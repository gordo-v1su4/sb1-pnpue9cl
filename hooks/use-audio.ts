'use client';

import { useState, useCallback, useEffect } from 'react';
import { initializeAudioContext, getAudioContext, disposeAudioContext } from '@/lib/audio/context';

export function useAudio() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialize = useCallback(async () => {
    if (isInitialized) return;

    try {
      await initializeAudioContext();
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to initialize audio system';
      setError(message);
      throw new Error(message);
    }
  }, [isInitialized]);

  const processAudioFile = useCallback(async (file: File): Promise<AudioBuffer> => {
    if (!file.type.startsWith('audio/')) {
      throw new Error('Invalid file type. Please upload an audio file.');
    }

    if (!isInitialized) {
      await initialize();
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const context = getAudioContext();
      return await context.decodeAudioData(arrayBuffer);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process audio file';
      throw new Error(message);
    }
  }, [initialize, isInitialized]);

  useEffect(() => {
    return () => {
      disposeAudioContext();
    };
  }, []);

  return {
    isInitialized,
    error,
    initialize,
    processAudioFile
  };
}