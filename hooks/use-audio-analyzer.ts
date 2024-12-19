'use client';

import { useState, useEffect, useRef } from 'react';
import { AudioProcessor } from '@/lib/audio-processor';
import { setPlayerVolume } from '@/lib/audio/volume';

export function useAudioAnalyzer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.75);
  const [loopPoints, setLoopPointsState] = useState({ start: 0, end: 1 });
  const [analyzerData, setAnalyzerData] = useState<Float32Array>(new Float32Array());
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const processorRef = useRef<AudioProcessor | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    processorRef.current = new AudioProcessor();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      processorRef.current?.dispose();
    };
  }, []);

  const updateAnalyzer = () => {
    if (processorRef.current && isPlaying) {
      setAnalyzerData(processorRef.current.getAnalyzerData());
      animationFrameRef.current = requestAnimationFrame(updateAnalyzer);
    }
  };

  const initializeAudio = async () => {
    if (isInitialized) return;

    try {
      await processorRef.current?.initialize();
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  };

  const loadAudio = async (file: File) => {
    setIsLoading(true);
    try {
      await initializeAudio();
      await processorRef.current?.loadAudio(file);
    } catch (error) {
      console.error('Error loading audio file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayback = async () => {
    if (!processorRef.current) return;

    try {
      const player = processorRef.current.getPlayer();
      if (!player) return;

      if (!isPlaying) {
        await player.start();
        setIsPlaying(true);
        updateAnalyzer();
      } else {
        player.stop();
        setIsPlaying(false);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      }
    } catch (error) {
      console.error('Playback error:', error);
    }
  };

  const updateVolume = (newVolume: number) => {
    if (!processorRef.current) return;
    setPlayerVolume(processorRef.current.getPlayer(), newVolume);
    setVolumeState(newVolume);
  };

  const updateLoopPoints = (start: number, end: number) => {
    if (!processorRef.current) return;
    const player = processorRef.current.getPlayer();
    if (player) {
      player.loopStart = start;
      player.loopEnd = end;
      player.loop = true;
    }
    setLoopPointsState({ start, end });
  };

  return {
    isPlaying,
    isLoading,
    isInitialized,
    volume,
    loopPoints,
    analyzerData,
    loadAudio,
    togglePlayback,
    updateVolume,
    updateLoopPoints,
    initializeAudio,
  };
}