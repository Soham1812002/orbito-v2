import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sun, Moon, LogOut, ChevronDown } from "lucide-react";
import { AppIcon } from "../../common/icons/AppIcon";
import { AuditLogIcon } from "../../common/icons/AuditLogIcon";
import { SupportIcon } from "../../common/icons/SupportIcon";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useTheme } from "../../../context/ThemeContext";
import { logout } from "../../../redux/userSlice";

export interface SidebarFooterProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobile?: boolean;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  collapsed,
  onToggleCollapse,
  isMobile = false
}) => {
  const dispatch = useAppDispatch();
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useAppSelector((state) => state.user);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/sign-in";
  };

  const displayName = currentUser?.firstName
    ? `${currentUser.firstName} ${currentUser.lastName || ""}`.trim()
    : currentUser?.email || "User";

  const userInitials = (
    currentUser?.firstName?.[0] ||
    currentUser?.email?.[0] ||
    "U"
  ).toUpperCase();

  const userRole = currentUser?.roles?.[0] || "Fleet Manager";

  return (
    <div
      className={`border-t border-slate-200 dark:border-[#1D293D] bg-slate-50/70 dark:bg-[#0F172B] transition-all duration-300 ${
        collapsed ? "overflow-visible p-2.5 space-y-2" : "overflow-hidden p-3 space-y-3"
      }`}
    >
      {/* 3-Column Utility Grid (Figma #1159:1260) */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          collapsed
            ? "max-h-0 opacity-0 -translate-y-2 pointer-events-none mb-0"
            : "max-h-12 opacity-100 translate-y-0"
        }`}
      >
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 dark:bg-[#1D293D]/40 p-1 border border-slate-200 dark:border-[#1D293D]/60">
          <button
            onClick={() => window.open("https://docs.orbito.com", "_blank")}
            className="flex h-8 items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-[#1D293D] transition-colors focus-ring"
            title="Help & Documentation"
            aria-label="Help & Documentation"
          >
            <AppIcon icon={SupportIcon} size="sm" />
          </button>

          <a
            href="/system-config"
            className="flex h-8 items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-[#1D293D] transition-colors focus-ring"
            title="System Config / Audit Log"
            aria-label="System Config"
          >
            <AppIcon icon={AuditLogIcon} size="sm" />
          </a>

          <button
            onClick={toggleTheme}
            className="flex h-8 items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-[#1D293D] transition-colors focus-ring"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            aria-label="Toggle Theme"
          >
            <AppIcon icon={theme === "dark" ? Sun : Moon} size="sm" />
          </button>
        </div>
      </div>

      {/* User Profile Card (Figma #1159:1325) */}
      <div className="relative group" ref={menuRef}>
        <div
          onClick={() => setMenuOpen(!menuOpen)}
          className={`flex items-center cursor-pointer transition-all duration-300 ease-in-out border border-slate-200 dark:border-[#1D293D]/80 bg-white dark:bg-[#1D293D]/30 hover:bg-slate-100 dark:hover:bg-[#1D293D]/60 rounded-xl ${
            collapsed
              ? "w-11 h-11 mx-auto justify-center !p-0"
              : "w-full justify-between p-2"
          }`}
          role="button"
          tabIndex={0}
          aria-expanded={menuOpen}
          aria-label="User account menu"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setMenuOpen(!menuOpen);
            }
          }}
        >
          <div
            className={`flex items-center ${
              collapsed ? "justify-center !gap-0" : "gap-2.5"
            } overflow-hidden`}
          >
            {/* Initials Avatar */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-white font-bold text-xs shadow-sm ring-1 ring-slate-200 dark:ring-[#314158]">
              {userInitials}
            </div>

            {!collapsed && (
              <div className="truncate text-left transition-all duration-300 ease-in-out overflow-hidden max-w-[150px] opacity-100 translate-x-0">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate leading-tight">
                  {displayName}
                </p>
                <p className="text-[10px] font-medium text-slate-500 dark:text-[#62748E] truncate leading-tight mt-0.5">
                  {userRole}
                </p>
              </div>
            )}
          </div>

          {!collapsed && (
            <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 transition-all duration-300 opacity-100" />
          )}
        </div>

        {/* Accessible Floating Tooltip in Collapsed State */}
        {collapsed && (
          <div
            role="tooltip"
            className="pointer-events-none absolute left-full ml-3 hidden md:group-hover:flex items-center rounded-lg bg-slate-900 text-white dark:bg-[#0F172B] dark:border-[#1D293D] dark:text-white border border-slate-700/60 px-2.5 py-1 text-xs font-semibold shadow-xl whitespace-nowrap z-[60] animate-in fade-in zoom-in-95 duration-150"
          >
            <span>{displayName}</span>
          </div>
        )}

        {/* User Popover Menu */}
        {menuOpen && (
          <div
            className={`absolute z-[60] mb-2 w-56 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F172B] p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150 ${
              collapsed ? "bottom-0 left-full ml-3" : "bottom-full left-0 mb-2"
            }`}
          >
            <div className="px-3 py-2 border-b border-slate-200 dark:border-[#1D293D]">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{displayName}</p>
              <p className="text-[11px] text-slate-500 dark:text-[#7B7F8A] truncate">{currentUser?.email}</p>
              <span className="inline-block mt-1 rounded bg-blue-50 text-blue-600 border border-blue-200 dark:border-transparent dark:bg-blue-900/60 dark:text-blue-300 px-1.5 py-0.5 text-[10px] font-medium uppercase">
                {userRole}
              </span>
            </div>

            <div className="mt-1">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-300 transition-colors focus-ring"
              >
                <AppIcon icon={LogOut} size="sm" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop/Tablet Collapse Toggle Button */}
      {!isMobile && (
        <button
          onClick={onToggleCollapse}
          className={`hidden md:flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#1D293D] dark:hover:text-white transition-colors focus-ring ${
            collapsed ? "w-11 h-11 mx-auto p-0" : "w-full p-2"
          }`}
          title={collapsed ? "Expand Sidebar (256px)" : "Collapse Sidebar (80px)"}
          aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-[#7B7F8A] dark:hover:text-white w-full overflow-hidden">
            <ChevronLeft
              className={`h-4 w-4 transition-transform duration-300 ease-in-out shrink-0 ${
                collapsed ? "rotate-180" : "rotate-0"
              }`}
            />
            {!collapsed && (
              <span className="overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out max-w-[120px] opacity-100 translate-x-0">
                Collapse Sidebar
              </span>
            )}
          </div>
        </button>
      )}
    </div>
  );
};
