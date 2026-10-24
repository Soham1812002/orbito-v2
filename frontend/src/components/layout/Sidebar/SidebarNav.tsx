import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { navigationSections, NavItemConfig, NavSubItemConfig } from "./navigation.config";
import { AppIcon } from "@/components/common/icons/AppIcon";
import { useAppSelector } from "@/redux/hooks";
import { hasPermission } from "@/utils/permissions";

export interface SidebarNavProps {
  collapsed: boolean;
  onItemClick?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  collapsed,
  onItemClick
}) => {
  const location = useLocation();
  const { currentUser } = useAppSelector((state) => state.user);

  // Track accordion expand states in expanded sidebar
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (location.pathname.startsWith("/system-config")) initial["sys-config"] = true;
    else if (location.pathname.startsWith("/app-config")) initial["app-config"] = true;
    else if (location.pathname.startsWith("/reports")) initial["reports"] = true;
    else if (location.pathname.startsWith("/licensing")) initial["licensing"] = true;
    else if (location.pathname.startsWith("/maintenance")) initial["maintenance"] = true;
    else if (location.pathname.startsWith("/operations")) initial["dispatch-operations"] = true;
    else if (location.pathname.startsWith("/users")) initial["users"] = true;
    else if (location.pathname.startsWith("/poi")) initial["poi"] = true;
    else if (location.pathname.startsWith("/geofence")) initial["geofence"] = true;
    else if (location.pathname.startsWith("/alerts")) initial["alerts"] = true;
    return initial;
  });

  // Track active flyout in collapsed mini-mode
  const [activeFlyout, setActiveFlyout] = useState<string | null>(null);
  const [flyoutSearch, setFlyoutSearch] = useState("");
  const flyoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-expand menu when entering its child routes and maintain active parent section
  useEffect(() => {
    if (location.pathname.startsWith("/system-config")) {
      setOpenSubmenus((prev) => ({ ...prev, "sys-config": true }));
    } else if (location.pathname.startsWith("/app-config")) {
      setOpenSubmenus((prev) => ({ ...prev, "app-config": true }));
    } else if (location.pathname.startsWith("/reports")) {
      setOpenSubmenus((prev) => ({ ...prev, "reports": true }));
    } else if (location.pathname.startsWith("/licensing")) {
      setOpenSubmenus((prev) => ({ ...prev, "licensing": true }));
    } else if (location.pathname.startsWith("/maintenance")) {
      setOpenSubmenus((prev) => ({ ...prev, "maintenance": true }));
    } else if (location.pathname.startsWith("/operations")) {
      setOpenSubmenus((prev) => ({ ...prev, "dispatch-operations": true }));
    } else if (location.pathname.startsWith("/users")) {
      setOpenSubmenus((prev) => ({ ...prev, "users": true }));
    } else if (location.pathname.startsWith("/poi")) {
      setOpenSubmenus((prev) => ({ ...prev, "poi": true }));
    } else if (location.pathname.startsWith("/geofence")) {
      setOpenSubmenus((prev) => ({ ...prev, "geofence": true }));
    } else if (location.pathname.startsWith("/alerts")) {
      setOpenSubmenus((prev) => ({ ...prev, "alerts": true }));
    }
  }, [location.pathname]);

  // Dismiss collapsed flyout on Escape key press
  useEffect(() => {
    if (!activeFlyout) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveFlyout(null);
        setFlyoutSearch("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeFlyout]);

  const toggleSubmenu = (key: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filterItem = (item: NavItemConfig) => {
    return hasPermission(currentUser, item.permission, item.role);
  };

  const handleFlyoutEnter = (key: string) => {
    if (flyoutTimerRef.current) clearTimeout(flyoutTimerRef.current);
    setActiveFlyout(key);
  };

  const handleFlyoutLeave = () => {
    flyoutTimerRef.current = setTimeout(() => {
      setActiveFlyout(null);
      setFlyoutSearch("");
    }, 200);
  };

  return (
    <nav
      className={`flex-1 ${collapsed ? "overflow-visible" : "overflow-y-auto"} px-3 py-3 transition-all duration-300 ${
        collapsed ? "space-y-2.5" : "space-y-4"
      }`}
      aria-label="Main Navigation"
    >
      {navigationSections.map((section) => {
        const visibleItems = section.items.filter(filterItem);
        if (visibleItems.length === 0) return null;

        return (
          <div key={section.id} className="space-y-1">
            {section.title && (
              <div className="overflow-hidden transition-all duration-300 ease-in-out">
                {!collapsed ? (
                  <h3 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#7B7F8A]/80 mb-1.5 select-none truncate">
                    {section.title}
                  </h3>
                ) : (
                  <div
                    className="my-1.5 border-t border-slate-200 dark:border-[#1D293D]/80 w-8 mx-auto transition-opacity duration-300"
                    aria-hidden="true"
                  />
                )}
              </div>
            )}

            <div className="space-y-1">
              {visibleItems.map((item) => {
                const IconComponent = item.icon;
                const hasChildren = !!item.children && item.children.length > 0;
                const isSubmenuOpen = !!openSubmenus[item.key];
                const isChildActive = hasChildren && item.children?.some((c) => location.pathname === c.path);
                const isParentActive = hasChildren
                  ? location.pathname.startsWith(item.path) || !!isChildActive
                  : location.pathname === item.path;

                return (
                  <div
                    key={item.key}
                    className="relative group"
                    onMouseEnter={() => collapsed && hasChildren && handleFlyoutEnter(item.key)}
                    onMouseLeave={() => collapsed && hasChildren && handleFlyoutLeave()}
                  >
                    {hasChildren && !collapsed ? (
                      <div
                        className={`w-full justify-between px-3 gap-2 nav-item-base ${
                          isParentActive
                            ? "nav-item-active"
                            : "nav-item-idle"
                        } relative flex items-center group/parent`}
                      >
                        <NavLink
                          to={item.path}
                          onClick={() => {
                            setOpenSubmenus((prev) => ({ ...prev, [item.key]: true }));
                            if (onItemClick) onItemClick();
                          }}
                          className="flex items-center gap-3 overflow-hidden flex-1 min-w-0 py-1"
                        >
                          <div className="relative shrink-0 flex items-center justify-center">
                            <AppIcon icon={IconComponent} size="md" />
                          </div>
                          <span className="truncate whitespace-nowrap max-w-[140px]">
                            {item.name}
                          </span>
                        </NavLink>

                        <div className="flex items-center gap-1.5 ml-auto shrink-0">
                          {item.badge && (
                            <span className="badge-alert max-w-[40px]">
                              {item.badge}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleSubmenu(item.key, e);
                            }}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            aria-expanded={isSubmenuOpen}
                            aria-label={`Toggle ${item.name} submenu`}
                          >
                            <ChevronDown
                              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                                isSubmenuOpen ? "rotate-180 text-blue-600 dark:text-blue-400" : "rotate-0"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <NavLink
                        to={item.path}
                        onClick={onItemClick}
                        className={({ isActive }) =>
                          `${
                            collapsed
                              ? "w-11 h-11 mx-auto justify-center !px-0 !gap-0"
                              : "w-full justify-between px-3 gap-3"
                          } nav-item-base ${
                            (collapsed ? isParentActive : isActive)
                              ? "nav-item-active"
                              : "nav-item-idle"
                          } relative`
                        }
                      >
                        <div
                          className={`flex items-center ${
                            collapsed ? "justify-center !gap-0" : "gap-3"
                          } overflow-hidden`}
                        >
                          <div className="relative shrink-0 flex items-center justify-center">
                            <AppIcon icon={IconComponent} size="md" />
                            {collapsed && item.badge && (
                              <span
                                className="absolute -top-1 -right-1.5 h-2.5 w-2.5 rounded-full bg-[#EF4444] ring-2 ring-white dark:ring-[#0F172B] animate-pulse"
                                aria-hidden="true"
                              />
                            )}
                          </div>

                          {!collapsed && (
                            <span className="truncate whitespace-nowrap max-w-[140px] opacity-100 translate-x-0">
                              {item.name}
                            </span>
                          )}
                        </div>

                        {!collapsed && item.badge && (
                          <span className="badge-alert ml-auto">
                            {item.badge}
                          </span>
                        )}

                        {collapsed && (
                          <div
                            role="tooltip"
                            className="pointer-events-none absolute left-full ml-3 hidden md:group-hover:flex items-center gap-2 rounded-lg bg-slate-900 text-white dark:bg-[#0F172B] dark:border-[#1D293D] dark:text-white border border-slate-700/60 px-2.5 py-1 text-xs font-semibold shadow-xl whitespace-nowrap z-[60] animate-in fade-in zoom-in-95 duration-150"
                          >
                            <span>{item.name}</span>
                            {item.badge && (
                              <span className="badge-alert text-[9px] px-1.5 py-0.2">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}
                      </NavLink>
                    )}

                    {/* Level 1 Accordion in Expanded Sidebar */}
                    {!collapsed && hasChildren && isSubmenuOpen && (
                      <div className="mt-1 pl-4 pr-1 space-y-0.5 border-l-2 border-slate-200 dark:border-[#1D293D] ml-5 animate-in slide-in-from-top-2 fade-in duration-200">
                        {item.children?.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = location.pathname === subItem.path;

                          return (
                            <NavLink
                              key={subItem.key}
                              to={subItem.path}
                              onClick={onItemClick}
                              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                isSubActive
                                  ? "bg-blue-50 text-blue-600 border border-blue-200 font-semibold dark:bg-blue-600/20 dark:text-blue-400 dark:border-blue-500/30"
                                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-[#1D293D]/50"
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                {SubIcon && <SubIcon className="h-3.5 w-3.5 shrink-0 opacity-80" />}
                                <span className="truncate">{subItem.name}</span>
                              </div>
                              {subItem.badge && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 dark:bg-[#1D293D] dark:text-slate-300 font-mono">
                                  {subItem.badge}
                                </span>
                              )}
                            </NavLink>
                          );
                        })}
                      </div>
                    )}

                    {/* Collapsed Mode Cascading Flyout Menu */}
                    {collapsed && hasChildren && activeFlyout === item.key && (
                      <div
                        role="menu"
                        onMouseEnter={() => handleFlyoutEnter(item.key)}
                        onMouseLeave={handleFlyoutLeave}
                        className="fixed z-[60] left-[84px] top-16 w-80 max-h-[80vh] flex flex-col rounded-2xl bg-white dark:bg-[#0F172B] border border-slate-200 dark:border-[#1D293D] shadow-2xl shadow-slate-900/15 dark:shadow-black/60 p-3 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md select-none before:content-[''] before:absolute before:-left-3 before:top-0 before:w-3 before:h-full"
                      >
                        {/* Flyout Header */}
                        <div className="pb-2.5 mb-2 border-b border-slate-200 dark:border-[#1D293D]">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                              {item.name} Modules
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800/50">
                              {item.children?.length} modules
                            </span>
                          </div>
                          {/* Live Search inside Flyout */}
                          <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                            <input
                              type="text"
                              value={flyoutSearch}
                              onChange={(e) => setFlyoutSearch(e.target.value)}
                              placeholder="Search modules..."
                              className="w-full bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#1D293D] rounded-lg pl-8 pr-3 py-1 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                              autoFocus
                            />
                          </div>
                        </div>

                        {/* Scrollable Sub-modules List */}
                        <div className="overflow-y-auto space-y-1 max-h-[55vh] pr-1">
                          {item.children
                            ?.filter(
                              (sub) =>
                                sub.name.toLowerCase().includes(flyoutSearch.toLowerCase()) ||
                                sub.group.toLowerCase().includes(flyoutSearch.toLowerCase())
                            )
                            .map((subItem) => {
                              const SubIcon = subItem.icon;
                              const isSubActive = location.pathname === subItem.path;

                              return (
                                <NavLink
                                  key={subItem.key}
                                  to={subItem.path}
                                  onClick={() => {
                                    setActiveFlyout(null);
                                    onItemClick?.();
                                  }}
                                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                                    isSubActive
                                      ? "bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/30"
                                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1D293D] hover:text-slate-900 dark:hover:text-white"
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 truncate">
                                    {SubIcon && <SubIcon className="h-4 w-4 shrink-0 text-slate-400" />}
                                    <span className="truncate">{subItem.name}</span>
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {subItem.group.split("&")[0].trim()}
                                  </span>
                                </NavLink>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
};
