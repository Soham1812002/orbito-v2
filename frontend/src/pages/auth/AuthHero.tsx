import React from "react";
import { Navigation, ShieldCheck, Activity, CheckCircle2, Radio } from "lucide-react";
import { InOrbitLogo } from "@/components/common/icons";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="flex items-start gap-3.5 rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 sm:p-3.5 backdrop-blur-md transition-all duration-300 hover:border-blue-500/40 hover:bg-slate-900/80">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-[#95F8FF] shadow-inner">
        {icon}
      </div>
      <div>
        <h4 className="text-xs sm:text-sm font-semibold text-white tracking-tight">{title}</h4>
        <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export const AuthHero: React.FC = () => {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden bg-[#0F172B] p-6 lg:p-8 xl:p-10 text-white h-full border-r border-[#1D293D]">
      {/* Background ambient glowing orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-12 -right-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/3 h-64 w-64 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-2xl" />

      {/* Top Brand Logo */}
      <div className="relative z-10 shrink-0">
        <InOrbitLogo className="h-8 w-auto text-white" />
      </div>

      {/* Center Value Content */}
      <div className="relative z-10 my-auto py-3 max-w-xl space-y-4 xl:space-y-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-[#95F8FF]">
            <Radio className="h-3 w-3 animate-pulse text-[#95F8FF]" />
            <span>Fleet Command Center</span>
          </div>

          <h1 className="mt-2.5 text-2xl sm:text-3xl xl:text-4xl font-bold tracking-tight text-white leading-tight">
            Next-Gen Telematics & <br />
            <span className="bg-gradient-to-r from-blue-400 via-[#95F8FF] to-cyan-300 bg-clip-text text-transparent">
              Fleet Intelligence
            </span>
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
            Real-time tracking, multi-tier RBAC governance, and predictive diagnostics for modern enterprise fleets.
          </p>
        </div>

        {/* 3 Value Cards */}
        <div className="space-y-2.5">
          <FeatureCard
            icon={<Navigation className="h-4 w-4" />}
            title="Real-time GPS & Telematics"
            description="Sub-second tracking across 10,000+ active fleet assets with live sensor telemetry."
          />
          <FeatureCard
            icon={<ShieldCheck className="h-4 w-4" />}
            title="Multi-tier RBAC Governance"
            description="Fine-grained role permissions, organization groups, and audit-ready access logs."
          />
          <FeatureCard
            icon={<Activity className="h-4 w-4" />}
            title="Predictive Diagnostics & Alerts"
            description="Automated DTC fault code detection, service reminders, and instant security geofencing."
          />
        </div>
      </div>

      {/* Bottom Compliance & SLA Trust Footer */}
      <div className="relative z-10 shrink-0 border-t border-slate-800/80 pt-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>SOC2 Type II</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>ISO 27001</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>99.99% Telematics SLA</span>
          </div>
        </div>
      </div>
    </div>
  );
};
