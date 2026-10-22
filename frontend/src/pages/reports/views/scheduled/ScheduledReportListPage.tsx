import React, { useState, useEffect } from "react";
import { Plus, Play, Trash2, CalendarDays, CheckCircle2, Clock, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { ReportBreadcrumbs } from "@/pages/reports/components/ReportBreadcrumbs";
import { ReportKpiCards } from "@/pages/reports/components/ReportKpiCards";
import { ReportExportToolbar } from "@/pages/reports/components/ReportExportToolbar";
import { AddScheduledReportModal } from "./AddScheduledReportModal";
import { reportsApi } from "@/api/reports.api";
import { ScheduledReportItem, ReportKpiMetric } from "@/types/reports.types";

export const ScheduledReportListPage: React.FC = () => {
  const [kpis, setKpis] = useState<ReportKpiMetric[]>([]);
  const [items, setItems] = useState<ScheduledReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await reportsApi.getScheduledReports();
      setKpis(data.kpis);
      setItems(data.items);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleActive = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
    toast.success("Schedule status updated");
  };

  const handleRunNow = (name: string) => {
    toast.success(`Triggered report delivery for "${name}"!`);
  };

  const handleDelete = (id: string, name: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success(`Schedule "${name}" deleted`);
  };

  const handleCreated = (newSchedule: ScheduledReportItem) => {
    setItems((prev) => [newSchedule, ...prev]);
  };

  const filteredItems = items.filter(
    (item) =>
      item.scheduleName.toLowerCase().includes(search.toLowerCase()) ||
      item.reportType.toLowerCase().includes(search.toLowerCase()) ||
      item.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <ReportBreadcrumbs items={[{ label: "Automation" }, { label: "Scheduled Reports" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Scheduled Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage recurring automated fleet reports, delivery recipients, and delivery schedules.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto touch-target focus-ring"
        >
          <Plus className="h-4 w-4" />
          <span>Add Schedule</span>
        </button>
      </div>

      <ReportKpiCards metrics={kpis} />

      <ReportExportToolbar
        totalCount={filteredItems.length}
        reportTitle="Scheduled_Reports_Directory"
        dataToExport={filteredItems}
      />

      <div className="panel-card !p-0 overflow-hidden border border-slate-200/80 dark:border-[#1D293D]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-[#121B2E] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Schedule Name & Scope</th>
                <th className="py-3.5 px-4">Report Type</th>
                <th className="py-3.5 px-4">Allocation</th>
                <th className="py-3.5 px-4 text-center">Frequency</th>
                <th className="py-3.5 px-4 text-center">File Format</th>
                <th className="py-3.5 px-4">Next Delivery</th>
                <th className="py-3.5 px-4">Recipients</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                      {item.scheduleName}
                    </div>
                    <div className="text-[11px] text-slate-400">{item.vehicleScope}</div>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-blue-600 dark:text-blue-400">
                    {item.reportType}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{item.company}</div>
                    <div className="text-[10px] text-slate-400">{item.branch}</div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                      {item.frequency}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono text-slate-600 dark:text-slate-300">
                    {item.fileFormat}
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                    {item.nextDelivery}
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 truncate">
                      <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                      <span className="truncate">{item.recipients.join(", ")}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggleActive(item.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                        item.isActive
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-300"
                      }`}
                    >
                      {item.isActive ? "ACTIVE" : "PAUSED"}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleRunNow(item.scheduleName)}
                        title="Run Report Now"
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Play className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.scheduleName)}
                        title="Delete Schedule"
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <AddScheduledReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreated}
      />
    </div>
  );
};

export default ScheduledReportListPage;
