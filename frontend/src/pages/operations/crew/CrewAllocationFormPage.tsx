import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Users,
  ArrowLeft,
  Save,
  Truck,
  User,
  Phone,
  Sparkles,
  Clock,
  Calendar,
  FileText
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { useCrewAllocations, useCreateCrewAllocation, useUpdateCrewAllocation } from "./crew.queries";
import { CrewAllocationFormData } from "./crew.types";
import { crewAllocationSchema } from "./crew.schema";
import { showToast } from "@/lib/toast";

export const CrewAllocationFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const { data: crewData } = useCrewAllocations();
  const createMutation = useCreateCrewAllocation();
  const updateMutation = useUpdateCrewAllocation();

  const [formData, setFormData] = useState<CrewAllocationFormData>({
    companyName: "inOrbit Logistics",
    branchName: "West Operations Hub",
    vehicleId: "veh-001",
    vehiclePlate: "",
    primaryDriverId: "drv-101",
    primaryDriverName: "",
    primaryDriverPhone: "",
    secondaryDriverId: "",
    secondaryDriverName: "",
    cleanerId: "",
    cleanerName: "",
    shiftName: "Morning General Shift (06:00 - 18:00)",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    dutyStatus: "on_duty",
    notes: "",
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && crewData?.rows) {
      const existing = crewData.rows.find((c) => c.id === id);
      if (existing) {
        setFormData({
          companyName: existing.companyName || "inOrbit Logistics",
          branchName: existing.branchName || "West Operations Hub",
          vehicleId: existing.vehicleId,
          vehiclePlate: existing.vehiclePlate,
          primaryDriverId: existing.primaryDriverId,
          primaryDriverName: existing.primaryDriverName,
          primaryDriverPhone: existing.primaryDriverPhone,
          secondaryDriverId: existing.secondaryDriverId || "",
          secondaryDriverName: existing.secondaryDriverName || "",
          cleanerId: existing.cleanerId || "",
          cleanerName: existing.cleanerName || "",
          shiftName: existing.shiftName,
          startDate: existing.startDate,
          endDate: existing.endDate || "",
          dutyStatus: existing.dutyStatus,
          notes: existing.notes || "",
          isActive: existing.isActive
        });
      }
    }
  }, [isEdit, id, crewData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = crewAllocationSchema.safeParse(formData);
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
          onSuccess: () => navigate("/operations/crew")
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => navigate("/operations/crew")
      });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      <PageHeader
        title={isEdit ? `Edit Crew Allocation: ${formData.vehiclePlate}` : "Assign Crew to Vehicle"}
        description="Pair primary driver, relief co-driver, cleaner, and duty shift schedule to a fleet vehicle"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Operations", href: "/operations/crew" },
          { label: "Crew Rosters", href: "/operations/crew" },
          { label: isEdit ? "Edit Roster" : "New Roster" }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate("/operations/crew")}
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
              {isEdit ? "Update Crew Assignment" : "Save Crew Assignment"}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Vehicle & Primary Driver */}
        <div className="panel-card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Assigned Vehicle & Primary Driver
            </h3>
          </div>

          <div className="space-y-4">
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
                  Branch / Operating Hub
                </label>
                <input
                  type="text"
                  value={formData.branchName}
                  onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus-ring"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-blue-100 dark:border-blue-950/50 bg-blue-50/20 dark:bg-blue-950/10 space-y-3">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">
                PRIMARY DRIVER IN CHARGE
              </span>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Primary Driver Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Kumar Sharma"
                  value={formData.primaryDriverName}
                  onChange={(e) => setFormData({ ...formData, primaryDriverName: e.target.value })}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus-ring"
                />
                {errors.primaryDriverName && <p className="text-[11px] text-rose-500 mt-1">{errors.primaryDriverName}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Contact Mobile Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. +91 98250 11223"
                  value={formData.primaryDriverPhone}
                  onChange={(e) => setFormData({ ...formData, primaryDriverPhone: e.target.value })}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white focus-ring"
                />
                {errors.primaryDriverPhone && <p className="text-[11px] text-rose-500 mt-1">{errors.primaryDriverPhone}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: Co-Driver & Cleaner Attendant */}
        <div className="panel-card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Users className="w-4 h-4 text-cyan-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Secondary Co-Driver & Cleaner Attendant
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Secondary / Relief Co-Driver (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Manoj Singh (Leave blank if single driver)"
                value={formData.secondaryDriverName}
                onChange={(e) => setFormData({ ...formData, secondaryDriverName: e.target.value })}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus-ring"
              />
              <p className="text-[11px] text-slate-500 mt-1">Recommended for interstate highway trips exceeding 8 consecutive hours</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Cleaner / Cargo Attendant Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Praveen Solanki"
                value={formData.cleanerName}
                onChange={(e) => setFormData({ ...formData, cleanerName: e.target.value })}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Shift Designation <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.shiftName}
                onChange={(e) => setFormData({ ...formData, shiftName: e.target.value })}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus-ring"
              >
                <option value="Morning General Shift (06:00 - 18:00)">Morning General Shift (06:00 - 18:00)</option>
                <option value="Night Express Shift (20:00 - 08:00)">Night Express Shift (20:00 - 08:00)</option>
                <option value="Split Shift (05:00 - 14:00)">Split Shift (05:00 - 14:00)</option>
                <option value="Port Shuttle Continuous Shift">Port Shuttle Continuous Shift</option>
                <option value="24/7 Rolling Double Shift">24/7 Rolling Double Shift</option>
              </select>
            </div>
          </div>
        </div>

        {/* Panel 3: Duty Status & Roster Dates */}
        <div className="panel-card p-5 space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Duty Status, Validity Window & Notes
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Duty Operational Status
              </label>
              <select
                value={formData.dutyStatus}
                onChange={(e) => setFormData({ ...formData, dutyStatus: e.target.value as any })}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus-ring"
              >
                <option value="on_duty">On Duty (Active on Road)</option>
                <option value="standby">On Standby (Depot Available)</option>
                <option value="off_duty">Off Duty (Rest / Leave)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Roster Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white focus-ring"
              />
              {errors.startDate && <p className="text-[11px] text-rose-500 mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Roster End Date (Optional)
              </label>
              <input
                type="date"
                value={formData.endDate || ""}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white focus-ring"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Roster Notes & Special Instructions
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Hazardous chemical handling certified; mandatory 45-min rest break at Kotputli depot..."
              value={formData.notes || ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus-ring"
            />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 py-3 px-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 z-30">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate("/operations/crew")}
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
          {isEdit ? "Update Crew Assignment" : "Save Crew Assignment"}
        </Button>
      </div>
    </form>
  );
};

export default CrewAllocationFormPage;
