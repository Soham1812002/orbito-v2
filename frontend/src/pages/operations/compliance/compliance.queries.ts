import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { complianceApi } from "./compliance.api";
import { ComplianceFilters, ComplianceFormData } from "./compliance.types";
import { showToast } from "@/lib/toast";

export const COMPLIANCE_KEYS = {
  all: ["compliance-reminders"] as const,
  lists: () => [...COMPLIANCE_KEYS.all, "list"] as const,
  list: (filters: ComplianceFilters) => [...COMPLIANCE_KEYS.lists(), filters] as const
};

export function useComplianceReminders(filters: ComplianceFilters = {}) {
  return useQuery({
    queryKey: COMPLIANCE_KEYS.list(filters),
    queryFn: () => complianceApi.getComplianceReminders(filters),
    staleTime: 30000
  });
}

export function useCreateComplianceReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ComplianceFormData) => complianceApi.createComplianceReminder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPLIANCE_KEYS.all });
      showToast.success("Compliance reminder registered successfully");
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || err?.message || "Failed to create reminder");
    }
  });
}

export function useUpdateComplianceReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ComplianceFormData> }) =>
      complianceApi.updateComplianceReminder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPLIANCE_KEYS.all });
      showToast.success("Compliance reminder updated successfully");
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || err?.message || "Failed to update reminder");
    }
  });
}

export function useDeleteComplianceReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => complianceApi.deleteComplianceReminder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPLIANCE_KEYS.all });
      showToast.success("Compliance reminder removed");
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || err?.message || "Failed to delete reminder");
    }
  });
}
