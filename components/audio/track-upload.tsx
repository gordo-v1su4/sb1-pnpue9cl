'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';

interface TrackUploadProps {
  onFileSelect: (file: File) => Promise<void>;
  isProcessing: boolean;
}

export function TrackUpload({ onFileSelect, isProcessing }: TrackUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await onFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      await onFileSelect(file);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-800'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="hidden"
        id="audio-upload"
        disabled={isProcessing}
      />
      <label 
        htmlFor="audio-upload" 
        className={`cursor-pointer block ${isProcessing ? 'opacity-50' : ''}`}
      >
        <div className="space-y-4">
          <Upload className="mx-auto h-12 w-12 text-gray-500" />
          <div className="space-y-2">
            <p className="text-lg font-medium text-white">
              {isProcessing ? 'Processing...' : 'Drop your audio file here'}
            </p>
            <p className="text-sm text-gray-400">
              {isProcessing ? 'Please wait' : 'or click to browse'}
            </p>
          </div>
        </div>
      </label>
    </div>
  );
}