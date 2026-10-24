import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Navigation,
  Car,
  Gauge,
  MapPin,
  AlertCircle,
  RotateCcw,
  Sliders
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { useVehicles, usePlaybackSession } from "./vehicles.queries";
import { PlaybackMapCanvas } from "./components/PlaybackMapCanvas";
import { PlaybackControls } from "./components/PlaybackControls";

export const RoutePlaybackPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlVehicleId = searchParams.get("vehicleId") || undefined;
  const { data: vehicles = [] } = useVehicles();

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("today");

  // Continuous Sub-Frame Replay Transport State
  const [progress, setProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [followVehicle, setFollowVehicle] = useState<boolean>(true);

  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Sync selected vehicle with vehicles list
  useEffect(() => {
    if (urlVehicleId) {
      setSelectedVehicleId(urlVehicleId);
    } else if (vehicles.length > 0 && !selectedVehicleId) {
      setSelectedVehicleId(vehicles[0].id);
    }
  }, [urlVehicleId, vehicles, selectedVehicleId]);

  // Load session query
  const { data: session, isLoading } = usePlaybackSession(selectedVehicleId, selectedDate);

  // Reset progress when vehicle or date changes
  useEffect(() => {
    setProgress(0);
    setIsPlaying(false);
    lastTimeRef.current = null;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, [selectedVehicleId, selectedDate]);

  // 60 FPS requestAnimationFrame Replay Engine
  useEffect(() => {
    if (!isPlaying || !session || session.points.length <= 1) {
      lastTimeRef.current = null;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    const totalPoints = session.points.length;
    const maxIndex = totalPoints - 1;

    // Base replay speed: 1 GPS fix per 1.2 seconds at 1x
    const pointsPerSecond = 0.8 * playbackSpeed;

    const tick = (currentTime: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      setProgress((prev) => {
        const next = prev + pointsPerSecond * deltaTime;
        if (next >= maxIndex) {
          setIsPlaying(false);
          lastTimeRef.current = null;
          return maxIndex;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isPlaying, session, playbackSpeed]);

  const handleVehicleChange = (newId: string) => {
    setSelectedVehicleId(newId);
    setSearchParams({ vehicleId: newId });
  };

  const handleStepForward = () => {
    if (!session) return;
    setProgress((prev) => Math.min(Math.floor(prev) + 1, session.points.length - 1));
  };

  const handleStepBackward = () => {
    setProgress((prev) => Math.max(Math.ceil(prev) - 1, 0));
  };

  const handleReset = () => {
    setProgress(0);
    setIsPlaying(false);
  };

  const stoppages = session?.points.filter((p) => p.stoppage) || [];
  const currentIndex = Math.min(Math.floor(progress), (session?.points.length || 1) - 1);

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Vehicles", href: "/vehicles" },
          { label: "Route Playback" }
        ]}
        title="Historical Route Playback"
        description="High-resolution trajectory replay, stoppage audit, and 60 FPS live-moving reconstruction."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Navigation className="h-3.5 w-3.5" />}
              onClick={() => navigate(`/dashboard?vehicleId=${selectedVehicleId}`)}
            >
              Live Map
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Car className="h-3.5 w-3.5" />}
              onClick={() => navigate("/vehicles")}
            >
              Directory
            </Button>
          </div>
        }
      />

      {/* Top Configuration & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Vehicle Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500 uppercase">Asset:</label>
            <select
              value={selectedVehicleId}
              onChange={(e) => handleVehicleChange(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.plateNumber} ({v.driver.name} - {v.makeModel})
                </option>
              ))}
            </select>
          </div>

          {/* Date Presets */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
            <button
              onClick={() => setSelectedDate("today")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                selectedDate === "today"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setSelectedDate("yesterday")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                selectedDate === "yesterday"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Yesterday
            </button>
          </div>
        </div>

        {session && (
          <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{session.points.length} GPS Fixes Logged</span>
          </div>
        )}
      </div>

      {/* Trip KPI Summary Banner */}
      {session && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Distance</p>
            <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{session.totalDistance} km</p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Max Speed</p>
            <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{session.maxSpeed} km/h</p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Avg Speed</p>
            <p className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">{session.avgSpeed} km/h</p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Stoppages</p>
            <p className="text-lg font-black text-rose-600 dark:text-rose-400 mt-0.5">{session.stoppageCount} Stops</p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Idle Time</p>
            <p className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">{session.idleDurationMinutes} mins</p>
          </div>
        </div>
      )}

      {/* Main Playback Canvas & Scrubber Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map & Controls Area (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-950">
            <PlaybackMapCanvas
              session={session || null}
              progress={progress}
              isPlaying={isPlaying}
              followVehicle={followVehicle}
              onToggleFollow={(val) => setFollowVehicle(val)}
              onSelectPoint={(idx) => setProgress(idx)}
            />
          </div>

          <PlaybackControls
            session={session || null}
            progress={progress}
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onSeek={(val) => setProgress(val)}
            onSpeedChange={(spd) => setPlaybackSpeed(spd)}
            onStepForward={handleStepForward}
            onStepBackward={handleStepBackward}
            onReset={handleReset}
          />
        </div>

        {/* Stoppage Event Audit Log (1 col) */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm flex flex-col h-[620px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-rose-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Stoppage Events ({stoppages.length})
              </h3>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pt-3 pr-1">
            {stoppages.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-10">
                No major stoppage events recorded for this session.
              </p>
            ) : (
              stoppages.map((stop, sIdx) => {
                const ptIndex = session?.points.findIndex((p) => p.id === stop.id) ?? -1;
                const isSelected = ptIndex === currentIndex;

                return (
                  <div
                    key={stop.id}
                    onClick={() => ptIndex >= 0 && setProgress(ptIndex)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 shadow-sm"
                        : "border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                      <span>Stop #{sIdx + 1}</span>
                      <span className="font-mono text-[11px] text-slate-500">
                        {new Date(stop.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {stop.locationName || `${stop.latitude.toFixed(4)}° N, ${stop.longitude.toFixed(4)}° E`}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutePlaybackPage;
