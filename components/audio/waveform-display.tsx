'use client';

import { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";

interface WaveformDisplayProps {
  analyzerData: Float32Array;
  loopPoints: { start: number; end: number };
}

export function WaveformDisplay({ analyzerData, loopPoints }: WaveformDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw waveform
    ctx.beginPath();
    ctx.strokeStyle = 'hsl(var(--primary))';
    ctx.lineWidth = 2;

    const sliceWidth = canvas.width / analyzerData.length;
    let x = 0;

    for (let i = 0; i < analyzerData.length; i++) {
      const v = analyzerData[i];
      const y = (v + 1) * canvas.height / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.stroke();

    // Draw loop points
    const startX = loopPoints.start * canvas.width;
    const endX = loopPoints.end * canvas.width;

    ctx.fillStyle = 'rgba(var(--primary), 0.2)';
    ctx.fillRect(startX, 0, endX - startX, canvas.height);
  }, [analyzerData, loopPoints]);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Waveform</h2>
      <canvas
        ref={canvasRef}
        width={800}
        height={200}
        className="w-full bg-background border border-border rounded-md"
      />
    </Card>
  );
}