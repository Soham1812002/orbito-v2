import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Orbit,
  X
} from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";
import { useAppSelector } from "../../redux/hooks";
import { hasPermission } from "../../utils/permissions";

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
  role?: string;
}

const navItems: NavItem[] = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Users", path: "/users", icon: Users, permission: "VIEW:USER" }
];

export const Sidebar: React.FC = () => {
  const { collapsed, toggleCollapse, mobileOpen, closeMobile } = useSidebar();
  const { currentUser } = useAppSelector((state) => state.user);

  const filteredNavItems = navItems.filter((item) => {
    return hasPermission(currentUser, item.permission, item.role);
  });

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300">
      <div>
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20">
              <Orbit className="h-6 w-6" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Orbito
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Enterprise
                </span>
              </div>
            )}
          </div>
          {/* Close for mobile */}
          <button
            onClick={closeMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5 p-3">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
                  } ${collapsed ? "justify-center px-0" : ""}`
                }
                title={collapsed ? item.name : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Badge / Footer Collapse Toggle */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        {!collapsed && currentUser && (
          <div className="mb-3 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase">
                {currentUser.firstName?.[0] || currentUser.email[0]}
              </div>
              <div className="truncate text-xs">
                <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {currentUser.firstName ? `${currentUser.firstName} ${currentUser.lastName || ""}` : currentUser.email}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="inline-block rounded bg-indigo-100 dark:bg-indigo-950/80 px-1.5 py-0.2 text-[10px] font-medium text-indigo-700 dark:text-indigo-300">
                    {currentUser.roles?.[0] || "USER"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={toggleCollapse}
          className="hidden md:flex w-full items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block shrink-0 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="fixed inset-y-0 left-0 z-30 h-full overflow-hidden transition-all duration-300">
          <div className={collapsed ? "w-20 h-full" : "w-64 h-full"}>
            {sidebarContent}
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={closeMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
