import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Map,
  ShieldCheck,
  PlusCircle,
  BarChart2,
  Truck,
  AlertOctagon,
  ArrowRight,
  Search,
  Radio,
  CheckCircle2
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useGeofenceList } from "@/queries/geofence.queries";

interface GeofenceModuleCard {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  statLabel: string;
  statValue: string;
}

export const GeofenceHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: geofenceData } = useGeofenceList();

  const totalGeofences = geofenceData?.total ?? 5;

  const modules: GeofenceModuleCard[] = [
    {
      id: "create-geofence",
      title: "Create Geofence",
      description: "Draw custom polygon or circular perimeter boundaries with speed limit and dwell rules.",
      path: "/geofence/new",
      icon: PlusCircle,
      badge: "MAP DESIGNER",
      statLabel: "Modes",
      statValue: "Polygon & Circular"
    },
    {
      id: "geofence-overview",
      title: "Geofence Directory",
      description: "Manage monitored perimeters, assigned vehicles, alert rules, and operational categories.",
      path: "/geofence/overview",
      icon: Map,
      badge: `${totalGeofences} BOUNDARIES`,
      statLabel: "Total Geofences",
      statValue: `${totalGeofences} Active`
    },
    {
      id: "geofence-summary-a",
      title: "Zone Activity (Summary-A)",
      description: "Analyze aggregate entry/exit volumes and accumulated in-zone dwell time across perimeters.",
      path: "/geofence/summary-a",
      icon: BarChart2,
      badge: "ZONE TRAFFIC",
      statLabel: "Primary Metric",
      statValue: "Boundary Entries"
    },
    {
      id: "geofence-summary-b",
      title: "Vehicle Crossings (Summary-B)",
      description: "Audit chronological vehicle entry and exit timestamps, entry speeds, and dwell durations.",
      path: "/geofence/summary-b",
      icon: Truck,
      badge: "TELEMETRY LOG",
      statLabel: "Tracking Mode",
      statValue: "Vehicle Level"
    },
    {
      id: "out-of-geofence",
      title: "Out-of-Geofence Deviations",
      description: "Real-time exception register for unauthorized route deviations, corridor breaches, and alerts.",
      path: "/geofence/out-of-geofence",
      icon: AlertOctagon,
      badge: "EXCEPTIONS",
      statLabel: "Breach Audit",
      statValue: "Deviation Alerts"
    }
  ];

  const filteredModules = modules.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Geofence Module" }
        ]}
        title="Geofencing & Boundary Compliance"
        badge={`${totalGeofences} MONITORED`}
        badgeVariant="cyan"
        description="Monitor spatial perimeters, speed thresholds, automatic entry/exit alerts, and vehicle dwell compliance."
      />

      {/* Search & Status Bar */}
      <div className="panel-card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search geofence tools and reports..."
              className="w-full h-10 pl-9 pr-4 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Radio className="h-4 w-4 text-blue-500 animate-pulse" />
            <span>Real-time GPS boundary surveillance active</span>
          </div>
        </div>
      </div>

      {/* Grid of 5 Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredModules.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => navigate(card.path)}
              className="panel-card group relative p-5 flex flex-col justify-between hover:border-blue-500/40 hover:shadow-lg dark:hover:border-blue-500/30 transition-all duration-200 cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 group-hover:scale-105 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  {card.badge && (
                    <span className="badge-pill bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] font-bold tracking-wider">
                      {card.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {card.description}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {card.statLabel}
                  </span>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {card.statValue}
                  </p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-[#2563EB] group-hover:text-white dark:bg-slate-800 dark:text-slate-300 transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GeofenceHubPage;
