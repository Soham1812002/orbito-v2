import React from "react";
import type { ColDef } from "ag-grid-community";
import { VehicleExpense, ExpenseHistoryAggregate } from "./expenses.types";

export const getExpenseHistoryColDefs = (): ColDef<ExpenseHistoryAggregate>[] => [
  {
    headerName: "COMPANY",
    field: "company",
    minWidth: 150,
    flex: 1.2
  },
  {
    headerName: "BRANCH",
    field: "branch",
    minWidth: 140,
    flex: 1
  },
  {
    headerName: "VEHICLE",
    field: "vehicle",
    minWidth: 130,
    flex: 1,
    cellClass: "font-mono font-medium text-slate-900 dark:text-slate-100"
  },
  {
    headerName: "FUEL EXPENSE",
    field: "fuelExpense",
    minWidth: 130,
    flex: 1,
    cellClass: "font-mono",
    valueFormatter: (params) => (params.value ? `₹${Number(params.value).toLocaleString()}` : "₹0")
  },
  {
    headerName: "MAINTENANCE EXPENSE",
    field: "maintenanceExpense",
    minWidth: 150,
    flex: 1.1,
    cellClass: "font-mono",
    valueFormatter: (params) => (params.value ? `₹${Number(params.value).toLocaleString()}` : "₹0")
  },
  {
    headerName: "TOTAL EXPENSE",
    field: "totalExpense",
    minWidth: 130,
    flex: 1,
    cellClass: "font-mono font-semibold text-slate-900 dark:text-slate-100",
    valueFormatter: (params) => (params.value ? `₹${Number(params.value).toLocaleString()}` : "₹0")
  },
  {
    headerName: "DISTANCE",
    field: "distance",
    minWidth: 120,
    flex: 1,
    cellClass: "font-mono",
    valueFormatter: (params) => (params.value ? `${Number(params.value).toLocaleString()} km` : "—")
  }
];

export const getExpenseOverviewColDefs = (): ColDef<VehicleExpense>[] => [
  {
    headerName: "COMPANY",
    field: "companyName",
    minWidth: 150,
    flex: 1.2
  },
  {
    headerName: "BRANCH",
    field: "branchName",
    minWidth: 140,
    flex: 1
  },
  {
    headerName: "VEHICLE",
    field: "vehiclePlate",
    minWidth: 130,
    flex: 1,
    cellClass: "font-mono font-medium text-slate-900 dark:text-slate-100"
  },
  {
    headerName: "EXPENSE TYPE",
    field: "expenseType",
    minWidth: 130,
    flex: 1,
    cellRenderer: (params: any) => {
      const type = params.value;
      const isFuel = type === "Fuel";
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-2xs font-semibold ${
            isFuel
              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
              : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
          }`}
        >
          {type}
        </span>
      );
    }
  },
  {
    headerName: "MAINTENANCE TYPE",
    field: "maintenanceType",
    minWidth: 160,
    flex: 1.2,
    valueFormatter: (params) => params.value || "—"
  },
  {
    headerName: "EXPENSE AMOUNT",
    field: "expenseAmount",
    minWidth: 140,
    flex: 1,
    cellClass: "font-mono font-semibold text-slate-900 dark:text-slate-100",
    valueFormatter: (params) => (params.value ? `₹${Number(params.value).toLocaleString()}` : "₹0")
  },
  {
    headerName: "EXPENSE DATE",
    field: "expenseDate",
    minWidth: 130,
    flex: 1,
    cellClass: "font-mono",
    valueFormatter: (params) => params.value || "—"
  },
  {
    headerName: "ODOMETER",
    field: "odometer",
    minWidth: 130,
    flex: 1,
    cellClass: "font-mono",
    valueFormatter: (params) => (params.value ? `${Number(params.value).toLocaleString()} km` : "—")
  }
];
