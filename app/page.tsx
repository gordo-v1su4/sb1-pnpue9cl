'use client';

import { useTrackAnalysis } from '@/hooks/use-track-analysis';
import { TrackUpload } from '@/components/audio/track-upload';
import { AnalysisResults } from '@/components/audio/analysis-results';
import { ProcessingStatus } from '@/components/audio/processing-status';

export default function Home() {
  const {
    analyzeTrack,
    isAnalyzing,
    progress,
    results,
    error
  } = useTrackAnalysis();

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Audio Analyzer</h1>
          <p className="text-gray-400">
            Upload an audio file to analyze its components
          </p>
        </div>

        <TrackUpload 
          onFileSelect={analyzeTrack}
          isProcessing={isAnalyzing}
        />

        <AnalysisResults 
          results={results} 
          isLoading={isAnalyzing} 
        />

        <ProcessingStatus 
          isProcessing={isAnalyzing} 
          progress={progress}
          error={error} 
        />
      </div>
    </div>
  );
}