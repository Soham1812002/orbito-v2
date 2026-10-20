import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Building2,
  Radio,
  Cpu,
  Truck,
  BellRing,
  ArrowRight,
  Sparkles,
  ClipboardList,
  Layers,
  Banknote,
  ShieldCheck,
  UserCheck,
  Car,
  Cog,
  MapPin,
  Grid,
  SlidersHorizontal,
  TrendingUp,
  RefreshCw,
  Loader2
} from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/common/Button";
import { systemConfigApi } from "./systemConfig.api";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext: string;
  activeLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  activeLabel,
  icon: Icon
}) => (
  <div className="panel-card p-5 relative overflow-hidden group hover:border-blue-500/40 transition-all">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</h3>
        </div>
      </div>
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
        <TrendingUp className="h-3 w-3" />
        Live DB
      </span>
    </div>

    <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-[#1D293D]">
      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
        ● {activeLabel}
      </span>
      <span className="text-slate-400 dark:text-slate-500 text-[11px] font-mono">
        {subtext}
      </span>
    </div>
  </div>
);

export const SystemConfigHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const { data: stats, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["system-configs-stats"],
    queryFn: ({ signal }) => systemConfigApi.getStats(signal),
    staleTime: 30000
  });

  const categories = [
    "All",
    "Identity & Access",
    "Reseller & Billing",
    "Connectivity & SIM",
    "Hardware & Devices",
    "Vehicle Assets",
    "Operations & Governance"
  ];

  const counts = stats?.counts || {};

  const modulesList = [
    // 1. Identity & Access
    {
      key: "users",
      title: "User Overview",
      description: "Review users, roles, password policies, and security PIN status.",
      path: "/system-config/users",
      icon: Users,
      badgeLabel: `${stats?.users?.total ?? 0} Users`,
      category: "Identity & Access"
    },
    {
      key: "user-groups",
      title: "User Groups",
      description: "Manage organizational structures, project scope, and user assignments.",
      path: "/system-config/user-groups",
      icon: Users,
      badgeLabel: `${counts["user-groups"] ?? 0} Groups`,
      category: "Identity & Access"
    },
    {
      key: "roles",
      title: "Role Management",
      description: "Configure system roles, privileges, and action authorization.",
      path: "/system-config/roles",
      icon: ShieldCheck,
      badgeLabel: `${counts["roles"] ?? 0} Roles`,
      category: "Identity & Access"
    },
    {
      key: "user-profiles",
      title: "User Profiles",
      description: "Manage module-level granular CRUD permissions per user role.",
      path: "/system-config/user-profiles",
      icon: UserCheck,
      badgeLabel: `${counts["user-profiles"] ?? 0} Profiles`,
      category: "Identity & Access"
    },
    // 2. Reseller & Billing
    {
      key: "resellers",
      title: "Reseller Overview",
      description: "Manage reseller entities, contracts, token validity, and allocated fleets.",
      path: "/system-config/resellers",
      icon: Building2,
      badgeLabel: `${counts["resellers"] ?? 0} Resellers`,
      category: "Reseller & Billing"
    },
    {
      key: "reseller-features",
      title: "Reseller Features",
      description: "Assign platform plan capabilities and screen-level access quotas.",
      path: "/system-config/reseller-features",
      icon: Layers,
      badgeLabel: `${counts["reseller-features"] ?? 0} Allocations`,
      category: "Reseller & Billing"
    },
    // 3. Connectivity & SIM
    {
      key: "sim-providers",
      title: "SIM Providers",
      description: "Configure mobile network telecom providers and care hotlines by circle.",
      path: "/system-config/sim-providers",
      icon: Radio,
      badgeLabel: `${counts["sim-providers"] ?? 0} Providers`,
      category: "Connectivity & SIM"
    },
    {
      key: "tariff-plans",
      title: "Tariff Plans",
      description: "Manage SIM data rates, billing allowances, and validity periods.",
      path: "/system-config/tariff-plans",
      icon: Banknote,
      badgeLabel: `${counts["tariff-plans"] ?? 0} Plans`,
      category: "Connectivity & SIM"
    },
    // 4. Hardware & Devices
    {
      key: "device-models",
      title: "Device Models",
      description: "Manage GPS telematics tracker hardware, TCP ports, and protocol configs.",
      path: "/system-config/device-models",
      icon: Cpu,
      badgeLabel: `${counts["device-models"] ?? 0} Models`,
      category: "Hardware & Devices"
    },
    {
      key: "device-features",
      title: "Device Features",
      description: "Define immobilizers, fuel probes, SOS, RFID, and temperature sensors.",
      path: "/system-config/device-features",
      icon: Sparkles,
      badgeLabel: `${counts["device-features"] ?? 0} Features`,
      category: "Hardware & Devices"
    },
    // 5. Vehicle Assets
    {
      key: "vehicle-types",
      title: "Vehicle Types",
      description: "Classify fleet vehicles by category, tonnage, and wheel configuration.",
      path: "/system-config/vehicle-types",
      icon: Truck,
      badgeLabel: `${counts["vehicle-types"] ?? 0} Types`,
      category: "Vehicle Assets"
    },
    {
      key: "vehicle-models",
      title: "Vehicle Models",
      description: "Maintain manufacturer brands, models, fuel specifications, and icons.",
      path: "/system-config/vehicle-models",
      icon: Car,
      badgeLabel: `${counts["vehicle-models"] ?? 0} Models`,
      category: "Vehicle Assets"
    },
    {
      key: "vehicle-features",
      title: "Vehicle Features",
      description: "Configure optional vehicle attributes (refrigeration, tail-lift, PTO).",
      path: "/system-config/vehicle-features",
      icon: Cog,
      badgeLabel: `${counts["vehicle-features"] ?? 0} Features`,
      category: "Vehicle Assets"
    },
    // 6. Operations & Governance
    {
      key: "alert-types",
      title: "Alert Types",
      description: "Define alert events, severity tiers, notification sounds, and broadcast rules.",
      path: "/system-config/alert-types",
      icon: BellRing,
      badgeLabel: `${counts["alert-types"] ?? 0} Alert Types`,
      category: "Operations & Governance"
    },
    {
      key: "poi-types",
      title: "POI Types",
      description: "Classify points of interest (depots, warehouses, ports, customer hubs).",
      path: "/system-config/poi-types",
      icon: MapPin,
      badgeLabel: `${counts["poi-types"] ?? 0} POI Types`,
      category: "Operations & Governance"
    },
    {
      key: "modules",
      title: "System Modules",
      description: "Manage application navigation hierarchy, route paths, and permissions.",
      path: "/system-config/modules",
      icon: Grid,
      badgeLabel: `${counts["modules"] ?? 0} Modules`,
      category: "Operations & Governance"
    },
    {
      key: "report-customization",
      title: "Report Customization",
      description: "Customize report schemas, column projections, and metrics by company.",
      path: "/system-config/report-customization",
      icon: SlidersHorizontal,
      badgeLabel: `${counts["report-customization"] ?? 0} Schemas`,
      category: "Operations & Governance"
    },
    {
      key: "audit-log",
      title: "Audit Log",
      description: "Inspect detailed user action logs, security events, and configuration changes.",
      path: "/system-config/audit-log",
      icon: ClipboardList,
      badgeLabel: `${stats?.auditLogs?.total ?? 0} Events`,
      category: "Operations & Governance"
    }
  ];

  const filteredModules = modulesList.filter(
    (m) => activeCategory === "All" || m.category === activeCategory
  );

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "System Config" }
        ]}
        title="Platform Configuration Hub"
        badge="PostgreSQL Live Engine"
        badgeVariant="cyan"
        description="Monitor system configuration modules, user governance, fleet entity records, and security audit logs."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              leftIcon={<RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />}
              onClick={() => refetch()}
              disabled={isFetching}
            >
              Refresh
            </Button>
            <Button
              variant="secondary"
              leftIcon={<ClipboardList className="h-4 w-4" />}
              onClick={() => navigate("/system-config/audit-log")}
            >
              Audit Log
            </Button>
          </div>
        }
      />

      {/* 4 Live KPI Metric Cards from PostgreSQL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Resellers"
          value={counts["resellers"] ?? (isLoading ? "..." : 0)}
          subtext="Partitioned by module_key"
          activeLabel="Operational in DB"
          icon={Building2}
        />
        <MetricCard
          title="Total User Accounts"
          value={stats?.users?.total ?? (isLoading ? "..." : 0)}
          subtext={`${stats?.users?.inactive ?? 0} inactive`}
          activeLabel={`${stats?.users?.active ?? 0} Active Users`}
          icon={Users}
        />
        <MetricCard
          title="Audit Trail Events"
          value={stats?.auditLogs?.total ?? (isLoading ? "..." : 0)}
          subtext="Append-only log"
          activeLabel="Zero-drift tracked"
          icon={ClipboardList}
        />
        <MetricCard
          title="Config Entities Stored"
          value={stats?.totalConfigs ?? (isLoading ? "..." : 0)}
          subtext="15 Active Modules"
          activeLabel="JSONB Schema Persisted"
          icon={Sparkles}
        />
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white">
              Configuration Modules & Database Repositories
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select a module to view, create, edit, or delete database-persisted entities.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-[#162032] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModules.map((module) => {
            const Icon = module.icon;

            return (
              <Link
                key={module.path}
                to={module.path}
                className="panel-card p-5 group hover:border-blue-500/50 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#1D293D] text-slate-600 dark:text-slate-300 font-semibold">
                      {module.badgeLabel}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                    {module.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {module.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-[#1D293D]/60 text-xs text-blue-600 dark:text-blue-400 font-semibold">
                  <span className="text-[10px] text-slate-400 font-normal">
                    {module.category}
                  </span>
                  <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Manage</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SystemConfigHubPage;
