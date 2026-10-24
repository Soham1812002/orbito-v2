import React, { useState, useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { Truck, Clock, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppDataTable } from "@/components/common/AppDataTable";
import { PoiFilterBar } from "./components/PoiFilterBar";
import { usePoiSummaryB } from "@/queries/poi.queries";
import { PoiSummaryBItem } from "@/types/poi.types";
import { showToast } from "@/lib/toast";

export const PoiSummaryBPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("ALL");
  const [selectedBranch, setSelectedBranch] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data = [], isLoading, refetch, isFetching } = usePoiSummaryB({
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
      const headers = ["Company", "Branch", "Vehicle Model", "Vehicle Type", "Registration No", "IMEI No", "Visit Count", "Total Stop Time (HH:MM:SS)", "Avg Stop Time (HH:MM:SS)"];
      const rows = data.map((d) => [
        `"${d.company}"`,
        `"${d.branch}"`,
        `"${d.vehicleModel}"`,
        `"${d.vehicleType}"`,
        `"${d.vehicleRegNo}"`,
        `"${d.imeiNo}"`,
        d.visitCount,
        `"${d.totalStopTime}"`,
        `"${d.avgStopTime}"`
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `poi_summary_b_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast.success("POI Summary-B exported successfully!");
    } catch {
      showToast.error("Failed to export Summary-B data");
    }
  };

  const columnDefs = useMemo<ColDef<PoiSummaryBItem>[]>(() => {
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
        headerName: "VEHICLE INFORMATION",
        field: "vehicleModel",
        width: 210,
        cellRenderer: (params: any) => (
          <div>
            <div className="font-bold text-slate-900 dark:text-white leading-tight">
              {params.value}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {params.data?.vehicleType}
            </div>
          </div>
        )
      },
      {
        headerName: "VEHICLE REG NO",
        field: "vehicleRegNo",
        width: 160,
        cellRenderer: (params: any) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded font-mono font-bold text-xs bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            {params.value}
          </span>
        )
      },
      {
        headerName: "IMEI NO",
        field: "imeiNo",
        width: 175,
        cellRenderer: (params: any) => (
          <span className="font-mono text-xs text-slate-600 dark:text-slate-400">{params.value}</span>
        )
      },
      {
        headerName: "VISIT COUNT",
        field: "visitCount",
        width: 140,
        headerClass: "ag-right-aligned-header",
        cellClass: "ag-right-aligned-cell",
        cellRenderer: (params: any) => (
          <span className="font-bold text-slate-800 dark:text-slate-200">{params.value}</span>
        )
      },
      {
        headerName: "TOTAL STOP (HH:MM:SS)",
        field: "totalStopTime",
        width: 200,
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
        headerName: "AVG STOP (HH:MM:SS)",
        field: "avgStopTime",
        width: 175,
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
          { label: "POI Module", href: "/poi" },
          { label: "POI Summary-B" }
        ]}
        title="Vehicle POI Stop Summary"
        description="Vehicle-level visit counts and accumulated stop time are organized in a compact, Excel-ready operational summary."
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
        placeholder="Filter by vehicle registration, model, or IMEI..."
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
          <span>Showing 1-{data.length} of {data.length} vehicle telemetry records. All POI Summary-B fields are included in the Excel export.</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">Excel / CSV Ready</span>
        </div>
      </div>
    </div>
  );
};

export default PoiSummaryBPage;
