import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Layers,
  ArrowLeft,
  Save,
  Truck,
  Compass,
  Clock,
  ShieldAlert,
  AlertTriangle,
  Calendar
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { useRoutePaths } from "../routes/routes.queries";
import { useCreateRouteAllocation, useUpdateRouteAllocation, useRouteAllocations } from "./allocations.queries";
import { RouteAllocationFormData } from "./allocations.types";
import { routeAllocationSchema } from "./allocations.schema";
import { showToast } from "@/lib/toast";

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const RouteAllocationFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const { data: routesData } = useRoutePaths({ limit: 100 });
  const { data: allocationsData } = useRouteAllocations();
  const createMutation = useCreateRouteAllocation();
  const updateMutation = useUpdateRouteAllocation();

  const [formData, setFormData] = useState<RouteAllocationFormData>({
    companyName: "inOrbit Logistics",
    branchName: "West Operations Hub",
    routePathId: "",
    vehicleId: "veh-001",
    vehiclePlate: "",
    allocationName: "",
    scheduleType: "daily",
    activeDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    departureTime: "08:00",
    maxTransitHours: 10,
    allowDeviation: false,
    deviationAlertThresholdMeters: 300,
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && allocationsData?.rows) {
      const existing = allocationsData.rows.find((a) => a.id === id);
      if (existing) {
        setFormData({
          companyName: existing.companyName || "inOrbit Logistics",
          branchName: existing.branchName || "West Operations Hub",
          routePathId: existing.routePathId,
          vehicleId: existing.vehicleId,
          vehiclePlate: existing.vehiclePlate,
          allocationName: existing.allocationName,
          scheduleType: existing.scheduleType,
          activeDays: existing.activeDays || ["Mon", "Tue", "Wed", "Thu", "Fri"],
          departureTime: existing.departureTime || "08:00",
          maxTransitHours: existing.maxTransitHours || 10,
          allowDeviation: existing.allowDeviation,
          deviationAlertThresholdMeters: existing.deviationAlertThresholdMeters,
          isActive: existing.isActive
        });
      }
    }
  }, [isEdit, id, allocationsData]);

  // Default routePathId if not set
  useEffect(() => {
    if (!formData.routePathId && routesData?.rows && routesData.rows.length > 0) {
      setFormData((prev) => ({ ...prev, routePathId: routesData.rows[0].id }));
    }
  }, [routesData, formData.routePathId]);

  const handleToggleDay = (day: string) => {
    const current = formData.activeDays || [];
    const next = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    setFormData({ ...formData, activeDays: next });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = routeAllocationSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path.join(".")] = issue.message;
      });
      setErrors(fieldErrors);
      showToast.error("Please resolve the highlighted validation errors");
      return;
    }

    if (isEdit && id) {
      updateMutation.mutate(
        { id, data: formData },
        {
          onSuccess: () => navigate("/operations/allocations")
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => navigate("/operations/allocations")
      });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const availableRoutes = routesData?.rows || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      <PageHeader
        title={isEdit ? `Edit Corridor Allocation: ${formData.vehiclePlate}` : "Allocate Vehicle to Route Corridor"}
        description="Assign fleet assets to defined transit corridors with automated route deviation alerts and dispatch schedules"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Operations", href: "/operations/allocations" },
          { label: "Corridor Allocations", href: "/operations/allocations" },
          { label: isEdit ? "Edit Allocation" : "New Allocation" }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate("/operations/allocations")}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              {isEdit ? "Update Allocation" : "Save Allocation"}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Vehicle & Corridor Selection */}
        <div className="panel-card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Target Vehicle & Route Corridor
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Allocation Group Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Daily Express Freight Run A"
                value={formData.allocationName}
                onChange={(e) => setFormData({ ...formData, allocationName: e.target.value })}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus-ring"
              />
              {errors.allocationName && <p className="text-[11px] text-rose-500 mt-1">{errors.allocationName}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Select Route Corridor <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.routePathId}
                onChange={(e) => setFormData({ ...formData, routePathId: e.target.value })}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus-ring"
              >
                {availableRoutes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.routeCode} — {r.routeName} ({r.distanceKm} km)
                  </option>
                ))}
              </select>
              {errors.routePathId && <p className="text-[11px] text-rose-500 mt-1">{errors.routePathId}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Vehicle Registration Plate <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. GJ 05 AB 1234"
                  value={formData.vehiclePlate}
                  onChange={(e) => setFormData({ ...formData, vehiclePlate: e.target.value.toUpperCase() })}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white focus-ring"
                />
                {errors.vehiclePlate && <p className="text-[11px] text-rose-500 mt-1">{errors.vehiclePlate}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Branch / Operating Region
                </label>
                <input
                  type="text"
                  value={formData.branchName}
                  onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus-ring"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-xs font-medium text-slate-900 dark:text-white">Active Allocation Status</p>
                <p className="text-[11px] text-slate-500">Live monitoring will flag corridor deviation alarms for this vehicle</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Panel 2: Scheduling & Deviation Controls */}
        <div className="panel-card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Clock className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Dispatch Schedule & Deviation Safeguards
            </h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Schedule Type
                </label>
                <select
                  value={formData.scheduleType}
                  onChange={(e) => setFormData({ ...formData, scheduleType: e.target.value as any })}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus-ring"
                >
                  <option value="daily">Daily 24/7 Run</option>
                  <option value="weekdays">Weekdays (Mon-Fri)</option>
                  <option value="custom">Custom Schedule Days</option>
                  <option value="on_demand">On-Demand Dispatch</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Scheduled Departure Time
                </label>
                <input
                  type="time"
                  value={formData.departureTime}
                  onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white focus-ring"
                />
              </div>
            </div>

            {formData.scheduleType === "custom" && (
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Active Run Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_DAYS.map((day) => {
                    const isSelected = formData.activeDays?.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleToggleDay(day)}
                        className={`text-xs py-1 px-3 rounded-lg font-medium transition-colors ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Max Transit Window (Hours)
                </label>
                <input
                  type="number"
                  min={1}
                  max={72}
                  value={formData.maxTransitHours}
                  onChange={(e) => setFormData({ ...formData, maxTransitHours: parseInt(e.target.value, 10) || 12 })}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white focus-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Deviation Alert Threshold (Meters)
                </label>
                <input
                  type="number"
                  min={50}
                  max={5000}
                  value={formData.deviationAlertThresholdMeters}
                  onChange={(e) => setFormData({ ...formData, deviationAlertThresholdMeters: parseInt(e.target.value, 10) || 300 })}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white focus-ring"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl border border-amber-100 dark:border-amber-950/50 bg-amber-50/20 dark:bg-amber-950/10 flex items-start gap-3">
              <input
                type="checkbox"
                id="allowDeviation"
                checked={formData.allowDeviation}
                onChange={(e) => setFormData({ ...formData, allowDeviation: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="allowDeviation" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <span className="font-semibold text-slate-900 dark:text-white block">
                  Permit Alternate Road Detours
                </span>
                When checked, deviations outside the buffer corridor will be recorded as warnings rather than triggering immediate high-severity audible alarms.
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 py-3 px-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 z-30">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate("/operations/allocations")}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isSaving}
          leftIcon={<Save className="w-4 h-4" />}
        >
          {isEdit ? "Update Allocation" : "Save Allocation"}
        </Button>
      </div>
    </form>
  );
};

export default RouteAllocationFormPage;
