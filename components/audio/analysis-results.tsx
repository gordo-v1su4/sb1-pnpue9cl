'use client';

interface AnalysisResultsProps {
  results: {
    tempo: number;
    key: string;
    energy: number;
    vocals: number;
    instruments: number;
  } | null;
  isLoading: boolean;
}

export function AnalysisResults({ results, isLoading }: AnalysisResultsProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
        <p className="text-gray-400">Analyzing track...</p>
      </div>
    );
  }

  if (!results) return null;

  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-white">Analysis Results</h2>
      <div className="space-y-4">
        <div>
          <span className="text-gray-400">Tempo:</span>
          <span className="ml-2 text-white">{results.tempo} BPM</span>
        </div>
        <div>
          <span className="text-gray-400">Key:</span>
          <span className="ml-2 text-white">{results.key}</span>
        </div>
        <div>
          <span className="text-gray-400">Energy:</span>
          <span className="ml-2 text-white">{Math.round(results.energy * 100)}%</span>
        </div>
        <div>
          <span className="text-gray-400">Vocals:</span>
          <span className="ml-2 text-white">{Math.round(results.vocals * 100)}%</span>
        </div>
        <div>
          <span className="text-gray-400">Instruments:</span>
          <span className="ml-2 text-white">{Math.round(results.instruments * 100)}%</span>
        </div>
      </div>
    </div>
  );
}