import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { ConfigEntityConfig } from "@/types/config.types";
import { appConfigApi } from "@/api/appConfig.api";

interface AppConfigFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "copy";
  config: ConfigEntityConfig;
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting?: boolean;
}

export const AppConfigFormModal: React.FC<AppConfigFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  config,
  initialData,
  onSubmit,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dynamically fetch live companies if current entity links to parent company
  const needsCompanies = useMemo(() => config.fields.some((f) => f.key === "companyId"), [config]);
  const { data: liveCompanies = [] } = useQuery({
    queryKey: ["app-config", "companies"],
    queryFn: ({ signal }) => appConfigApi.getConfigs("companies", signal),
    enabled: isOpen && needsCompanies,
    staleTime: 60000
  });

  // Dynamically fetch live branches if current entity links to parent branch
  const needsBranches = useMemo(() => config.fields.some((f) => f.key === "branchId"), [config]);
  const { data: liveBranches = [] } = useQuery({
    queryKey: ["app-config", "branches"],
    queryFn: ({ signal }) => appConfigApi.getConfigs("branches", signal),
    enabled: isOpen && needsBranches,
    staleTime: 60000
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData && (mode === "edit" || mode === "copy")) {
        const cloned = { ...initialData };
        if (mode === "copy") {
          delete cloned.id;
          delete cloned._id;
          // Clear unique fields like code, plate, imei, iccid, employeeCode
          if (cloned.code) cloned.code = `${cloned.code}-COPY`;
          if (cloned.plateNumber) cloned.plateNumber = "";
          if (cloned.imei) cloned.imei = "";
          if (cloned.iccid) cloned.iccid = "";
          if (cloned.employeeCode) cloned.employeeCode = "";
        }
        setFormData(cloned);
      } else {
        const defaults: Record<string, any> = {};
        for (const f of config.fields) {
          if (f.type === "checkbox") {
            defaults[f.key] = false;
          } else if (f.type === "select" && f.options && f.options.length > 0) {
            defaults[f.key] = f.options[0].value;
          } else {
            defaults[f.key] = "";
          }
        }
        setFormData(defaults);
      }
      setErrors({});
    }
  }, [isOpen, mode, initialData, config]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    for (const f of config.fields) {
      if (f.required) {
        const val = formData[f.key];
        if (val === undefined || val === null || String(val).trim() === "") {
          newErrors[f.key] = `${f.label} is required`;
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const title =
    mode === "create"
      ? `Add New ${config.singularTitle}`
      : mode === "edit"
      ? `Edit ${config.singularTitle}`
      : `Duplicate ${config.singularTitle}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {config.fields.map((field) => {
            const isFullWidth = field.type === "textarea" || field.key === "name" || field.key === "address";
            const resolvedOptions =
              field.key === "companyId" && liveCompanies.length > 0
                ? liveCompanies.map((c: any) => ({
                    label: c.name ? `${c.name} (${c.code || "CORP"})` : c.code,
                    value: c.name || c.code
                  }))
                : field.key === "branchId" && liveBranches.length > 0
                ? liveBranches.map((b: any) => ({
                    label: b.name ? `${b.name} (${b.code || "BRN"})` : b.code,
                    value: b.name || b.code
                  }))
                : field.options || [];

            return (
              <div
                key={field.key}
                className={isFullWidth ? "col-span-1 md:col-span-2 space-y-1.5" : "space-y-1.5"}
              >
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {field.label}
                  {field.required && <span className="text-rose-500 ml-1">*</span>}
                </label>

                {field.type === "select" ? (
                  <select
                    value={formData[field.key] ?? ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-[#1D293D] bg-white dark:bg-[#111C38] text-slate-900 dark:text-white focus-ring transition-colors"
                  >
                    <option value="">Select {field.label}...</option>
                    {resolvedOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    rows={3}
                    value={formData[field.key] ?? ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-[#1D293D] bg-white dark:bg-[#111C38] text-slate-900 dark:text-white focus-ring transition-colors resize-none"
                  />
                ) : field.type === "checkbox" ? (
                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id={field.key}
                      checked={Boolean(formData[field.key])}
                      onChange={(e) => handleChange(field.key, e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus-ring border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                    />
                    <label htmlFor={field.key} className="text-xs text-slate-600 dark:text-slate-400">
                      Enable / Active
                    </label>
                  </div>
                ) : (
                  <input
                    type={field.type === "number" ? "number" : "text"}
                    value={formData[field.key] ?? ""}
                    onChange={(e) =>
                      handleChange(
                        field.key,
                        field.type === "number" ? Number(e.target.value) : e.target.value
                      )
                    }
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-[#1D293D] bg-white dark:bg-[#111C38] text-slate-900 dark:text-white focus-ring transition-colors"
                  />
                )}

                {field.helperText && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{field.helperText}</p>
                )}
                {errors[field.key] && (
                  <p className="text-xs text-rose-500 font-medium">{errors[field.key]}</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-[#1D293D]">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {mode === "create" ? "Create Entity" : mode === "copy" ? "Create Copy" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
