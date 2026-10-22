import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ArrowLeft,
  RotateCw,
  HelpCircle,
  Mail,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { AuthLayout } from "./AuthLayout";
import { LinkConfirmationState } from "@/types/auth.types";
import { showToast } from "@/lib/toast";

export const LinkConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LinkConfirmationState | undefined;

  const destination = state?.destination || "your registered account";
  const method = state?.method || "email";

  const [cooldown, setCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;

    setIsResending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setCooldown(60);
      showToast.success(`A new reset link has been dispatched to ${destination}!`);
    } catch {
      showToast.error("Failed to resend reset link. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout>
      <div className="panel-card p-5 sm:p-6 space-y-3.5 sm:space-y-4">
        {/* Top Success Badge & Header */}
        <div>
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 shadow-xs mb-2">
            <CheckCircle2 className="h-5 w-5" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-[#95F8FF]">
              Account Recovery
            </span>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Reset link sent
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Your secure password reset instructions are on their way.
            </p>
          </div>
        </div>

        {/* Destination Information Callout */}
        <div className="rounded-xl border border-blue-200/80 bg-blue-50/70 p-3 sm:p-3.5 dark:border-blue-900/50 dark:bg-blue-950/30">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white dark:bg-blue-500">
              {method === "email" ? (
                <Mail className="h-3.5 w-3.5" />
              ) : (
                <MessageSquare className="h-3.5 w-3.5" />
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">
                Check your {method === "email" ? "Email inbox" : "WhatsApp messages"}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-300">
                We sent a secure password reset link to:
              </p>
              <p className="mt-0.5 font-mono text-xs font-semibold text-blue-700 dark:text-[#95F8FF] break-all">
                {destination}
              </p>
            </div>
          </div>
        </div>

        {/* 2-Step Next Actions Timeline */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 sm:p-3.5 dark:border-slate-800 dark:bg-slate-900/40 space-y-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Next steps to regain access
          </p>

          <div className="flex items-start gap-2.5">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-[11px] font-bold text-blue-600 dark:text-[#95F8FF]">
              1
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Open the message and select the secure password reset link.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-[11px] font-bold text-blue-600 dark:text-[#95F8FF]">
              2
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Create a strong new password to regain full access to your fleet workspace.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-2 pt-1">
          {/* Back to Log In Button */}
          <Button
            type="button"
            onClick={() => navigate("/sign-in")}
            className="w-full py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to log in
          </Button>

          {/* Resend Link with Cooldown */}
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || isResending}
            className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <RotateCw
              className={`h-3.5 w-3.5 ${isResending ? "animate-spin text-blue-500" : ""}`}
            />
            {cooldown > 0 ? (
              <span>Resend reset link in ({cooldown}s)</span>
            ) : (
              <span>Resend reset link</span>
            )}
          </button>
        </div>

        {/* Footer Support */}
        <div className="border-t border-slate-200 pt-3 text-center dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Didn't receive it?</span>
            <span className="text-slate-600 dark:text-slate-300">
              Check spam folder or
            </span>
            <a
              href="mailto:support@inorbitfleet.com"
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              contact admin
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LinkConfirmationPage;
