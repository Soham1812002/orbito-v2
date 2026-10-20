import React from "react";
import { SidebarBrand } from "./SidebarBrand";
import { SidebarNav } from "./SidebarNav";
import { SidebarFooter } from "./SidebarFooter";
import { useSidebar } from "../../../context/SidebarContext";

export const Sidebar: React.FC = () => {
  const { collapsed, toggleCollapse, mobileOpen, closeMobile } = useSidebar();

  const renderContent = (isMobile = false) => {
    const isCollapsed = isMobile ? false : collapsed;
    return (
      <div
        className={`flex h-full flex-col justify-between panel-sidebar select-none ${
          isCollapsed ? "overflow-visible" : "overflow-hidden"
        }`}
      >
        <div
          className={`flex flex-col flex-1 ${
            isCollapsed ? "overflow-visible" : "overflow-hidden"
          }`}
        >
          <SidebarBrand
            collapsed={isCollapsed}
            onCloseMobile={closeMobile}
            isMobile={isMobile}
          />
          <SidebarNav
            collapsed={isCollapsed}
            onItemClick={isMobile ? closeMobile : undefined}
          />
        </div>

        <SidebarFooter
          collapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
          isMobile={isMobile}
        />
      </div>
    );
  };

  return (
    <>
      {/* Desktop / Tablet Sidebar */}
      <aside
        className={`hidden md:block shrink-0 transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          collapsed ? "w-20" : "w-64"
        }`}
        aria-label="Sidebar navigation"
      >
        <div
          className={`fixed inset-y-0 left-0 z-30 h-full transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            collapsed ? "w-20 overflow-visible" : "w-64 overflow-hidden"
          }`}
        >
          {renderContent(false)}
        </div>
      </aside>

      {/* Mobile Off-Canvas Drawer (<768px) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={closeMobile}
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-left duration-300 ease-out">
            {renderContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
