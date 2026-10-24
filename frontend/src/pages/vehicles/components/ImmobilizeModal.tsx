import React, { useState } from "react";
import {
  AlertTriangle,
  Lock,
  Unlock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle
} from "lucide-react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { VehicleTelemetry, ImmobilizerCommand } from "../vehicles.types";

interface ImmobilizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleTelemetry | null;
  onConfirm: (command: { action: "lock" | "unlock"; pin: string; reason: string }) => Promise<void>;
  isSubmitting?: boolean;
}

export const ImmobilizeModal: React.FC<ImmobilizeModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  onConfirm,
  isSubmitting = false
}) => {
  const [action, setAction] = useState<"lock" | "unlock">("lock");
  const [pin, setPin] = useState("");
  const [reason, setReason] = useState("Suspected Theft / Hijack Protocol");
  const [confirmedSafety, setConfirmedSafety] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!vehicle) return null;

  const isSpeedHigh = vehicle.speed > 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setErrorMsg("Please enter a valid 6-digit authorization PIN.");
      return;
    }

    if (action === "lock" && !confirmedSafety) {
      setErrorMsg("You must confirm the safety checklist before dispatching an engine cutoff.");
      return;
    }

    try {
      await onConfirm({ action, pin, reason });
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to dispatch immobilizer command.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Remote Engine Immobilizer"
      description="Dispatch over-the-air relay cutoff command to the telematics hardware."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Target Vehicle Summary Card */}
        <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-950/60 p-3 border border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {vehicle.plateNumber}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Speed: {vehicle.speed} km/h
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate max-w-xs">{vehicle.lastLocation}</p>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                vehicle.immobilizerState === "cut_off"
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {vehicle.immobilizerState === "cut_off" ? "CUT-OFF ACTIVE" : "ENGINE RUNNING"}
            </span>
          </div>
        </div>

        {/* Action Toggle: Cut Engine vs Restore Engine */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setAction("lock");
              setErrorMsg("");
            }}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 font-semibold text-xs transition-all ${
              action === "lock"
                ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 shadow-sm"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
            }`}
          >
            <Lock className="h-4 w-4" />
            <span>Cut Engine (Immobilize)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAction("unlock");
              setErrorMsg("");
            }}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 font-semibold text-xs transition-all ${
              action === "unlock"
                ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
            }`}
          >
            <Unlock className="h-4 w-4" />
            <span>Restore Engine (Enable)</span>
          </button>
        </div>

        {/* High-Risk Safety Warning */}
        {action === "lock" && (
          <div className="rounded-xl border border-amber-300 dark:border-amber-900/60 bg-amber-50/80 dark:bg-amber-950/30 p-3.5 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Critical Telematics Safety Notice</span>
            </div>
            <p className="text-amber-700 dark:text-amber-400 leading-relaxed">
              Disabling engine relays at high speed on public highways can cause sudden power steering and brake booster loss. If vehicle speed exceeds 10 km/h, the device will queue the command and engage cutoff only once the vehicle decelerates to a safe stop.
            </p>
            {isSpeedHigh && (
              <p className="font-bold text-rose-600 dark:text-rose-400">
                Current speed is {vehicle.speed} km/h. Relay cutoff will be safely delayed by firmware until speed drops &lt; 10 km/h.
              </p>
            )}
          </div>
        )}

        {/* Reason for Dispatch */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Authorization Reason
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Suspected Theft / Hijack Protocol">Suspected Theft / Hijack Protocol</option>
            <option value="Unauthorized Geofence Breach">Unauthorized Geofence Breach</option>
            <option value="Payment Default / Lease Violation">Payment Default / Lease Violation</option>
            <option value="Routine Maintenance Lockout">Routine Maintenance Lockout</option>
            <option value="Security Audit Verification">Security Audit Verification</option>
          </select>
        </div>

        {/* 6-Digit PIN Verification */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>6-Digit Security PIN</span>
            <span className="text-[11px] text-slate-400 font-normal">Default sandbox PIN: 123456</span>
          </label>
          <input
            type="password"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter your 6-digit PIN"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-center text-lg tracking-widest font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Checkbox Acknowledgment */}
        {action === "lock" && (
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={confirmedSafety}
              onChange={(e) => setConfirmedSafety(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>
              I certify that I am authorized to dispatch engine relay commands to this asset and acknowledge the firmware safe deceleration policy.
            </span>
          </label>
        )}

        {errorMsg && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs">
            <XCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant={action === "lock" ? "danger" : "primary"}
            size="sm"
            isLoading={isSubmitting}
            leftIcon={action === "lock" ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          >
            {action === "lock" ? "Confirm & Immobilize" : "Confirm & Restore Engine"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
