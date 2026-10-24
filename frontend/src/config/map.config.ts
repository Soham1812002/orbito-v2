import * as maplibregl from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

// Initialize MapLibre GL bundled Web Worker for Vite
if (typeof window !== "undefined" && typeof (maplibregl as any).setWorkerUrl === "function") {
  (maplibregl as any).setWorkerUrl(workerUrl);
}

export interface MapLayerConfig {
  id: string;
  name: string;
  styleUrl: string;
  type: "vector" | "raster";
}

export const MAP_CONFIG = {
  // Ultra-reliable vector tile styles compatible with MapLibre GL JS
  styles: {
    dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
    liberty: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
    bright: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
    openfreemap: "https://tiles.openfreemap.org/styles/dark"
  },
  
  // Default pan-India center coordinate [longitude, latitude]
  defaultCenter: [77.2090, 28.6139] as [number, number],
  defaultZoom: 11,
  minZoom: 3,
  maxZoom: 19,
  
  // Key Indian Freight & Logistics Hub presets
  corridors: [
    { id: "delhi-ncr", name: "Delhi-NCR Freight Corridor", center: [77.1025, 28.7041] as [number, number], zoom: 12 },
    { id: "bhiwandi", name: "Bhiwandi Central Depot (Mumbai)", center: [73.0631, 19.2967] as [number, number], zoom: 12 },
    { id: "ahmedabad", name: "Sanand Auto Industrial Corridor (Gujarat)", center: [72.3789, 22.9922] as [number, number], zoom: 12 },
    { id: "pune", name: "Chakan Industrial Belt (Pune)", center: [73.8567, 18.7606] as [number, number], zoom: 12 },
    { id: "bangalore", name: "Hosur-Bengaluru Transit Hub", center: [77.5946, 12.9716] as [number, number], zoom: 12 }
  ],
  
  // Available map layers for the settings drawer
  layers: [
    { id: "dark", name: "Dark Telematics (Default)", styleUrl: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json", type: "vector" },
    { id: "street", name: "Street & Transit", styleUrl: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json", type: "vector" },
    { id: "bright", name: "High Contrast Daytime", styleUrl: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json", type: "vector" },
    { id: "openfreemap", name: "OpenFreeMap Dark", styleUrl: "https://tiles.openfreemap.org/styles/dark", type: "vector" }
  ] as MapLayerConfig[]
};

