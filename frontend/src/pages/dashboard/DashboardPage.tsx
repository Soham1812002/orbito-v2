import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  SlidersHorizontal,
  RefreshCw,
  List,
  Layers,
  Radio,
  Clock,
  Sparkles,
  Bell,
  Search,
  Filter,
  Car
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { MAP_CONFIG } from "@/config/map.config";
import { useVehicles, useSendImmobilizerCommand, useCreateShareLink } from "@/pages/vehicles/vehicles.queries";
import { VehicleTelemetry } from "@/pages/vehicles/vehicles.types";
import { LiveMapCanvas } from "@/pages/vehicles/components/LiveMapCanvas";
import { VehicleTelemetryDrawer } from "@/pages/vehicles/components/VehicleTelemetryDrawer";
import { LiveVehicleSwitcher } from "@/pages/vehicles/components/LiveVehicleSwitcher";
import { ImmobilizeModal } from "@/pages/vehicles/components/ImmobilizeModal";
import { ShareTrackingModal } from "@/pages/vehicles/components/ShareTrackingModal";
import { LiveTrackingSettingsModal } from "@/pages/vehicles/components/LiveTrackingSettingsModal";
import { RecentAlertsDrawer } from "@/pages/vehicles/components/RecentAlertsDrawer";
import { VehicleRemindersDrawer } from "@/pages/vehicles/components/VehicleRemindersDrawer";
import { QuickReportsDrawer } from "@/pages/vehicles/components/QuickReportsDrawer";

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Selected vehicle & drawer states
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | undefined>(undefined);
  const [isTelemetryDrawerOpen, setIsTelemetryDrawerOpen] = useState(false);
  const [isAlertsFeedOpen, setIsAlertsFeedOpen] = useState(false);
  const [isRemindersDrawerOpen, setIsRemindersDrawerOpen] = useState(false);
  const [isReportsDrawerOpen, setIsReportsDrawerOpen] = useState(false);

  // Status chip filter: all | moving | idling | stopped | inactive
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [companyFilter, setCompanyFilter] = useState<string>("all");

  // Map settings state
  const [mapStyle, setMapStyle] = useState(MAP_CONFIG.styles.dark);
  const [showGeofences, setShowGeofences] = useState(true);
  const [showTraffic, setShowTraffic] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Modal target states
  const [immobilizeTarget, setImmobilizeTarget] = useState<VehicleTelemetry | null>(null);
  const [shareTarget, setShareTarget] = useState<VehicleTelemetry | null>(null);

  // Telematics Query (polls every refreshInterval ms)
  const { data: allVehicles = [], refetch, isFetching } = useVehicles(undefined, refreshInterval);
  const immobilizerMutation = useSendImmobilizerCommand();
  const shareLinkMutation = useCreateShareLink();

  // Calculate fleet status counts matching Figma
  const totalCount = allVehicles.length;
  const runningCount = allVehicles.filter((v) => v.status === "moving").length;
  const idleCount = allVehicles.filter((v) => v.status === "idling").length;
  const stoppedCount = allVehicles.filter((v) => v.status === "stopped").length;
  const inactiveCount = allVehicles.filter((v) => v.status === "inactive").length;

  // Filter vehicles according to active chip, company, and search query
  const filteredVehicles = useMemo(() => {
    return allVehicles.filter((v) => {
      if (statusFilter !== "all" && v.status !== statusFilter) return false;
      if (companyFilter !== "all" && v.companyName !== companyFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchPlate = v.plateNumber.toLowerCase().includes(q);
        const matchDriver = v.driver.name.toLowerCase().includes(q);
        const matchLocation = v.lastLocation.toLowerCase().includes(q);
        if (!matchPlate && !matchDriver && !matchLocation) return false;
      }
      return true;
    });
  }, [allVehicles, statusFilter, companyFilter, searchQuery]);

  const selectedVehicle = allVehicles.find((v) => v.id === selectedVehicleId) || null;

  const handleSelectVehicle = (vehicle: VehicleTelemetry) => {
    setSelectedVehicleId(vehicle.id);
    setIsTelemetryDrawerOpen(true);
    setIsAlertsFeedOpen(false);
    setIsRemindersDrawerOpen(false);
    setIsReportsDrawerOpen(false);
  };

  const handleCloseAllDrawers = () => {
    setIsTelemetryDrawerOpen(false);
    setIsAlertsFeedOpen(false);
    setIsRemindersDrawerOpen(false);
    setIsReportsDrawerOpen(false);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Dashboard" }
        ]}
        title="Fleet Telematics Live Dashboard"
        badge="60 FPS GPU ENGINE"
        badgeVariant="cyan"
        description="Real-time multi-asset vector map tracking commercial fleet units across Indian logistics corridors."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                handleCloseAllDrawers();
                setIsAlertsFeedOpen(!isAlertsFeedOpen);
              }}
              className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors hover:bg-rose-100"
              title="Recent Alerts Feed"
            >
              <Bell className="h-3.5 w-3.5" />
              <span>Live Alerts</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            </button>

            <Button
              variant="outline"
              size="sm"
              leftIcon={<SlidersHorizontal className="h-3.5 w-3.5" />}
              onClick={() => setIsSettingsOpen(true)}
            >
              Layers
            </Button>

            <Button
              variant="outline"
              size="sm"
              leftIcon={<List className="h-3.5 w-3.5" />}
              onClick={() => navigate("/vehicles")}
            >
              Vehicle Directory
            </Button>

            <Button
              variant="outline"
              size="sm"
              leftIcon={<Clock className="h-3.5 w-3.5" />}
              onClick={() => navigate("/playback")}
            >
              Route Playback
            </Button>
          </div>
        }
      />

      {/* Top Fleet Status Chips & Filter Toolbar (Matching Figma Node 3024:204) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        {/* Status Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              statusFilter === "all"
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-sm"
                : "bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100"
            }`}
          >
            <span>TOTAL</span>
            <span className="px-1.5 py-0.2 rounded-md bg-white/20 dark:bg-black/20 text-[11px] font-mono font-black">
              {totalCount}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter("moving")}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              statusFilter === "moving"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>RUNNING</span>
            <span className="px-1.5 py-0.2 rounded-md bg-white/20 dark:bg-black/20 text-[11px] font-mono font-black">
              {runningCount}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter("idling")}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              statusFilter === "idling"
                ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>IDLE</span>
            <span className="px-1.5 py-0.2 rounded-md bg-white/20 dark:bg-black/20 text-[11px] font-mono font-black">
              {idleCount}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter("stopped")}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              statusFilter === "stopped"
                ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/20"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span>STOP</span>
            <span className="px-1.5 py-0.2 rounded-md bg-white/20 dark:bg-black/20 text-[11px] font-mono font-black">
              {stoppedCount}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter("inactive")}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              statusFilter === "inactive"
                ? "bg-slate-600 text-white border-slate-600 shadow-sm"
                : "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/30 hover:bg-slate-500/20"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-slate-400" />
            <span>INACTIVE</span>
            <span className="px-1.5 py-0.2 rounded-md bg-white/20 dark:bg-black/20 text-[11px] font-mono font-black">
              {inactiveCount}
            </span>
          </button>
        </div>

        {/* Quick Search & Company Selector */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-56">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search vehicle, driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 pl-8 pr-3 py-1.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Companies</option>
            <option value="inOrbit Logistics">inOrbit Logistics</option>
            <option value="Metro Transport">Metro Transport</option>
          </select>
        </div>
      </div>

      {/* Main Map Workspace Canvas */}
      <div className="relative w-full h-[calc(100vh-270px)] min-h-[550px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-950">
        <LiveMapCanvas
          vehicles={filteredVehicles}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={handleSelectVehicle}
          styleUrl={mapStyle}
          showGeofences={showGeofences}
          showTraffic={showTraffic}
        />

        {/* Bottom Collapsible Vehicle Switcher */}
        <LiveVehicleSwitcher
          vehicles={filteredVehicles}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={handleSelectVehicle}
        />

        {/* Right Collapsible Telemetry Details Drawer */}
        <VehicleTelemetryDrawer
          vehicle={selectedVehicle}
          isOpen={isTelemetryDrawerOpen && Boolean(selectedVehicle)}
          onClose={() => setIsTelemetryDrawerOpen(false)}
          onImmobilize={(veh) => setImmobilizeTarget(veh)}
          onShare={(veh) => setShareTarget(veh)}
          onPlayback={(id) => navigate(`/playback?vehicleId=${id}`)}
          onOpenReminders={() => {
            setIsTelemetryDrawerOpen(false);
            setIsRemindersDrawerOpen(true);
          }}
          onOpenReports={() => {
            setIsTelemetryDrawerOpen(false);
            setIsReportsDrawerOpen(true);
          }}
        />

        {/* Recent Alerts Feed Drawer */}
        <RecentAlertsDrawer
          isOpen={isAlertsFeedOpen}
          onClose={() => setIsAlertsFeedOpen(false)}
          onSelectVehicle={(vehId) => {
            const v = allVehicles.find((veh) => veh.id === vehId);
            if (v) handleSelectVehicle(v);
          }}
        />

        {/* Contextual Vehicle Reminders Drawer */}
        <VehicleRemindersDrawer
          vehicle={selectedVehicle}
          isOpen={isRemindersDrawerOpen && Boolean(selectedVehicle)}
          onClose={() => setIsRemindersDrawerOpen(false)}
        />

        {/* Contextual Quick Reports Drawer */}
        <QuickReportsDrawer
          vehicle={selectedVehicle}
          isOpen={isReportsDrawerOpen && Boolean(selectedVehicle)}
          onClose={() => setIsReportsDrawerOpen(false)}
        />
      </div>

      {/* Settings Modal */}
      <LiveTrackingSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedStyle={mapStyle}
        onSelectStyle={setMapStyle}
        showGeofences={showGeofences}
        onToggleGeofences={setShowGeofences}
        showTraffic={showTraffic}
        onToggleTraffic={setShowTraffic}
        refreshInterval={refreshInterval}
        onChangeRefreshInterval={setRefreshInterval}
      />

      {/* Remote Immobilizer Modal */}
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

      {/* Share Tracking Link Modal */}
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

export default DashboardPage;
