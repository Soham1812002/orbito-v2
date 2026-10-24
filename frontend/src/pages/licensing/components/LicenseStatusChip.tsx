import React from "react";
import { CheckCircle2, Clock, AlertTriangle, XCircle } from "lucide-react";
import { LicenseStatusType } from "@/types/licensing.types";

interface LicenseStatusChipProps {
  status: LicenseStatusType | string;
  label?: string;
  className?: string;
}

export const LicenseStatusChip: React.FC<LicenseStatusChipProps> = ({
  status,
  label,
  className = ""
}) => {
  const normStatus = (status || "").toUpperCase();
  const displayLabel =
    label ||
    (normStatus === "ACTIVE"
      ? "Active"
      : normStatus === "EXPIRES_TODAY"
      ? "Expires today"
      : normStatus === "EXPIRING_SOON"
      ? "11 days left"
      : normStatus === "EXPIRED"
      ? "Expired"
      : status);

  if (normStatus === "ACTIVE") {
    return (
      <div
        className={`inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap ${className}`}
      >
        <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 shadow-xs" />
        <span>{displayLabel}</span>
      </div>
    );
  }

  if (normStatus === "EXPIRES_TODAY") {
    return (
      <div
        className={`inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap ${className}`}
      >
        <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0 animate-pulse" />
        <span>{displayLabel}</span>
      </div>
    );
  }

  if (normStatus === "EXPIRING_SOON") {
    return (
      <div
        className={`inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap ${className}`}
      >
        <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
        <span>{displayLabel}</span>
      </div>
    );
  }

  // EXPIRED / Default
  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 whitespace-nowrap ${className}`}
    >
      <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
      <span>{displayLabel}</span>
    </div>
  );
};

export default LicenseStatusChip;
