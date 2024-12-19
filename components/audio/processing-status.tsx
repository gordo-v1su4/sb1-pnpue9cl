'use client';

import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ProcessingStatusProps {
  isProcessing: boolean;
  progress: number;
  error: string | null;
}

export function ProcessingStatus({ isProcessing, progress, error }: ProcessingStatusProps) {
  if (!isProcessing && !error) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-gray-900 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        {isProcessing ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Loader2 className="animate-spin" />
              <p className="text-white">Processing audio...</p>
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-400 text-center">{Math.round(progress)}%</p>
          </div>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : null}
      </div>
    </div>
  );
}