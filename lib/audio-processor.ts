'use client';

import * as Tone from 'tone';
import { initializeAudioContext, isAudioContextInitialized } from './audio/context';
import { createAnalyzer, createFilter, createPlayer } from './audio/nodes';
import { fileToArrayBuffer } from './audio/file-utils';

export class AudioProcessor {
  private player: Tone.Player | null = null;
  private analyzer: Tone.Analyser | null = null;
  private filter: Tone.Filter | null = null;
  private initialized: boolean = false;
  
  constructor() {
    // Don't initialize in constructor - wait for explicit init call
  }

  async initialize() {
    if (this.initialized) return;

    try {
      await initializeAudioContext();
      this.analyzer = createAnalyzer();
      this.filter = createFilter();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize audio processor:', error);
      throw error;
    }
  }

  async ensureInitialized() {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  async loadAudio(file: File): Promise<void> {
    await this.ensureInitialized();

    try {
      const buffer = await fileToArrayBuffer(file);
      const audioBuffer = await Tone.context.decodeAudioData(buffer);
      
      if (this.player) {
        this.player.disconnect();
        this.player.dispose();
      }

      this.player = createPlayer(audioBuffer);
      this.player.chain(this.filter!, this.analyzer!, Tone.Destination);
      await this.player.loaded();
    } catch (error) {
      console.error('Error loading audio:', error);
      throw new Error('Failed to load audio file. Please try a different file.');
    }
  }

  getPlayer(): Tone.Player | null {
    return this.player;
  }

  getAnalyzerData(): Float32Array {
    return this.analyzer ? this.analyzer.getValue() : new Float32Array();
  }

  dispose() {
    this.player?.dispose();
    this.analyzer?.dispose();
    this.filter?.dispose();
    this.initialized = false;
  }
}