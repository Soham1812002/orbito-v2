import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  SlidersHorizontal,
  RefreshCw,
  List,
  Layers,
  Radio,
  Clock,
  Sparkles,
  Bell
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { MAP_CONFIG } from "@/config/map.config";
import { useVehicles, useSendImmobilizerCommand, useCreateShareLink } from "./vehicles.queries";
import { VehicleTelemetry } from "./vehicles.types";
import { LiveMapCanvas } from "./components/LiveMapCanvas";
import { VehicleTelemetryDrawer } from "./components/VehicleTelemetryDrawer";
import { LiveVehicleSwitcher } from "./components/LiveVehicleSwitcher";
import { ImmobilizeModal } from "./components/ImmobilizeModal";
import { ShareTrackingModal } from "./components/ShareTrackingModal";
import { LiveTrackingSettingsModal } from "./components/LiveTrackingSettingsModal";
import { RecentAlertsDrawer } from "./components/RecentAlertsDrawer";
import { VehicleRemindersDrawer } from "./components/VehicleRemindersDrawer";
import { QuickReportsDrawer } from "./components/QuickReportsDrawer";

export const LiveTrackingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const urlVehicleId = searchParams.get("vehicleId") || undefined;

  const [selectedVehicleId, setSelectedVehicleId] = useState<string | undefined>(urlVehicleId);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAlertsFeedOpen, setIsAlertsFeedOpen] = useState(false);
  const [isRemindersDrawerOpen, setIsRemindersDrawerOpen] = useState(false);
  const [isReportsDrawerOpen, setIsReportsDrawerOpen] = useState(false);

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
  const { data: vehicles = [], refetch, isFetching } = useVehicles(undefined, refreshInterval);
  const immobilizerMutation = useSendImmobilizerCommand();
  const shareLinkMutation = useCreateShareLink();

  // Sync selected vehicle with URL query param
  useEffect(() => {
    if (urlVehicleId) {
      setSelectedVehicleId(urlVehicleId);
      setIsDrawerOpen(true);
    }
  }, [urlVehicleId]);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || null;

  const handleSelectVehicle = (vehicle: VehicleTelemetry) => {
    setSelectedVehicleId(vehicle.id);
    setIsDrawerOpen(true);
    setSearchParams({ vehicleId: vehicle.id });
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Vehicles", href: "/vehicles" },
          { label: "Live Tracking" }
        ]}
        title="Live Fleet Telematics"
        description="High-frequency 60 FPS GPU vector map tracking 25 commercial logistics assets across India."
        actions={
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live {refreshInterval / 1000}s</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              leftIcon={<Bell className="h-3.5 w-3.5 text-amber-500" />}
              onClick={() => setIsAlertsFeedOpen(true)}
            >
              Alerts
            </Button>

            <Button
              variant="outline"
              size="sm"
              leftIcon={<SlidersHorizontal className="h-3.5 w-3.5" />}
              onClick={() => setIsSettingsOpen(true)}
            >
              Map Layers
            </Button>

            <Button
              variant="outline"
              size="sm"
              leftIcon={<List className="h-3.5 w-3.5" />}
              onClick={() => navigate("/vehicles")}
            >
              Directory
            </Button>
          </div>
        }
      />

      {/* Main Map Workspace Canvas */}
      <div className="relative w-full h-[calc(100vh-210px)] min-h-[550px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-950">
        <LiveMapCanvas
          vehicles={vehicles}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={handleSelectVehicle}
          styleUrl={mapStyle}
          showGeofences={showGeofences}
          showTraffic={showTraffic}
        />

        {/* Bottom Collapsible Vehicle Switcher */}
        <LiveVehicleSwitcher
          vehicles={vehicles}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={handleSelectVehicle}
        />

        {/* Right Collapsible Telemetry Drawer */}
        <VehicleTelemetryDrawer
          vehicle={selectedVehicle}
          isOpen={isDrawerOpen && Boolean(selectedVehicle)}
          onClose={handleCloseDrawer}
          onImmobilize={(veh) => setImmobilizeTarget(veh)}
          onShare={(veh) => setShareTarget(veh)}
          onPlayback={(id) => navigate(`/playback?vehicleId=${id}`)}
          onOpenReminders={() => setIsRemindersDrawerOpen(true)}
          onOpenReports={() => setIsReportsDrawerOpen(true)}
        />

        {/* In-Map Slide-over Contextual Drawers */}
        <RecentAlertsDrawer
          isOpen={isAlertsFeedOpen}
          onClose={() => setIsAlertsFeedOpen(false)}
          onSelectVehicle={(vehId) => {
            setSelectedVehicleId(vehId);
            setIsAlertsFeedOpen(false);
            setIsDrawerOpen(true);
          }}
        />

        <VehicleRemindersDrawer
          isOpen={isRemindersDrawerOpen}
          vehicle={selectedVehicle}
          onClose={() => setIsRemindersDrawerOpen(false)}
        />

        <QuickReportsDrawer
          isOpen={isReportsDrawerOpen}
          vehicle={selectedVehicle}
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
export default LiveTrackingPage;
