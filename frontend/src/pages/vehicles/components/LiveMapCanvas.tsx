import React, { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import { VehicleTelemetry } from "../vehicles.types";
import { MAP_CONFIG } from "@/config/map.config";

// Configure MapLibre GL bundled worker for Vite
if (typeof window !== "undefined" && typeof (maplibregl as any).setWorkerUrl === "function") {
  (maplibregl as any).setWorkerUrl(workerUrl);
}


interface LiveMapCanvasProps {
  vehicles: VehicleTelemetry[];
  selectedVehicleId?: string;
  onSelectVehicle: (vehicle: VehicleTelemetry) => void;
  styleUrl?: string;
  showGeofences?: boolean;
  showTraffic?: boolean;
}

export const LiveMapCanvas: React.FC<LiveMapCanvasProps> = ({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  styleUrl = MAP_CONFIG.styles.dark,
  showGeofences = true,
  showTraffic = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const vehiclesRef = useRef<VehicleTelemetry[]>(vehicles);
  vehiclesRef.current = vehicles;
  const prevSelectedVehicleIdRef = useRef<string | undefined>(undefined);

  const ensureSpatialLayers = (map: maplibregl.Map) => {
    if (!map.isStyleLoaded()) return;

    // 1. Geofence Depot Sample Layer
    if (!map.getSource("geofence-sample")) {
      map.addSource("geofence-sample", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [77.200, 28.610],
                [77.225, 28.610],
                [77.225, 28.625],
                [77.200, 28.625],
                [77.200, 28.610]
              ]
            ]
          },
          properties: { name: "Central NCR Logistics Hub" }
        }
      });

      map.addLayer({
        id: "geofence-fill",
        type: "fill",
        source: "geofence-sample",
        paint: {
          "fill-color": "#2563EB",
          "fill-opacity": 0.15
        },
        layout: {
          visibility: showGeofences ? "visible" : "none"
        }
      });

      map.addLayer({
        id: "geofence-line",
        type: "line",
        source: "geofence-sample",
        paint: {
          "line-color": "#3B82F6",
          "line-width": 2,
          "line-dasharray": [3, 2]
        },
        layout: {
          visibility: showGeofences ? "visible" : "none"
        }
      });
    }

    // 2. National Highway Traffic Flow Sample Layer
    if (!map.getSource("traffic-sample")) {
      map.addSource("traffic-sample", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [77.209, 28.6139],
                  [77.260, 28.5800],
                  [77.340, 28.5200],
                  [77.400, 28.4500]
                ]
              },
              properties: { level: "moderate" }
            },
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [77.400, 28.4500],
                  [77.450, 28.3800],
                  [77.520, 28.3000]
                ]
              },
              properties: { level: "heavy" }
            }
          ]
        }
      });

      map.addLayer({
        id: "traffic-flow-line",
        type: "line",
        source: "traffic-sample",
        paint: {
          "line-color": [
            "match",
            ["get", "level"],
            "heavy", "#EF4444",
            "moderate", "#F59E0B",
            "#10B981"
          ],
          "line-width": 4,
          "line-opacity": 0.75
        },
        layout: {
          visibility: showTraffic ? "visible" : "none"
        }
      });
    }
  };

  // Initialize MapLibre GL Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initialCenter = selectedVehicleId
      ? ([
          vehicles.find((v) => v.id === selectedVehicleId)?.longitude || MAP_CONFIG.defaultCenter[0],
          vehicles.find((v) => v.id === selectedVehicleId)?.latitude || MAP_CONFIG.defaultCenter[1]
        ] as [number, number])
      : MAP_CONFIG.defaultCenter;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: initialCenter,
      zoom: MAP_CONFIG.defaultZoom,
      pitch: 20,
      attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");

    map.on("load", () => {
      ensureSpatialLayers(map);
    });

    // Re-attach spatial layers whenever map style finishes loading
    map.on("styledata", () => {
      ensureSpatialLayers(map);
    });

    mapRef.current = map;

    // Handle container resize when sidebar expands/collapses
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
    };
  }, []);

  // Update Style if changed
  useEffect(() => {
    if (!mapRef.current || !styleUrl) return;
    mapRef.current.setStyle(styleUrl);
  }, [styleUrl]);

  // Toggle Geofence layer visibility
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const visibility = showGeofences ? "visible" : "none";
    if (map.getLayer("geofence-fill")) {
      map.setLayoutProperty("geofence-fill", "visibility", visibility);
    }
    if (map.getLayer("geofence-line")) {
      map.setLayoutProperty("geofence-line", "visibility", visibility);
    }
  }, [showGeofences]);

  // Toggle Traffic layer visibility
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const visibility = showTraffic ? "visible" : "none";
    if (map.getLayer("traffic-flow-line")) {
      map.setLayoutProperty("traffic-flow-line", "visibility", visibility);
    }
  }, [showTraffic]);

  // Update vehicle markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const currentMarkerIds = new Set<string>();

    vehicles.forEach((vehicle) => {
      currentMarkerIds.add(vehicle.id);
      const isSelected = vehicle.id === selectedVehicleId;

      // Status color matching design tokens
      const statusColor =
        vehicle.status === "moving"
          ? "#10B981"
          : vehicle.status === "idling"
          ? "#F59E0B"
          : vehicle.status === "stopped"
          ? "#EF4444"
          : "#64748B";

      let marker = markersRef.current.get(vehicle.id);

      if (!marker) {
        // Create custom HTML DOM marker for rich telemetry visualization
        const el = document.createElement("div");
        el.className = "relative cursor-pointer transition-transform duration-200 hover:scale-110";
        el.style.width = "40px";
        el.style.height = "40px";

        el.innerHTML = `
          <div class="marker-disc relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg border-2 transition-all duration-200 ${
            isSelected ? "border-white ring-4 ring-blue-500/50 scale-125 z-10" : "border-slate-800"
          }" style="background-color: ${statusColor}">
            <div class="marker-arrow w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[10px] border-b-white transition-transform duration-300"
                 style="transform: rotate(${vehicle.heading}deg)"></div>
            ${
              vehicle.status === "moving"
                ? '<span class="moving-ping absolute -top-1 -right-1 flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span>'
                : ""
            }
          </div>
          <div class="marker-badge absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider text-white shadow-md ${
            isSelected ? "bg-blue-600" : "bg-slate-900/90"
          }">
            ${vehicle.plateNumber.split(" ")[0] || "VEH"}
          </div>
        `;

        el.addEventListener("click", (e) => {
          e.stopPropagation();
          const latestVeh = vehiclesRef.current.find((v) => v.id === vehicle.id) || vehicle;
          onSelectVehicle(latestVeh);
        });

        marker = new maplibregl.Marker({ element: el })
          .setLngLat([vehicle.longitude, vehicle.latitude])
          .addTo(map);

        markersRef.current.set(vehicle.id, marker);
      } else {
        // Smoothly update marker coordinates and rotation
        marker.setLngLat([vehicle.longitude, vehicle.latitude]);
        const el = marker.getElement();

        const disc = el.querySelector(".marker-disc") as HTMLElement | null;
        if (disc) {
          disc.className = `marker-disc relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg border-2 transition-all duration-200 ${
            isSelected ? "border-white ring-4 ring-blue-500/50 scale-125 z-10" : "border-slate-800"
          }`;
          disc.style.backgroundColor = statusColor;
        }

        const arrow = el.querySelector(".marker-arrow") as HTMLElement | null;
        if (arrow) {
          arrow.style.transform = `rotate(${vehicle.heading}deg)`;
        }

        const badge = el.querySelector(".marker-badge") as HTMLElement | null;
        if (badge) {
          badge.className = `marker-badge absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider text-white shadow-md ${
            isSelected ? "bg-blue-600" : "bg-slate-900/90"
          }`;
        }
      }
    });

    // Remove markers that are no longer in the list
    markersRef.current.forEach((marker, id) => {
      if (!currentMarkerIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });
  }, [vehicles, selectedVehicleId, onSelectVehicle]);

  // Fly to selected vehicle only when selection changes
  useEffect(() => {
    if (!mapRef.current || !selectedVehicleId) {
      prevSelectedVehicleIdRef.current = selectedVehicleId;
      return;
    }
    if (prevSelectedVehicleIdRef.current === selectedVehicleId) return;

    const vehicle = vehicles.find((v) => v.id === selectedVehicleId);
    if (vehicle) {
      prevSelectedVehicleIdRef.current = selectedVehicleId;
      mapRef.current.flyTo({
        center: [vehicle.longitude, vehicle.latitude],
        zoom: 14,
        speed: 1.2,
        curve: 1.4
      });
    }
  }, [selectedVehicleId, vehicles]);

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-2xl bg-slate-950">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
