import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Map, Save, X, Compass, ShieldAlert, Bell, Gauge } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { GeofenceMapEditor } from "./components/GeofenceMapEditor";
import { useCreateGeofence, useUpdateGeofence, useGeofenceDetail } from "@/queries/geofence.queries";
import { geofenceFormSchema, GeofenceFormData } from "@/schemas/geofence.schema";
import { GeofenceType } from "@/types/geofence.types";
import { showToast } from "@/lib/toast";

export const CreateGeofencePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  const { data: existingGeofence, isLoading: isLoadingDetail } = useGeofenceDetail(editId || "");
  const createMutation = useCreateGeofence();
  const updateMutation = useUpdateGeofence();

  const [type, setType] = useState<GeofenceType>("circular");
  const [radiusMeters, setRadiusMeters] = useState(500);
  const [centerLat, setCenterLat] = useState(22.9868);
  const [centerLng, setCenterLng] = useState(72.4876);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<GeofenceFormData>({
    resolver: zodResolver(geofenceFormSchema),
    defaultValues: {
      name: "Ahmedabad Western Logistics Hub Yard",
      type: "circular",
      category: "Yard",
      company: "InOrbit Logistics",
      branch: "Western Hub",
      centerLatitude: 22.9868,
      centerLongitude: 72.4876,
      radiusMeters: 500,
      speedLimitKmh: 20,
      alertOnEnter: true,
      alertOnExit: true,
      alertOnOverstay: true,
      maxDwellMinutes: 120,
      description: "Container yard parking perimeter with automated entry/exit event logging.",
      isActive: true
    }
  });

  const alertOnEnter = watch("alertOnEnter");
  const alertOnExit = watch("alertOnExit");
  const alertOnOverstay = watch("alertOnOverstay");

  useEffect(() => {
    if (existingGeofence) {
      setType(existingGeofence.type);
      if (existingGeofence.radiusMeters) setRadiusMeters(existingGeofence.radiusMeters);
      setCenterLat(existingGeofence.centerLatitude);
      setCenterLng(existingGeofence.centerLongitude);
      reset({
        name: existingGeofence.name,
        type: existingGeofence.type,
        category: existingGeofence.category,
        company: existingGeofence.company,
        branch: existingGeofence.branch,
        centerLatitude: existingGeofence.centerLatitude,
        centerLongitude: existingGeofence.centerLongitude,
        radiusMeters: existingGeofence.radiusMeters || 500,
        speedLimitKmh: existingGeofence.speedLimitKmh || 25,
        alertOnEnter: existingGeofence.alertOnEnter,
        alertOnExit: existingGeofence.alertOnExit,
        alertOnOverstay: existingGeofence.alertOnOverstay,
        maxDwellMinutes: existingGeofence.maxDwellMinutes,
        description: existingGeofence.description,
        isActive: existingGeofence.isActive
      });
    }
  }, [existingGeofence, reset]);

  const handleTypeChange = (newType: GeofenceType) => {
    setType(newType);
    setValue("type", newType);
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadiusMeters(newRadius);
    setValue("radiusMeters", newRadius);
  };

  const handleCenterChange = (lat: number, lng: number) => {
    setCenterLat(lat);
    setCenterLng(lng);
    setValue("centerLatitude", lat);
    setValue("centerLongitude", lng);
  };

  const onFormSubmit = async (formData: GeofenceFormData) => {
    try {
      const payload: GeofenceFormData = {
        ...formData,
        type,
        centerLatitude: centerLat,
        centerLongitude: centerLng,
        radiusMeters: type === "circular" ? radiusMeters : undefined
      };

      if (editId) {
        await updateMutation.mutateAsync({ id: editId, data: payload });
        showToast.success(`Geofence "${payload.name}" updated successfully!`);
      } else {
        await createMutation.mutateAsync(payload);
        showToast.success(`Geofence "${payload.name}" created successfully!`);
      }
      navigate("/geofence/overview");
    } catch {
      showToast.error("Failed to save Geofence. Please check inputs.");
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Geofence Module", href: "/geofence" },
          { label: editId ? "Edit Geofence" : "Create Geofence" }
        ]}
        title={editId ? "Edit Boundary Perimeter" : "Create Geofence Perimeter"}
        badge="MAP & RULES DUAL PANE"
        badgeVariant="cyan"
        description="Design boundary perimeters with interactive radius controls and set speed thresholds & surveillance alerts."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/geofence/overview")}
            leftIcon={<Compass className="h-4 w-4" />}
          >
            Geofence Directory
          </Button>
        }
      />

      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        {/* Left: Map Boundary Editor */}
        <div className="flex-1 min-w-0">
          <GeofenceMapEditor
            type={type}
            onTypeChange={handleTypeChange}
            radiusMeters={radiusMeters}
            onRadiusChange={handleRadiusChange}
            centerLat={centerLat}
            centerLng={centerLng}
            onCenterChange={handleCenterChange}
          />
        </div>

        {/* Right: Geofence Details Drawer */}
        <div className="w-full lg:w-96 shrink-0 panel-card flex flex-col justify-between overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-[#95F8FF]">
                PERIMETER RULES
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Geofence details
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigate("/geofence/overview")}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form
            id="geofence-form"
            onSubmit={handleSubmit(onFormSubmit)}
            className="p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[calc(100vh-220px)]"
          >
            <Input
              label="Geofence Name *"
              placeholder="e.g. Ahmedabad Western Yard"
              error={errors.name?.message}
              {...register("name")}
            />

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Zone Category *
                </label>
                <select
                  {...register("category")}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Yard">Yard</option>
                  <option value="Warehouse">Warehouse</option>
                  <option value="Plant">Plant</option>
                  <option value="Restricted Zone">Restricted Zone</option>
                  <option value="Customer Depot">Customer Depot</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Speed Limit (km/h)
                </label>
                <input
                  type="number"
                  {...register("speedLimitKmh", { valueAsNumber: true })}
                  placeholder="25"
                  className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company *
                </label>
                <select
                  {...register("company")}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="InOrbit Logistics">InOrbit Logistics</option>
                  <option value="Apex Fleetworks">Apex Fleetworks</option>
                  <option value="TransGlobal Freight">TransGlobal Freight</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Branch *
                </label>
                <select
                  {...register("branch")}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Western Hub">Western Hub</option>
                  <option value="North Region">North Region</option>
                  <option value="Maharashtra Central">Maharashtra Central</option>
                  <option value="Southern Maritime">Southern Maritime</option>
                </select>
              </div>
            </div>

            {/* Alert Rules Toggles */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Surveillance Triggers
              </span>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 cursor-pointer">
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Trigger alert on vehicle Entry
                </span>
                <input
                  type="checkbox"
                  {...register("alertOnEnter")}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500/20"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 cursor-pointer">
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Trigger alert on vehicle Exit
                </span>
                <input
                  type="checkbox"
                  {...register("alertOnExit")}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500/20"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 cursor-pointer">
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Alert on overstay / excessive dwell
                </span>
                <input
                  type="checkbox"
                  {...register("alertOnOverstay")}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500/20"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                {...register("description")}
                placeholder="Perimeter purpose and enforcement instructions..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </form>

          <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/geofence/overview")}
              className="flex-1 h-10 text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="geofence-form"
              variant="primary"
              isLoading={createMutation.isPending || updateMutation.isPending || isLoadingDetail}
              leftIcon={<Save className="h-4 w-4" />}
              className="flex-1 h-10 text-xs font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
            >
              Save Geofence
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGeofencePage;
