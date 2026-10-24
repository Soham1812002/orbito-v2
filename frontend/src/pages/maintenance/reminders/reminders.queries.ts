import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { remindersApi } from "./reminders.api";
import { MaintenanceReminder, ReminderFilterParams } from "./reminders.types";
import { showToast } from "@/lib/toast";

export const REMINDER_QUERY_KEYS = {
  all: ["maintenance", "reminders"] as const,
  list: (params?: ReminderFilterParams) => ["maintenance", "reminders", "list", params] as const,
  overview: (params?: ReminderFilterParams) => ["maintenance", "reminders", "overview", params] as const,
  detail: (id: string) => ["maintenance", "reminders", "detail", id] as const
};

export const useMaintenanceReminders = (params?: ReminderFilterParams) => {
  return useQuery({
    queryKey: REMINDER_QUERY_KEYS.list(params),
    queryFn: () => remindersApi.getReminders(params),
    staleTime: 30_000
  });
};

export const useReminderOverview = (params?: ReminderFilterParams) => {
  return useQuery({
    queryKey: REMINDER_QUERY_KEYS.overview(params),
    queryFn: () => remindersApi.getReminderOverview(params),
    staleTime: 30_000
  });
};

export const useReminderDetail = (id: string) => {
  return useQuery({
    queryKey: REMINDER_QUERY_KEYS.detail(id),
    queryFn: () => remindersApi.getReminderById(id),
    enabled: !!id
  });
};

export const useCreateReminder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<MaintenanceReminder>) => remindersApi.createReminder(payload),
    onSuccess: (record) => {
      qc.invalidateQueries({ queryKey: REMINDER_QUERY_KEYS.all });
      showToast.success(`Reminder "${record.reminderName}" scheduled successfully`);
    },
    onError: (err: any) => {
      showToast.error(err.message || "Failed to schedule reminder");
    }
  });
};

export const useUpdateReminder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<MaintenanceReminder> }) =>
      remindersApi.updateReminder(id, payload),
    onSuccess: (record) => {
      qc.invalidateQueries({ queryKey: REMINDER_QUERY_KEYS.all });
      showToast.success(`Reminder "${record.reminderName}" updated successfully`);
    },
    onError: (err: any) => {
      showToast.error(err.message || "Failed to update reminder");
    }
  });
};

export const useDeleteReminder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => remindersApi.deleteReminder(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: REMINDER_QUERY_KEYS.all });
      showToast.success("Reminder deleted successfully");
    },
    onError: (err: any) => {
      showToast.error(err.message || "Failed to delete reminder");
    }
  });
};
