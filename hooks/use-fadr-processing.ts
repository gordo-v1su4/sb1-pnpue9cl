'use client';

import { useState, useCallback } from 'react';
import { getUploadUrl, uploadFile } from '@/lib/api/fadr/upload';
import { createAsset, getAsset } from '@/lib/api/fadr/asset';
import { createStemTask, pollTaskStatus } from '@/lib/api/fadr/task';
import { getDownloadUrl, downloadFile } from '@/lib/api/fadr/download';
import { FadrError } from '@/lib/api/fadr/error-handler';

const POLLING_INTERVAL = 5000; // 5 seconds

export function useFadrProcessing() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const processAudio = useCallback(async (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      // Step 1: Get upload URL
      setProgress(10);
      const { url, s3Path } = await getUploadUrl(file.name, 'mp3');

      // Step 2: Upload file
      setProgress(30);
      await uploadFile(url, file);

      // Step 3: Create asset
      setProgress(50);
      const asset = await createAsset(file.name, 'mp3', s3Path);

      // Step 4: Create stem task
      setProgress(60);
      const task = await createStemTask(asset._id);

      // Step 5: Poll for completion
      setProgress(70);
      let currentTask = task;
      while (!currentTask.asset.stems?.length) {
        await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
        currentTask = await pollTaskStatus(task._id);
        setProgress(80);
      }

      // Step 6: Get stems
      setProgress(90);
      const stemAssets = await Promise.all(
        currentTask.asset.stems.map(stemId => getAsset(stemId))
      );

      // Step 7: Get download URLs
      const downloadUrls = await Promise.all(
        stemAssets.map(async (stemAsset) => ({
          type: stemAsset.metaData?.stemType || 'unknown',
          url: await getDownloadUrl(stemAsset._id),
        }))
      );

      setProgress(100);
      return downloadUrls;
    } catch (err) {
      const fadrError = err instanceof FadrError ? err : new FadrError('Processing failed');
      setError(fadrError.message);
      throw fadrError;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    processAudio,
    isProcessing,
    progress,
    error,
  };
}