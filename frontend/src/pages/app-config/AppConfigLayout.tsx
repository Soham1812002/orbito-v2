import React, { useState, useMemo } from "react";
import { Outlet, NavLink, useLocation, Link } from "react-router-dom";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Settings,
  Menu,
  X,
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
  Layers
} from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";

interface AppConfigSubModule {
  key: string;
  name: string;
  path: string;
  group: "Organization Hierarchy" | "Fleet Assets" | "Hardware & Connectivity" | "Rules & Governance";
  icon: React.ElementType;
  badge?: string;
}

const APP_CONFIG_MODULES: AppConfigSubModule[] = [
  // 1. Organization Hierarchy
  {
    key: "companies",
    name: "Companies",
    path: "/app-config/companies",
    group: "Organization Hierarchy",
    icon: Building2
  },
  {
    key: "branches",
    name: "Branches",
    path: "/app-config/branches",
    group: "Organization Hierarchy",
    icon: GitBranch
  },
  {
    key: "employees",
    name: "Employees",
    path: "/app-config/employees",
    group: "Organization Hierarchy",
    icon: Users
  },

  // 2. Fleet Assets
  {
    key: "vehicles",
    name: "Added Vehicles",
    path: "/app-config/vehicles",
    group: "Fleet Assets",
    icon: Truck
  },
  {
    key: "added-devices",
    name: "Added Devices",
    path: "/app-config/added-devices",
    group: "Fleet Assets",
    icon: Layers
  },

  // 3. Hardware & Connectivity
  {
    key: "gps-devices",
    name: "GPS Devices",
    path: "/app-config/gps-devices",
    group: "Hardware & Connectivity",
    icon: Cpu
  },
  {
    key: "sim-cards",
    name: "SIM Cards",
    path: "/app-config/sim-cards",
    group: "Hardware & Connectivity",
    icon: Radio
  },

  // 4. Rules & Governance
  {
    key: "master-data",
    name: "Master Data",
    path: "/app-config/master-data",
    group: "Rules & Governance",
    icon: FileSpreadsheet
  },
  {
    key: "master-data-xls",
    name: "Master Data (XLS)",
    path: "/app-config/master-data-xls",
    group: "Rules & Governance",
    icon: FileSpreadsheet,
    badge: "BULK"
  },
  {
    key: "company-rules",
    name: "Company Rules",
    path: "/app-config/company-rules",
    group: "Rules & Governance",
    icon: ShieldAlert
  },
  {
    key: "remove-entity",
    name: "Remove Entity",
    path: "/app-config/remove-entity",
    group: "Rules & Governance",
    icon: UserMinus
  },
  {
    key: "sms-allocation",
    name: "SMS Allocation",
    path: "/app-config/sms-allocation",
    group: "Rules & Governance",
    icon: MessageSquare
  }
];

export const AppConfigLayout: React.FC = () => {
  const location = useLocation();
  const { collapsed: mainSidebarCollapsed } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [subSidebarOpen, setSubSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Group sub-modules by category
  const groupedModules = useMemo(() => {
    const groups: Record<string, AppConfigSubModule[]> = {};

    const filtered = APP_CONFIG_MODULES.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.group.toLowerCase().includes(searchQuery.toLowerCase())
    );

    for (const item of filtered) {
      if (!groups[item.group]) {
        groups[item.group] = [];
      }
      groups[item.group].push(item);
    }

    return groups;
  }, [searchQuery]);

  const renderNavContent = () => (
    <div className="flex h-full flex-col select-none">
      {/* Sub-Sidebar Header */}
      <div className="p-4 border-b border-slate-200 dark:border-[#1D293D]">
        <div className="flex items-center justify-between mb-3">
          <Link
            to="/app-config"
            className="flex items-center gap-2.5 text-sm font-bold text-slate-900 dark:text-white hover:text-[#007AFF] transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#007AFF] text-white shadow-xs">
              <Settings className="h-4 w-4" />
            </div>
            <span className="tracking-tight">App Config</span>
          </Link>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 font-semibold">
            {APP_CONFIG_MODULES.length}
          </span>
        </div>

        {/* Real-time Sub-Module Search Filter */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search modules..."
            className="w-full rounded-xl bg-slate-100 dark:bg-[#162032] border border-slate-200 dark:border-[#1D293D] pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#007AFF] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Grouped Category Navigation List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Hub Overview Link */}
        <div>
          <NavLink
            to="/app-config"
            end
            onClick={() => setMobileDrawerOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#007AFF] text-white shadow-xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162032]"
              }`
            }
          >
            <div className="flex items-center gap-2">
              <Settings className="h-3.5 w-3.5" />
              <span>Platform Hub</span>
            </div>
            <span className="text-[10px] uppercase font-bold opacity-75">Overview</span>
          </NavLink>
        </div>

        {/* Categorized Modules */}
        {Object.entries(groupedModules).map(([category, items]) => (
          <div key={category} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#7B7F8A]">
              {category}
            </div>

            <div className="space-y-0.5">
              {items.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.key}
                    to={item.path}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-600/20 text-[#007AFF] dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 font-semibold"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162032] hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <IconComponent
                        className={`h-4 w-4 shrink-0 ${
                          isActive ? "text-[#007AFF] dark:text-blue-400" : "text-slate-400"
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-full min-h-[calc(100vh-4rem)] relative">
      {/* Mobile drawer toggle button */}
      <div className="md:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#007AFF] text-white shadow-lg hover:bg-blue-600 focus-ring"
        >
          {mobileDrawerOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* Mobile Slide-out Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#111C38] border-r border-slate-200 dark:border-[#1D293D] shadow-2xl transition-transform duration-300 md:hidden ${
          mobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {renderNavContent()}
      </div>

      {/* Desktop Sub-Sidebar */}
      <aside
        className={`hidden md:block transition-all duration-300 shrink-0 border-r border-slate-200 dark:border-[#1D293D] bg-white dark:bg-[#111C38] relative z-20 ${
          subSidebarOpen ? "w-64" : "w-0"
        }`}
      >
        <div className={`w-64 h-full ${!subSidebarOpen ? "hidden" : "block"}`}>
          {renderNavContent()}
        </div>

        {/* Collapse Toggle Handle */}
        <button
          onClick={() => setSubSidebarOpen(!subSidebarOpen)}
          className="absolute -right-3 top-6 z-30 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 dark:border-[#1D293D] bg-white dark:bg-[#111C38] text-slate-500 hover:text-slate-900 dark:hover:text-white shadow-xs transition-colors"
          title={subSidebarOpen ? "Collapse Sub-Menu" : "Expand Sub-Menu"}
        >
          {subSidebarOpen ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-[#0b1329] min-w-0">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppConfigLayout;
