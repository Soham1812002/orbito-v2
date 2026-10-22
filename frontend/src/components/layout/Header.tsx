import React, { useState, useRef, useEffect } from "react";
import { Menu, Sun, Moon, LogOut, Bell, Search, Shield, User as UserIcon } from "lucide-react";
import { AppIcon } from "@/components/common/icons/AppIcon";
import { useSidebar } from "@/context/SidebarContext";
import { useTheme } from "@/context/ThemeContext";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/userSlice";
import { GlobalSearchModal } from "./GlobalSearchModal";

export const Header: React.FC = () => {
  const { toggleMobile } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.user);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
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

  return (
    <>
      <header className="sticky top-0 z-20 flex h-14 sm:h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 sm:px-6 backdrop-blur-md dark:border-slate-800 dark:bg-[#0F172B]/80 transition-colors">
        {/* Left: Mobile Drawer Trigger & Search / Subtitle */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobile}
            className="md:hidden touch-target rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 focus-ring"
            aria-label="Toggle navigation menu"
          >
            <AppIcon icon={Menu} size="lg" />
          </button>

          {/* Global Search Bar Trigger (hidden on small mobile, visible on sm+) */}
          <button
            type="button"
            onClick={() => setSearchModalOpen(true)}
            className="hidden sm:flex items-center justify-between gap-2 rounded-xl bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800/60 dark:hover:bg-slate-800 px-3 py-1.5 border border-slate-200 dark:border-slate-700/60 w-64 md:w-80 cursor-pointer text-left transition-colors"
            aria-label="Search navigation items"
          >
            <div className="flex items-center gap-2 min-w-0">
              <AppIcon icon={Search} size="xs" className="text-slate-400 shrink-0" />
              <span className="text-xs text-slate-400 truncate">
                Search fleet, vehicles, users...
              </span>
            </div>
            <kbd className="hidden md:inline-block rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 shrink-0">
              ⌘K
            </kbd>
          </button>
        </div>

      {/* Right Utility Group */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Notification Bell with Unread Dot */}
        <button
          className="relative touch-target p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors focus-ring"
          aria-label="View notifications"
          title="Notifications"
        >
          <AppIcon icon={Bell} size="md" />
          <span
            className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[#EF4444] ring-2 ring-white dark:ring-[#0F172B]"
            aria-hidden="true"
          />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="touch-target p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors focus-ring"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <AppIcon
            icon={theme === "dark" ? Sun : Moon}
            size="md"
            className={theme === "dark" ? "text-amber-400" : "text-blue-600"}
          />
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-ring"
            aria-expanded={dropdownOpen}
            aria-label="User profile menu"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2563EB] text-white font-bold text-xs shadow-xs ring-1 ring-white dark:ring-slate-700">
              {userInitials}
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-[#0F172B] animate-in fade-in zoom-in-95 duration-100 z-50">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {displayName}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {currentUser?.email}
                </p>
                <div className="mt-1.5 flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase">
                  <AppIcon icon={Shield} size="xs" />
                  <span>{currentUser?.roles?.[0] || "User"}</span>
                </div>
              </div>

              <div className="mt-1 space-y-0.5">
                <a
                  href="/users"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/70 transition-colors focus-ring"
                >
                  <AppIcon icon={UserIcon} size="xs" />
                  <span>My Profile & Rights</span>
                </a>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors focus-ring"
                >
                  <AppIcon icon={LogOut} size="xs" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
    <GlobalSearchModal
      isOpen={searchModalOpen}
      onClose={() => setSearchModalOpen(false)}
    />
  </>
  );
};
