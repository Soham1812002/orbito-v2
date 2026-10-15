import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  ShieldCheck,
  Database,
  Layers,
  ArrowUpRight,
  Server,
  Zap,
  Lock,
  GitBranch
} from "lucide-react";
import { useAppSelector } from "../../redux/hooks";

export const DashboardPage: React.FC = () => {
  const { currentUser } = useAppSelector((state) => state.user);

  const stats = [
    {
      name: "Role & RBAC",
      value: currentUser?.roles?.[0] || "Super Admin",
      change: `${currentUser?.permissions?.length || 0} Permissions`,
      icon: ShieldCheck,
      color: "from-indigo-500 to-indigo-600"
    },
    {
      name: "ORM & Database",
      value: "PostgreSQL 16",
      change: "Sequelize 6 + Zero-Drift",
      icon: Database,
      color: "from-blue-500 to-cyan-600"
    },
    {
      name: "API Engine",
      value: "Express 5 (TS)",
      change: "Contract-Driven DTOs",
      icon: Server,
      color: "from-violet-500 to-purple-600"
    },
    {
      name: "Frontend Stack",
      value: "Vite + React",
      change: "TanStack Query + Redux",
      icon: Zap,
      color: "from-amber-500 to-orange-600"
    }
  ];

  const architectureHighlights = [
    {
      title: "Clean Layered Backend",
      desc: "Express 5 Router -> Middlewares (Auth, RBAC, DTO validation) -> Thin Controller -> Service -> Sequelize ORM with atomic transactions.",
      icon: Layers
    },
    {
      title: "Stateless Fine-Grained RBAC",
      desc: "Contract-driven permissions formatted as ACTION:ENTITY with an administrative OPERATE:ALL SuperAdmin bypass.",
      icon: Lock
    },
    {
      title: "Standard 8-File Feature Modules",
      desc: "Co-located frontend business domains isolating types, schemas, API calls, TanStack Query hooks, columns, forms, and views.",
      icon: GitBranch
    },
    {
      title: "Zero-Drift Migration Engine",
      desc: "Automated schema migrations tracked in sequelize_meta with pre-flight deployment synchronization guards.",
      icon: Database
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-8 text-white shadow-xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-200 border border-indigo-400/20">
            System Operational
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Welcome back, {currentUser?.firstName || currentUser?.email}!
          </h1>
          <p className="mt-2 text-sm text-indigo-100/80">
            Orbito v2 monorepo is fully scaffolded and operational following the enterprise architecture specification.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/users"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-900 hover:bg-slate-100 transition-colors shadow-sm"
            >
              <Users className="h-4 w-4 text-indigo-600" />
              <span>Explore User Directory</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {stat.name}
                </span>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr ${stat.color} text-white shadow-sm`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  {stat.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Architecture Highlights */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Architectural Blueprint Principles
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {architectureHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
