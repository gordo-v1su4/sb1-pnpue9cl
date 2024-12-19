'use client';

import * as Tone from 'tone';
import { toast } from '@/components/ui/use-toast';

export interface PlaybackState {
  isPlaying: boolean;
  volume: number;
  loopPoints: { start: number; end: number };
}

export async function startPlayback(player: Tone.Player | null): Promise<void> {
  if (!player) return;
  
  try {
    await Tone.start();
    player.start();
  } catch (error) {
    console.error('Failed to start playback:', error);
    toast({
      title: "Error",
      description: "Failed to start playback. Please try again.",
      variant: "destructive",
    });
  }
}

export function stopPlayback(player: Tone.Player | null): void {
  if (!player) return;
  try {
    player.stop();
  } catch (error) {
    console.error('Failed to stop playback:', error);
  }
}

export function setVolume(player: Tone.Player | null, volume: number): void {
  if (!player) return;
  try {
    player.volume.value = Tone.gainToDb(volume);
  } catch (error) {
    console.error('Failed to update volume:', error);
  }
}

export function setLoopPoints(
  player: Tone.Player | null, 
  start: number, 
  end: number
): void {
  if (!player) return;
  try {
    player.loopStart = start;
    player.loopEnd = end;
    player.loop = true;
  } catch (error) {
    console.error('Failed to set loop points:', error);
  }
}