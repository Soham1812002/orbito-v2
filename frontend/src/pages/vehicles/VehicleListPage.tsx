import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ColDef } from "ag-grid-community";
import {
  Car,
  Navigation,
  Clock,
  ShieldAlert,
  Share2,
  Search,
  Filter,
  Download,
  Plus,
  RefreshCw,
  Phone,
  Fuel,
  Battery,
  MoreVertical,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { AppDataTable, TwoLineCell } from "@/components/common/AppDataTable";
import { TableFilterBar } from "@/components/common/TableFilterBar";
import { Select } from "@/components/common/Select";
import { useVehicles, useFleetStats, useSendImmobilizerCommand, useCreateShareLink } from "./vehicles.queries";
import { VehicleTelemetry, VehicleStatus, VehicleCategory } from "./vehicles.types";
import { vehiclesApi } from "./vehicles.api";
import { ImmobilizeModal } from "./components/ImmobilizeModal";
import { ShareTrackingModal } from "./components/ShareTrackingModal";

export const VehicleListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<VehicleCategory | "all">("all");

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset to page 1 when any filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, categoryFilter]);

  // Modals state
  const [immobilizeTarget, setImmobilizeTarget] = useState<VehicleTelemetry | null>(null);
  const [shareTarget, setShareTarget] = useState<VehicleTelemetry | null>(null);

  const { data: vehicles = [], isLoading, refetch, isFetching } = useVehicles({
    search: debouncedSearch,
    status: statusFilter,
    category: categoryFilter
  });

  const total = vehicles.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paginatedVehicles = useMemo(() => {
    const start = (page - 1) * pageSize;
    return vehicles.slice(start, start + pageSize);
  }, [vehicles, page, pageSize]);

  const { data: stats } = useFleetStats();
  const immobilizerMutation = useSendImmobilizerCommand();
  const shareLinkMutation = useCreateShareLink();

  const handleExportCsv = async () => {
    await vehiclesApi.exportVehicles({
      search: debouncedSearch,
      status: statusFilter,
      category: categoryFilter
    });
  };

  const statusBadge = (status: VehicleStatus) => {
    const map = {
      moving: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      idling: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      stopped: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
      inactive: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30"
    };
    return (
      <span className={`px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-full border ${map[status]}`}>
        {status}
      </span>
    );
  };

  const columns = useMemo<ColDef<VehicleTelemetry>[]>(
    () => [
      {
        headerName: "Vehicle / Model",
        field: "plateNumber",
        minWidth: 165,
        flex: 1.2,
        cellRenderer: (params: any) => {
          const v: VehicleTelemetry = params.data;
          if (!v) return null;
          return (
            <div className="h-full flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold">
                <Car className="h-4 w-4" />
              </div>
              <TwoLineCell
                primary={
                  <button
                    type="button"
                    onClick={() => navigate(`/live-tracking?vehicleId=${v.id}`)}
                    className="font-mono font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    title="Open in Live Tracking"
                  >
                    {v.plateNumber}
                  </button>
                }
                secondary={v.makeModel}
              />
            </div>
          );
        }
      },
      {
        headerName: "Status",
        field: "status",
        minWidth: 95,
        flex: 0.7,
        cellRenderer: (params: any) => {
          const v: VehicleTelemetry = params.data;
          if (!v) return null;
          return statusBadge(v.status);
        }
      },
      {
        headerName: "Speed",
        field: "speed",
        minWidth: 80,
        flex: 0.6,
        cellRenderer: (params: any) => (
          <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
            {params.value} km/h
          </span>
        )
      },
      {
        headerName: "Driver",
        field: "driver",
        minWidth: 130,
        flex: 1.0,
        cellRenderer: (params: any) => {
          const v: VehicleTelemetry = params.data;
          if (!v) return null;
          return (
            <TwoLineCell
              primary={v.driver?.name || "Unassigned"}
              secondary={<span className="font-mono">{v.driver?.phone || "No Phone"}</span>}
            />
          );
        }
      },
      {
        headerName: "Fuel / Battery",
        field: "fuelPercent",
        minWidth: 110,
        flex: 0.8,
        cellRenderer: (params: any) => {
          const v: VehicleTelemetry = params.data;
          if (!v) return null;
          const isEv = v.category === "electric_cargo";
          const percent = isEv ? (v.batteryPercent ?? 100) : (v.fuelPercent ?? 0);
          const label = isEv ? "Battery" : "Fuel";
          const barColor = isEv ? "bg-emerald-500" : "bg-blue-600";
          return (
            <div className="space-y-1 w-20">
              <div className="flex items-center justify-between text-2xs text-slate-500 font-medium">
                <span>{label} {percent}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${barColor} rounded-full`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        }
      },
      {
        headerName: "Distance",
        field: "todayDistance",
        minWidth: 85,
        flex: 0.6,
        cellRenderer: (params: any) => (
          <span className="font-mono font-semibold text-xs text-slate-700 dark:text-slate-300">
            {params.value} km
          </span>
        )
      },
      {
        headerName: "Location",
        field: "lastLocation",
        minWidth: 150,
        flex: 1.2,
        cellRenderer: (params: any) => (
          <span className="text-2xs text-slate-500 truncate block" title={params.value}>
            {params.value}
          </span>
        )
      },
      {
        headerName: "Actions",
        field: "id",
        minWidth: 125,
        flex: 0.9,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => {
          const v: VehicleTelemetry = params.data;
          if (!v) return null;
          return (
            <div className="flex items-center gap-1.5 py-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/live-tracking?vehicleId=${v.id}`);
                }}
                title="Live Map Tracking"
                className="p-1 rounded-md text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer"
              >
                <Navigation className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/playback?vehicleId=${v.id}`);
                }}
                title="Route Playback"
                className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Clock className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShareTarget(v);
                }}
                title="Share Tracking Link"
                className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setImmobilizeTarget(v);
                }}
                title="Immobilizer Relay (Engine Cut-off)"
                className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
              >
                <ShieldAlert className="h-4 w-4" />
              </button>
            </div>
          );
        }
      }
    ],
    [navigate]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Vehicles", href: "/vehicles" },
          { label: "Vehicle Directory" }
        ]}
        title="Vehicle Assets Directory"
        description={`Monitor, audit, and dispatch commands to ${stats?.totalAssets ?? vehicles.length} connected logistics assets across Indian corridors.`}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Navigation className="h-3.5 w-3.5" />}
            onClick={() => navigate("/live-tracking")}
          >
            Live Map View
          </Button>
        }
      />

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Fleet Assets</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats?.totalAssets ?? vehicles.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">100% telemetry connected</p>
        </div>

        <div className="rounded-2xl border border-emerald-200/60 dark:border-emerald-950 bg-emerald-50/30 dark:bg-emerald-950/20 p-4 shadow-sm">
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase">On Trip / Moving</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {stats?.moving ?? vehicles.filter((v) => v.status === "moving").length}
          </p>
          <p className="text-[11px] text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">Active transit on NH corridors</p>
        </div>

        <div className="rounded-2xl border border-amber-200/60 dark:border-amber-950 bg-amber-50/30 dark:bg-amber-950/20 p-4 shadow-sm">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase">Idling / Rest Area</p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {stats?.idling ?? vehicles.filter((v) => v.status === "idling").length}
          </p>
          <p className="text-[11px] text-amber-600/70 dark:text-amber-400/70 mt-0.5">Ignition ON with 0 km/h</p>
        </div>

        <div className="rounded-2xl border border-rose-200/60 dark:border-rose-950 bg-rose-50/30 dark:bg-rose-950/20 p-4 shadow-sm">
          <p className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase">Stopped & Inactive</p>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {stats
              ? stats.stopped + stats.inactive
              : vehicles.filter((v) => v.status === "stopped" || v.status === "inactive").length}
          </p>
          <p className="text-[11px] text-rose-600/70 dark:text-rose-400/70 mt-0.5">Depot parked & maintenance</p>
        </div>
      </div>

      {/* Standard TableFilterBar */}
      <TableFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search plate, driver, or operator..."
        searchWidthClassName="sm:w-80 lg:w-96"
        statusFilter={statusFilter}
        onStatusFilterChange={(v) => setStatusFilter(v as VehicleStatus | "all")}
        statusOptions={[
          { label: "All Status", value: "all" },
          { label: "Moving", value: "moving" },
          { label: "Idling", value: "idling" },
          { label: "Stopped", value: "stopped" },
          { label: "Inactive", value: "inactive" }
        ]}
        filters={
          <div className="w-full sm:w-44">
            <Select
              sizeVariant="sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
            >
              <option value="all">All Vehicle Types</option>
              <option value="heavy_truck">Heavy Trucks</option>
              <option value="delivery_van">Delivery Vans</option>
              <option value="container_carrier">Container Carriers</option>
              <option value="tanker">Liquid Tankers</option>
              <option value="electric_cargo">Electric Cargo</option>
            </Select>
          </div>
        }
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        onExport={handleExportCsv}
        exportLabel="Export CSV"
      />

      {/* Directory Table using standard AppDataTable */}
      <div className="panel-card p-4 sm:p-5 overflow-hidden">
        <AppDataTable<VehicleTelemetry>
          rowData={paginatedVehicles}
          columnDefs={columns}
          isLoading={isLoading}
          isFetching={isFetching}
          total={total}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(1);
          }}
        />
      </div>

      {/* Modals */}
      <ImmobilizeModal
        isOpen={Boolean(immobilizeTarget)}
        onClose={() => setImmobilizeTarget(null)}
        vehicle={immobilizeTarget}
        isSubmitting={immobilizerMutation.isPending}
        onConfirm={async (cmd) => {
          if (immobilizeTarget) {
            await immobilizerMutation.mutateAsync({
              vehicleId: immobilizeTarget.id,
              action: cmd.action,
              pin: cmd.pin,
              reason: cmd.reason
            });
          }
        }}
      />

      <ShareTrackingModal
        isOpen={Boolean(shareTarget)}
        onClose={() => setShareTarget(null)}
        vehicle={shareTarget}
        onGenerateLink={async (cfg) => {
          return await shareLinkMutation.mutateAsync({
            vehicleId: shareTarget!.id,
            ...cfg
          });
        }}
      />
    </div>
  );
};
export default VehicleListPage;
