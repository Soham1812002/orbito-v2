import React from "react";

interface UserStatusFilterChipsProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
  counts: {
    all: number;
    active: number;
    suspended: number;
  };
}

export const UserStatusFilterChips: React.FC<UserStatusFilterChipsProps> = ({
  currentStatus,
  onStatusChange,
  counts
}) => {
  const options = [
    { key: "all", label: `ALL (${counts.all})` },
    { key: "active", label: `ACTIVE (${counts.active})` },
    { key: "suspended", label: `SUSPENDED (${counts.suspended})` }
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
      <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1 whitespace-nowrap">
        User Status:
      </span>
      {options.map((opt) => {
        const isSelected = currentStatus === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onStatusChange(opt.key)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all focus-ring whitespace-nowrap ${
              isSelected
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
