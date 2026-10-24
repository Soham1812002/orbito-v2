import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { ColDef } from "ag-grid-community";
import {
  ArrowLeft,
  Download,
  RefreshCw,
  Plus,
  Search,
  Building2,
  Edit,
  Trash2,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { AppDataTable } from "@/components/common/AppDataTable";
import { TableFilterBar } from "@/components/common/TableFilterBar";
import { Select } from "@/components/common/Select";
import { LicenseStatusChip } from "./components/LicenseStatusChip";
import {
  useCompanyLicenses,
  useDeleteCompanyLicense
} from "@/queries/licensing.queries";
import { CompanyLicense } from "@/types/licensing.types";
import { licensingApi } from "@/api/licensing.api";
import { showToast } from "@/lib/toast";

export const CompanyLicenseListPage: React.FC = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expiryPeriod, setExpiryPeriod] = useState("any");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [licenseToDelete, setLicenseToDelete] = useState<CompanyLicense | null>(null);

  const { data, isLoading, refetch } = useCompanyLicenses({
    page,
    limit: pageSize,
    search: searchTerm.trim() || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    expiryPeriod: expiryPeriod !== "any" ? expiryPeriod : undefined
  });

  const deleteMutation = useDeleteCompanyLicense();

  const handleExportCsv = async () => {
    await licensingApi.exportCompanyLicenses({
      search: searchTerm.trim() || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined
    });
  };

  const confirmDelete = async () => {
    if (!licenseToDelete) return;
    try {
      await deleteMutation.mutateAsync(licenseToDelete.id);
      setDeleteModalOpen(false);
      setLicenseToDelete(null);
    } catch {
      // Handled by mutation
    }
  };

  const columns = useMemo<ColDef<any>[]>(
    () => [
      {
        headerName: "Company & Branch",
        field: "company",
        minWidth: 220,
        flex: 1.4,
        cellRenderer: (params: any) => {
          const c: CompanyLicense = params.data;
          if (!c) return null;
          return (
            <div className="flex items-center gap-3 py-1">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-bold text-xs border border-blue-500/20">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 dark:text-white truncate">
                  {c.company}
                </p>
                <p className="text-2xs text-slate-500 dark:text-slate-400 truncate">
                  {c.branch}
                </p>
              </div>
            </div>
          );
        }
      },
      {
        headerName: "Contact & Phone",
        field: "contactPerson",
        minWidth: 180,
        cellRenderer: (params: any) => {
          const c: CompanyLicense = params.data;
          if (!c) return null;
          return (
            <div className="py-1">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {c.contactPerson}
              </p>
              <p className="text-2xs text-slate-500 dark:text-slate-400 font-mono">
                {c.telephone}
              </p>
            </div>
          );
        }
      },
      {
        headerName: "License Details",
        field: "licenseNumber",
        minWidth: 200,
        cellRenderer: (params: any) => {
          const c: CompanyLicense = params.data;
          if (!c) return null;
          return (
            <div className="py-1">
              <span className="font-mono text-2xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                {c.licenseNumber}
              </span>
              <p className="text-2xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                {c.licenseName}
              </p>
            </div>
          );
        }
      },
      {
        headerName: "Activation Date",
        field: "activationDate",
        minWidth: 130,
        cellRenderer: (params: any) => (
          <span className="text-xs font-mono text-slate-700 dark:text-slate-300">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Expiry Date",
        field: "expiryDate",
        minWidth: 130,
        cellRenderer: (params: any) => (
          <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Vehicle Capacity",
        field: "addedVehicles",
        minWidth: 160,
        cellRenderer: (params: any) => {
          const c: CompanyLicense = params.data;
          if (!c) return null;
          const pct = Math.min(100, Math.round((c.addedVehicles / (c.maxVehicles || 1)) * 100));
          const isHigh = pct >= 90;
          return (
            <div className="py-1 w-full space-y-1">
              <div className="flex items-center justify-between text-2xs">
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {c.addedVehicles} / {c.maxVehicles}
                </span>
                <span className={`font-mono font-semibold ${isHigh ? "text-amber-600" : "text-slate-500"}`}>
                  {pct}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isHigh ? "bg-amber-500" : "bg-blue-600 dark:bg-blue-500"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        }
      },
      {
        headerName: "Remark",
        field: "remark",
        minWidth: 180,
        cellRenderer: (params: any) => (
          <span className="text-2xs text-slate-600 dark:text-slate-400 italic">
            {params.value || "—"}
          </span>
        )
      },
      {
        headerName: "Status",
        field: "status",
        minWidth: 130,
        cellRenderer: (params: any) => {
          const c: CompanyLicense = params.data;
          if (!c) return null;
          return <LicenseStatusChip status={c.status} label={c.statusLabel} />;
        }
      },
      {
        headerName: "Actions",
        field: "id",
        minWidth: 110,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => {
          const c: CompanyLicense = params.data;
          if (!c) return null;
          return (
            <div className="flex items-center gap-1.5 py-1">
              <button
                type="button"
                onClick={() => navigate(`/licensing/companies/${c.id}/edit`)}
                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus-ring"
                title="Edit Company License"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setLicenseToDelete(c);
                  setDeleteModalOpen(true);
                }}
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors focus-ring"
                title="Delete Company License"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        }
      }
    ],
    [navigate]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Operations", href: "/operations" },
          { label: "Licensing Module", href: "/licensing" },
          { label: "Company Licenses" }
        ]}
        title="Company License Summary"
        description="Review license capacity, activation dates, expiry status, and renewal information across companies."
        actions={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate("/licensing")}
          >
            Back to Hub
          </Button>
        }
      />

      {/* Standardized TableFilterBar */}
      <TableFilterBar
        search={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by company or contact person..."
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={[
          { label: "All Statuses", value: "all" },
          { label: "Active", value: "ACTIVE" },
          { label: "Expires Today", value: "EXPIRES_TODAY" },
          { label: "Expiring Soon", value: "EXPIRING_SOON" },
          { label: "Expired", value: "EXPIRED" }
        ]}
        filters={
          <div className="w-full sm:w-44">
            <Select
              sizeVariant="sm"
              value={expiryPeriod}
              onChange={(e) => setExpiryPeriod(e.target.value)}
            >
              <option value="any">Any Expiry Date</option>
              <option value="today">Expiring Today</option>
              <option value="this_month">Expiring This Month</option>
              <option value="next_30">Next 30 Days</option>
              <option value="next_90">Next 90 Days</option>
            </Select>
          </div>
        }
        onRefresh={() => refetch()}
        isRefreshing={isLoading}
        onExport={handleExportCsv}
        exportLabel="Export Excel"
        onCreateNew={() => navigate("/licensing/companies/new")}
        createLabel="Add License"
      />

      {/* Main Table Card with Standard Panel-Card Padding */}
      <div className="panel-card p-4 sm:p-5 overflow-hidden">
        <AppDataTable<any>
          rowData={data?.rows || []}
          columnDefs={columns}
          isLoading={isLoading}
          total={data?.total}
          page={page}
          pageSize={pageSize}
          totalPages={data?.totalPages}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Remove Company License"
        description="Are you sure you want to delete this company license record? This will revoke associated vehicle fleet allocations."
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Company license <span className="font-bold">{licenseToDelete?.licenseNumber}</span> for <span className="font-bold">{licenseToDelete?.company}</span> will be permanently removed.
            </p>
          </div>
          <div className="flex items-center justify-end gap-3 pt-3">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              leftIcon={<Trash2 className="h-4 w-4" />}
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Confirm Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CompanyLicenseListPage;
