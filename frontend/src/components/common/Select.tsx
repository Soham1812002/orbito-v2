import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  sizeVariant?: "sm" | "md";
  options?: SelectOption[];
  children?: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      sizeVariant = "md",
      options,
      children,
      className = "",
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || props.name || Math.random().toString(36).substring(2, 9);

    const sizeClasses =
      sizeVariant === "sm"
        ? "h-9 text-xs px-3 pr-9 rounded-xl"
        : "h-10 text-sm px-3.5 pr-10 rounded-xl";

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={`w-full appearance-none border bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed select-none ${sizeClasses} ${
              error
                ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                : "border-slate-200 dark:border-slate-800 dark:focus:border-blue-400"
            } ${className}`}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <ChevronDown
            className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${
              sizeVariant === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"
            } text-slate-400 dark:text-slate-500 shrink-0`}
            aria-hidden="true"
          />
        </div>

        {error && <p className="text-xs text-rose-500">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
