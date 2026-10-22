import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ArrowRight,
  X,
  CornerDownLeft,
  LayoutDashboard,
  Car,
  FileText,
  MapPin,
  Map,
  Bell,
  CreditCard,
  Wrench,
  Sliders,
  Settings,
  Compass,
  Navigation,
  SquareSlash,
  Clock,
  Flame,
  Radio,
  Snowflake,
  Cpu,
  Mail,
  FileCode2,
  Activity,
  CalendarDays,
  ShieldCheck,
  Building2,
  Users,
  Grid
} from "lucide-react";

export interface SearchableMenuItem {
  id: string;
  title: string;
  category: string;
  path: string;
  keywords?: string[];
  icon: React.ComponentType<{ className?: string }>;
}

export const searchIndex: SearchableMenuItem[] = [
  // Core Navigation
  { id: "dashboard", title: "Dashboard", category: "Core Navigation", path: "/dashboard", icon: LayoutDashboard },
  { id: "vehicles", title: "Vehicles Register", category: "Core Navigation", path: "/vehicles", icon: Car },
  // POI & Spatial Telematics
  { id: "poi-hub", title: "POI Hub & Navigation", category: "Spatial Telematics", path: "/poi", keywords: ["poi", "places", "landmarks", "dispatch", "stops"], icon: Grid },
  { id: "poi-overview", title: "POI Directory Overview", category: "Spatial Telematics", path: "/poi/overview", keywords: ["points of interest", "poi list", "table", "coordinates"], icon: MapPin },
  { id: "poi-new", title: "Add New Point of Interest", category: "Spatial Telematics", path: "/poi/new", keywords: ["create poi", "pin map", "new location", "marker"], icon: MapPin },
  { id: "poi-summary-a", title: "POI Summary A (Stop Duration)", category: "Spatial Telematics", path: "/poi/summary-a", keywords: ["poi stop report", "duration", "dwell", "parking"], icon: Clock },
  { id: "poi-summary-b", title: "POI Summary B (Vehicle Dwell)", category: "Spatial Telematics", path: "/poi/summary-b", keywords: ["poi vehicle dwell", "entry count", "dwell time"], icon: Compass },
  { id: "poi-missed", title: "Missed POI Report", category: "Spatial Telematics", path: "/poi/missed", keywords: ["skipped poi", "unvisited", "missed stops", "compliance"], icon: SquareSlash },
  { id: "poi-collection", title: "Collection Address Log", category: "Spatial Telematics", path: "/poi/collection-address", keywords: ["pickup", "collection address", "dispatch adherence"], icon: Building2 },

  // Geofence & Boundary Management
  { id: "geofence-hub", title: "Geofence Hub Navigator", category: "Spatial Telematics", path: "/geofence", keywords: ["geofence", "virtual perimeter", "fences", "corridors"], icon: Grid },
  { id: "geofence-overview", title: "Geofence Overview & Directory", category: "Spatial Telematics", path: "/geofence/overview", keywords: ["geofence list", "active fences", "zones", "radius"], icon: Map },
  { id: "geofence-new", title: "Create Geofence Boundary", category: "Spatial Telematics", path: "/geofence/new", keywords: ["draw perimeter", "radial", "polygon", "new geofence", "editor"], icon: Navigation },
  { id: "geofence-summary-a", title: "Geofence Summary A (Zone Activity)", category: "Spatial Telematics", path: "/geofence/summary-a", keywords: ["zone activity", "stay duration", "fence report"], icon: Activity },
  { id: "geofence-summary-b", title: "Geofence Summary B (Vehicle Crossing)", category: "Spatial Telematics", path: "/geofence/summary-b", keywords: ["crossing log", "in-out events", "vehicle fence"], icon: Car },
  { id: "geofence-out", title: "Out of Geofence Deviations", category: "Spatial Telematics", path: "/geofence/out-of-geofence", keywords: ["breach", "route violation", "deviation", "unauthorized exit"], icon: ShieldCheck },

  // Alerts & Notifications
  { id: "alerts", title: "Alerts & Notifications", category: "Core Navigation", path: "/alerts", icon: Bell },

  // Operations
  { id: "licensing", title: "Licensing", category: "Operations", path: "/licensing", icon: CreditCard },
  { id: "maintenance", title: "Fleet Maintenance", category: "Operations", path: "/maintenance", icon: Wrench },

  // Reports
  { id: "reports-hub", title: "Reports Catalog Navigator", category: "Fleet Reports", path: "/reports", icon: Grid },
  { id: "report-travel", title: "Travel Summary Report", category: "Fleet Reports", path: "/reports/travel-summary", keywords: ["distance", "mileage", "speed"], icon: Compass },
  { id: "report-trip", title: "Trip Summary Overview", category: "Fleet Reports", path: "/reports/trip-summary", keywords: ["routes", "trips", "events"], icon: Navigation },
  { id: "report-stoppage", title: "Stoppage Summary Report", category: "Fleet Reports", path: "/reports/stoppage-summary", keywords: ["stops", "parking", "duration"], icon: SquareSlash },
  { id: "report-idle", title: "Idle Summary Report", category: "Fleet Reports", path: "/reports/idle-summary", keywords: ["fuel", "engine idle", "waste"], icon: Clock },
  { id: "report-ignition", title: "Ignition Summary Report", category: "Fleet Reports", path: "/reports/ignition-summary", keywords: ["engine hours", "battery", "start"], icon: Flame },
  { id: "report-inactive", title: "Inactive Summary Report", category: "Fleet Reports", path: "/reports/inactive-summary", keywords: ["offline", "no gps", "disconnect"], icon: Radio },
  { id: "report-ac", title: "AC Usage Summary Report", category: "Fleet Reports", path: "/reports/ac-summary", keywords: ["air conditioning", "cooling", "cold chain"], icon: Snowflake },
  { id: "report-digital-port", title: "Digital Port Summary Report", category: "Fleet Reports", path: "/reports/digital-port-summary", keywords: ["sensors", "inputs", "io"], icon: Cpu },
  { id: "report-vehicle-status", title: "Vehicle Status Report", category: "Fleet Reports", path: "/reports/vehicle-status", keywords: ["battery", "sim", "telemetry"], icon: Car },
  { id: "report-vehicle-location", title: "Vehicle Location Report", category: "Fleet Reports", path: "/reports/vehicle-location", keywords: ["gps", "coordinates", "address"], icon: MapPin },
  { id: "report-vehicle-activation", title: "Vehicle Activation Report", category: "Fleet Reports", path: "/reports/vehicle-activation", keywords: ["setup", "onboarding"], icon: ShieldCheck },
  { id: "report-sms-email", title: "SMS & Email Dispatch Log", category: "Fleet Reports", path: "/reports/sms-email-summary", keywords: ["messages", "notifications"], icon: Mail },
  { id: "report-device-log", title: "Device Telemetry Log", category: "Fleet Reports", path: "/reports/device-log", keywords: ["imei", "packet", "raw hex"], icon: FileCode2 },
  { id: "report-system-log", title: "System Diagnostics Log", category: "Fleet Reports", path: "/reports/system-log", keywords: ["gateway", "firmware", "health"], icon: Activity },
  { id: "report-scheduled", title: "Scheduled Reports Automation", category: "Fleet Reports", path: "/reports/scheduled-reports", keywords: ["cron", "recurrence", "email report"], icon: CalendarDays },

  // System Configuration
  { id: "sys-users", title: "User Overview", category: "Sys Config", path: "/system-config/users", icon: Users },
  { id: "sys-user-groups", title: "User Groups", category: "Sys Config", path: "/system-config/user-groups", icon: Users },
  { id: "sys-roles", title: "System Roles", category: "Sys Config", path: "/system-config/roles", icon: ShieldCheck },
  { id: "sys-resellers", title: "Resellers Management", category: "Sys Config", path: "/system-config/resellers", icon: Building2 },
  { id: "sys-sim", title: "SIM Providers", category: "Sys Config", path: "/system-config/sim-providers", icon: Radio },

  // App Configuration
  { id: "app-companies", title: "Companies", category: "App Config", path: "/app-config/companies", icon: Building2 },
  { id: "app-branches", title: "Branches", category: "App Config", path: "/app-config/branches", icon: Building2 },
  { id: "app-employees", title: "Employees", category: "App Config", path: "/app-config/employees", icon: Users },
  { id: "app-vehicles", title: "Added Vehicles", category: "App Config", path: "/app-config/vehicles", icon: Car },
  { id: "app-devices", title: "GPS Devices", category: "App Config", path: "/app-config/gps-devices", icon: Cpu },
  { id: "app-sim-cards", title: "SIM Cards Register", category: "App Config", path: "/app-config/sim-cards", icon: Radio }
];

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  initialQuery = ""
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Sync initial query when opened
  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, initialQuery]);

  // Filter items
  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      return searchIndex.slice(0, 10);
    }

    const q = query.toLowerCase().trim();
    return searchIndex.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q));
      const matchPath = item.path.toLowerCase().includes(q);
      return matchTitle || matchCategory || matchKeywords || matchPath;
    });
  }, [query]);

  // Reset selected index when query results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          navigate(filteredResults[selectedIndex].path);
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, navigate, onClose]);

  // Highlight matched substrings
  const renderHighlightedText = (text: string, highlightQuery: string) => {
    if (!highlightQuery.trim()) return text;

    const escapedQuery = highlightQuery.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedQuery})`, "gi");
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === highlightQuery.toLowerCase().trim() ? (
            <span
              key={index}
              className="text-blue-600 dark:text-blue-400 font-bold bg-blue-500/15 dark:bg-blue-400/20 px-0.5 rounded"
            >
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </span>
    );
  };

  const handleSelect = (item: SearchableMenuItem) => {
    navigate(item.path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/50 dark:bg-black/70 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white/90 dark:bg-[#0F172B]/90 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl backdrop-blur-xl overflow-hidden transition-all animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200/80 dark:border-slate-800/80">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search fleet, vehicles, users, reports, settings..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-400 border border-slate-300 dark:border-slate-700 rounded bg-slate-100 dark:bg-slate-800">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {filteredResults.length > 0 ? (
            filteredResults.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs shadow-blue-500/20"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 transition-colors ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">
                        {renderHighlightedText(item.title, query)}
                      </div>
                      <div
                        className={`text-[11px] truncate ${
                          isSelected ? "text-blue-100" : "text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        {item.category} · {item.path}
                      </div>
                    </div>
                  </div>

                  {/* Navigation link icon at the end of every item */}
                  <div className="flex items-center gap-2 pl-3 shrink-0">
                    {isSelected && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium opacity-80">
                        Select <CornerDownLeft className="h-3 w-3" />
                      </span>
                    )}
                    <ArrowRight
                      className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 ${
                        isSelected
                          ? "text-white"
                          : "text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                      }`}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-400">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold">No matching menu items found</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for "trip", "stoppage", "vehicles", or "roles"
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer with Keyboard Hints */}
        <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-[#162032]/80 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px]">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px]">
                ↓
              </kbd>{" "}
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px]">
                ↵
              </kbd>{" "}
              Select
            </span>
          </div>
          <span>Orbito Quick Search</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
