import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  FileSpreadsheet,
  PlusCircle,
  Receipt,
  ChevronRight,
  Search,
  Wrench,
  TrendingUp,
  Clock,
  AlertCircle
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

interface ModuleActionCard {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  badge?: string;
  badgeColor?: string;
}

export const MaintenanceHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const cards: ModuleActionCard[] = [
    {
      id: "reminder-status",
      title: "Reminder Status",
      description: "Review due, upcoming, and overdue service tasks",
      route: "/maintenance/reminders/status",
      icon: Bell,
      iconBg: "bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40",
      iconColor: "text-blue-600 dark:text-blue-400",
      badge: "24 Active",
      badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
    },
    {
      id: "expense-history",
      title: "Expense History",
      description: "Review recorded fuel, service, and repair expenses",
      route: "/maintenance/expenses/history",
      icon: FileSpreadsheet,
      iconBg: "bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900/40",
      iconColor: "text-sky-600 dark:text-sky-400",
      badge: "₹98.4K MTD",
      badgeColor: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400 border border-sky-200 dark:border-sky-800"
    },
    {
      id: "add-reminder",
      title: "Add Reminder",
      description: "Schedule a vehicle service or compliance reminder",
      route: "/maintenance/reminders/new",
      icon: CalendarDays,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/40",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      badge: "New Rule",
      badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
    },
    {
      id: "add-expense",
      title: "Add Expense",
      description: "Log fuel, maintenance, or other operating costs",
      route: "/maintenance/expenses/new",
      icon: PlusCircle,
      iconBg: "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
      iconColor: "text-slate-700 dark:text-slate-300",
      badge: "Record Entry",
      badgeColor: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
    }
  ];

  const filteredCards = cards.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* Header Context Bar */}
      <PageHeader
        breadcrumbs={[
          { label: "Administration", href: "/system-config" },
          { label: "Maintenance Module" }
        ]}
        title="Maintenance Module"
        description="Track maintenance schedules, reminders, and operational expense records."
        actions={
          <div className="flex items-center gap-3">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search configuration modules"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-ring"
              />
            </div>
            <button
              type="button"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="panel-card p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/40">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xs text-slate-500 dark:text-slate-400 font-medium">Configured Reminders</div>
            <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">24</div>
          </div>
        </div>

        <div className="panel-card p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 border border-red-100 dark:border-red-900/40">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xs text-slate-500 dark:text-slate-400 font-medium">Overdue Services</div>
            <div className="text-lg font-bold font-mono text-red-600 dark:text-red-400">2</div>
          </div>
        </div>

        <div className="panel-card p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/40">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xs text-slate-500 dark:text-slate-400 font-medium">Upcoming (14 Days)</div>
            <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">4</div>
          </div>
        </div>

        <div className="panel-card p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-900/40">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xs text-slate-500 dark:text-slate-400 font-medium">Total Monthly Expense</div>
            <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">₹98,430</div>
          </div>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => navigate(card.route)}
              className="panel-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-600 cursor-pointer transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                  {card.badge && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <span>Open module</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MaintenanceHubPage;
