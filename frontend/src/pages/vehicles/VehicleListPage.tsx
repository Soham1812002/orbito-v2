import React, { useState, useMemo } from "react";
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
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<VehicleCategory | "all">("all");

  // Modals state
  const [immobilizeTarget, setImmobilizeTarget] = useState<VehicleTelemetry | null>(null);
  const [shareTarget, setShareTarget] = useState<VehicleTelemetry | null>(null);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  const { data: vehicles = [], isLoading, refetch, isFetching } = useVehicles({
    search,
    status: statusFilter,
    category: categoryFilter
  });

  const { data: stats } = useFleetStats();
  const immobilizerMutation = useSendImmobilizerCommand();
  const shareLinkMutation = useCreateShareLink();

  const handleExportCsv = async () => {
    await vehiclesApi.exportVehicles({
      search,
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
        minWidth: 200,
        flex: 1.3,
        cellRenderer: (params: any) => {
          const v: VehicleTelemetry = params.data;
          if (!v) return null;
          return (
            <div className="h-full flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold">
                <Car className="h-4 w-4" />
              </div>
              <TwoLineCell
                primary={<span className="font-mono font-bold">{v.plateNumber}</span>}
                secondary={v.makeModel}
              />
            </div>
          );
        }
      },
      {
        headerName: "Status",
        field: "status",
        minWidth: 120,
        cellRenderer: (params: any) => {
          const v: VehicleTelemetry = params.data;
          if (!v) return null;
          return statusBadge(v.status);
        }
      },
      {
        headerName: "Speed",
        field: "speed",
        minWidth: 110,
        cellRenderer: (params: any) => (
          <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
            {params.value} km/h
          </span>
        )
      },
      {
        headerName: "Driver Details",
        field: "driver",
        minWidth: 160,
        cellRenderer: (params: any) => {
          const v: VehicleTelemetry = params.data;
          if (!v) return null;
          return (
            <TwoLineCell
              primary={v.driver.name}
              secondary={<span className="font-mono">{v.driver.phone}</span>}
            />
          );
        }
      },
      {
        headerName: "Fuel & Battery",
        field: "fuelPercent",
        minWidth: 140,
        cellRenderer: (params: any) => {
          const v: VehicleTelemetry = params.data;
          if (!v) return null;
          return (
            <div className="space-y-1 w-24">
              <div className="flex items-center justify-between text-2xs text-slate-500">
                <span>Fuel {v.fuelPercent}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${v.fuelPercent}%` }}
                />
              </div>
            </div>
          );
        }
      },
      {
        headerName: "Today Dist",
        field: "todayDistance",
        minWidth: 110,
        cellRenderer: (params: any) => (
          <span className="font-mono font-semibold text-xs text-slate-700 dark:text-slate-300">
            {params.value} km
          </span>
        )
      },
      {
        headerName: "Current Location",
        field: "lastLocation",
        minWidth: 180,
        flex: 1.2,
        cellRenderer: (params: any) => (
          <span className="text-2xs text-slate-500 truncate block">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Actions",
        field: "id",
        minWidth: 160,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => {
          const v: VehicleTelemetry = params.data;
          if (!v) return null;
          return (
            <div className="flex items-center gap-1 py-1">
              <button
                type="button"
                onClick={() => navigate(`/live-tracking?vehicleId=${v.id}`)}
                title="Track on Map"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
              >
                <Navigation className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate(`/playback?vehicleId=${v.id}`)}
                title="Route Replay"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Clock className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setImmobilizeTarget(v)}
                title="Immobilizer Relay"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
              >
                <ShieldAlert className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setShareTarget(v)}
                title="Share Link"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Share2 className="h-4 w-4" />
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
          { label: "Dashboard", href: "/dashboard" },
          { label: "Fleet Vehicles" }
        ]}
        title="Vehicle Assets Directory"
        description="Monitor, audit, and dispatch commands to 25 connected logistics assets across Indian corridors."
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
            {(stats?.stopped ?? 0) + (stats?.inactive ?? 0)}
          </p>
          <p className="text-[11px] text-rose-600/70 dark:text-rose-400/70 mt-0.5">Depot parked & maintenance</p>
        </div>
      </div>

      {/* Standard TableFilterBar */}
      <TableFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by registration plate, driver, or operator..."
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
          rowData={vehicles}
          columnDefs={columns}
          isLoading={isLoading}
          total={vehicles.length}
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
