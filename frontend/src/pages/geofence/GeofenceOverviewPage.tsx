import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ColDef } from "ag-grid-community";
import { Map, Edit2, Trash2, Gauge, AlertTriangle, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppDataTable } from "@/components/common/AppDataTable";
import { GeofenceFilterBar } from "./components/GeofenceFilterBar";
import { useGeofenceList, useDeleteGeofence } from "@/queries/geofence.queries";
import { GeofenceItem } from "@/types/geofence.types";
import { showToast } from "@/lib/toast";

export const GeofenceOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, refetch, isFetching } = useGeofenceList({
    search: searchTerm,
    type: selectedType,
    category: selectedCategory
  });

  const deleteMutation = useDeleteGeofence();

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete Geofence "${name}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
        showToast.success(`Geofence "${name}" deleted successfully`);
      } catch {
        showToast.error("Failed to delete Geofence");
      }
    }
  };

  const handleExportExcel = () => {
    if (!data?.items || data.items.length === 0) {
      showToast.error("No data available to export");
      return;
    }

    try {
      const headers = ["Company", "Branch", "Geofence Name", "Type", "Category", "Radius (m)", "Speed Limit (km/h)", "Assigned Vehicles", "Alert on Enter", "Alert on Exit", "Status"];
      const rows = data.items.map((g) => [
        `"${g.company}"`,
        `"${g.branch}"`,
        `"${g.name}"`,
        `"${g.type}"`,
        `"${g.category}"`,
        g.radiusMeters || "Polygon",
        g.speedLimitKmh || "None",
        g.assignedVehiclesCount,
        g.alertOnEnter ? "Yes" : "No",
        g.alertOnExit ? "Yes" : "No",
        g.isActive ? "Active" : "Inactive"
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `geofence_directory_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast.success("Geofence Directory exported successfully!");
    } catch {
      showToast.error("Failed to export Geofence data");
    }
  };

  const columnDefs = useMemo<ColDef<GeofenceItem>[]>(() => {
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
        headerName: "GEOFENCE NAME",
        field: "name",
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
        width: 130,
        cellRenderer: (params: any) => {
          const isPolygon = params.value === "polygon";
          return (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                isPolygon
                  ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800"
                  : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800"
              }`}
            >
              {params.value}
            </span>
          );
        }
      },
      {
        headerName: "CATEGORY",
        field: "category",
        width: 145,
        cellRenderer: (params: any) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {params.value}
          </span>
        )
      },
      {
        headerName: "RADIUS / BOUNDARY",
        field: "radiusMeters",
        width: 165,
        cellRenderer: (params: any) => {
          const item = params.data as GeofenceItem;
          if (item.type === "circular") {
            return (
              <span className="font-mono text-xs text-slate-700 dark:text-slate-300 font-medium">
                {item.radiusMeters}m radius
              </span>
            );
          }
          return (
            <span className="font-mono text-xs text-purple-600 dark:text-purple-400 font-medium">
              {item.coordinates?.length || 4} Vertices
            </span>
          );
        }
      },
      {
        headerName: "SPEED LIMIT",
        field: "speedLimitKmh",
        width: 140,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-1.5 font-mono text-xs text-slate-700 dark:text-slate-300">
            <Gauge className="h-3.5 w-3.5 text-slate-400" />
            <span>{params.value ? `${params.value} km/h` : "Unlimited"}</span>
          </div>
        )
      },
      {
        headerName: "ASSIGNED VEHICLES",
        field: "assignedVehiclesCount",
        width: 160,
        headerClass: "ag-right-aligned-header",
        cellClass: "ag-right-aligned-cell",
        cellRenderer: (params: any) => (
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {params.value} Vehicles
          </span>
        )
      },
      {
        headerName: "ACTIONS",
        field: "id",
        width: 110,
        pinned: "right",
        cellRenderer: (params: any) => {
          const item = params.data as GeofenceItem;
          return (
            <div className="flex items-center gap-1.5 h-full">
              <button
                type="button"
                onClick={() => navigate(`/geofence/new?edit=${item.id}`)}
                className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Edit Geofence"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item.id, item.name)}
                className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Delete Geofence"
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
          { label: "Geofence Module", href: "/geofence" },
          { label: "Geofence Directory" }
        ]}
        title="Geofence Boundary Directory"
        badge={`${data?.total || 0} BOUNDARIES`}
        badgeVariant="cyan"
        description="Monitor and configure active boundary zones, speed limits, vehicle assignments, and alert triggers."
      />

      <GeofenceFilterBar
        search={searchTerm}
        onSearchChange={setSearchTerm}
        type={selectedType}
        onTypeChange={setSelectedType}
        category={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onRefresh={() => refetch()}
        onExport={handleExportExcel}
        onCreateNew={() => navigate("/geofence/new")}
        createLabel="Create Geofence"
        isRefreshing={isFetching}
      />

      <div className="panel-card overflow-hidden">
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
          <span>Showing 1-{data?.items.length || 0} of {data?.total || 0} geofence boundaries. All fields are included in the Excel export.</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">Excel / CSV Ready</span>
        </div>
      </div>
    </div>
  );
};

export default GeofenceOverviewPage;
