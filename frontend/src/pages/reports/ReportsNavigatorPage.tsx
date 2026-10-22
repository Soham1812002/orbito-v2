import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Navigation,
  Compass,
  SquareSlash,
  Flame,
  Clock,
  Radio,
  Snowflake,
  Cpu,
  Mail,
  Car,
  MapPin,
  FileCode2,
  Activity,
  CalendarDays,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  X
} from "lucide-react";
import { ReportCategory, ReportItemMeta } from "@/types/reports.types";

export const reportCatalog: ReportItemMeta[] = [
  {
    key: "travel-summary",
    name: "Travel Summary",
    path: "/reports/travel-summary",
    category: "Activity & Motion",
    icon: Compass,
    badge: "247 VEHICLES",
    badgeVariant: "cyan",
    description: "Review distance, driving duration, route milestones and speed performance across your fleet."
  },
  {
    key: "trip-summary",
    name: "Trip Summary",
    path: "/reports/trip-summary",
    category: "Activity & Motion",
    icon: Navigation,
    badge: "DRILLDOWN",
    badgeVariant: "cyan",
    description: "Concise view of completed trips, travel distance, drive time, and trip alerts by vehicle with trip history.",
    hasEventView: true
  },
  {
    key: "stoppage-summary",
    name: "Stoppage Summary",
    path: "/reports/stoppage-summary",
    category: "Activity & Motion",
    icon: SquareSlash,
    badge: "EVENTS",
    badgeVariant: "counter",
    description: "Analyze vehicle stoppage events, duration trends, and complete stoppage activity by branch.",
    hasEventView: true
  },
  {
    key: "ignition-summary",
    name: "Ignition Summary",
    path: "/reports/ignition-summary",
    category: "Telemetry & Sensors",
    icon: Flame,
    badge: "3,482 KM",
    badgeVariant: "cyan",
    description: "Ignition events, distance, operating time, driver allocation, and detailed run vs idle telemetry.",
    hasEventView: true
  },
  {
    key: "idle-summary",
    name: "Idle Summary",
    path: "/reports/idle-summary",
    category: "Activity & Motion",
    icon: Clock,
    badge: "FUEL AUDIT",
    badgeVariant: "alert",
    description: "Monitor engine idle durations, unnecessary fuel consumption, and vehicle idle performance.",
    hasEventView: true
  },
  {
    key: "inactive-summary",
    name: "Inactive Summary",
    path: "/reports/inactive-summary",
    category: "Telemetry & Sensors",
    icon: Radio,
    badge: "14 OFFLINE",
    badgeVariant: "alert",
    description: "Track inactive vehicles, lost GPS communications, and prolonged parking downtime.",
    hasEventView: true
  },
  {
    key: "ac-summary",
    name: "AC Summary",
    path: "/reports/ac-summary",
    category: "Telemetry & Sensors",
    icon: Snowflake,
    badge: "COLD CHAIN",
    badgeVariant: "cyan",
    description: "Review air-conditioning usage, runtimes, activation cycles, and ignition overlap status.",
    hasEventView: true
  },
  {
    key: "digital-port-summary",
    name: "Digital Port Summary",
    path: "/reports/digital-port-summary",
    category: "Telemetry & Sensors",
    icon: Cpu,
    badge: "48 DEVICES",
    badgeVariant: "counter",
    description: "Monitor digital input and output sensor activity (Door, PTO, Panic) and port durations.",
    hasEventView: true
  },
  {
    key: "sms-email-summary",
    name: "SMS & Email",
    path: "/reports/sms-email-summary",
    category: "Communications & Logs",
    icon: Mail,
    badge: "12,486 SENT",
    badgeVariant: "counter",
    description: "Review SMS and email notifications sent for each company, branch, and vehicle."
  },
  {
    key: "vehicle-status",
    name: "Vehicle Status",
    path: "/reports/vehicle-status",
    category: "Operations & Tracking",
    icon: Car,
    badge: "LIVE REGISTER",
    badgeVariant: "cyan",
    description: "Live vehicle, device, ignition, GPS, battery, and last communication status by organization."
  },
  {
    key: "vehicle-location",
    name: "Vehicle Location",
    path: "/reports/vehicle-location",
    category: "Operations & Tracking",
    icon: MapPin,
    badge: "42 ONLINE",
    badgeVariant: "cyan",
    description: "Monitor latest vehicle locations, reverse-geocoded addresses, coordinates, and telemetry status."
  },
  {
    key: "device-log",
    name: "Device Log",
    path: "/reports/device-log",
    category: "Communications & Logs",
    icon: FileCode2,
    badge: "PACKET LOOKUP",
    badgeVariant: "counter",
    description: "Search tracking device by IMEI number to inspect its latest GPS packet, vehicle signals, and raw data."
  },
  {
    key: "system-log",
    name: "System Log",
    path: "/reports/system-log",
    category: "Communications & Logs",
    icon: Activity,
    badge: "DIAGNOSTICS",
    badgeVariant: "counter",
    description: "Monitor incoming device packets, GPS validity, power status, latency, and firmware logs."
  },
  {
    key: "scheduled-reports",
    name: "Schedule Reports",
    path: "/reports/scheduled-reports",
    category: "Automation",
    icon: CalendarDays,
    badge: "12 ACTIVE",
    badgeVariant: "cyan",
    description: "Manage recurring automated fleet reports, delivery recipients, and automated schedules."
  },
  {
    key: "vehicle-activation",
    name: "Vehicle Activation",
    path: "/reports/vehicle-activation",
    category: "Operations & Tracking",
    icon: ShieldCheck,
    badge: "42 ACTIVE",
    badgeVariant: "cyan",
    description: "Track vehicle setup, GPS hardware provisioning, SIM assignment, and activation lifecycle."
  }
];

export const ReportsNavigatorPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory>("All");

  const categories: ReportCategory[] = [
    "All",
    "Activity & Motion",
    "Telemetry & Sensors",
    "Operations & Tracking",
    "Communications & Logs",
    "Automation"
  ];

  const filteredReports = useMemo(() => {
    return reportCatalog.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero matching Figma #1028:160 */}
      <div className="panel-card !p-6 sm:!p-8 relative overflow-hidden bg-gradient-to-br from-blue-900/10 via-transparent to-cyan-500/5 border border-blue-500/20 dark:border-blue-500/10">
        <div className="relative z-10 space-y-2 max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Fleet Report Navigator
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Browse grouped reports for travel, safety, operational, and compliance insights. Search reports or filter by domain to inspect telematics records.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="relative mt-6 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vehicles, reports, drivers, sensors, or alerts..."
            className="w-full pl-10 pr-10 py-3 text-sm rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs shadow-blue-500/25"
                  : "bg-white dark:bg-[#0F172B] border border-slate-200 dark:border-[#1D293D] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((report) => {
          const Icon = report.icon;
          return (
            <div
              key={report.key}
              onClick={() => navigate(report.path)}
              className="panel-card !p-5 flex flex-col justify-between cursor-pointer border border-slate-200/80 dark:border-[#1D293D] hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/5 dark:hover:border-blue-500 transition-all group"
            >
              <div>
                {/* Header: Icon */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-xs">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                {/* Title & Category */}
                <div className="space-y-1 mb-2">
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {report.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {report.name}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {report.description}
                </p>
              </div>

              {/* Bottom trigger action */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span>View Report</span>
                <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {filteredReports.length === 0 && (
        <div className="panel-card p-12 text-center text-slate-500">
          <p className="text-sm">No reports matching "{searchQuery}" in category "{selectedCategory}".</p>
        </div>
      )}
    </div>
  );
};

export default ReportsNavigatorPage;
