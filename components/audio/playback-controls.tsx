'use client';

import { Play, Pause, Volume2 } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  volume: number;
  onPlayPause: () => void;
  onVolumeChange: (value: number) => void;
}

export function PlaybackControls({
  isPlaying,
  volume,
  onPlayPause,
  onVolumeChange,
}: PlaybackControlsProps) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-900 border border-gray-800 rounded-lg">
      <button
        onClick={onPlayPause}
        className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
      >
        {isPlaying ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="h-6 w-6" />
        )}
      </button>
      
      <div className="flex items-center space-x-2 flex-1">
        <Volume2 className="h-5 w-5 text-gray-400" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-32 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
}