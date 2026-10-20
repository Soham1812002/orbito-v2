import React, { useState, useMemo } from "react";
import { Outlet, NavLink, useLocation, Link } from "react-router-dom";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Menu,
  X
} from "lucide-react";
import { navigationSections } from "../../components/layout/Sidebar/navigation.config";
import { useSidebar } from "../../context/SidebarContext";

export const SystemConfigLayout: React.FC = () => {
  const location = useLocation();
  const { collapsed: mainSidebarCollapsed } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [subSidebarOpen, setSubSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Extract all system config sub-modules from navigation config
  const sysConfigItem = useMemo(() => {
    for (const section of navigationSections) {
      const found = section.items.find((item) => item.key === "sys-config");
      if (found) return found;
    }
    return null;
  }, []);

  const subItems = useMemo(() => {
    return sysConfigItem?.children || [];
  }, [sysConfigItem]);

  // Group sub-modules by their category
  const groupedModules = useMemo(() => {
    const groups: Record<string, typeof subItems> = {};

    const filtered = subItems.filter(
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
  }, [subItems, searchQuery]);

  const renderNavContent = () => (
    <div className="flex h-full flex-col select-none">
      {/* Sub-Sidebar Header */}
      <div className="p-4 border-b border-slate-200 dark:border-[#1D293D]">
        <div className="flex items-center justify-between mb-3">
          <Link
            to="/system-config"
            className="flex items-center gap-2.5 text-sm font-bold text-slate-900 dark:text-white hover:text-blue-500 transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <Sliders className="h-4 w-4" />
            </div>
            <span className="tracking-tight">System Config</span>
          </Link>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 font-semibold">
            {subItems.length}
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
            className="w-full rounded-xl bg-slate-100 dark:bg-[#162032] border border-slate-200 dark:border-[#1D293D] pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
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
            to="/system-config"
            end
            onClick={() => setMobileDrawerOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162032]"
              }`
            }
          >
            <div className="flex items-center gap-2">
              <Sliders className="h-3.5 w-3.5" />
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
                        ? "bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 font-semibold"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162032] hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {IconComponent && (
                        <IconComponent
                          className={`h-4 w-4 shrink-0 ${
                            isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-400"
                          }`}
                        />
                      )}
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "bg-slate-200 dark:bg-[#1D293D] text-slate-600 dark:text-slate-300"
                        }`}
                      >
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
    <div className="flex h-full w-full overflow-hidden bg-slate-50 dark:bg-[#070B14]">
      {/* Desktop Contextual Sub-Sidebar (240px Collapsible) */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 border-r border-slate-200 dark:border-[#1D293D] bg-white dark:bg-[#0D1527] transition-[width] duration-300 ease-in-out relative ${
          subSidebarOpen ? "w-60" : "w-0 border-r-0"
        }`}
        aria-label="System Config Navigation"
      >
        <div className="h-full w-60 overflow-hidden flex flex-col">
          {renderNavContent()}
        </div>

        {/* Desktop Drawer Collapse/Expand Toggle Pin */}
        <button
          onClick={() => setSubSidebarOpen(!subSidebarOpen)}
          className="absolute -right-3 top-20 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-[#0F172B] border border-slate-300 dark:border-[#1D293D] text-slate-500 hover:text-blue-500 shadow-md transition-colors"
          title={subSidebarOpen ? "Collapse Sub-Sidebar" : "Expand Sub-Sidebar"}
        >
          {subSidebarOpen ? (
            <ChevronLeft className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>
      </aside>

      {/* Expand trigger when sub-sidebar is collapsed */}
      {!subSidebarOpen && (
        <button
          onClick={() => setSubSidebarOpen(true)}
          className={`hidden lg:flex fixed ${
            mainSidebarCollapsed ? "left-[80px]" : "left-[256px]"
          } top-20 z-20 h-8 w-8 items-center justify-center rounded-r-xl bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-[left] duration-300 focus-ring`}
          title="Open System Config Sub-Sidebar"
          aria-label="Open System Config Sub-Sidebar"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}

      {/* Mobile Drawer Trigger (< 1024px) */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 focus-ring"
          aria-label="Open config modules menu"
        >
          <Sliders className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Drawer Sheet */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white dark:bg-[#0D1527] shadow-2xl animate-in slide-in-from-left duration-300">
            {renderNavContent()}
          </div>
        </div>
      )}

      {/* Main Canvas Viewport */}
      <div className="flex-1 overflow-y-auto h-full min-w-0 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default SystemConfigLayout;
