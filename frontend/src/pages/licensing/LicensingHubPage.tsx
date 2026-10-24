import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  Car,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useLicensingStats } from "@/queries/licensing.queries";

export const LicensingHubPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading } = useLicensingStats();

  const cards = [
    {
      id: "company-license",
      title: "Company License",
      description: "Review and manage organization-level license entitlements across parent and subsidiary fleet companies.",
      path: "/licensing/companies",
      newPath: "/licensing/companies/new",
      icon: Building2,
      count: stats?.companyLicensesCount ?? 4,
      countLabel: "Company Licenses",
      gradient: "from-blue-600/10 via-blue-500/5 to-transparent",
      iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
      accentBorder: "hover:border-blue-500/50"
    },
    {
      id: "user-license",
      title: "User License",
      description: "Assign and monitor licensing access for individual users, operators, dispatchers, and fleet managers.",
      path: "/licensing/users",
      newPath: "/licensing/users/new",
      icon: Users,
      count: stats?.userLicensesCount ?? 4,
      countLabel: "User Licenses",
      gradient: "from-indigo-600/10 via-indigo-500/5 to-transparent",
      iconBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20",
      accentBorder: "hover:border-indigo-500/50"
    },
    {
      id: "vehicle-license",
      title: "Vehicle License",
      description: "Manage license allocation and hardware status across fleet vehicles, GPS telematics devices, and SIMs.",
      path: "/licensing/vehicles",
      newPath: "/licensing/vehicles/new",
      icon: Car,
      count: stats?.vehicleLicensesCount ?? 4,
      countLabel: "Vehicle Licenses",
      gradient: "from-emerald-600/10 via-emerald-500/5 to-transparent",
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
      accentBorder: "hover:border-emerald-500/50"
    },
    {
      id: "reseller-license",
      title: "Reseller License",
      description: "Assign and monitor licensing access for channel partners, distributor quotas, and regional client pools.",
      path: "/licensing/resellers",
      newPath: "/licensing/resellers/new",
      icon: Briefcase,
      count: stats?.resellerLicensesCount ?? 4,
      countLabel: "Reseller Licenses",
      gradient: "from-amber-600/10 via-amber-500/5 to-transparent",
      iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
      accentBorder: "hover:border-amber-500/50"
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Operations", href: "/operations" },
          { label: "Licensing Module" }
        ]}
        title="Licensing Module"
        badge="ENTITLEMENTS HUB"
        badgeVariant="cyan"
        description="Manage licensing entitlements across your organization, users, hardware units, and distributor fleet networks."
      />

      {/* Top Telematics KPI Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="panel-card flex items-center justify-between p-4">
          <div className="space-y-1">
            <p className="text-2xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Entitlements
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {isLoading ? "—" : stats?.activeTotal ?? 6}
            </p>
            <p className="text-2xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="h-3 w-3" /> Fully compliant & online
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>

        <div className="panel-card flex items-center justify-between p-4">
          <div className="space-y-1">
            <p className="text-2xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Expiring or Renewal Due
            </p>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {isLoading ? "—" : stats?.expiringTotal ?? 6}
            </p>
            <p className="text-2xs text-amber-600 flex items-center gap-1 font-medium">
              <AlertTriangle className="h-3 w-3" /> Requires renewal notice
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="panel-card flex items-center justify-between p-4">
          <div className="space-y-1">
            <p className="text-2xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Fleet Vehicle Quotas
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              750+
            </p>
            <p className="text-2xs text-blue-600 dark:text-blue-400 flex items-center gap-1 font-medium">
              <Sparkles className="h-3 w-3" /> Across nationwide corridors
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 border border-blue-500/20">
            <Car className="h-6 w-6" />
          </div>
        </div>

        <div className="panel-card flex items-center justify-between p-4">
          <div className="space-y-1">
            <p className="text-2xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Channel Partners
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {isLoading ? "—" : stats?.resellerLicensesCount ?? 4}
            </p>
            <p className="text-2xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1 font-medium">
              <Users className="h-3 w-3" /> Regional distribution tiers
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
            <Briefcase className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* 4 Entitlement Action Cards (Figma Frame 1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.id}
              className={`panel-card group relative overflow-hidden transition-all duration-200 border border-slate-200 dark:border-slate-800 ${c.accentBorder} hover:shadow-lg`}
            >
              <div className="flex flex-col h-full justify-between p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${c.iconBg}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-2xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
                      {c.count} {c.countLabel.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {c.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {c.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => navigate(c.path)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 focus-ring py-1 px-2 rounded-lg"
                  >
                    Open Directory
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(c.newPath)}
                    className="inline-flex items-center gap-1.5 text-2xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors focus-ring"
                  >
                    Add New
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LicensingHubPage;
