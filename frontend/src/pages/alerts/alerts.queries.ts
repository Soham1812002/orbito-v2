import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { alertsApi } from "./alerts.api";
import { AlertLogFilters, AlertRuleFilters } from "./alerts.types";
import toast from "react-hot-toast";

export const ALERT_QUERY_KEYS = {
  logs: (filters?: AlertLogFilters) => ["alerts", "logs", filters] as const,
  feed: (limit?: number) => ["alerts", "feed", limit] as const,
  rules: (filters?: AlertRuleFilters) => ["alerts", "rules", filters] as const,
  ruleDetail: (id: string) => ["alerts", "rule", id] as const
};

export const useAlertLogs = (filters: AlertLogFilters = {}) => {
  return useQuery({
    queryKey: ALERT_QUERY_KEYS.logs(filters),
    queryFn: () => alertsApi.getLogs(filters),
    staleTime: 1000 * 10
  });
};

export const useRecentAlertsFeed = (limit: number = 10, pollInterval: number = 5000) => {
  return useQuery({
    queryKey: ALERT_QUERY_KEYS.feed(limit),
    queryFn: () => alertsApi.getRecentFeed(limit),
    refetchInterval: pollInterval,
    staleTime: 1000 * 5
  });
};

export const useAlertRules = (filters: AlertRuleFilters = {}) => {
  return useQuery({
    queryKey: ALERT_QUERY_KEYS.rules(filters),
    queryFn: () => alertsApi.getRules(filters),
    staleTime: 1000 * 30
  });
};

export const useAlertRuleDetail = (id?: string) => {
  return useQuery({
    queryKey: ALERT_QUERY_KEYS.ruleDetail(id || ""),
    queryFn: () => alertsApi.getRuleById(id!),
    enabled: Boolean(id)
  });
};

export const useAcknowledgeAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      alertsApi.acknowledgeAlert(id, notes),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      toast.success(`Alert for ${updated.plateNumber} acknowledged`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to acknowledge alert");
    }
  });
};

export const useCreateAlertRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => alertsApi.createRule(payload),
    onSuccess: (rule) => {
      queryClient.invalidateQueries({ queryKey: ["alerts", "rules"] });
      toast.success(`Alert rule "${rule.name}" created successfully`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create alert rule");
    }
  });
};

export const useUpdateAlertRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      alertsApi.updateRule(id, payload),
    onSuccess: (rule) => {
      queryClient.invalidateQueries({ queryKey: ["alerts", "rules"] });
      toast.success(`Alert rule "${rule.name}" updated successfully`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update alert rule");
    }
  });
};

export const useToggleAlertRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => alertsApi.toggleRuleActive(id),
    onSuccess: (rule) => {
      queryClient.invalidateQueries({ queryKey: ["alerts", "rules"] });
      toast.success(
        `Rule "${rule.name}" is now ${rule.isActive ? "Active" : "Inactive"}`
      );
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to toggle alert rule");
    }
  });
};

export const useDeleteAlertRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => alertsApi.deleteRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts", "rules"] });
      toast.success("Alert rule deleted");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete alert rule");
    }
  });
};
