import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColDef } from "ag-grid-community";
import {
  UserMinus,
  AlertTriangle,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Search,
  RefreshCw,
  Archive
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { Select } from "@/components/common/Select";
import { AppDataTable } from "@/components/common/AppDataTable";
import { showToast } from "@/lib/toast";
import { appConfigApi, AppConfigItem } from "@/api/appConfig.api";

export const RemoveEntityPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [entityType, setEntityType] = useState<string>("Vehicle");
  const [entityId, setEntityId] = useState("");
  const [entityName, setEntityName] = useState("");
  const [reason, setReason] = useState("Asset Sold / Disposed");
  const [notes, setNotes] = useState("");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  // Fetch decommission audit history from app_configs with moduleKey 'remove-entity'
  const {
    data: auditLogs = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["app-config", "remove-entity"],
    queryFn: ({ signal }) => appConfigApi.getConfigs("remove-entity", signal),
    staleTime: 30000
  });

  const decommissionMutation = useMutation({
    mutationFn: (payload: any) => appConfigApi.archiveDecommission(payload),
    onSuccess: () => {
      showToast.success(`Entity ${entityId} decommissioned and archived successfully!`);
      queryClient.invalidateQueries({ queryKey: ["app-config", "remove-entity"] });
      queryClient.invalidateQueries({ queryKey: ["app-config", "stats"] });
      setConfirmModalOpen(false);
      setEntityId("");
      setEntityName("");
      setNotes("");
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || "Failed to decommission entity.");
    }
  });

  const handleInitiateDecommission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entityId.trim()) {
      showToast.error("Please enter a valid entity identifier.");
      return;
    }
    setConfirmModalOpen(true);
  };

  const handleConfirmDecommission = () => {
    decommissionMutation.mutate({
      entityType,
      entityId,
      entityName: entityName || entityId,
      reason,
      notes,
      operatorName: "Fleet Admin"
    });
  };

  const auditColumns = useMemo<ColDef<AppConfigItem>[]>(
    () => [
      {
        headerName: "Asset Type",
        field: "entityType",
        minWidth: 130,
        cellRenderer: (params: any) => (
          <span className="font-semibold text-rose-600 dark:text-rose-400">
            {params.value || "Asset"}
          </span>
        )
      },
      {
        headerName: "Identifier",
        field: "entityId",
        minWidth: 150,
        cellRenderer: (params: any) => (
          <span className="font-mono font-semibold text-xs text-slate-800 dark:text-slate-200">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Asset Name",
        field: "entityName",
        minWidth: 150,
        cellRenderer: (params: any) => params.value || "—"
      },
      {
        headerName: "Reason",
        field: "reason",
        minWidth: 180,
        cellRenderer: (params: any) => (
          <span className="text-slate-600 dark:text-slate-400">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Decommissioned By",
        field: "decommissionedBy",
        minWidth: 160,
        cellRenderer: (params: any) => params.value || "Fleet Admin"
      },
      {
        headerName: "Timestamp",
        field: "decommissionedAt",
        minWidth: 170,
        cellRenderer: (params: any) => (
          <span className="text-slate-400 font-mono text-2xs">
            {params.value ? new Date(params.value).toLocaleString() : "—"}
          </span>
        )
      }
    ],
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Remove Entity (Safe Decommission)"
        description="Safely decommission and archive fleet assets, hardware trackers, and driver credentials with audit trail logging."
        badge="GOVERNANCE CONTROL"
      />

      {/* Decommission Form Panel */}
      <div className="panel-card p-6">
        <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-slate-200 dark:border-[#1D293D]">
          <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Controlled Decommission Workflow
            </h3>
            <p className="text-xs text-slate-500">
              Preserves historical telemetry while unbinding active allocations.
            </p>
          </div>
        </div>

        <form onSubmit={handleInitiateDecommission} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Entity Classification
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {["Vehicle", "GPS Device", "SIM Card", "Driver", "Branch"].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setEntityType(type)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all text-center ${
                    entityType === type
                      ? "border-[#007AFF] bg-blue-50 dark:bg-blue-900/30 text-[#007AFF]"
                      : "border-slate-200 dark:border-[#1D293D] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#162244]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Identifier (Plate / IMEI / Code) *
              </label>
              <input
                type="text"
                required
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
                placeholder={
                  entityType === "Vehicle"
                    ? "e.g. MH-04-AZ-8821"
                    : entityType === "GPS Device"
                    ? "e.g. 864201948201948"
                    : "e.g. EMP-DRV-101"
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-[#1D293D] bg-white dark:bg-[#111C38] text-slate-900 dark:text-white focus-ring transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Asset Name / Description
              </label>
              <input
                type="text"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                placeholder="e.g. Tata Signa 4825.T or Teltonika Unit"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-[#1D293D] bg-white dark:bg-[#111C38] text-slate-900 dark:text-white focus-ring transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Decommission Reason *
              </label>
              <Select
                sizeVariant="sm"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="Asset Sold / Disposed">Asset Sold / Disposed</option>
                <option value="Hardware Damaged / RMA">Hardware Damaged / RMA</option>
                <option value="Lease Terminated">Lease Terminated</option>
                <option value="Driver Resigned / Retired">Driver Resigned / Retired</option>
                <option value="Contract Closed">Contract Closed</option>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Audit Notes & Explanation
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Required remarks for regulatory compliance..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-[#1D293D] bg-white dark:bg-[#111C38] text-slate-900 dark:text-white focus-ring transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="danger">
              <Archive className="w-4 h-4 mr-2" />
              Decommission Entity
            </Button>
          </div>
        </form>
      </div>

      {/* Historical Decommission Audit Log Table */}
      <div className="panel-card p-4 sm:p-5 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Historical Decommission Audit Log
            </h3>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} title="Refresh Audit Log">
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>

        <AppDataTable<AppConfigItem>
          rowData={auditLogs}
          columnDefs={auditColumns}
          isLoading={isLoading}
          total={auditLogs.length}
        />
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirm Entity Decommission"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50 flex items-start space-x-3 text-amber-800 dark:text-amber-300 text-xs">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
            <p>
              You are about to decommission <strong>{entityType}</strong> (<code>{entityId}</code>). This will unbind active trip routes and transition the asset into permanent archival.
            </p>
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <p><strong>Reason:</strong> {reason}</p>
            {notes && <p><strong>Notes:</strong> {notes}</p>}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-[#1D293D]">
            <Button variant="ghost" onClick={() => setConfirmModalOpen(false)} disabled={decommissionMutation.isPending}>
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={decommissionMutation.isPending}
              onClick={handleConfirmDecommission}
            >
              Confirm Decommission
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RemoveEntityPage;
