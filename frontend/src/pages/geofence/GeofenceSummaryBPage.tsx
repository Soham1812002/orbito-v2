import React, { useState, useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { Truck, Clock, Gauge, ArrowRightCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppDataTable } from "@/components/common/AppDataTable";
import { GeofenceFilterBar } from "./components/GeofenceFilterBar";
import { useGeofenceSummaryB } from "@/queries/geofence.queries";
import { GeofenceSummaryBItem } from "@/types/geofence.types";
import { showToast } from "@/lib/toast";

export const GeofenceSummaryBPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data = [], isLoading, refetch, isFetching } = useGeofenceSummaryB({
    search: searchTerm
  });

  const handleExportExcel = () => {
    if (data.length === 0) {
      showToast.error("No data available to export");
      return;
    }

    try {
      const headers = ["Company", "Branch", "Vehicle Reg No", "Vehicle Model", "Geofence Name", "Entry Time", "Exit Time", "Dwell Duration (HH:MM:SS)", "Speed on Entry (km/h)", "Status"];
      const rows = data.map((d) => [
        `"${d.company}"`,
        `"${d.branch}"`,
        `"${d.vehicleRegNo}"`,
        `"${d.vehicleModel}"`,
        `"${d.geofenceName}"`,
        `"${d.entryTime}"`,
        `"${d.exitTime || "Active Inside"}"`,
        `"${d.dwellDuration}"`,
        d.speedOnEntry,
        `"${d.status}"`
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `vehicle_geofence_crossings_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast.success("Vehicle Geofence Crossings exported successfully!");
    } catch {
      showToast.error("Failed to export vehicle crossing data");
    }
  };

  const columnDefs = useMemo<ColDef<GeofenceSummaryBItem>[]>(() => {
    return [
      {
        headerName: "COMPANY",
        field: "company",
        width: 170,
        filter: true,
        cellRenderer: (params: any) => (
          <span className="font-semibold text-slate-800 dark:text-slate-200">{params.value}</span>
        )
      },
      {
        headerName: "BRANCH",
        field: "branch",
        width: 155,
        filter: true,
        cellRenderer: (params: any) => (
          <span className="text-slate-600 dark:text-slate-400">{params.value}</span>
        )
      },
      {
        headerName: "VEHICLE REG NO",
        field: "vehicleRegNo",
        width: 165,
        cellRenderer: (params: any) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded font-mono font-bold text-xs bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            {params.value}
          </span>
        )
      },
      {
        headerName: "VEHICLE MODEL",
        field: "vehicleModel",
        width: 175,
        cellRenderer: (params: any) => (
          <span className="font-medium text-slate-800 dark:text-slate-200">{params.value}</span>
        )
      },
      {
        headerName: "GEOFENCE NAME",
        field: "geofenceName",
        width: 250,
        cellRenderer: (params: any) => (
          <span className="font-bold text-slate-900 dark:text-white truncate">{params.value}</span>
        )
      },
      {
        headerName: "ENTRY TIME",
        field: "entryTime",
        width: 165,
        cellRenderer: (params: any) => (
          <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
            {new Date(params.value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        )
      },
      {
        headerName: "EXIT TIME",
        field: "exitTime",
        width: 165,
        cellRenderer: (params: any) => (
          <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
            {params.value
              ? new Date(params.value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
              : "Active Inside"}
          </span>
        )
      },
      {
        headerName: "SPEED ON ENTRY",
        field: "speedOnEntry",
        width: 150,
        headerClass: "ag-right-aligned-header",
        cellClass: "ag-right-aligned-cell",
        cellRenderer: (params: any) => (
          <div className="flex items-center justify-end gap-1 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Gauge className="h-3.5 w-3.5 text-slate-400" />
            <span>{params.value} km/h</span>
          </div>
        )
      },
      {
        headerName: "DWELL DURATION",
        field: "dwellDuration",
        width: 155,
        headerClass: "ag-right-aligned-header",
        cellClass: "ag-right-aligned-cell",
        cellRenderer: (params: any) => (
          <div className="flex items-center justify-end gap-1.5 font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
            <Clock className="h-3.5 w-3.5" />
            <span>{params.value}</span>
          </div>
        )
      },
      {
        headerName: "STATUS",
        field: "status",
        width: 120,
        pinned: "right",
        cellRenderer: (params: any) => {
          const isInside = params.value === "INSIDE";
          return (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded font-bold text-[10px] uppercase tracking-wider border ${
                isInside
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                  : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
              }`}
            >
              {params.value}
            </span>
          );
        }
      }
    ];
  }, []);

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Geofence Module", href: "/geofence" },
          { label: "Vehicle Crossings" }
        ]}
        title="Vehicle Geofence Zone Crossings"
        description="Audit chronological vehicle entry and exit timestamps, entry speeds, and dwell durations."
      />

      <GeofenceFilterBar
        search={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={() => refetch()}
        onExport={handleExportExcel}
        isRefreshing={isFetching}
        placeholder="Filter by vehicle registration, model, or geofence..."
      />

      <div className="panel-card p-4 sm:p-5 overflow-hidden">
        <AppDataTable
          rowData={data}
          columnDefs={columnDefs}
          isLoading={isLoading}
          total={data.length}
          page={page}
          pageSize={pageSize}
          totalPages={Math.ceil(data.length / pageSize) || 1}
          onPageChange={setPage}
          height="520px"
        />
        <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Showing 1-{data.length} of {data.length} vehicle zone crossing events. All fields are included in the Excel export.</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">Excel / CSV Ready</span>
        </div>
      </div>
    </div>
  );
};

export default GeofenceSummaryBPage;
