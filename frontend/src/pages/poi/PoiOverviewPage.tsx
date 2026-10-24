import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ColDef } from "ag-grid-community";
import { MapPin, ExternalLink, Trash2, Edit2, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppDataTable } from "@/components/common/AppDataTable";
import { PoiFilterBar } from "./components/PoiFilterBar";
import { usePoiList, useDeletePoi } from "@/queries/poi.queries";
import { PoiItem } from "@/types/poi.types";
import { poiApi } from "@/api/poi.api";
import { showToast } from "@/lib/toast";

export const PoiOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("ALL");
  const [selectedBranch, setSelectedBranch] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, refetch, isFetching } = usePoiList({
    search: searchTerm,
    company: selectedCompany,
    branch: selectedBranch,
    category: selectedCategory
  });

  const deleteMutation = useDeletePoi();

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete POI "${name}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
        showToast.success(`POI "${name}" deleted successfully`);
      } catch {
        showToast.error("Failed to delete POI");
      }
    }
  };

  const handleExportExcel = async () => {
    try {
      await poiApi.exportPois({
        search: searchTerm || undefined,
        company: selectedCompany !== "ALL" ? selectedCompany : undefined,
        branch: selectedBranch !== "ALL" ? selectedBranch : undefined,
        category: selectedCategory !== "ALL" ? selectedCategory : undefined
      });
      showToast.success("POI Directory exported to Excel CSV!");
    } catch {
      showToast.error("Failed to export data");
    }
  };

  const columnDefs = useMemo<ColDef<PoiItem>[]>(() => {
    return [
      {
        headerName: "COMPANY",
        field: "company",
        width: 170,
        filter: true,
        cellRenderer: (params: any) => (
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {params.value}
          </span>
        )
      },
      {
        headerName: "BRANCH",
        field: "branch",
        width: 150,
        filter: true,
        cellRenderer: (params: any) => (
          <span className="text-slate-600 dark:text-slate-400">{params.value}</span>
        )
      },
      {
        headerName: "PLACE NAME",
        field: "name",
        width: 220,
        filter: true,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center shrink-0">
              <MapPin className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white truncate">
              {params.value}
            </span>
          </div>
        )
      },
      {
        headerName: "GEO CODE",
        field: "geoCode",
        width: 145,
        cellRenderer: (params: any) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[11px] font-semibold tracking-wide bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {params.value}
          </span>
        )
      },
      {
        headerName: "CATEGORY",
        field: "category",
        width: 145,
        cellRenderer: (params: any) => {
          const category = params.value;
          let badgeClass = "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
          if (category === "Plant") {
            badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800";
          } else if (category === "Toll Plaza") {
            badgeClass = "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800";
          } else if (category === "Staging Yard") {
            badgeClass = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800";
          }
          return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeClass}`}>
              {category}
            </span>
          );
        }
      },
      {
        headerName: "STREET",
        field: "street",
        width: 210,
        cellRenderer: (params: any) => (
          <span className="text-slate-600 dark:text-slate-400 truncate">{params.value}</span>
        )
      },
      {
        headerName: "CITY",
        field: "city",
        width: 130,
        cellRenderer: (params: any) => (
          <span className="text-slate-700 dark:text-slate-300 font-medium">{params.value}</span>
        )
      },
      {
        headerName: "STATE",
        field: "state",
        width: 130,
        cellRenderer: (params: any) => (
          <span className="text-slate-600 dark:text-slate-400">{params.value}</span>
        )
      },
      {
        headerName: "ACTIONS",
        field: "id",
        width: 120,
        pinned: "right",
        cellRenderer: (params: any) => {
          const item = params.data as PoiItem;
          return (
            <div className="flex items-center gap-1.5 h-full">
              <button
                type="button"
                onClick={() => navigate(`/poi/new?edit=${item.id}`)}
                className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Edit POI"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item.id, item.name)}
                className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Delete POI"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        }
      }
    ];
  }, [navigate]);

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "POI Module", href: "/poi" },
          { label: "POI Overview" }
        ]}
        title="Points of Interest Directory"
        description="Company, branch, location, and address information is organized for an operational Excel-ready overview."
      />

      <PoiFilterBar
        search={searchTerm}
        onSearchChange={setSearchTerm}
        company={selectedCompany}
        onCompanyChange={setSelectedCompany}
        branch={selectedBranch}
        onBranchChange={setSelectedBranch}
        category={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onRefresh={() => refetch()}
        onExport={handleExportExcel}
        onCreateNew={() => navigate("/poi/new")}
        createLabel="Add POI"
        isRefreshing={isFetching}
      />

      {/* Main Data Table */}
      <div className="panel-card p-4 sm:p-5 overflow-hidden">
        <AppDataTable
          rowData={data?.items || []}
          columnDefs={columnDefs}
          isLoading={isLoading}
          total={data?.total || 0}
          page={page}
          pageSize={pageSize}
          totalPages={Math.ceil((data?.total || 1) / pageSize)}
          onPageChange={setPage}
          height="520px"
        />
        <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Showing 1-{data?.items.length || 0} of {data?.total || 0} configured places. All POI fields are included in the Excel export.</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">Excel / CSV Ready</span>
        </div>
      </div>
    </div>
  );
};

export default PoiOverviewPage;
