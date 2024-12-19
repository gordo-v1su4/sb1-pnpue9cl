'use client';

import { getUploadUrl, uploadFile } from './upload';
import { createAsset } from './asset';
import { createStemTask } from './task';
import { pollForTaskCompletion } from './polling';
import { validateAudioFile } from './validation';
import type { AnalysisResponse, Task } from './types';
import { FadrError } from './error-handler';

export async function analyzeAudio(
  file: File,
  onProgress?: (progress: number) => void
): Promise<AnalysisResponse> {
  try {
    validateAudioFile(file);
    
    // Step 1: Get upload URL (10%)
    onProgress?.(10);
    const { url, s3Path } = await getUploadUrl(file.name, 'mp3');

    // Step 2: Upload file (30%)
    onProgress?.(30);
    await uploadFile(url, file);

    // Step 3: Create asset (50%)
    onProgress?.(50);
    const asset = await createAsset(file.name, 'mp3', s3Path);

    // Step 4: Create and monitor stem task (60-90%)
    onProgress?.(60);
    const task = await createStemTask(asset._id);
    const completedTask = await pollForTaskCompletion(task._id, (taskProgress) => {
      onProgress?.(60 + (taskProgress * 0.3));
    });

    // Step 5: Format results (100%)
    onProgress?.(100);
    return formatAnalysisResponse(completedTask);
  } catch (error) {
    if (error instanceof FadrError) {
      throw error;
    }
    throw new FadrError(
      'Failed to analyze audio',
      'ANALYSIS_ERROR',
      500
    );
  }
}

function formatAnalysisResponse(task: Task): AnalysisResponse {
  return {
    id: task._id,
    status: 'completed',
    results: {
      tempo: task.asset.metaData?.tempo || 0,
      key: task.asset.metaData?.key || 'Unknown',
      energy: 0.5, // Default value as it's not provided by the API
      vocals: task.asset.stems?.some(s => s.includes('vocals')) ? 1 : 0,
      instruments: task.asset.stems?.some(s => s.includes('instruments')) ? 1 : 0,
    }
  };
}