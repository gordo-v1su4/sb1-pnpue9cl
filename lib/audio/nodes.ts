'use client';

import * as Tone from 'tone';

export function createAnalyzer(): Tone.Analyser {
  return new Tone.Analyser('waveform', 2048);
}

export function createFilter(): Tone.Filter {
  return new Tone.Filter(1000, 'lowpass').toDestination();
}

export function createPlayer(buffer: AudioBuffer): Tone.Player {
  return new Tone.Player({
    url: buffer,
    loop: false,
  });
}