import React, { useState, useRef } from "react";
import {
  MapPin,
  Search,
  Plus,
  Minus,
  Navigation,
  Compass,
  Layers,
  Info
} from "lucide-react";

interface PoiMapPickerProps {
  latitude: number;
  longitude: number;
  onCoordinatesChange: (lat: number, lng: number, placeHint?: string) => void;
  addressSearch: string;
  onAddressSearchChange: (address: string) => void;
}

export const PoiMapPicker: React.FC<PoiMapPickerProps> = ({
  latitude,
  longitude,
  onCoordinatesChange,
  addressSearch,
  onAddressSearchChange
}) => {
  const [zoomLevel, setZoomLevel] = useState(14);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Quick preset locations for enterprise Indian logistics corridors
  const presetLocations = [
    { name: "Jewar Toll Plaza, Yamuna Expressway", lat: 28.1206, lng: 77.5382 },
    { name: "Ahmedabad Western Logistics Hub", lat: 22.9868, lng: 72.4876 },
    { name: "Sanand Auto Industrial Corridor", lat: 22.9922, lng: 72.3789 },
    { name: "Delhi Logistics Hub, Mahipalpur", lat: 28.5355, lng: 77.1264 },
    { name: "Chakan Staging Yard, Pune", lat: 18.7606, lng: 73.8567 },
    { name: "Bhiwandi Central Depot", lat: 19.2967, lng: 73.0631 }
  ];

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert relative canvas position to coordinate offsets
    const deltaX = (x / rect.width - 0.5) * (0.08 / (zoomLevel / 10));
    const deltaY = (0.5 - y / rect.height) * (0.08 / (zoomLevel / 10));

    const newLat = parseFloat((latitude + deltaY).toFixed(5));
    const newLng = parseFloat((longitude + deltaX).toFixed(5));

    onCoordinatesChange(newLat, newLng, "Selected Map Point");
  };

  const handleSelectPreset = (preset: (typeof presetLocations)[0]) => {
    onAddressSearchChange(preset.name);
    onCoordinatesChange(preset.lat, preset.lng, preset.name);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleMapClick}
      className="relative w-full h-full min-h-[540px] lg:min-h-[640px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 select-none cursor-crosshair shadow-inner"
    >
      {/* Background Cartographic Vector Grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-35"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#334155"
              strokeWidth="0.8"
            />
          </pattern>
          <pattern
            id="major-grid"
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
        <rect width="100%" height="100%" fill="#0b1329" />
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#major-grid)" />

        {/* Express Corridor Routes (Visual Arteries) */}
        <path
          d="M -100 280 C 300 250, 600 380, 1400 320"
          fill="none"
          stroke="#2563EB"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M 480 -50 C 510 300, 460 600, 520 1000"
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="4"
          strokeDasharray="8 6"
          opacity="0.5"
        />
        <path
          d="M 150 700 C 450 550, 850 450, 1300 200"
          fill="none"
          stroke="#64748B"
          strokeWidth="3"
          opacity="0.4"
        />
      </svg>

      {/* Floating Top-Left "Place a POI" Guidance Card (Exact Figma #1097:18274) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-5 left-5 z-20 w-80 panel-card p-4 shadow-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md"
      >
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Place a POI
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Click anywhere on the map to set location
            </p>
          </div>
        </div>

        {/* Address Search Input */}
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={addressSearch}
            onChange={(e) => onAddressSearchChange(e.target.value)}
            placeholder="Search address or toll..."
            className="w-full h-9 pl-8 pr-3 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Preset Locations Quick Pills */}
        <div className="mt-2.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Quick Corridors:
          </span>
          <div className="flex flex-wrap gap-1">
            {presetLocations.slice(0, 3).map((loc) => (
              <button
                key={loc.name}
                type="button"
                onClick={() => handleSelectPreset(loc)}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              >
                {loc.name.split(",")[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <Info className="h-3.5 w-3.5 text-blue-500 shrink-0" />
          <span>Coordinates: {latitude.toFixed(4)}, {longitude.toFixed(4)}</span>
        </div>
      </div>

      {/* Centered Active POI Pin Marker (Exact Figma #1097:18309) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center pointer-events-none group animate-in fade-in zoom-in duration-300"
      >
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Wave */}
          <span className="absolute h-14 w-14 rounded-full bg-blue-500/25 animate-ping opacity-75" />
          {/* Main Pin Ring */}
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#2563EB] text-white shadow-xl shadow-blue-500/50 ring-4 ring-white dark:ring-slate-900">
            <MapPin className="h-6 w-6 stroke-[2.2]" />
          </div>
        </div>

        {/* Under-Pin Pill Badge */}
        <div className="mt-2 rounded-full bg-slate-900 px-3 py-1 text-[10px] font-bold tracking-wider text-white shadow-lg border border-slate-700/80 uppercase">
          POI LOCATION
        </div>
      </div>

      {/* Floating Bottom-Right Map Controls */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-5 right-5 z-20 flex flex-col gap-1.5"
      >
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
          onClick={() => {
            onCoordinatesChange(28.1206, 77.5382, "Jewar Toll Plaza");
            onAddressSearchChange("Yamuna Expressway, Jewar Toll Plaza");
          }}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-lg border border-slate-200 dark:border-slate-800 transition-colors"
          title="Reset to Center"
        >
          <Navigation className="h-4 w-4 text-blue-600" />
        </button>
      </div>

      {/* Bottom Scale Indicator */}
      <div className="absolute bottom-4 left-5 z-10 px-2 py-0.5 rounded bg-slate-900/80 text-[10px] text-slate-300 font-mono backdrop-blur-sm border border-slate-800">
        Scale: 1:{zoomLevel * 500} · WGS84
      </div>
    </div>
  );
};

export default PoiMapPicker;
