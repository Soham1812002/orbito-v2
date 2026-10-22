import React, { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { PageLoadingFallback } from "@/components/feedback/PageLoadingFallback";

export const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-[#070B14] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Skip-to-content accessibility link (WCAG 2.1 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-xl focus:bg-[#2563EB] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Sidebar (Desktop, Tablet mini mode, Mobile drawer) */}
      <Sidebar />

      {/* Main viewport area */}
      <div className="flex flex-1 flex-col h-full overflow-hidden min-w-0">
        <Header />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto layout-container"
        >
          <Suspense fallback={<PageLoadingFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

