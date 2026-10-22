import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  PlusCircle,
  BarChart2,
  Truck,
  AlertTriangle,
  FileSpreadsheet,
  ArrowRight,
  Search,
  Compass,
  CheckCircle2
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { usePoiList } from "@/queries/poi.queries";

interface ModuleCard {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  badgeVariant?: "blue" | "green" | "amber" | "rose" | "purple" | "cyan";
  statLabel: string;
  statValue: string;
}

export const PoiHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: poiData } = usePoiList();

  const totalPlaces = poiData?.total ?? 24;

  const modules: ModuleCard[] = [
    {
      id: "add-poi",
      title: "Add POI",
      description: "Define a new point of interest with geocoded coordinates and operational attributes.",
      path: "/poi/new",
      icon: PlusCircle,
      badge: "CREATOR",
      badgeVariant: "blue",
      statLabel: "Tool Type",
      statValue: "Interactive Map"
    },
    {
      id: "poi-overview",
      title: "POI Overview",
      description: "Review points of interest across companies, branches, and assigned geographic locations.",
      path: "/poi/overview",
      icon: Compass,
      badge: `${totalPlaces} PLACES`,
      badgeVariant: "cyan",
      statLabel: "Configured POIs",
      statValue: `${totalPlaces} Active`
    },
    {
      id: "summary-a",
      title: "POI Summary-A",
      description: "Review visitor volumes and stop-duration performance across configured points of interest.",
      path: "/poi/summary-a",
      icon: BarChart2,
      badge: "HOURS:MIN",
      badgeVariant: "purple",
      statLabel: "Primary Metric",
      statValue: "Location Dwell"
    },
    {
      id: "summary-b",
      title: "POI Summary-B",
      description: "Analyze vehicle-level visits, total elapsed dwell durations, and registered telemetry IMEI.",
      path: "/poi/summary-b",
      icon: Truck,
      badge: "VEHICLE AUDIT",
      badgeVariant: "amber",
      statLabel: "Tracking Mode",
      statValue: "Vehicle Level"
    },
    {
      id: "missed-poi",
      title: "Missed POI",
      description: "Identify scheduled locations not visited by assigned fleet vehicles during operational shifts.",
      path: "/poi/missed",
      icon: AlertTriangle,
      badge: "EXCEPTIONS",
      badgeVariant: "rose",
      statLabel: "Alert Trigger",
      statValue: "Non-Compliance"
    },
    {
      id: "collection-address",
      title: "Collection Address",
      description: "Maintain collection and delivery addresses with dispatch adherence and visited counts.",
      path: "/poi/collection-address",
      icon: FileSpreadsheet,
      badge: "LOGISTICS",
      badgeVariant: "green",
      statLabel: "Coverage",
      statValue: "Pickup & Drop"
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
          { label: "POI Module" }
        ]}
        title="Points of Interest (POI) Operations"
        badge={`${totalPlaces} CONFIGURED`}
        badgeVariant="cyan"
        description="Define geocoded locations, audit vehicle stop durations, monitor missed points, and track pickup addresses."
      />

      {/* Module Search Bar */}
      <div className="panel-card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search POI tools and summaries..."
              className="w-full h-10 pl-9 pr-4 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Interactive Map & Excel Reporting Engine Enabled</span>
          </div>
        </div>
      </div>

      {/* Grid of 6 Module Cards */}
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
                {/* Header Icon + Badge */}
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

                {/* Title & Description */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {card.description}
                </p>
              </div>

              {/* Footer Stat + Launch Arrow */}
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

export default PoiHubPage;
