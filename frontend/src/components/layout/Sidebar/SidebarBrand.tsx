import React from "react";
import { X } from "lucide-react";
import { InOrbitLogo } from "@/components/common/icons/InOrbitLogo";
import { InOrbitMark } from "@/components/common/icons/InOrbitMark";
import { AppIcon } from "@/components/common/icons/AppIcon";

export interface SidebarBrandProps {
  collapsed: boolean;
  onCloseMobile?: () => void;
  isMobile?: boolean;
}

export const SidebarBrand: React.FC<SidebarBrandProps> = ({
  collapsed,
  onCloseMobile,
  isMobile = false
}) => {
  return (
    <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200 dark:border-[#1D293D] overflow-hidden">
      <div className="relative flex items-center h-full w-full">
        {/* Full Logo when expanded */}
        <div
          className={`flex items-center transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
            collapsed && !isMobile
              ? "max-w-0 opacity-0 -translate-x-3 pointer-events-none"
              : "max-w-[200px] opacity-100 translate-x-0"
          }`}
        >
          <InOrbitLogo collapsed={false} />
        </div>

        {/* Compact Mark when collapsed */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${
            collapsed && !isMobile
              ? "opacity-100 scale-100"
              : "opacity-0 scale-75 pointer-events-none"
          }`}
        >
          <InOrbitMark size={36} />
        </div>
      </div>

      {isMobile && onCloseMobile && (
        <button
          onClick={onCloseMobile}
          className="touch-target p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-[#1D293D] focus-ring"
          aria-label="Close navigation menu"
        >
          <AppIcon icon={X} size="lg" />
        </button>
      )}
    </div>
  );
};
