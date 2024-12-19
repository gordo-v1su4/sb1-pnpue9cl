'use client';

import { useState } from 'react';
import { analyzeAudio, separateTracks } from '@/lib/api/fadr/client';
import type { AnalysisResult, SeparatedTracks } from '@/lib/api/fadr/types';

export function useAudioProcessing() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [tracks, setTracks] = useState<SeparatedTracks | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function processAudio(file: File, type: 'analyze' | 'separate') {
    setIsProcessing(true);
    setError(null);

    try {
      if (type === 'analyze') {
        const response = await analyzeAudio(file);
        setResults(response.results || null);
      } else {
        const response = await separateTracks(file);
        setTracks(response.results || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed');
    } finally {
      setIsProcessing(false);
    }
  }

  return {
    isProcessing,
    results,
    tracks,
    error,
    processAudio,
  };
}