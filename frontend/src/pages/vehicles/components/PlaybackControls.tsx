import React from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  FastForward,
  Clock,
  Gauge,
  MapPin,
  RotateCcw
} from "lucide-react";
import { PlaybackSession } from "../vehicles.types";
import { getInterpolatedVehicleState } from "../utils/playbackAnimation";

interface PlaybackControlsProps {
  session: PlaybackSession | null;
  progress: number; // Fractional progress from 0.0 to points.length - 1
  isPlaying: boolean;
  playbackSpeed: number;
  onPlayPause: () => void;
  onSeek: (progress: number) => void;
  onSpeedChange: (speed: number) => void;
  onStepForward?: () => void;
  onStepBackward?: () => void;
  onReset?: () => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  session,
  progress,
  isPlaying,
  playbackSpeed,
  onPlayPause,
  onSeek,
  onSpeedChange,
  onStepForward,
  onStepBackward,
  onReset
}) => {
  if (!session || session.points.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 text-center text-xs text-slate-500 shadow-xl">
        Select a date and click Load Route to initialize route replay engine.
      </div>
    );
  }

  const totalPoints = session.points.length;
  const maxIndex = Math.max(1, totalPoints - 1);
  const progressPercent = Math.min(100, Math.max(0, (progress / maxIndex) * 100));

  // Get continuous sub-frame telemetry state
  const currentState = getInterpolatedVehicleState(session.points, progress);
  const currentPoint = session.points[Math.min(Math.floor(progress), totalPoints - 1)];

  const speeds = [1, 2, 4, 8, 16];

  const formatTime = (isoString?: string) => {
    if (!isoString) return "--:--";
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 shadow-2xl">
      {/* Current Telemetry Micro-Bar */}
      {currentState && (
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white font-mono">
              <Clock className="h-3.5 w-3.5 text-blue-500" />
              {formatTime(currentState.timestamp)}
            </span>
            <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300 font-mono">
              <Gauge className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">{currentState.speed}</span> km/h
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                currentState.ignition
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-slate-500/10 text-slate-500"
              }`}
            >
              {currentState.ignition ? "IGN ON" : "IGN OFF"}
            </span>
            {currentState.stoppage && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/10 text-rose-600 dark:text-rose-400">
                STOPPAGE
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <span className="truncate max-w-[280px]">
              {currentState.locationName || currentPoint?.locationName || "Yamuna Expressway"}
            </span>
          </div>
        </div>
      )}

      {/* Scrub Bar / Timeline Slider with Sub-Frame Precision */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>{formatTime(session.points[0]?.timestamp)}</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            Fix #{Math.floor(progress) + 1} / {totalPoints} ({progressPercent.toFixed(1)}%)
          </span>
          <span>{formatTime(session.points[totalPoints - 1]?.timestamp)}</span>
        </div>

        <div className="relative flex items-center group py-1">
          <input
            type="range"
            min={0}
            max={maxIndex}
            step={0.01}
            value={progress}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Control Buttons & Speed Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Playback Transport Buttons */}
        <div className="flex items-center gap-2">
          {onReset && (
            <button
              onClick={onReset}
              title="Reset Replay"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}

          <button
            onClick={onStepBackward}
            title="Step backward"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
          >
            <SkipBack className="h-4 w-4" />
          </button>

          <button
            onClick={onPlayPause}
            title={isPlaying ? "Pause" : "Play"}
            className="flex h-10 px-5 items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/25 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isPlaying ? "Pause Replay" : "Start Replay"}</span>
          </button>

          <button
            onClick={onStepForward}
            title="Step forward"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        {/* Speed Multiplier Pill Group */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
          <FastForward className="h-3.5 w-3.5 text-slate-400 ml-1.5 mr-0.5" />
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                playbackSpeed === s
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaybackControls;
