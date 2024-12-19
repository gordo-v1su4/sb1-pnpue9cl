'use client';

import * as Tone from 'tone';

export function setPlayerVolume(player: Tone.Player | null, volume: number): void {
  if (!player) return;
  // Convert linear volume (0-1) to decibels (-Infinity to 0)
  const db = volume === 0 ? -Infinity : Math.log10(volume) * 20;
  player.volume.value = db;
}