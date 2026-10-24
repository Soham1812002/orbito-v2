import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  RotateCw,
  Plus,
  Search,
  Wrench,
  Building2,
  GitBranch,
  Truck
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { AppDataTable } from "@/components/common/AppDataTable";
import { TableFilterBar } from "@/components/common/TableFilterBar";
import { Select } from "@/components/common/Select";
import { useMaintenanceReminders } from "./reminders.queries";
import { getReminderStatusColDefs } from "./reminders.columns";
import { showToast } from "@/lib/toast";

export const ReminderStatusListPage: React.FC = () => {
  const navigate = useNavigate();

  const [searchVehicle, setSearchVehicle] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedVehicle, setSelectedVehicle] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, refetch } = useMaintenanceReminders({
    page,
    limit: pageSize,
    search: searchVehicle.trim() || undefined,
    company: selectedCompany !== "all" ? selectedCompany : undefined,
    branch: selectedBranch !== "all" ? selectedBranch : undefined,
    vehicle: selectedVehicle !== "all" ? selectedVehicle : undefined
  });

  const columnDefs = useMemo(() => getReminderStatusColDefs(), []);

  const handleExportExcel = () => {
    if (!data?.rows?.length) {
      showToast.error("No reminders available to export");
      return;
    }
    const headers = [
      "Company,Branch,Vehicle,Maintenance Type,Description,Last Service,Last Mileage,Next Mileage,Next Days,Notification,Status\n"
    ];
    const rows = data.rows.map(
      (r) =>
        `"${r.companyName}","${r.branchName}","${r.vehiclePlate}","${r.reminderType}","${r.description || r.reminderName}","${r.lastServiceDate || ""}","${r.lastMileage || ""} km","${r.nextMileage} km","${r.nextDays || ""}","${r.notifyEmail ? "Email" : ""}${r.notifySms ? " SMS" : ""}","${r.status}"`
    );
    const blob = new Blob([headers.concat(rows).join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `maintenance_reminders_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast.success("Exported reminder status report successfully");
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-full">
      {/* Page Header */}
      <PageHeader
        breadcrumbs={[
          { label: "Reports", href: "/reports" },
          { label: "Maintenance", href: "/maintenance" },
          { label: "Reminder Status" }
        ]}
        title="Reminder Status"
        description="Monitor scheduled maintenance reminders, notification preferences, and vehicle service status."
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
        searchPlaceholder="Search vehicle plate, reminder..."
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
        onCreateNew={() => navigate("/maintenance/reminders/new")}
        createLabel="Add Reminder"
      />

      {/* AG Grid Data Table in panel-card */}
      <div className="panel-card p-4 sm:p-5 overflow-hidden">
        <AppDataTable
          rowData={data?.rows || []}
          columnDefs={columnDefs}
          isLoading={isLoading}
          total={data?.totalCount || 0}
          page={page}
          pageSize={pageSize}
          totalPages={data?.totalPages || 1}
          onPageChange={setPage}
          height="500px"
        />
      </div>

      {/* Table Subtext */}
      <p className="text-2xs text-slate-500 dark:text-slate-400">
        Showing 1-{data?.rows?.length || 4} of {data?.totalCount || 24} configured reminders. All maintenance dates, mileage thresholds, notification methods, and statuses are included in the Excel export.
      </p>
    </div>
  );
};

export default ReminderStatusListPage;
