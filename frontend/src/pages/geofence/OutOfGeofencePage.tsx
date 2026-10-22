import React, { useState, useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AlertOctagon, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppDataTable } from "@/components/common/AppDataTable";
import { GeofenceFilterBar } from "./components/GeofenceFilterBar";
import { useOutOfGeofenceList, useAcknowledgeDeviation } from "@/queries/geofence.queries";
import { OutOfGeofenceItem } from "@/types/geofence.types";
import { Button } from "@/components/common/Button";
import { showToast } from "@/lib/toast";

export const OutOfGeofencePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data = [], isLoading, refetch, isFetching } = useOutOfGeofenceList({
    search: searchTerm
  });

  const acknowledgeMutation = useAcknowledgeDeviation();

  const handleAcknowledge = async (id: string, vehicleRegNo: string) => {
    try {
      await acknowledgeMutation.mutateAsync(id);
      showToast.success(`Deviation incident for ${vehicleRegNo} acknowledged.`);
    } catch {
      showToast.error("Failed to acknowledge incident");
    }
  };

  const handleExportExcel = () => {
    if (data.length === 0) {
      showToast.error("No data available to export");
      return;
    }

    try {
      const headers = ["Company", "Branch", "Vehicle Reg No", "Vehicle Model", "Driver", "Deviation Location", "Distance Outside (km)", "Timestamp", "Severity", "Acknowledged"];
      const rows = data.map((d) => [
        `"${d.company}"`,
        `"${d.branch}"`,
        `"${d.vehicleRegNo}"`,
        `"${d.vehicleModel}"`,
        `"${d.driverName}"`,
        `"${d.deviationLocation}"`,
        d.distanceOutsideKm,
        `"${d.deviationTime}"`,
        `"${d.severity}"`,
        d.acknowledged ? "Yes" : "No"
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `out_of_geofence_deviations_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast.success("Deviation Incidents exported successfully!");
    } catch {
      showToast.error("Failed to export deviation data");
    }
  };

  const columnDefs = useMemo<ColDef<OutOfGeofenceItem>[]>(() => {
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
        headerName: "VEHICLE",
        field: "vehicleRegNo",
        width: 230,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {params.value}
            </span>
            <span className="font-medium text-xs text-slate-700 dark:text-slate-300 truncate">
              {params.data?.vehicleModel}
            </span>
          </div>
        )
      },
      {
        headerName: "ASSIGNED DRIVER",
        field: "driverName",
        width: 160,
        cellRenderer: (params: any) => (
          <span className="font-medium text-slate-900 dark:text-white">{params.value}</span>
        )
      },
      {
        headerName: "DEVIATION LOCATION",
        field: "deviationLocation",
        width: 260,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 truncate">
            <AlertOctagon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
            <span className="truncate">{params.value}</span>
          </div>
        )
      },
      {
        headerName: "DISTANCE OUTSIDE",
        field: "distanceOutsideKm",
        width: 160,
        headerClass: "ag-right-aligned-header",
        cellClass: "ag-right-aligned-cell",
        cellRenderer: (params: any) => (
          <span className="font-mono font-bold text-xs text-rose-600 dark:text-rose-400">
            +{params.value} km
          </span>
        )
      },
      {
        headerName: "SEVERITY",
        field: "severity",
        width: 125,
        cellRenderer: (params: any) => {
          const sev = params.value;
          let badge = "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300";
          if (sev === "high") {
            badge = "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400";
          } else if (sev === "medium") {
            badge = "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400";
          }
          return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded font-bold text-[10px] uppercase tracking-wider border ${badge}`}>
              {sev}
            </span>
          );
        }
      },
      {
        headerName: "ACTION",
        field: "id",
        width: 140,
        pinned: "right",
        cellRenderer: (params: any) => {
          const item = params.data as OutOfGeofenceItem;
          if (item.acknowledged) {
            return (
              <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Reviewed
              </span>
            );
          }
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAcknowledge(item.id, item.vehicleRegNo)}
              className="h-7 px-2 text-[11px] font-semibold text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-950/40"
            >
              Acknowledge
            </Button>
          );
        }
      }
    ];
  }, [acknowledgeMutation]);

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Geofence Module", href: "/geofence" },
          { label: "Out-of-Geofence" }
        ]}
        title="Out-of-Geofence Security Incidents"
        badge="INCIDENT REGISTER"
        badgeVariant="alert"
        description="Real-time exception register for unauthorized route departures, corridor breaches, and security alerts."
      />

      <GeofenceFilterBar
        search={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={() => refetch()}
        onExport={handleExportExcel}
        isRefreshing={isFetching}
        placeholder="Filter by vehicle registration, driver, or location..."
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
          <span>Showing 1-{data.length} of {data.length} active deviation incidents. All fields are included in the Excel export.</span>
          <span className="font-semibold text-rose-600 dark:text-rose-400">Security Audit</span>
        </div>
      </div>
    </div>
  );
};

export default OutOfGeofencePage;
