import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileSpreadsheet,
  Download,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Trash2,
  ArrowRight
} from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/common/Button";
import { showToast } from "../../lib/toast";
import { appConfigApi } from "./appConfig.api";

interface ParsedRecord {
  category: string;
  itemCode: string;
  itemName: string;
  displayOrder: number;
  description: string;
  status: string;
}

export const MasterDataXlsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedDomain, setSelectedDomain] = useState<string>("master-data");
  const [parsedRows, setParsedRows] = useState<ParsedRecord[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);

  const importMutation = useMutation({
    mutationFn: (items: any[]) => appConfigApi.bulkImport(selectedDomain, items),
    onSuccess: (data) => {
      showToast.success(`Successfully imported ${data.count} records!`);
      queryClient.invalidateQueries({ queryKey: ["app-config", selectedDomain] });
      queryClient.invalidateQueries({ queryKey: ["app-config", "stats"] });
      setParsedRows([]);
      setFileName(null);
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || "Failed to import spreadsheet records.");
    }
  });

  const handleDownloadTemplate = () => {
    const csvContent =
      "Category,ItemCode,ItemName,DisplayOrder,Description,Status\n" +
      "Vehicle Categories,CAT_CONTAINER_40FT,40ft High Cube Container,1,Heavy container chassis,Active\n" +
      "Alert Severities,SEV_FATIGUE,Driver Fatigue Alert,2,Infrared pupil drowsiness monitor,Active\n" +
      "Sensor Calibrations,CAL_TEMP_REEFER,Pharma Cold Vault Multiplier,1,-20C to +40C resistance curve,Active\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `master_data_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast.success("Sample template downloaded!");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter((l) => l.trim().length > 0);
      if (lines.length <= 1) {
        showToast.error("Spreadsheet file is empty.");
        return;
      }

      // Helper function to parse CSV lines handling quoted commas and escapes
      const parseCsvLine = (line: string): string[] => {
        const result: string[] = [];
        let current = "";
        let inQuotes = false;
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          if (char === '"') {
            if (inQuotes && line[j + 1] === '"') {
              current += '"';
              j++;
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === "," && !inQuotes) {
            result.push(current.trim());
            current = "";
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      };

      // Parse CSV rows
      const rows: ParsedRecord[] = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = parseCsvLine(lines[i]);
        if (parts.length >= 3) {
          rows.push({
            category: parts[0] || "Vehicle Categories",
            itemCode: parts[1] || `CODE_${i}`,
            itemName: parts[2] || `Item ${i}`,
            displayOrder: Number(parts[3]) || i,
            description: parts[4] || "",
            status: parts[5] || "Active"
          });
        }
      }

      setParsedRows(rows);
      showToast.success(`Parsed ${rows.length} records ready for preview!`);
    };
    reader.readAsText(file);
  };

  const handleCommitImport = () => {
    if (parsedRows.length === 0) {
      showToast.error("No valid records to import.");
      return;
    }
    importMutation.mutate(parsedRows);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Master Data via XLS / CSV"
        description="Batch upload lookups, sensor calibration parameters, and fleet categories using spreadsheets."
        badge="BULK IMPORT SUITE"
        actions={
          <Button variant="secondary" onClick={handleDownloadTemplate}>
            <Download className="w-4 h-4 mr-2" />
            Download Sample Template
          </Button>
        }
      />

      {/* Target Module Selector */}
      <div className="panel-card p-5">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Select Target Module
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: "master-data", label: "Master Lookups & Calibrations" },
            { id: "vehicles", label: "Vehicles Fleet Registry" },
            { id: "gps-devices", label: "GPS Hardware Units" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedDomain(item.id)}
              className={`p-3 text-xs font-semibold rounded-xl border text-left transition-all ${
                selectedDomain === item.id
                  ? "border-[#007AFF] bg-blue-50/50 dark:bg-blue-900/20 text-[#007AFF]"
                  : "border-slate-200 dark:border-[#1D293D] hover:bg-slate-50 dark:hover:bg-[#162244] text-slate-700 dark:text-slate-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div className="panel-card p-8 border-2 border-dashed border-slate-300 dark:border-[#1D293D] rounded-2xl text-center relative hover:border-[#007AFF] transition-colors">
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-[#007AFF] flex items-center justify-center">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-white">
              {fileName ? fileName : "Drag and drop your spreadsheet here, or browse"}
            </p>
            <p className="text-xs text-slate-500 mt-1">Supports UTF-8 CSV or XLSX files up to 5 MB</p>
          </div>
        </div>
      </div>

      {/* Parsed Preview Table */}
      {parsedRows.length > 0 && (
        <div className="panel-card overflow-hidden space-y-4 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Ready to Import: {parsedRows.length} Rows Detected
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setParsedRows([]);
                  setFileName(null);
                }}
              >
                <Trash2 className="w-4 h-4 mr-1 text-rose-500" />
                Clear
              </Button>
              <Button
                variant="primary"
                onClick={handleCommitImport}
                isLoading={importMutation.isPending}
              >
                Commit Bulk Import ({parsedRows.length})
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-[#1D293D] rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#0b1329] text-slate-500 border-b border-slate-200 dark:border-[#1D293D]">
                <tr>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Item Code</th>
                  <th className="px-4 py-3">Item Name</th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1D293D]/60 text-slate-800 dark:text-slate-200">
                {parsedRows.slice(0, 10).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-[#162244]/30">
                    <td className="px-4 py-2.5 font-medium">{row.category}</td>
                    <td className="px-4 py-2.5 font-mono">{row.itemCode}</td>
                    <td className="px-4 py-2.5">{row.itemName}</td>
                    <td className="px-4 py-2.5">{row.displayOrder}</td>
                    <td className="px-4 py-2.5 text-slate-500 truncate max-w-xs">{row.description}</td>
                    <td className="px-4 py-2.5">
                      <span className="badge-emerald">{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {parsedRows.length > 10 && (
            <p className="text-xs text-slate-500 text-center">
              Showing first 10 rows of {parsedRows.length} total parsed records.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MasterDataXlsPage;
