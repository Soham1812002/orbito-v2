import React, { useState, useEffect } from "react";
import { Search, Copy, Check, CheckCircle2, Cpu, Radio, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { reportsApi } from "@/api/reports.api";
import { DeviceTelemetryPacket } from "@/types/reports.types";

export const DeviceLogPage: React.FC = () => {
  const [imeiQuery, setImeiQuery] = useState("867530049218476");
  const [packet, setPacket] = useState<DeviceTelemetryPacket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchPacket = async (targetImei: string) => {
    setIsLoading(true);
    try {
      const data = await reportsApi.getDeviceTelemetryPacket(targetImei);
      setPacket(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPacket(imeiQuery);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imeiQuery.trim()) {
      toast.error("Please enter a valid IMEI number");
      return;
    }
    fetchPacket(imeiQuery.trim());
  };

  const copyRawPacket = () => {
    if (!packet) return;
    navigator.clipboard.writeText(packet.rawPacketString);
    setCopied(true);
    toast.success("Raw telemetry packet copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <ReportBreadcrumbs items={[{ label: "Communications & Logs" }, { label: "Device Log" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Device Log
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Search a tracking device by IMEI number to inspect its latest GPS packet, vehicle signals, and raw telemetry string.
          </p>
        </div>
      </div>

      {/* Lookup Card matching Figma #1058:3819 */}
      <div className="panel-card !p-5 border border-slate-200/80 dark:border-[#1D293D]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Find Device Packet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter the device IMEI number to load the latest available telemetry record.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Gateway Connected
          </span>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={imeiQuery}
              onChange={(e) => setImeiQuery(e.target.value)}
              placeholder="e.g. 867530049218476"
              className="w-full font-mono text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Search className="h-4 w-4" />
            <span>{isLoading ? "Searching..." : "Lookup Packet"}</span>
          </button>
        </form>
      </div>

      {packet && (
        <div className="space-y-4">
          {/* Header Record Summary */}
          <div className="panel-card !p-5 border border-slate-200/80 dark:border-[#1D293D]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Latest Device Record
                  </h3>
                  <span className="badge-pill bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    ONLINE
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Received {packet.timestamp} from {packet.deviceModel}
                </p>
              </div>

              <button
                onClick={copyRawPacket}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied!" : "Copy Data"}</span>
              </button>
            </div>

            {/* Decoded Telemetry Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Company</span>
                <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{packet.company}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Branch</span>
                <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{packet.branch}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Vehicle</span>
                <p className="font-semibold text-slate-900 dark:text-white font-mono mt-0.5">
                  {packet.vehicleNo} · {packet.vehicleModel}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Coordinates</span>
                <p className="font-semibold text-slate-900 dark:text-white font-mono mt-0.5">
                  {packet.latitude}°, {packet.longitude}°
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">GPS Speed</span>
                <p className="font-bold text-slate-900 dark:text-white font-mono text-sm mt-0.5">
                  {packet.speedKmH} km/h
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Satellites</span>
                <p className="font-semibold text-slate-900 dark:text-white font-mono mt-0.5">
                  {packet.satellites} Satellites
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">GSM Signal</span>
                <p className="font-semibold text-slate-900 dark:text-white font-mono mt-0.5">
                  {packet.gsmSignalDbm} dBm (Good)
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">External Power</span>
                <p className="font-semibold text-slate-900 dark:text-white font-mono mt-0.5">
                  {packet.externalVoltageV}V (Main: {packet.internalBatteryV}V)
                </p>
              </div>
            </div>

            {/* Raw packet string box */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                RAW TELEMETRY PACKET (HEX)
              </span>
              <pre className="mt-2 p-3 rounded-xl bg-slate-900 text-cyan-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all border border-slate-800 selection:bg-blue-600">
                {packet.rawPacketString}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceLogPage;
