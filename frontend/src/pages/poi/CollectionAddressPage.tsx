import React, { useState, useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { CheckCircle2, XCircle, MapPin, Layers } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppDataTable } from "@/components/common/AppDataTable";
import { PoiFilterBar } from "./components/PoiFilterBar";
import { useCollectionAddressList } from "@/queries/poi.queries";
import { CollectionAddressItem } from "@/types/poi.types";
import { showToast } from "@/lib/toast";

export const CollectionAddressPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("ALL");
  const [selectedBranch, setSelectedBranch] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data = [], isLoading, refetch, isFetching } = useCollectionAddressList({
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
      const headers = ["Company", "Branch", "Vehicle Reg No", "Visited Count", "Missed Count", "Total Scheduled"];
      const rows = data.map((d) => [
        `"${d.company}"`,
        `"${d.branch}"`,
        `"${d.vehicleRegNo}"`,
        d.visitedCount,
        d.missedCount,
        d.totalScheduled
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `collection_address_summary_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast.success("Collection Address Summary exported successfully!");
    } catch {
      showToast.error("Failed to export Collection Address data");
    }
  };

  const columnDefs = useMemo<ColDef<CollectionAddressItem>[]>(() => {
    return [
      {
        headerName: "COMPANY",
        field: "company",
        width: 200,
        filter: true,
        cellRenderer: (params: any) => (
          <span className="font-semibold text-slate-800 dark:text-slate-200">{params.value}</span>
        )
      },
      {
        headerName: "BRANCH",
        field: "branch",
        width: 180,
        filter: true,
        cellRenderer: (params: any) => (
          <span className="text-slate-600 dark:text-slate-400">{params.value}</span>
        )
      },
      {
        headerName: "VEHICLE NO",
        field: "vehicleRegNo",
        width: 220,
        cellRenderer: (params: any) => (
          <span className="font-mono font-bold text-xs px-2.5 py-1 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            {params.value}
          </span>
        )
      },
      {
        headerName: "VISITED",
        field: "visitedCount",
        width: 150,
        headerClass: "ag-right-aligned-header",
        cellClass: "ag-right-aligned-cell",
        cellRenderer: (params: any) => (
          <div className="flex items-center justify-end gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded font-bold text-xs bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {params.value} Visited
            </span>
          </div>
        )
      },
      {
        headerName: "MISSED",
        field: "missedCount",
        width: 150,
        headerClass: "ag-right-aligned-header",
        cellClass: "ag-right-aligned-cell",
        cellRenderer: (params: any) => (
          <div className="flex items-center justify-end gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded font-bold text-xs bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-500/20">
              <XCircle className="h-3 w-3 mr-1" />
              {params.value} Missed
            </span>
          </div>
        )
      },
      {
        headerName: "TOTAL",
        field: "totalScheduled",
        width: 140,
        headerClass: "ag-right-aligned-header",
        cellClass: "ag-right-aligned-cell",
        cellRenderer: (params: any) => (
          <span className="font-bold text-slate-800 dark:text-slate-200">{params.value}</span>
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
          { label: "Collection Address" }
        ]}
        title="Collection Address Dispatch Summary"
        description="Vehicle-level collection visits, missed addresses, and scheduled totals organized in an Excel-ready summary."
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
        placeholder="Filter by vehicle registration or branch..."
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
          <span>Showing 1-{data.length} of {data.length} address dispatch records. All fields are included in the Excel export.</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">Excel / CSV Ready</span>
        </div>
      </div>
    </div>
  );
};

export default CollectionAddressPage;
