import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Compass,
  CheckCircle2,
  Clock,
  MapPin,
  Route as RouteIcon
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { AppDataTable } from "@/components/common/AppDataTable";
import { TableFilterBar } from "@/components/common/TableFilterBar";
import { Modal } from "@/components/common/Modal";
import { useRoutePaths, useDeleteRoutePath } from "./routes.queries";
import { getRoutePathColumns } from "./routes.columns";
import { RoutePath } from "./routes.types";

export const RoutePathListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<RoutePath | null>(null);

  const { data, isLoading, refetch, isFetching } = useRoutePaths({
    search: search || undefined,
    isActive: statusFilter === "all" ? undefined : statusFilter
  });

  const deleteMutation = useDeleteRoutePath();

  const routes = data?.rows || [];

  // Metrics
  const metrics = useMemo(() => {
    const total = routes.length;
    const active = routes.filter((r) => r.isActive).length;
    const totalMins = routes.reduce((acc, r) => acc + (r.estimatedDurationMins || 0), 0);
    const avgDurationHours = total > 0 ? (totalMins / total / 60).toFixed(1) : "0";
    const totalWaypoints = routes.reduce((acc, r) => acc + (r.waypoints?.length || 0), 0);
    return { total, active, avgDurationHours, totalWaypoints };
  }, [routes]);

  const handleExportCsv = () => {
    if (routes.length === 0) return;
    const headers = [
      "Route Code",
      "Route Name",
      "Origin",
      "Destination",
      "Distance (km)",
      "Duration (mins)",
      "Speed Cap (km/h)",
      "Status"
    ];
    const csvRows = routes.map((r) => [
      `"${r.routeCode}"`,
      `"${r.routeName}"`,
      `"${r.originName}"`,
      `"${r.destinationName}"`,
      r.distanceKm,
      r.estimatedDurationMins,
      r.maxAllowedSpeed,
      r.isActive ? "Active" : "Archived"
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...csvRows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `route_corridors_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = useMemo(
    () =>
      getRoutePathColumns({
        onView: (route) => navigate(`/operations/routes/${route.id}/edit`),
        onEdit: (route) => navigate(`/operations/routes/${route.id}/edit`),
        onDelete: (route) => setDeleteTarget(route)
      }),
    [navigate]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Route Paths & Corridors"
        description="Define master transit corridors, waypoints, geofence corridors, and road speed caps"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Operations", href: "/operations/routes" },
          { label: "Route Corridors" }
        ]}
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="panel-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Corridors</p>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
              {metrics.total}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Compass className="w-5 h-5" />
          </div>
        </div>

        <div className="panel-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Corridors</p>
            <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
              {metrics.active}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="panel-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Avg Transit Time</p>
            <p className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
              {metrics.avgDurationHours} <span className="text-sm font-normal text-slate-500">hrs</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="panel-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Waypoints</p>
            <p className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
              {metrics.totalWaypoints}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <MapPin className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Standard TableFilterBar */}
      <TableFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by code, corridor name, origin or destination..."
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={[
          { label: "All Statuses", value: "all" },
          { label: "Active Only", value: "true" },
          { label: "Archived", value: "false" }
        ]}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        onExport={handleExportCsv}
        exportLabel="Export CSV"
        onCreateNew={() => navigate("/operations/routes/new")}
        createLabel="Add Route Path"
      />

      {/* Main Table Card with Standard Panel-Card Padding */}
      <div className="panel-card p-4 sm:p-5 overflow-hidden">
        <AppDataTable
          rowData={routes}
          columnDefs={columns}
          isLoading={isLoading}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <Modal
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          title="Delete Route Corridor"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to delete corridor{" "}
              <strong className="text-slate-900 dark:text-white font-mono">
                {deleteTarget.routeCode}
              </strong>{" "}
              ({deleteTarget.routeName})? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                isLoading={deleteMutation.isPending}
                onClick={() => {
                  deleteMutation.mutate(deleteTarget.id, {
                    onSuccess: () => setDeleteTarget(null)
                  });
                }}
              >
                Delete Corridor
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RoutePathListPage;
