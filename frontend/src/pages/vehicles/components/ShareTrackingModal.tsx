import React, { useState } from "react";
import {
  Share2,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  Clock,
  ExternalLink,
  Lock
} from "lucide-react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { VehicleTelemetry, ShareLinkConfig } from "../vehicles.types";

interface ShareTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleTelemetry | null;
  onGenerateLink: (config: {
    expiryHours: number;
    passcode?: string;
    allowPlayback: boolean;
  }) => Promise<ShareLinkConfig>;
}

export const ShareTrackingModal: React.FC<ShareTrackingModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  onGenerateLink
}) => {
  const [expiryHours, setExpiryHours] = useState<number>(6);
  const [enablePasscode, setEnablePasscode] = useState(false);
  const [passcode, setPasscode] = useState("FLEET8");
  const [allowPlayback, setAllowPlayback] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedConfig, setGeneratedConfig] = useState<ShareLinkConfig | null>(null);
  const [copied, setCopied] = useState(false);

  if (!vehicle) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const config = await onGenerateLink({
        expiryHours,
        passcode: enablePasscode ? passcode : undefined,
        allowPlayback
      });
      setGeneratedConfig(config);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedConfig) return;
    navigator.clipboard.writeText(generatedConfig.shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Live Tracking Link"
      description="Create a secure, time-expiring web link for customers, consignees, or emergency services."
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Vehicle Badge */}
        <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-950/60 p-3 border border-slate-200 dark:border-slate-800">
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              {vehicle.plateNumber}
            </p>
            <p className="text-xs text-slate-500">{vehicle.makeModel} • {vehicle.companyName}</p>
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            {vehicle.status.toUpperCase()}
          </span>
        </div>

        {/* Configuration Controls */}
        <div className="space-y-3">
          {/* Expiry Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Link Expiration Window
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 6, 12, 24].map((hours) => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => setExpiryHours(hours)}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                    expiryHours === hours
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  {hours} Hour{hours > 1 ? "s" : ""}
                </button>
              ))}
            </div>
          </div>

          {/* Passcode Protection */}
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={enablePasscode}
                  onChange={(e) => setEnablePasscode(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Require Security Passcode</span>
              </label>
              <Lock className="h-3.5 w-3.5 text-slate-400" />
            </div>

            {enablePasscode && (
              <input
                type="text"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value.toUpperCase())}
                placeholder="e.g. FLEET2026"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          {/* Allow Playback Toggle */}
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={allowPlayback}
              onChange={(e) => setAllowPlayback(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Allow viewer to inspect historical route playback for today</span>
          </label>
        </div>

        {/* Generate / Refresh Button */}
        {!generatedConfig && (
          <Button
            type="button"
            variant="primary"
            size="md"
            className="w-full justify-center"
            isLoading={isGenerating}
            leftIcon={<Share2 className="h-4 w-4" />}
            onClick={handleGenerate}
          >
            Generate Tracking Link
          </Button>
        )}

        {/* Generated Link Display & QR Code */}
        {generatedConfig && (
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 p-3.5 space-y-3">
            <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> Public Link Active
              </span>
              <span className="text-[11px] text-slate-500">Expires in {expiryHours} hours</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={generatedConfig.shareUrl}
                className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-mono text-slate-700 dark:text-slate-300 select-all"
              />
              <Button
                type="button"
                variant={copied ? "secondary" : "primary"}
                size="sm"
                onClick={handleCopy}
                leftIcon={copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
              <span>Passcode: {generatedConfig.passcode || "None"}</span>
              <button
                type="button"
                onClick={handleGenerate}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Regenerate New Link
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};
