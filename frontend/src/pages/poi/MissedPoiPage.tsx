import React, { useState, useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AlertCircle, AlertTriangle, Truck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppDataTable } from "@/components/common/AppDataTable";
import { PoiFilterBar } from "./components/PoiFilterBar";
import { useMissedPoiList } from "@/queries/poi.queries";
import { MissedPoiItem } from "@/types/poi.types";
import { showToast } from "@/lib/toast";

export const MissedPoiPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("ALL");
  const [selectedBranch, setSelectedBranch] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data = [], isLoading, refetch, isFetching } = useMissedPoiList({
    search: searchTerm,
    company: selectedCompany,
    branch: selectedBranch
  });

  const handleExportExcel = () => {
    if (data.length === 0) {
      showToast.error("No data available to export");
      return;
    }

    try {
      const headers = ["Company", "Branch", "Vehicle Reg No", "Vehicle Model", "Vehicle Type", "Scheduled POI Count", "Visited Count", "Missed Count"];
      const rows = data.map((d) => [
        `"${d.company}"`,
        `"${d.branch}"`,
        `"${d.vehicleRegNo}"`,
        `"${d.vehicleModel}"`,
        `"${d.vehicleType}"`,
        d.scheduledPoiCount,
        d.visitedCount,
        d.missedCount
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `missed_poi_summary_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast.success("Missed POI Summary exported successfully!");
    } catch {
      showToast.error("Failed to export Missed POI data");
    }
  };

  const columnDefs = useMemo<ColDef<MissedPoiItem>[]>(() => {
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
        headerName: "VEHICLE NO - VEHICLE NAME",
        field: "vehicleRegNo",
        width: 290,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {params.value}
            </span>
            <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
              {params.data?.vehicleModel}
            </span>
          </div>
        )
      },
      {
        headerName: "VEHICLE TYPE",
        field: "vehicleType",
        width: 200,
        cellRenderer: (params: any) => (
          <span className="text-slate-600 dark:text-slate-400 text-xs">{params.value}</span>
        )
      },
      {
        headerName: "SCHEDULED",
        field: "scheduledPoiCount",
        width: 130,
        headerClass: "ag-right-aligned-header",
        cellClass: "ag-right-aligned-cell",
        cellRenderer: (params: any) => (
          <span className="font-semibold text-slate-700 dark:text-slate-300">{params.value}</span>
        )
      },
      {
        headerName: "VISITED",
        field: "visitedCount",
        width: 120,
        headerClass: "ag-right-aligned-header",
        cellClass: "ag-right-aligned-cell",
        cellRenderer: (params: any) => (
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{params.value}</span>
        )
      },
      {
        headerName: "NO OF MISSED POINT",
        field: "missedCount",
        width: 180,
        headerClass: "ag-right-aligned-header",
        cellClass: "ag-right-aligned-cell",
        cellRenderer: (params: any) => (
          <div className="flex items-center justify-end gap-1.5">
            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full font-bold text-xs bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-500/20">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {params.value} Missed
            </span>
          </div>
        )
      }
    ];
  }, []);

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "POI Module", href: "/poi" },
          { label: "Missed POI" }
        ]}
        title="Missed Point of Interest Summary"
        description="Review vehicle visits and missed point activity across configured points of interest."
      />

      <PoiFilterBar
        search={searchTerm}
        onSearchChange={setSearchTerm}
        company={selectedCompany}
        onCompanyChange={setSelectedCompany}
        branch={selectedBranch}
        onBranchChange={setSelectedBranch}
        onRefresh={() => refetch()}
        onExport={handleExportExcel}
        isRefreshing={isFetching}
        placeholder="Filter by vehicle registration or model..."
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
          <span>Showing 1-{data.length} of {data.length} missed point records. All Missed POI Summary fields are included in the Excel export.</span>
          <span className="font-semibold text-rose-600 dark:text-rose-400">Exception Highlight</span>
        </div>
      </div>
    </div>
  );
};

export default MissedPoiPage;
