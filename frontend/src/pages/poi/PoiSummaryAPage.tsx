import React, { useState, useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { Clock, MapPin, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppDataTable } from "@/components/common/AppDataTable";
import { PoiFilterBar } from "./components/PoiFilterBar";
import { usePoiSummaryA } from "@/queries/poi.queries";
import { PoiSummaryAItem } from "@/types/poi.types";
import { showToast } from "@/lib/toast";

export const PoiSummaryAPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("ALL");
  const [selectedBranch, setSelectedBranch] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data = [], isLoading, refetch, isFetching } = usePoiSummaryA({
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
      const headers = ["Company", "Branch", "Geo Code", "Point of Interest", "No of Visitors", "Total Stop Time (HH:MM:SS)", "Avg Stop Time (HH:MM:SS)"];
      const rows = data.map((d) => [
        `"${d.company}"`,
        `"${d.branch}"`,
        `"${d.geoCode}"`,
        `"${d.pointOfInterest}"`,
        d.noOfVisitors,
        `"${d.totalStopTime}"`,
        `"${d.avgStopTime}"`
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `poi_summary_a_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast.success("POI Summary-A exported successfully!");
    } catch {
      showToast.error("Failed to export Summary-A data");
    }
  };

  const columnDefs = useMemo<ColDef<PoiSummaryAItem>[]>(() => {
    return [
      {
        headerName: "COMPANY",
        field: "company",
        width: 180,
        filter: true,
        cellRenderer: (params: any) => (
          <span className="font-semibold text-slate-800 dark:text-slate-200">{params.value}</span>
        )
      },
      {
        headerName: "BRANCH",
        field: "branch",
        width: 160,
        filter: true,
        cellRenderer: (params: any) => (
          <span className="text-slate-600 dark:text-slate-400">{params.value}</span>
        )
      },
      {
        headerName: "GEO CODE",
        field: "geoCode",
        width: 145,
        cellRenderer: (params: any) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[11px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {params.value}
          </span>
        )
      },
      {
        headerName: "POINT OF INTEREST",
        field: "pointOfInterest",
        width: 260,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center shrink-0">
              <MapPin className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white truncate">{params.value}</span>
          </div>
        )
      },
      {
        headerName: "NO OF VISITORS",
        field: "noOfVisitors",
        width: 160,
        headerClass: "ag-right-aligned-header",
        cellClass: "ag-right-aligned-cell",
        cellRenderer: (params: any) => (
          <div className="flex items-center justify-end gap-1.5 font-bold text-slate-800 dark:text-slate-200">
            <Users className="h-3.5 w-3.5 text-blue-500" />
            <span>{params.value}</span>
          </div>
        )
      },
      {
        headerName: "TOTAL STOP TIME (HH:MM:SS)",
        field: "totalStopTime",
        width: 220,
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
          { label: "POI Module", href: "/poi" },
          { label: "POI Summary-A" }
        ]}
        title="POI Stop Duration Performance"
        badge="AGGREGATE SUMMARY"
        badgeVariant="cyan"
        description="Review visitor volumes and stop-duration performance across configured points of interest."
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
        placeholder="Filter by POI name, geocode, or branch..."
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
          <span>Showing 1-{data.length} of {data.length} operational records. All POI Summary-A fields are included in the Excel export.</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">Excel / CSV Ready</span>
        </div>
      </div>
    </div>
  );
};

export default PoiSummaryAPage;
