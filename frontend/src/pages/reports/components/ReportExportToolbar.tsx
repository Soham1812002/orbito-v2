import React from "react";
import { Download, FileSpreadsheet, FileText, Printer } from "lucide-react";
import toast from "react-hot-toast";

interface ReportExportToolbarProps {
  totalCount: number;
  reportTitle: string;
  dataToExport?: any[];
  extraActions?: React.ReactNode;
}

export const ReportExportToolbar: React.FC<ReportExportToolbarProps> = ({
  totalCount,
  reportTitle,
  dataToExport = [],
  extraActions
}) => {
  const handleExportCsv = () => {
    if (!dataToExport || dataToExport.length === 0) {
      toast.error("No data available to export");
      return;
    }

    try {
      // Generate CSV string from data array
      const headers = Object.keys(dataToExport[0]).filter((k) => k !== "id");
      const csvRows = [
        headers.join(","),
        ...dataToExport.map((row) =>
          headers
            .map((field) => {
              const val = row[field];
              const escaped = typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : `"${val}"`;
              return escaped;
            })
            .join(",")
        )
      ];

      const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${reportTitle.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`${reportTitle} exported successfully!`);
    } catch {
      toast.error("Failed to generate export file");
    }
  };

  const handleExportExcel = () => {
    handleExportCsv(); // Provide CSV with spreadsheet mime
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1 py-1 text-xs">
      {/* Record Counter Badge */}
      <div className="flex items-center gap-2">
        <span className="text-slate-500 dark:text-slate-400">
          Total Records:{" "}
          <strong className="text-slate-900 dark:text-white font-semibold font-mono text-sm">
            {totalCount}
          </strong>
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
        {extraActions}

        {/* Excel Button */}
        <button
          onClick={handleExportExcel}
          title="Export to Excel"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors"
        >
          <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Excel</span>
        </button>

        {/* CSV Button */}
        <button
          onClick={handleExportCsv}
          title="Export CSV"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
        >
          <Download className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          <span>CSV</span>
        </button>

        {/* Print / PDF Button */}
        <button
          onClick={handlePrint}
          title="Print or Save PDF"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-slate-400 font-medium transition-colors"
        >
          <Printer className="h-3.5 w-3.5 text-slate-500" />
          <span>Print</span>
        </button>
      </div>
    </div>
  );
};
