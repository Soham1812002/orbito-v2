import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  RotateCw,
  Plus,
  Search,
  Receipt,
  Building2,
  GitBranch,
  Truck
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { AppDataTable } from "@/components/common/AppDataTable";
import { TableFilterBar } from "@/components/common/TableFilterBar";
import { Select } from "@/components/common/Select";
import { useExpenseHistory } from "./expenses.queries";
import { getExpenseHistoryColDefs } from "./expenses.columns";
import { showToast } from "@/lib/toast";

export const ExpenseHistoryListPage: React.FC = () => {
  const navigate = useNavigate();

  const [searchVehicle, setSearchVehicle] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedVehicle, setSelectedVehicle] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, refetch } = useExpenseHistory({
    page,
    limit: pageSize,
    search: searchVehicle.trim() || undefined,
    company: selectedCompany !== "all" ? selectedCompany : undefined,
    branch: selectedBranch !== "all" ? selectedBranch : undefined,
    vehicle: selectedVehicle !== "all" ? selectedVehicle : undefined
  });

  const columnDefs = useMemo(() => getExpenseHistoryColDefs(), []);

  const handleExportExcel = () => {
    if (!data?.rows?.length) {
      showToast.error("No expense records to export");
      return;
    }
    const headers = ["Company,Branch,Vehicle,Fuel Expense,Maintenance Expense,Total Expense,Distance\n"];
    const rows = data.rows.map(
      (r) =>
        `"${r.company}","${r.branch}","${r.vehicle}","₹${r.fuelExpense}","₹${r.maintenanceExpense}","₹${r.totalExpense}","${r.distance} km"`
    );
    const blob = new Blob([headers.concat(rows).join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `fleet_expense_history_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast.success("Exported expense history successfully");
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-full">
      {/* Page Header */}
      <PageHeader
        breadcrumbs={[
          { label: "Reports", href: "/reports" },
          { label: "Expenses", href: "/maintenance/expenses/overview" },
          { label: "Expense History" }
        ]}
        title="Expense History"
        description="Review fuel, maintenance, and total operating expenses across your fleet."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/maintenance")}
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Back to Hub
          </Button>
        }
      />

      {/* Standard TableFilterBar */}
      <TableFilterBar
        search={searchVehicle}
        onSearchChange={setSearchVehicle}
        searchPlaceholder="Search vehicle plate, expense..."
        filters={
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-full sm:w-36">
              <Select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                options={[
                  { value: "all", label: "All Companies" },
                  { value: "inOrbit Logistics", label: "inOrbit Logistics" },
                  { value: "Metro Transport", label: "Metro Transport" }
                ]}
              />
            </div>
            <div className="w-full sm:w-36">
              <Select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                options={[
                  { value: "all", label: "All Branches" },
                  { value: "West Operations", label: "West Operations" },
                  { value: "North Operations", label: "North Operations" },
                  { value: "Central Fleet", label: "Central Fleet" }
                ]}
              />
            </div>
            <div className="w-full sm:w-36">
              <Select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                options={[
                  { value: "all", label: "All Vehicles" },
                  { value: "GJ 05 AB 1234", label: "GJ 05 AB 1234" },
                  { value: "GJ 01 KM 4821", label: "GJ 01 KM 4821" },
                  { value: "DL 01 AB 7532", label: "DL 01 AB 7532" },
                  { value: "MH 14 DT 9087", label: "MH 14 DT 9087" }
                ]}
              />
            </div>
          </div>
        }
        onRefresh={() => refetch()}
        isRefreshing={isLoading}
        onExport={handleExportExcel}
        exportLabel="Export Excel"
        onCreateNew={() => navigate("/maintenance/expenses/new")}
        createLabel="Add Expense"
      />

      {/* AG Grid Data Table in panel-card */}
      <div className="panel-card p-4 sm:p-5 overflow-hidden">
        <AppDataTable
          rowData={data?.rows || []}
          columnDefs={columnDefs}
          isLoading={isLoading}
          total={data?.totalRecords || 0}
          page={page}
          pageSize={pageSize}
          totalPages={1}
          onPageChange={setPage}
          height="500px"
        />
      </div>

      {/* Table Subtext */}
      <p className="text-2xs text-slate-500 dark:text-slate-400">
        Showing 1-{data?.rows?.length || 4} of {data?.totalRecords || 24} expense records. Company, branch, vehicle, expense totals, and distance values are included in the Excel export.
      </p>
    </div>
  );
};

export default ExpenseHistoryListPage;
