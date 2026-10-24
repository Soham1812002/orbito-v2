import React from "react";
import {
  Layers,
  Map as MapIcon,
  Activity,
  ShieldCheck,
  Flame,
  Check
} from "lucide-react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { MAP_CONFIG } from "@/config/map.config";

interface LiveTrackingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStyle: string;
  onSelectStyle: (styleUrl: string) => void;
  showGeofences: boolean;
  onToggleGeofences: (show: boolean) => void;
  showTraffic: boolean;
  onToggleTraffic: (show: boolean) => void;
  refreshInterval: number;
  onChangeRefreshInterval: (interval: number) => void;
}

export const LiveTrackingSettingsModal: React.FC<LiveTrackingSettingsModalProps> = ({
  isOpen,
  onClose,
  selectedStyle,
  onSelectStyle,
  showGeofences,
  onToggleGeofences,
  showTraffic,
  onToggleTraffic,
  refreshInterval,
  onChangeRefreshInterval
}) => {
  const styles = [
    {
      id: "dark",
      name: "Indian Dark Vector",
      desc: "Optimized for telematics night ops & high contrast",
      url: MAP_CONFIG.styles.dark,
      previewBg: "bg-slate-900 border-slate-700"
    },
    {
      id: "streets",
      name: "Daylight Streets",
      desc: "Detailed highway labels & landmark navigation",
      url: MAP_CONFIG.styles.liberty,
      previewBg: "bg-blue-50 border-blue-200"
    },
    {
      id: "bright",
      name: "High Contrast Bright",
      desc: "Clean daytime canvas for high vehicle density",
      url: MAP_CONFIG.styles.bright,
      previewBg: "bg-slate-100 border-slate-300"
    }
  ];

  const intervals = [
    { label: "5 Seconds (High Precision)", value: 5000 },
    { label: "10 Seconds (Standard Fleet)", value: 10000 },
    { label: "30 Seconds (Low Bandwidth)", value: 30000 }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Live Map Settings & Display Preferences"
      description="Configure vector tile rendering, spatial layer overlays, and telemetry refresh frequency."
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Map Styles Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
            Vector Base Map Style
          </label>
          <div className="space-y-2">
            {styles.map((style) => {
              const isSelected = selectedStyle === style.url;
              return (
                <div
                  key={style.id}
                  onClick={() => onSelectStyle(style.url)}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg border flex items-center justify-center ${style.previewBg}`}>
                      <MapIcon className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {style.name}
                      </p>
                      <p className="text-[11px] text-slate-500">{style.desc}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Spatial Layer Toggles */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            Spatial Layers & Overlays
          </label>

          {/* Geofence Overlay */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Geofence Depots & Corridors
                </p>
                <p className="text-[11px] text-slate-500">
                  Display warehouse and customer polygon boundaries on map
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={showGeofences}
              onChange={(e) => onToggleGeofences(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* Traffic Overlay */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="flex items-center gap-2.5">
              <Flame className="h-4 w-4 text-amber-500" />
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  National Highway Traffic Flow
                </p>
                <p className="text-[11px] text-slate-500">
                  Highlight congestion slowdowns across Indian expressways
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={showTraffic}
              onChange={(e) => onToggleTraffic(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Telemetry Polling Rate */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
            Auto-Polling Rate
          </label>
          <div className="space-y-1.5">
            {intervals.map((rate) => (
              <label
                key={rate.value}
                className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40"
              >
                <input
                  type="radio"
                  name="refreshRate"
                  checked={refreshInterval === rate.value}
                  onChange={() => onChangeRefreshInterval(rate.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>{rate.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="primary" size="sm" onClick={onClose}>
            Apply Settings
          </Button>
        </div>
      </div>
    </Modal>
  );
};
