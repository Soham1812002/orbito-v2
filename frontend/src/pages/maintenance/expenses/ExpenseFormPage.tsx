import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Receipt,
  ShieldCheck,
  Calendar,
  Fuel,
  CreditCard,
  Gauge
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { useCreateExpense } from "./expenses.queries";
import { expenseFormSchema, ExpenseFormData } from "./expenses.schema";
import { showToast } from "@/lib/toast";

export const ExpenseFormPage: React.FC = () => {
  const navigate = useNavigate();
  const createExpenseMutation = useCreateExpense();

  const [formData, setFormData] = useState<Partial<ExpenseFormData>>({
    companyName: "inOrbit Logistics",
    branchName: "West Operations",
    vehicleId: "veh-001",
    vehiclePlate: "GJ 05 AB 1234",
    driverName: "Rajesh Kumar",
    expenseType: "Fuel",
    maintenanceType: "Oil & filter service",
    expenseDate: new Date().toISOString().split("T")[0],
    fuelType: "Diesel",
    fuelStation: "",
    fuelQuantity: 0,
    fuelRate: 95.0,
    expenseAmount: 0,
    odometer: 82448,
    paymentMode: "Fleet Card",
    invoiceNumber: "",
    description: "",
    isReimbursable: true,
    attachReceiptLater: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (field: keyof ExpenseFormData, value: any) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      // Auto-compute total amount for fuel if quantity and rate are present
      if (field === "fuelQuantity" || field === "fuelRate") {
        const qty = field === "fuelQuantity" ? Number(value) : Number(prev.fuelQuantity || 0);
        const rate = field === "fuelRate" ? Number(value) : Number(prev.fuelRate || 0);
        if (qty > 0 && rate > 0) {
          next.expenseAmount = Math.round(qty * rate * 100) / 100;
        }
      }
      return next;
    });

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleVehicleSelect = (plate: string) => {
    setFormData((prev) => ({
      ...prev,
      vehiclePlate: plate,
      vehicleId: plate.replace(/\s+/g, "-").toLowerCase()
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = expenseFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[String(issue.path[0])] = issue.message;
        }
      });
      setErrors(fieldErrors);
      showToast.error("Please fill in all required fields correctly.");
      return;
    }

    try {
      await createExpenseMutation.mutateAsync({
        companyName: result.data.companyName,
        branchName: result.data.branchName,
        vehicleId: result.data.vehicleId,
        vehiclePlate: result.data.vehiclePlate,
        driverName: result.data.driverName,
        expenseType: result.data.expenseType,
        maintenanceType: result.data.expenseType === "Maintenance" ? result.data.maintenanceType : undefined,
        expenseDate: result.data.expenseDate,
        fuelType: result.data.expenseType === "Fuel" ? result.data.fuelType : undefined,
        fuelStation: result.data.expenseType === "Fuel" ? result.data.fuelStation : undefined,
        fuelQuantity: result.data.expenseType === "Fuel" ? result.data.fuelQuantity : undefined,
        fuelRate: result.data.expenseType === "Fuel" ? result.data.fuelRate : undefined,
        expenseAmount: result.data.expenseAmount,
        odometer: result.data.odometer,
        paymentMode: result.data.paymentMode,
        invoiceNumber: result.data.invoiceNumber,
        description: result.data.description,
        isReimbursable: result.data.isReimbursable,
        attachReceiptLater: result.data.attachReceiptLater
      });
      navigate("/maintenance/expenses/overview");
    } catch {
      // toast is handled in mutation
    }
  };

  const isFuel = formData.expenseType === "Fuel";
  const isMaintenance = formData.expenseType === "Maintenance";

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-12">
      {/* Page Header */}
      <PageHeader
        breadcrumbs={[
          { label: "Expenses", href: "/maintenance/expenses/history" },
          { label: "Fuel Management", href: "/maintenance/expenses/overview" },
          { label: "Add Expense" }
        ]}
        title="Add Expense"
        badge="NEW ENTRY"
        badgeVariant="default"
        description="Record fuel, maintenance, toll, and other operational vehicle expenses."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/maintenance/expenses/overview")}
            className="gap-1.5 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            BACK
          </Button>
        }
      />

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="panel-card p-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-xs flex flex-col gap-6">
          {/* Card Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/40">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Expense details
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Fields marked with an asterisk are required.
              </p>
            </div>
          </div>

          {/* Section 1: Vehicle Assignment */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Vehicle Assignment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Company <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.companyName}
                  onChange={(e) => handleFieldChange("companyName", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-ring"
                >
                  <option value="inOrbit Logistics">inOrbit Logistics</option>
                  <option value="Metro Transport">Metro Transport</option>
                </select>
                {errors.companyName && <span className="text-2xs text-red-500">{errors.companyName}</span>}
              </div>

              {/* Branch */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Branch <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.branchName}
                  onChange={(e) => handleFieldChange("branchName", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-ring"
                >
                  <option value="West Operations">West Operations</option>
                  <option value="North Operations">North Operations</option>
                  <option value="Central Fleet">Central Fleet</option>
                </select>
                {errors.branchName && <span className="text-2xs text-red-500">{errors.branchName}</span>}
              </div>

              {/* Vehicle */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Vehicle <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.vehiclePlate}
                  onChange={(e) => handleVehicleSelect(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus-ring"
                >
                  <option value="GJ 05 AB 1234">GJ 05 AB 1234 — Tata Signa 4825</option>
                  <option value="GJ 01 KM 4821">GJ 01 KM 4821 — BharatBenz 3528C</option>
                  <option value="DL 01 AB 7532">DL 01 AB 7532 — Ashok Leyland 2820</option>
                  <option value="MH 14 DT 9087">MH 14 DT 9087 — Eicher Pro 3019</option>
                </select>
                {errors.vehiclePlate && <span className="text-2xs text-red-500">{errors.vehiclePlate}</span>}
              </div>

              {/* Driver */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Driver
                </label>
                <select
                  value={formData.driverName}
                  onChange={(e) => handleFieldChange("driverName", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-ring"
                >
                  <option value="Rajesh Kumar">Rajesh Kumar</option>
                  <option value="Mukesh Patel">Mukesh Patel</option>
                  <option value="Sanjay Singh">Sanjay Singh</option>
                  <option value="Pravin More">Pravin More</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Expense Information */}
          <div className="flex flex-col gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Expense Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Expense Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Expense type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.expenseType}
                  onChange={(e) => handleFieldChange("expenseType", e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-ring"
                >
                  <option value="Fuel">Fuel</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Toll">Toll</option>
                  <option value="Parking">Parking</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Expense Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Expense date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    value={formData.expenseDate}
                    onChange={(e) => handleFieldChange("expenseDate", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus-ring"
                  />
                </div>
                {errors.expenseDate && <span className="text-2xs text-red-500">{errors.expenseDate}</span>}
              </div>

              {/* Conditional: Fuel Section */}
              {isFuel && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Fuel type
                    </label>
                    <select
                      value={formData.fuelType}
                      onChange={(e) => handleFieldChange("fuelType", e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-ring"
                    >
                      <option value="Diesel">Diesel</option>
                      <option value="Petrol">Petrol</option>
                      <option value="CNG">CNG</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Fuel station
                    </label>
                    <div className="relative">
                      <Fuel className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Enter station or vendor"
                        value={formData.fuelStation || ""}
                        onChange={(e) => handleFieldChange("fuelStation", e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-ring"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Quantity
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.fuelQuantity || ""}
                        onChange={(e) => handleFieldChange("fuelQuantity", Number(e.target.value))}
                        className="w-full pl-3 pr-14 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus-ring"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-2xs font-bold text-slate-400">
                        LITRES
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Rate per litre
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                        ₹
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.fuelRate || ""}
                        onChange={(e) => handleFieldChange("fuelRate", Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus-ring"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Conditional: Maintenance Section */}
              {isMaintenance && (
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Maintenance type
                  </label>
                  <select
                    value={formData.maintenanceType}
                    onChange={(e) => handleFieldChange("maintenanceType", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-ring"
                  >
                    <option value="Oil & filter service">Oil & filter service</option>
                    <option value="Tyre replacement">Tyre replacement</option>
                    <option value="Brake service">Brake service</option>
                    <option value="General Service">General Service</option>
                    <option value="Battery replacement">Battery replacement</option>
                    <option value="Electrical Repair">Electrical Repair</option>
                  </select>
                </div>
              )}

              {/* Total Amount */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Total amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Enter total amount"
                    value={formData.expenseAmount || ""}
                    onChange={(e) => handleFieldChange("expenseAmount", Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-medium focus-ring"
                  />
                </div>
                {errors.expenseAmount && <span className="text-2xs text-red-500">{errors.expenseAmount}</span>}
              </div>

              {/* Odometer */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Odometer <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    placeholder="Enter odometer value"
                    value={formData.odometer || ""}
                    onChange={(e) => handleFieldChange("odometer", Number(e.target.value))}
                    className="w-full pl-9 pr-12 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus-ring"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-2xs font-bold text-slate-400">
                    KM
                  </span>
                </div>
                {errors.odometer && <span className="text-2xs text-red-500">{errors.odometer}</span>}
              </div>
            </div>
          </div>

          {/* Section 3: Payment and Notes */}
          <div className="flex flex-col gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Payment and Notes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Payment Mode */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Payment mode <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={formData.paymentMode}
                    onChange={(e) => handleFieldChange("paymentMode", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-ring"
                  >
                    <option value="Fleet Card">Fleet Card</option>
                    <option value="Company Card">Company Card</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Net Banking">Net Banking</option>
                  </select>
                </div>
              </div>

              {/* Invoice Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Invoice number
                </label>
                <input
                  type="text"
                  placeholder="Enter bill or invoice number"
                  value={formData.invoiceNumber}
                  onChange={(e) => handleFieldChange("invoiceNumber", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-ring"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Add expense details, route information, or approval notes..."
                  value={formData.description}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-ring resize-none"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap items-center gap-6 md:col-span-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.attachReceiptLater}
                    onChange={(e) => handleFieldChange("attachReceiptLater", e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  Attach receipt later
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.isReimbursable}
                    onChange={(e) => handleFieldChange("isReimbursable", e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  Mark as reimbursable
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center gap-2 text-2xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Expense records are available in reports after saving.
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate("/maintenance/expenses/overview")}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={createExpenseMutation.isPending}
              className="text-xs"
            >
              Save Expense
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ExpenseFormPage;
