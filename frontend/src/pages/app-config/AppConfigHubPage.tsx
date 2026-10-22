import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  GitBranch,
  Truck,
  Users,
  Radio,
  Cpu,
  FileSpreadsheet,
  ShieldAlert,
  UserMinus,
  MessageSquare,
  Layers,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  HardDrive
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { appConfigApi } from "@/api/appConfig.api";
import { appConfigRegistry } from "@/config/appConfigs";

export const AppConfigHubPage: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["app-config", "stats"],
    queryFn: ({ signal }) => appConfigApi.getStats(signal),
    staleTime: 30000
  });

  const cards = [
    // Organization Hierarchy
    {
      key: "companies",
      title: "Companies",
      category: "Organization Hierarchy",
      icon: Building2,
      path: "/app-config/companies",
      color: "from-blue-600 to-indigo-600",
      description: "Manage client enterprise accounts, contract limits, and legal entities.",
      count: stats?.counts?.companies ?? 0
    },
    {
      key: "branches",
      title: "Branches",
      category: "Organization Hierarchy",
      icon: GitBranch,
      path: "/app-config/branches",
      color: "from-indigo-600 to-cyan-600",
      description: "Regional dispatch depots, terminals, and base yard geofences.",
      count: stats?.counts?.branches ?? 0
    },
    {
      key: "employees",
      title: "Employees & Drivers",
      category: "Organization Hierarchy",
      icon: Users,
      path: "/app-config/employees",
      color: "from-sky-600 to-blue-600",
      description: "Driver license registries, operations managers, and technicians.",
      count: stats?.counts?.employees ?? 0
    },

    // Fleet Assets
    {
      key: "vehicles",
      title: "Added Vehicles",
      category: "Fleet Assets",
      icon: Truck,
      path: "/app-config/vehicles",
      color: "from-emerald-600 to-teal-600",
      description: "Commercial freight carriers, VIN numbers, tanks, and assignments.",
      count: stats?.counts?.vehicles ?? 0
    },
    {
      key: "added-devices",
      title: "Added Devices",
      category: "Fleet Assets",
      icon: Layers,
      path: "/app-config/added-devices",
      color: "from-teal-600 to-emerald-700",
      description: "Telemetry bundles linking GPS hardware with fuel and temp sensors.",
      count: stats?.counts?.["added-devices"] ?? 0
    },

    // Hardware & Connectivity
    {
      key: "gps-devices",
      title: "GPS Devices",
      category: "Hardware & Connectivity",
      icon: Cpu,
      path: "/app-config/gps-devices",
      color: "from-amber-600 to-orange-600",
      description: "AIS-140 and telematics trackers, IMEIs, protocols, and firmware.",
      count: stats?.counts?.["gps-devices"] ?? 0
    },
    {
      key: "sim-cards",
      title: "SIM Cards",
      category: "Hardware & Connectivity",
      icon: Radio,
      path: "/app-config/sim-cards",
      color: "from-orange-600 to-amber-700",
      description: "M2M IoT SIM cards, carrier APNs, data plans, and phone numbers.",
      count: stats?.counts?.["sim-cards"] ?? 0
    },

    // Rules & Governance
    {
      key: "master-data",
      title: "Master Data",
      category: "Rules & Governance",
      icon: FileSpreadsheet,
      path: "/app-config/master-data",
      color: "from-purple-600 to-violet-600",
      description: "System lookups, sensor calibration multipliers, and category tables.",
      count: stats?.counts?.["master-data"] ?? 0
    },
    {
      key: "master-data-xls",
      title: "Bulk XLS Import",
      category: "Rules & Governance",
      icon: FileSpreadsheet,
      path: "/app-config/master-data-xls",
      color: "from-violet-600 to-purple-700",
      description: "Batch import vehicles, devices, and SIMs via standardized spreadsheets.",
      count: "XLSX"
    },
    {
      key: "company-rules",
      title: "Company Rules",
      category: "Rules & Governance",
      icon: ShieldAlert,
      path: "/app-config/company-rules",
      color: "from-rose-600 to-pink-600",
      description: "Speed governance caps, continuous driving limits, and night curfews.",
      count: stats?.counts?.["company-rules"] ?? 0
    },
    {
      key: "remove-entity",
      title: "Remove Entity",
      category: "Rules & Governance",
      icon: UserMinus,
      path: "/app-config/remove-entity",
      color: "from-slate-600 to-slate-800",
      description: "Controlled decommissioning tool with dependency check & audit trail.",
      count: stats?.counts?.["remove-entity"] ?? 0
    },
    {
      key: "sms-allocation",
      title: "SMS Allocation",
      category: "Rules & Governance",
      icon: MessageSquare,
      path: "/app-config/sms-allocation",
      color: "from-pink-600 to-rose-700",
      description: "DLT SMS gateway quota, message consumption, and alert thresholds.",
      count: stats?.counts?.["sms-allocation"] ?? 0
    }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="App Configuration Hub"
        description="Configure organization hierarchies, fleet telematics units, connectivity profiles, and governance rules."
        badge="ENTERPRISE FLEET SUITE"
      />

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="panel-card p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Companies
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {isLoading ? "—" : stats?.companies ?? 0}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#007AFF] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Active enterprise customer accounts
          </div>
        </div>

        <div className="panel-card p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Operating Branches
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {isLoading ? "—" : stats?.branches ?? 0}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
              <GitBranch className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-500 font-medium">
            <Activity className="w-3.5 h-3.5 mr-1 text-indigo-500" />
            Regional depots & dispatch yards
          </div>
        </div>

        <div className="panel-card p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Enrolled Fleet
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {isLoading ? "—" : stats?.vehicles ?? 0}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            Commercial assets tracked live
          </div>
        </div>

        <div className="panel-card p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Connected Hardware
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {isLoading ? "—" : stats?.devices ?? 0}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-amber-600 dark:text-amber-400 font-medium">
            <Activity className="w-3.5 h-3.5 mr-1" />
            GPS trackers & sensor bundles
          </div>
        </div>
      </div>

      {/* 3-Column / 4-Row Module Launchpad Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Configuration Modules</h2>
          <span className="text-xs text-slate-500">{cards.length} Core Modules Available</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.key}
                to={card.path}
                className="panel-card p-5 hover:border-[#007AFF]/50 hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-[#162244] text-slate-700 dark:text-slate-200 flex items-center justify-center group-hover:bg-[#007AFF] group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#007AFF] transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                          {card.category}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#162244] text-slate-600 dark:text-slate-300">
                      {card.count}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {card.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-[#1D293D] flex items-center justify-between text-xs font-semibold text-[#007AFF]">
                  <span>Configure Module</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AppConfigHubPage;
