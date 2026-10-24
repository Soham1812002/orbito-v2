import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { expensesApi } from "./expenses.api";
import { VehicleExpense, ExpenseFilterParams } from "./expenses.types";
import { showToast } from "@/lib/toast";

export const EXPENSE_QUERY_KEYS = {
  all: ["maintenance", "expenses"] as const,
  list: (params?: ExpenseFilterParams) => ["maintenance", "expenses", "list", params] as const,
  history: (params?: ExpenseFilterParams) => ["maintenance", "expenses", "history", params] as const,
  detail: (id: string) => ["maintenance", "expenses", "detail", id] as const
};

export const useVehicleExpenses = (params?: ExpenseFilterParams) => {
  return useQuery({
    queryKey: EXPENSE_QUERY_KEYS.list(params),
    queryFn: () => expensesApi.getExpenses(params),
    staleTime: 30_000
  });
};

export const useExpenseHistory = (params?: ExpenseFilterParams) => {
  return useQuery({
    queryKey: EXPENSE_QUERY_KEYS.history(params),
    queryFn: () => expensesApi.getExpenseHistory(params),
    staleTime: 30_000
  });
};

export const useExpenseDetail = (id: string) => {
  return useQuery({
    queryKey: EXPENSE_QUERY_KEYS.detail(id),
    queryFn: () => expensesApi.getExpenseById(id),
    enabled: !!id
  });
};

export const useCreateExpense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<VehicleExpense>) => expensesApi.createExpense(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXPENSE_QUERY_KEYS.all });
      showToast.success("Expense record saved successfully");
    },
    onError: (err: any) => {
      showToast.error(err.message || "Failed to save expense record");
    }
  });
};

export const useUpdateExpense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<VehicleExpense> }) =>
      expensesApi.updateExpense(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXPENSE_QUERY_KEYS.all });
      showToast.success("Expense record updated successfully");
    },
    onError: (err: any) => {
      showToast.error(err.message || "Failed to update expense record");
    }
  });
};

export const useDeleteExpense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => expensesApi.deleteExpense(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXPENSE_QUERY_KEYS.all });
      showToast.success("Expense record deleted successfully");
    },
    onError: (err: any) => {
      showToast.error(err.message || "Failed to delete expense record");
    }
  });
};
