import React, { useState } from "react";
import { Circle, Hexagon, Plus, Minus, Navigation, Info, ShieldAlert } from "lucide-react";
import { GeofenceCoordinate, GeofenceType } from "@/types/geofence.types";

interface GeofenceMapEditorProps {
  type: GeofenceType;
  onTypeChange: (type: GeofenceType) => void;
  radiusMeters: number;
  onRadiusChange: (radius: number) => void;
  centerLat: number;
  centerLng: number;
  onCenterChange: (lat: number, lng: number) => void;
  coordinates?: GeofenceCoordinate[];
  onCoordinatesChange?: (coords: GeofenceCoordinate[]) => void;
}

export const GeofenceMapEditor: React.FC<GeofenceMapEditorProps> = ({
  type,
  onTypeChange,
  radiusMeters,
  onRadiusChange,
  centerLat,
  centerLng,
  onCenterChange
}) => {
  const [zoomLevel, setZoomLevel] = useState(14);

  return (
    <div className="relative w-full h-full min-h-[540px] lg:min-h-[640px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 select-none shadow-inner">
      {/* Background Cartographic Vector Grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-35"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="geo-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#334155"
              strokeWidth="0.8"
            />
          </pattern>
          <pattern
            id="geo-major-grid"
            width="160"
            height="160"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 160 0 L 0 0 0 160"
              fill="none"
              stroke="#475569"
              strokeWidth="1.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="#0a1226" />
        <rect width="100%" height="100%" fill="url(#geo-grid)" />
        <rect width="100%" height="100%" fill="url(#geo-major-grid)" />

        {/* Outer Arterial Corridors */}
        <path
          d="M 50 150 C 350 220, 750 180, 1200 450"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="5"
          opacity="0.4"
        />
        <path
          d="M 300 700 C 600 450, 900 650, 1300 350"
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="3.5"
          strokeDasharray="6 4"
          opacity="0.3"
        />
      </svg>

      {/* Floating Mode Selector Pill (Top-Center) */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 flex items-center p-1 rounded-xl panel-card shadow-lg border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
        <button
          type="button"
          onClick={() => onTypeChange("circular")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            type === "circular"
              ? "bg-[#2563EB] text-white shadow-sm"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Circle className="h-3.5 w-3.5" />
          <span>Circular Radius</span>
        </button>
        <button
          type="button"
          onClick={() => onTypeChange("polygon")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            type === "polygon"
              ? "bg-[#2563EB] text-white shadow-sm"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Hexagon className="h-3.5 w-3.5" />
          <span>Custom Polygon</span>
        </button>
      </div>

      {/* Interactive Geofence Graphic (Center of Map) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
        {type === "circular" ? (
          <div className="relative flex items-center justify-center">
            {/* Circular Geofence Radial Area */}
            <div
              style={{
                width: `${Math.min(Math.max(radiusMeters / 2, 140), 380)}px`,
                height: `${Math.min(Math.max(radiusMeters / 2, 140), 380)}px`
              }}
              className="rounded-full border-2 border-blue-500 bg-blue-500/15 backdrop-blur-[1px] shadow-2xl flex items-center justify-center animate-in zoom-in-75 duration-300"
            >
              {/* Radial Center Anchor */}
              <div className="h-4 w-4 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-900 shadow-md" />
            </div>

            {/* Perimeter Distance Badge */}
            <div className="absolute -bottom-8 rounded-full bg-slate-900/90 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-blue-300 border border-slate-700 shadow-md">
              Radius: {radiusMeters}m
            </div>
          </div>
        ) : (
          <div className="relative flex items-center justify-center">
            {/* Polygon Boundary Shape */}
            <svg
              width="320"
              height="260"
              viewBox="0 0 320 260"
              className="animate-in zoom-in-75 duration-300"
            >
              <polygon
                points="40,30 280,50 300,210 60,230"
                fill="rgba(147, 51, 234, 0.15)"
                stroke="#9333EA"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />
              <circle cx="40" cy="30" r="5" fill="#9333EA" stroke="#fff" strokeWidth="2" />
              <circle cx="280" cy="50" r="5" fill="#9333EA" stroke="#fff" strokeWidth="2" />
              <circle cx="300" cy="210" r="5" fill="#9333EA" stroke="#fff" strokeWidth="2" />
              <circle cx="60" cy="230" r="5" fill="#9333EA" stroke="#fff" strokeWidth="2" />
            </svg>
            <div className="absolute -bottom-6 rounded-full bg-slate-900/90 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-purple-300 border border-slate-700 shadow-md">
              4 Vertices Defined
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Radius Slider for Circular Mode */}
      {type === "circular" && (
        <div className="absolute bottom-5 left-5 z-20 panel-card p-3 shadow-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md w-72">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Perimeter Buffer Radius
            </span>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
              {radiusMeters}m
            </span>
          </div>
          <input
            type="range"
            min={100}
            max={2000}
            step={50}
            value={radiusMeters}
            onChange={(e) => onRadiusChange(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>100m (Depot Gate)</span>
            <span>2000m (Industrial Park)</span>
          </div>
        </div>
      )}

      {/* Floating Bottom-Right Map Controls */}
      <div className="absolute bottom-5 right-5 z-20 flex flex-col gap-1.5">
        <div className="panel-card overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(z + 1, 20))}
            className="flex h-9 w-9 items-center justify-center bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 transition-colors"
            title="Zoom In"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(z - 1, 5))}
            className="flex h-9 w-9 items-center justify-center bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
            title="Zoom Out"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onCenterChange(22.9868, 72.4876)}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-lg border border-slate-200 dark:border-slate-800 transition-colors"
          title="Center on Hub"
        >
          <Navigation className="h-4 w-4 text-blue-600" />
        </button>
      </div>
    </div>
  );
};

export default GeofenceMapEditor;
