'use client';

import { useState, useCallback } from 'react';
import { FadrAPI } from '@/lib/api/fadr';
import type { AnalysisResult, SeparatedTracks } from '@/lib/api/fadr/types';

interface UseFadrOptions {
  apiKey: string;
}

export function useFadr({ apiKey }: UseFadrOptions) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSeparating, setIsSeparating] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [separatedTracks, setSeparatedTracks] = useState<SeparatedTracks | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fadrApi = new FadrAPI({ apiKey });

  const analyzeTrack = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const analysis = await fadrApi.analyzeAudio(file);
      let results = analysis;

      while (results.status === 'pending' || results.status === 'processing') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        results = await fadrApi.getAnalysisStatus(analysis.id);
      }

      if (results.status === 'failed') {
        throw new Error('Analysis failed');
      }

      setAnalysisResults(results.results || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze track');
    } finally {
      setIsAnalyzing(false);
    }
  }, [fadrApi]);

  const separateTrack = useCallback(async (file: File) => {
    setIsSeparating(true);
    setError(null);

    try {
      const separation = await fadrApi.separateTracks(file);
      let results = separation;

      while (results.status === 'pending' || results.status === 'processing') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        results = await fadrApi.getSeparationStatus(separation.id);
      }

      if (results.status === 'failed') {
        throw new Error('Separation failed');
      }

      setSeparatedTracks(results.results || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to separate track');
    } finally {
      setIsSeparating(false);
    }
  }, [fadrApi]);

  return {
    analyzeTrack,
    separateTrack,
    isAnalyzing,
    isSeparating,
    analysisResults,
    separatedTracks,
    error,
  };
}