import React, { useEffect, useRef, useState, useCallback } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import { Navigation, Maximize2, Compass } from "lucide-react";
import { PlaybackSession } from "../vehicles.types";
import { MAP_CONFIG } from "@/config/map.config";
import {
  getInterpolatedVehicleState,
  splitRouteCoordinates,
  InterpolatedState
} from "../utils/playbackAnimation";

// Configure MapLibre GL bundled worker for Vite
if (typeof window !== "undefined" && typeof (maplibregl as any).setWorkerUrl === "function") {
  (maplibregl as any).setWorkerUrl(workerUrl);
}

interface PlaybackMapCanvasProps {
  session: PlaybackSession | null;
  progress: number; // Fractional index from 0.0 to points.length - 1
  isPlaying: boolean;
  onSelectPoint?: (index: number) => void;
  styleUrl?: string;
  followVehicle?: boolean;
  onToggleFollow?: (follow: boolean) => void;
}

export const PlaybackMapCanvas: React.FC<PlaybackMapCanvasProps> = ({
  session,
  progress,
  isPlaying,
  onSelectPoint,
  styleUrl = MAP_CONFIG.styles.dark,
  followVehicle = true,
  onToggleFollow
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const vehicleMarkerRef = useRef<maplibregl.Marker | null>(null);
  const stoppageMarkersRef = useRef<maplibregl.Marker[]>([]);
  const isMapLoadedRef = useRef<boolean>(false);

  const [internalFollow, setInternalFollow] = useState<boolean>(followVehicle);

  useEffect(() => {
    setInternalFollow(followVehicle);
  }, [followVehicle]);

  const setFollow = useCallback(
    (val: boolean) => {
      setInternalFollow(val);
      onToggleFollow?.(val);
    },
    [onToggleFollow]
  );

  // Initialize MapLibre GL Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initialCenter = session?.points[0]
      ? ([session.points[0].longitude, session.points[0].latitude] as [number, number])
      : MAP_CONFIG.defaultCenter;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: initialCenter,
      zoom: 13,
      pitch: 35,
      attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");

    map.on("load", () => {
      isMapLoadedRef.current = true;
    });

    // Auto-disable camera follow when user manually drags or pans the map
    map.on("dragstart", () => {
      setFollow(false);
    });

    mapRef.current = map;

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
      isMapLoadedRef.current = false;
    };
  }, []);

  // Fit bounds to entire route
  const fitRouteBounds = useCallback(() => {
    const map = mapRef.current;
    if (!map || !session || session.points.length === 0) return;

    const coordinates = session.points.map((p) => [p.longitude, p.latitude] as [number, number]);
    const bounds = coordinates.reduce(
      (b, coord) => b.extend(coord),
      new maplibregl.LngLatBounds(coordinates[0], coordinates[0])
    );
    map.fitBounds(bounds, { padding: 60, maxZoom: 15, duration: 800 });
  }, [session]);

  // Setup dual-tone polyline sources and layers when session changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !session || session.points.length === 0) return;

    const setupLayers = () => {
      const allCoords = session.points.map((p) => [p.longitude, p.latitude]);

      // Remove previous layers/sources if present
      if (map.getLayer("route-traversed-line")) map.removeLayer("route-traversed-line");
      if (map.getLayer("route-traversed-glow")) map.removeLayer("route-traversed-glow");
      if (map.getLayer("route-remaining-line")) map.removeLayer("route-remaining-line");
      if (map.getSource("source-traversed")) map.removeSource("source-traversed");
      if (map.getSource("source-remaining")) map.removeSource("source-remaining");

      // 1. Remaining route source & layer (muted upcoming path)
      map.addSource("source-remaining", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "LineString", coordinates: allCoords },
          properties: {}
        }
      });

      map.addLayer({
        id: "route-remaining-line",
        type: "line",
        source: "source-remaining",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#94A3B8",
          "line-width": 3,
          "line-opacity": 0.45,
          "line-dasharray": [3, 2]
        }
      });

      // 2. Traversed route source & layers (bright glowing path behind vehicle)
      map.addSource("source-traversed", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "LineString", coordinates: [allCoords[0]] },
          properties: {}
        }
      });

      map.addLayer({
        id: "route-traversed-glow",
        type: "line",
        source: "source-traversed",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#2563EB",
          "line-width": 8,
          "line-opacity": 0.45
        }
      });

      map.addLayer({
        id: "route-traversed-line",
        type: "line",
        source: "source-traversed",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#60A5FA",
          "line-width": 4,
          "line-opacity": 1.0
        }
      });

      // Fit bounds initially
      fitRouteBounds();

      // Clean old stoppage markers & render new
      stoppageMarkersRef.current.forEach((m) => m.remove());
      stoppageMarkersRef.current = [];

      session.points.forEach((pt, idx) => {
        if (pt.stoppage) {
          const stopEl = document.createElement("div");
          stopEl.className =
            "flex items-center justify-center w-6 h-6 rounded-full bg-rose-600 border-2 border-white text-white text-[10px] font-bold shadow-md cursor-pointer hover:scale-125 transition-transform";
          stopEl.title = `Stoppage: ${pt.locationName || pt.timestamp}`;
          stopEl.innerText = "P";
          stopEl.addEventListener("click", () => onSelectPoint?.(idx));

          const m = new maplibregl.Marker({ element: stopEl })
            .setLngLat([pt.longitude, pt.latitude])
            .addTo(map);
          stoppageMarkersRef.current.push(m);
        }
      });
    };

    if (map.isStyleLoaded()) {
      setupLayers();
    } else {
      map.once("styledata", setupLayers);
    }
  }, [session, fitRouteBounds]);

  // 60 FPS Continuous Vehicle Marker & Dual-Tone Polyline Update
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !session || session.points.length === 0) return;

    const state: InterpolatedState | null = getInterpolatedVehicleState(session.points, progress);
    if (!state) return;

    // 1. Create or smoothly update the vehicle marker
    if (!vehicleMarkerRef.current) {
      const el = document.createElement("div");
      el.className = "relative flex items-center justify-center cursor-pointer select-none";
      el.style.width = "48px";
      el.style.height = "48px";

      el.innerHTML = `
        <div class="telematics-radar absolute w-14 h-14 rounded-full bg-blue-500/30 animate-ping pointer-events-none"></div>
        <div class="vehicle-disc relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-tr from-blue-700 to-blue-500 border-2 border-white shadow-2xl ring-4 ring-blue-500/40">
          <div class="vehicle-arrow w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[14px] border-b-white transition-transform duration-75"
               style="transform: rotate(${state.heading}deg)"></div>
        </div>
        <div class="speed-hud absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-white bg-slate-900/95 border border-slate-700/80 shadow-md pointer-events-none">
          <span class="speed-val">${state.speed} km/h</span>
        </div>
      `;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(state.position)
        .addTo(map);

      vehicleMarkerRef.current = marker;
    } else {
      vehicleMarkerRef.current.setLngLat(state.position);

      const el = vehicleMarkerRef.current.getElement();
      const arrow = el.querySelector(".vehicle-arrow") as HTMLElement | null;
      if (arrow) {
        arrow.style.transform = `rotate(${state.heading}deg)`;
      }

      const speedVal = el.querySelector(".speed-val") as HTMLElement | null;
      if (speedVal) {
        speedVal.innerText = `${state.speed} km/h`;
      }

      const radar = el.querySelector(".telematics-radar") as HTMLElement | null;
      if (radar) {
        radar.style.display = state.speed > 0 || isPlaying ? "block" : "none";
      }
    }

    // 2. Update dynamic dual-tone polyline segments
    if (map.getSource("source-traversed") && map.getSource("source-remaining")) {
      const { traversed, remaining } = splitRouteCoordinates(
        session.points,
        state.position,
        progress
      );

      const traversedSource = map.getSource("source-traversed") as maplibregl.GeoJSONSource;
      traversedSource.setData({
        type: "Feature",
        geometry: { type: "LineString", coordinates: traversed },
        properties: {}
      });

      const remainingSource = map.getSource("source-remaining") as maplibregl.GeoJSONSource;
      remainingSource.setData({
        type: "Feature",
        geometry: { type: "LineString", coordinates: remaining },
        properties: {}
      });
    }

    // 3. Smooth Camera Tracking (Follow Mode)
    if (internalFollow) {
      map.easeTo({
        center: state.position,
        duration: 0 // Immediate sub-frame camera pan without lag
      });
    }
  }, [progress, session, internalFollow, isPlaying]);

  return (
    <div className="relative w-full h-full min-h-[480px] rounded-2xl overflow-hidden bg-slate-950">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Camera Tracking Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFollow(!internalFollow)}
          title={internalFollow ? "Disable Follow Mode" : "Follow Vehicle"}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md border shadow-lg transition-all ${
            internalFollow
              ? "bg-blue-600/90 text-white border-blue-400 shadow-blue-500/25 ring-2 ring-blue-400/30"
              : "bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800"
          }`}
        >
          <Navigation className={`w-3.5 h-3.5 ${internalFollow ? "animate-pulse" : ""}`} />
          <span>{internalFollow ? "Following Vehicle" : "Follow Vehicle"}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setFollow(false);
            fitRouteBounds();
          }}
          title="Fit Whole Route to Screen"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800 backdrop-blur-md shadow-lg transition-all"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>
      </div>
    </div>
  );
};

export default PlaybackMapCanvas;
