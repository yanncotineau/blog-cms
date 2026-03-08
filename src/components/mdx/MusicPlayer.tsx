"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface MusicPlayerProps {
  code: string;
  title?: string;
  description?: string;
}

export default function MusicPlayer({
  code,
  title = "Strudel Pattern",
  description,
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const { width, height } = canvas;
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, width, height);

      if (isPlaying) {
        const time = Date.now() / 1000;
        ctx.beginPath();
        ctx.strokeStyle = "#8b5cf6";
        ctx.lineWidth = 2;

        for (let x = 0; x < width; x++) {
          const y =
            height / 2 +
            Math.sin(x * 0.02 + time * 3) * 20 +
            Math.sin(x * 0.05 + time * 2) * 15 +
            Math.sin(x * 0.01 + time * 5) * 10;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "#a78bfa";
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.5;
        for (let x = 0; x < width; x++) {
          const y =
            height / 2 +
            Math.sin(x * 0.03 + time * 4) * 15 +
            Math.cos(x * 0.02 + time * 2) * 20;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else {
        ctx.beginPath();
        ctx.strokeStyle = "#4b5563";
        ctx.lineWidth = 2;
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const strudelUrl = `https://strudel.cc/#${encodeURIComponent(code)}`;

  return (
    <div className="my-6 overflow-hidden border-2 border-white/15 bg-slate-900/50">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <h4 className="font-medium text-slate-200">{title}</h4>
          {description && (
            <p className="mt-0.5 text-sm text-slate-400">{description}</p>
          )}
        </div>
        <a
          href={strudelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-purple-600/20 px-3 py-1.5 text-sm font-medium text-purple-300 transition-colors hover:bg-purple-600/30"
        >
          Open in Strudel →
        </a>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={100}
          className="w-full"
        />
        
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/30">
            <span className="text-sm text-slate-400">
              Click play to preview visualization
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 border-t border-white/10 px-4 py-3">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white transition-colors hover:bg-purple-500"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </button>
        
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-slate-200"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>

        <div className="flex-1">
          <div className="h-1 rounded-full bg-slate-700">
            <div
              className="h-full rounded-full bg-purple-500 transition-all"
              style={{ width: isPlaying ? "45%" : "0%" }}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-slate-950/50 px-4 py-3">
        <pre className="overflow-x-auto font-mono text-sm text-purple-300">
          {code}
        </pre>
      </div>
    </div>
  );
}
