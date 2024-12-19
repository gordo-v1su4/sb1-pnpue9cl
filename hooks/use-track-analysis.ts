'use client';

import { useState, useCallback } from 'react';
import { analyzeAudio } from '@/lib/api/fadr/client';
import type { AnalysisResult } from '@/lib/api/fadr/types';
import { toast } from '@/components/ui/use-toast';
import { FadrError } from '@/lib/api/fadr/error-handler';

export function useTrackAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeTrack = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    setProgress(0);
    setError(null);

    try {
      const response = await analyzeAudio(file, (progress) => {
        setProgress(progress);
      });
      
      if (response.results) {
        setResults(response.results);
        toast({
          title: "Success",
          description: "Audio analysis complete",
        });
      }
    } catch (err) {
      const message = err instanceof FadrError ? err.message : 'Failed to analyze audio';
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    analyzeTrack,
    isAnalyzing,
    progress,
    results,
    error,
  };
}