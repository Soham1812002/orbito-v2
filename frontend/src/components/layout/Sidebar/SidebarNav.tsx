import React from "react";
import { NavLink } from "react-router-dom";
import { navigationSections, NavItemConfig } from "./navigation.config";
import { AppIcon } from "../../common/icons/AppIcon";
import { useAppSelector } from "../../../redux/hooks";
import { hasPermission } from "../../../utils/permissions";

export interface SidebarNavProps {
  collapsed: boolean;
  onItemClick?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  collapsed,
  onItemClick
}) => {
  const { currentUser } = useAppSelector((state) => state.user);

  const filterItem = (item: NavItemConfig) => {
    return hasPermission(currentUser, item.permission, item.role);
  };

  return (
    <nav
      className={`flex-1 overflow-y-auto px-3 py-3 transition-all duration-300 ${
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
                  <h3 className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#7B7F8A]/80 mb-1.5 select-none truncate">
                    {section.title}
                  </h3>
                ) : (
                  <div
                    className="my-1.5 border-t border-[#1D293D]/80 w-8 mx-auto transition-opacity duration-300"
                    aria-hidden="true"
                  />
                )}
              </div>
            )}

            <div className="space-y-1">
              {visibleItems.map((item) => {
                const IconComponent = item.icon;

                return (
                  <NavLink
                    key={item.key}
                    to={item.path}
                    onClick={onItemClick}
                    className={({ isActive }) =>
                      `transition-all duration-300 ease-in-out ${
                        collapsed
                          ? "w-11 h-11 mx-auto justify-center !px-0 !gap-0"
                          : "w-full justify-between px-3 gap-3"
                      } nav-item-base ${
                        isActive ? "nav-item-active" : "nav-item-idle"
                      } relative group`
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
                            className="absolute -top-1 -right-1.5 h-2.5 w-2.5 rounded-full bg-[#EF4444] ring-2 ring-[#0F172B] animate-pulse"
                            aria-hidden="true"
                          />
                        )}
                      </div>

                      {!collapsed && (
                        <span className="truncate whitespace-nowrap transition-all duration-300 ease-in-out max-w-[160px] opacity-100 translate-x-0">
                          {item.name}
                        </span>
                      )}
                    </div>

                    {!collapsed && item.badge && (
                      <span className="badge-alert ml-auto transition-all duration-300 ease-in-out max-w-[40px] opacity-100 scale-100">
                        {item.badge}
                      </span>
                    )}

                    {/* Accessible Floating Tooltip in Collapsed State */}
                    {collapsed && (
                      <div
                        role="tooltip"
                        className="pointer-events-none absolute left-full ml-3 hidden md:group-hover:flex items-center gap-2 rounded-lg bg-[#0F172B] border border-[#1D293D] px-2.5 py-1 text-xs font-semibold text-white shadow-xl whitespace-nowrap z-50 animate-in fade-in zoom-in-95 duration-150"
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
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
};
