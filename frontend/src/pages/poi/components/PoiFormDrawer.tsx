import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Check, Save } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { poiFormSchema, PoiFormData } from "@/schemas/poi.schema";

interface PoiFormDrawerProps {
  initialValues?: Partial<PoiFormData>;
  onSubmit: (data: PoiFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const PoiFormDrawer: React.FC<PoiFormDrawerProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<PoiFormData>({
    resolver: zodResolver(poiFormSchema),
    defaultValues: {
      name: initialValues?.name || "Jewar Toll Plaza",
      company: initialValues?.company || "InOrbit Logistics",
      branch: initialValues?.branch || "North Region",
      category: initialValues?.category || "Toll Plaza",
      street: initialValues?.street || "Yamuna Expressway",
      city: initialValues?.city || "Jewar",
      state: initialValues?.state || "Uttar Pradesh",
      latitude: initialValues?.latitude ?? 28.1206,
      longitude: initialValues?.longitude ?? 77.5382,
      description:
        initialValues?.description ||
        "Primary automated fast-tag logging gate on the Yamuna Expressway corridor.",
      isActive: initialValues?.isActive ?? true
    }
  });

  const isActive = watch("isActive");

  return (
    <div className="w-full lg:w-96 shrink-0 panel-card flex flex-col justify-between overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      {/* Header (Figma #1097:18354) */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-[#95F8FF]">
            NEW LOCATION
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            POI details
          </h3>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scrollable Form Body */}
      <form
        id="poi-drawer-form"
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 sm:p-5 space-y-5 overflow-y-auto max-h-[calc(100vh-220px)]"
      >
        {/* Section 1: General Information */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold">
              1
            </span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              GENERAL INFORMATION
            </h4>
          </div>

          <Input
            label="POI name *"
            placeholder="e.g. Jewar Toll Plaza"
            error={errors.name?.message}
            {...register("name")}
          />

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
                <option value="North Region">North Region</option>
                <option value="Western Hub">Western Hub</option>
                <option value="Maharashtra Central">Maharashtra Central</option>
                <option value="Southern Maritime">Southern Maritime</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Location Details */}
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold">
              2
            </span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              LOCATION DETAILS
            </h4>
          </div>

          <Input
            label="Street Address *"
            placeholder="Yamuna Expressway, Jewar Toll Plaza"
            error={errors.street?.message}
            {...register("street")}
          />

          <div className="grid grid-cols-2 gap-2.5">
            <Input
              label="City *"
              placeholder="Jewar"
              error={errors.city?.message}
              {...register("city")}
            />
            <Input
              label="State *"
              placeholder="Uttar Pradesh"
              error={errors.state?.message}
              {...register("state")}
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Latitude *
              </label>
              <input
                type="number"
                step="any"
                {...register("latitude", { valueAsNumber: true })}
                className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Longitude *
              </label>
              <input
                type="number"
                step="any"
                {...register("longitude", { valueAsNumber: true })}
                className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Classification */}
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold">
              3
            </span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              CLASSIFICATION
            </h4>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              POI type *
            </label>
            <select
              {...register("category")}
              className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Toll Plaza">Toll Plaza</option>
              <option value="Depot">Depot</option>
              <option value="Plant">Plant</option>
              <option value="Logistics Hub">Logistics Hub</option>
              <option value="Staging Yard">Staging Yard</option>
              <option value="Client Site">Client Site</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              {...register("description")}
              placeholder="Operational details and gate access notes..."
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Active POI Toggle Switch */}
          <div
            onClick={() => setValue("isActive", !isActive)}
            className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
          >
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Active POI
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Visible in tracking and reports
              </p>
            </div>
            <div
              className={`h-5 w-9 rounded-full transition-colors relative flex items-center p-0.5 ${
                isActive ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <div
                className={`h-4 w-4 rounded-full bg-white transition-transform ${
                  isActive ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </div>
          </div>
        </div>
      </form>

      {/* Footer Actions (Figma #1097:18456) */}
      <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 h-10 text-xs font-semibold"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="poi-drawer-form"
          variant="primary"
          isLoading={isLoading}
          leftIcon={<Save className="h-4 w-4" />}
          className="flex-1 h-10 text-xs font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
        >
          Save POI
        </Button>
      </div>
    </div>
  );
};

export default PoiFormDrawer;
