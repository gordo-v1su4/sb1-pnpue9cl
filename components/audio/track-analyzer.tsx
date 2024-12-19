'use client';

import { AnalysisBar } from "./analysis-bar";

interface TrackAnalyzerProps {
  analyzerData: Float32Array;
}

export function TrackAnalyzer({ analyzerData }: TrackAnalyzerProps) {
  const calculateIntensity = (start: number, end: number) => {
    const slice = analyzerData.slice(start, end);
    return slice.reduce((sum, val) => sum + Math.abs(val), 0) / slice.length;
  };

  const vocalIntensity = calculateIntensity(0, analyzerData.length / 4);
  const instrumentalIntensity = calculateIntensity(analyzerData.length / 4, analyzerData.length / 2);
  const rhythmStrength = calculateIntensity(analyzerData.length / 2, (3 * analyzerData.length) / 4);
  const beatIntensity = calculateIntensity((3 * analyzerData.length) / 4, analyzerData.length);

  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-white">Track Analysis</h2>
      <div className="space-y-6">
        <AnalysisBar
          label="Vocal Intensity"
          value={vocalIntensity}
          max={1}
          color="bg-blue-500"
        />
        <AnalysisBar
          label="Instrumental Intensity"
          value={instrumentalIntensity}
          max={1}
          color="bg-green-500"
        />
        <AnalysisBar
          label="Rhythm Strength"
          value={rhythmStrength}
          max={1}
          color="bg-purple-500"
        />
        <AnalysisBar
          label="Beat Intensity"
          value={beatIntensity}
          max={1}
          color="bg-orange-500"
        />
      </div>
    </div>
  );
}