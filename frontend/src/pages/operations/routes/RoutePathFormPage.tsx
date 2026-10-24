import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Compass,
  ArrowLeft,
  Save,
  MapPin,
  Clock,
  Gauge,
  Plus,
  Trash2,
  AlertCircle
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { useRoutePathById, useCreateRoutePath, useUpdateRoutePath } from "./routes.queries";
import { RoutePathFormData, Waypoint } from "./routes.types";
import { routePathSchema } from "./routes.schema";
import { showToast } from "@/lib/toast";

export const RoutePathFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const { data: existingData, isLoading: isFetching } = useRoutePathById(id || "");
  const createMutation = useCreateRoutePath();
  const updateMutation = useUpdateRoutePath();

  const [formData, setFormData] = useState<RoutePathFormData>({
    companyName: "inOrbit Logistics",
    branchName: "West Operations Hub",
    routeCode: "",
    routeName: "",
    originName: "",
    originLatitude: 23.0225,
    originLongitude: 72.5714,
    destinationName: "",
    destinationLatitude: 19.2967,
    destinationLongitude: 73.0631,
    distanceKm: 250,
    estimatedDurationMins: 300,
    maxAllowedSpeed: 80,
    bufferRadiusMeters: 400,
    isActive: true,
    waypoints: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existingData) {
      setFormData({
        companyName: existingData.companyName || "inOrbit Logistics",
        branchName: existingData.branchName || "West Operations Hub",
        routeCode: existingData.routeCode,
        routeName: existingData.routeName,
        originName: existingData.originName,
        originLatitude: existingData.originLatitude,
        originLongitude: existingData.originLongitude,
        destinationName: existingData.destinationName,
        destinationLatitude: existingData.destinationLatitude,
        destinationLongitude: existingData.destinationLongitude,
        distanceKm: existingData.distanceKm,
        estimatedDurationMins: existingData.estimatedDurationMins,
        maxAllowedSpeed: existingData.maxAllowedSpeed,
        bufferRadiusMeters: existingData.bufferRadiusMeters,
        isActive: existingData.isActive,
        waypoints: existingData.waypoints || []
      });
    }
  }, [existingData]);

  const handleAddWaypoint = () => {
    const nextSeq = (formData.waypoints?.length || 0) + 1;
    const newWp: Waypoint = {
      id: `wp-${Date.now()}`,
      name: `Transit Checkpoint ${nextSeq}`,
      latitude: formData.originLatitude,
      longitude: formData.originLongitude,
      stopSequence: nextSeq,
      expectedDwellMins: 15,
      geofenceRadiusMeters: 200
    };
    setFormData((prev) => ({
      ...prev,
      waypoints: [...(prev.waypoints || []), newWp]
    }));
  };

  const handleUpdateWaypoint = (index: number, updates: Partial<Waypoint>) => {
    setFormData((prev) => {
      const list = [...(prev.waypoints || [])];
      list[index] = { ...list[index], ...updates };
      return { ...prev, waypoints: list };
    });
  };

  const handleDeleteWaypoint = (index: number) => {
    setFormData((prev) => {
      const list = [...(prev.waypoints || [])];
      list.splice(index, 1);
      return {
        ...prev,
        waypoints: list.map((w, i) => ({ ...w, stopSequence: i + 1 }))
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = routePathSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      showToast.error("Please resolve the highlighted validation errors");
      return;
    }

    if (isEdit && id) {
      updateMutation.mutate(
        { id, data: formData },
        {
          onSuccess: () => navigate("/operations/routes")
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => navigate("/operations/routes")
      });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isEdit && isFetching) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      <PageHeader
        title={isEdit ? `Edit Route Corridor: ${formData.routeCode}` : "Create Route Corridor"}
        description="Configure transit corridor geometry, origin & destination points, buffer boundaries, and telemetry caps"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Operations", href: "/operations/routes" },
          { label: "Route Corridors", href: "/operations/routes" },
          { label: isEdit ? "Edit Corridor" : "New Corridor" }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate("/operations/routes")}
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
              {isEdit ? "Update Corridor" : "Save Corridor"}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Route Identification */}
        <div className="panel-card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Corridor Identity & Organization
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Route Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. COR-AHM-MUM-01"
                value={formData.routeCode}
                onChange={(e) => setFormData({ ...formData, routeCode: e.target.value.toUpperCase() })}
                disabled={isEdit}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white focus-ring disabled:opacity-60"
              />
              {errors.routeCode && <p className="text-[11px] text-rose-500 mt-1">{errors.routeCode}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Corridor Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Ahmedabad - Mumbai Freight"
                value={formData.routeName}
                onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus-ring"
              />
              {errors.routeName && <p className="text-[11px] text-rose-500 mt-1">{errors.routeName}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Branch / Depot Hub
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
              <p className="text-xs font-medium text-slate-900 dark:text-white">Active Operational Status</p>
              <p className="text-[11px] text-slate-500">Enable this corridor for live vehicle allocations and telemetry monitoring</p>
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

        {/* Panel 2: Telemetry Caps & Limits */}
        <div className="panel-card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Gauge className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Telemetry Caps & Corridor Buffer
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Distance (km) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.distanceKm}
                onChange={(e) => setFormData({ ...formData, distanceKm: parseFloat(e.target.value) || 0 })}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white focus-ring"
              />
              {errors.distanceKm && <p className="text-[11px] text-rose-500 mt-1">{errors.distanceKm}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Estimated Duration (mins) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={formData.estimatedDurationMins}
                onChange={(e) => setFormData({ ...formData, estimatedDurationMins: parseInt(e.target.value, 10) || 0 })}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white focus-ring"
              />
              {errors.estimatedDurationMins && <p className="text-[11px] text-rose-500 mt-1">{errors.estimatedDurationMins}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Speed Cap Limit (km/h) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={formData.maxAllowedSpeed}
                onChange={(e) => setFormData({ ...formData, maxAllowedSpeed: parseInt(e.target.value, 10) || 0 })}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white focus-ring"
              />
              {errors.maxAllowedSpeed && <p className="text-[11px] text-rose-500 mt-1">{errors.maxAllowedSpeed}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Corridor Buffer Radius (meters) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={formData.bufferRadiusMeters}
                onChange={(e) => setFormData({ ...formData, bufferRadiusMeters: parseInt(e.target.value, 10) || 0 })}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white focus-ring"
              />
              {errors.bufferRadiusMeters && <p className="text-[11px] text-rose-500 mt-1">{errors.bufferRadiusMeters}</p>}
            </div>
          </div>
        </div>

        {/* Panel 3: Origin & Destination Coordinates */}
        <div className="panel-card p-5 space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Origin & Destination Coordinates
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Origin */}
            <div className="p-4 rounded-xl border border-emerald-100 dark:border-emerald-950/50 bg-emerald-50/20 dark:bg-emerald-950/10 space-y-3">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                ORIGIN ENDPOINT
              </span>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Origin Location Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ahmedabad Central Depot"
                  value={formData.originName}
                  onChange={(e) => setFormData({ ...formData, originName: e.target.value })}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus-ring"
                />
                {errors.originName && <p className="text-[11px] text-rose-500 mt-1">{errors.originName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formData.originLatitude}
                    onChange={(e) => setFormData({ ...formData, originLatitude: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white focus-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formData.originLongitude}
                    onChange={(e) => setFormData({ ...formData, originLongitude: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white focus-ring"
                  />
                </div>
              </div>
            </div>

            {/* Destination */}
            <div className="p-4 rounded-xl border border-rose-100 dark:border-rose-950/50 bg-rose-50/20 dark:bg-rose-950/10 space-y-3">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300">
                DESTINATION ENDPOINT
              </span>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Destination Location Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bhiwandi Logistics Park, Mumbai"
                  value={formData.destinationName}
                  onChange={(e) => setFormData({ ...formData, destinationName: e.target.value })}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus-ring"
                />
                {errors.destinationName && <p className="text-[11px] text-rose-500 mt-1">{errors.destinationName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formData.destinationLatitude}
                    onChange={(e) => setFormData({ ...formData, destinationLatitude: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white focus-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formData.destinationLongitude}
                    onChange={(e) => setFormData({ ...formData, destinationLongitude: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white focus-ring"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 4: Sequential Waypoints Table */}
        <div className="panel-card p-5 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Waypoints Sequence & Dwell Points
              </h3>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddWaypoint}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Waypoint
            </Button>
          </div>

          {(formData.waypoints?.length || 0) === 0 ? (
            <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <MapPin className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-500">No intermediate waypoints defined for this corridor</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Add toll gates, fuel stations, state borders, or rest depots along the path</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2 px-3 font-semibold w-16">Seq</th>
                    <th className="py-2 px-3 font-semibold min-w-[180px]">Waypoint Name</th>
                    <th className="py-2 px-3 font-semibold min-w-[120px]">Latitude</th>
                    <th className="py-2 px-3 font-semibold min-w-[120px]">Longitude</th>
                    <th className="py-2 px-3 font-semibold min-w-[100px]">Dwell (m)</th>
                    <th className="py-2 px-3 font-semibold min-w-[100px]">Geofence (m)</th>
                    <th className="py-2 px-3 font-semibold w-12 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {formData.waypoints?.map((wp, idx) => (
                    <tr key={wp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                        #{wp.stopSequence}
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={wp.name}
                          onChange={(e) => handleUpdateWaypoint(idx, { name: e.target.value })}
                          className="w-full text-xs py-1.5 px-2 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus-ring"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          step="0.000001"
                          value={wp.latitude}
                          onChange={(e) => handleUpdateWaypoint(idx, { latitude: parseFloat(e.target.value) || 0 })}
                          className="w-full text-xs py-1.5 px-2 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white focus-ring"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          step="0.000001"
                          value={wp.longitude}
                          onChange={(e) => handleUpdateWaypoint(idx, { longitude: parseFloat(e.target.value) || 0 })}
                          className="w-full text-xs py-1.5 px-2 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white focus-ring"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={wp.expectedDwellMins || 15}
                          onChange={(e) => handleUpdateWaypoint(idx, { expectedDwellMins: parseInt(e.target.value, 10) || 0 })}
                          className="w-full text-xs py-1.5 px-2 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white focus-ring"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={wp.geofenceRadiusMeters || 200}
                          onChange={(e) => handleUpdateWaypoint(idx, { geofenceRadiusMeters: parseInt(e.target.value, 10) || 0 })}
                          className="w-full text-xs py-1.5 px-2 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white focus-ring"
                        />
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteWaypoint(idx)}
                          className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 py-3 px-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 z-30">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate("/operations/routes")}
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
          {isEdit ? "Update Route Corridor" : "Save Route Corridor"}
        </Button>
      </div>
    </form>
  );
};

export default RoutePathFormPage;
