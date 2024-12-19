'use client';

let audioContext: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.error('Failed to create AudioContext:', error);
      throw new Error('Failed to initialize audio system. Please check your browser settings.');
    }
  }
  return audioContext;
}

export async function initializeAudioContext(): Promise<void> {
  try {
    const ctx = getAudioContext();
    
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
  } catch (error) {
    console.error('Failed to initialize audio context:', error);
    throw error;
  }
}

export function disposeAudioContext(): void {
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
}