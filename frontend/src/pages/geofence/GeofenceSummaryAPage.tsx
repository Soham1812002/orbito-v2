import React, { useState, useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { Clock, Map, LogIn, LogOut, Truck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppDataTable } from "@/components/common/AppDataTable";
import { GeofenceFilterBar } from "./components/GeofenceFilterBar";
import { useGeofenceSummaryA } from "@/queries/geofence.queries";
import { GeofenceSummaryAItem } from "@/types/geofence.types";
import { showToast } from "@/lib/toast";

export const GeofenceSummaryAPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data = [], isLoading, refetch, isFetching } = useGeofenceSummaryA({
    search: searchTerm,
    type: selectedType
  });

  const handleExportExcel = () => {
    if (data.length === 0) {
      showToast.error("No data available to export");
      return;
    }

    try {
      const headers = ["Company", "Branch", "Geofence Name", "Type", "Category", "Total Entries", "Total Exits", "Vehicles Inside", "Total Dwell (HH:MM:SS)", "Avg Dwell (HH:MM:SS)"];
      const rows = data.map((d) => [
        `"${d.company}"`,
        `"${d.branch}"`,
        `"${d.geofenceName}"`,
        `"${d.type}"`,
        `"${d.category}"`,
        d.totalEntries,
        d.totalExits,
        d.activeVehiclesInside,
        `"${d.totalDwellTime}"`,
        `"${d.avgDwellTime}"`
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `geofence_activity_summary_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast.success("Geofence Activity Summary exported successfully!");
    } catch {
      showToast.error("Failed to export Geofence summary");
    }
  };

  const columnDefs = useMemo<ColDef<GeofenceSummaryAItem>[]>(() => {
    return [
      {
        headerName: "COMPANY",
        field: "company",
        width: 175,
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
        headerName: "GEOFENCE NAME",
        field: "geofenceName",
        width: 250,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Map className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white truncate">{params.value}</span>
          </div>
        )
      },
      {
        headerName: "TYPE",
        field: "type",
        width: 125,
        cellRenderer: (params: any) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {params.value}
          </span>
        )
      },
      {
        headerName: "TOTAL ENTRIES",
        field: "totalEntries",
        width: 150,
        headerClass: "ag-right-aligned-header",
        cellClass: "ag-right-aligned-cell",
        cellRenderer: (params: any) => (
          <div className="flex items-center justify-end gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
            <LogIn className="h-3.5 w-3.5" />
            <span>{params.value}</span>
          </div>
        )
      },
      {
        headerName: "TOTAL EXITS",
        field: "totalExits",
        width: 140,
        headerClass: "ag-right-aligned-header",
        cellClass: "ag-right-aligned-cell",
        cellRenderer: (params: any) => (
          <div className="flex items-center justify-end gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <LogOut className="h-3.5 w-3.5 text-slate-400" />
            <span>{params.value}</span>
          </div>
        )
      },
      {
        headerName: "CURRENTLY INSIDE",
        field: "activeVehiclesInside",
        width: 175,
        headerClass: "ag-right-aligned-header",
        cellClass: "ag-right-aligned-cell",
        cellRenderer: (params: any) => (
          <span className="font-bold text-blue-600 dark:text-blue-400">
            {params.value} Vehicles
          </span>
        )
      },
      {
        headerName: "TOTAL DWELL (HH:MM:SS)",
        field: "totalDwellTime",
        width: 210,
        headerClass: "ag-right-aligned-header",
        cellClass: "ag-right-aligned-cell",
        cellRenderer: (params: any) => (
          <div className="flex items-center justify-end gap-1.5 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>{params.value}</span>
          </div>
        )
      },
      {
        headerName: "AVG DWELL (HH:MM:SS)",
        field: "avgDwellTime",
        width: 180,
        headerClass: "ag-right-aligned-header",
        cellClass: "ag-right-aligned-cell",
        cellRenderer: (params: any) => (
          <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
            {params.value}
          </span>
        )
      }
    ];
  }, []);

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Geofence Module", href: "/geofence" },
          { label: "Zone Activity Summary" }
        ]}
        title="Geofence Zone Activity Performance"
        badge="ZONE SURVEILLANCE"
        badgeVariant="cyan"
        description="Analyze aggregate entry/exit volumes and accumulated in-zone dwell time across configured perimeters."
      />

      <GeofenceFilterBar
        search={searchTerm}
        onSearchChange={setSearchTerm}
        type={selectedType}
        onTypeChange={setSelectedType}
        onRefresh={() => refetch()}
        onExport={handleExportExcel}
        isRefreshing={isFetching}
        placeholder="Filter by geofence name or branch..."
      />

      <div className="panel-card overflow-hidden">
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
          <span>Showing 1-{data.length} of {data.length} zone activity summaries. All fields are included in the Excel export.</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">Excel / CSV Ready</span>
        </div>
      </div>
    </div>
  );
};

export default GeofenceSummaryAPage;
