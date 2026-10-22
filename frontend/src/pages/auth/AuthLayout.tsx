import React from "react";
import { AuthHero } from "./AuthHero";
import { InOrbitLogo } from "@/components/common/icons";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen w-full overflow-hidden bg-slate-50 dark:bg-[#070B14] text-slate-900 dark:text-slate-100 flex flex-col lg:grid lg:grid-cols-2">
      {/* Mobile / Tablet Top Brand Header (< lg) */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 dark:border-slate-800 dark:bg-[#0F172B] lg:hidden">
        <InOrbitLogo className="h-6 w-auto" />
        <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-[#95F8FF]">
          Fleet Operations
        </span>
      </div>

      {/* Left Column (Desktop Hero): >= lg */}
      <div className="hidden lg:block h-full overflow-hidden">
        <AuthHero />
      </div>

      {/* Right Column: Form Container */}
      <div className="relative flex flex-1 h-[calc(100dvh-3.5rem)] lg:h-full items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Isolated decorative background orbs wrapped in overflow-hidden to prevent scrollArea inflation */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-600/10" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-600/10" />
        </div>

        {/* Card Container centered vertically without redundant dead space */}
        <div className="relative z-10 w-full max-w-md my-auto py-2">
          {children}
        </div>
      </div>
    </div>
  );
};
