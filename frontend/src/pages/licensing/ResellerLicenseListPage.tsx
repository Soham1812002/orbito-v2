import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { ColDef } from "ag-grid-community";
import {
  ArrowLeft,
  Download,
  RefreshCw,
  Plus,
  Search,
  Network,
  Edit,
  Trash2,
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
  useResellerLicenses,
  useDeleteResellerLicense
} from "@/queries/licensing.queries";
import { ResellerLicense } from "@/types/licensing.types";
import { licensingApi } from "@/api/licensing.api";
import { showToast } from "@/lib/toast";

export const ResellerLicenseListPage: React.FC = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expiryPeriod, setExpiryPeriod] = useState("any");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [licenseToDelete, setLicenseToDelete] = useState<ResellerLicense | null>(null);

  const { data, isLoading, refetch } = useResellerLicenses({
    page,
    limit: pageSize,
    search: searchTerm.trim() || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    expiryPeriod: expiryPeriod !== "any" ? expiryPeriod : undefined
  });

  const deleteMutation = useDeleteResellerLicense();

  const handleExportCsv = async () => {
    await licensingApi.exportResellerLicenses({
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
        headerName: "Reseller / Partner",
        field: "reseller",
        minWidth: 220,
        flex: 1.4,
        cellRenderer: (params: any) => {
          const r: ResellerLicense = params.data;
          if (!r) return null;
          return (
            <div className="py-1">
              <p className="font-bold text-slate-900 dark:text-white truncate">
                {r.reseller}
              </p>
              <p className="text-2xs text-indigo-600 dark:text-indigo-400 font-semibold truncate">
                {r.licenseModel}
              </p>
            </div>
          );
        }
      },
      {
        headerName: "Contact Person",
        field: "contactPerson",
        minWidth: 150,
        cellRenderer: (params: any) => (
          <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Telephone",
        field: "telephone",
        minWidth: 140,
        cellRenderer: (params: any) => (
          <span className="text-xs font-mono text-slate-700 dark:text-slate-300">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Activation Date",
        field: "activationDate",
        minWidth: 120,
        cellRenderer: (params: any) => (
          <span className="text-xs font-mono text-slate-700 dark:text-slate-300">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Expiry Date",
        field: "expiryDate",
        minWidth: 120,
        cellRenderer: (params: any) => (
          <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Allocated Clients",
        field: "allocatedClients",
        minWidth: 130,
        cellRenderer: (params: any) => (
          <div className="py-1 flex items-center gap-1.5">
            <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/20">
              {params.value}
            </span>
            <span className="text-2xs text-slate-400">Companies</span>
          </div>
        )
      },
      {
        headerName: "Vehicle Quota",
        field: "allocatedVehicles",
        minWidth: 170,
        cellRenderer: (params: any) => {
          const r: ResellerLicense = params.data;
          if (!r) return null;
          const quota = r.vehicleQuota || 500;
          const used = r.allocatedVehicles || 0;
          const pct = Math.min(100, Math.round((used / quota) * 100));
          return (
            <div className="py-1 w-full space-y-1">
              <div className="flex items-center justify-between text-2xs">
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {used} / {quota}
                </span>
                <span className="text-slate-400 font-mono">{pct}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    pct > 90
                      ? "bg-rose-500"
                      : pct > 75
                      ? "bg-amber-500"
                      : "bg-indigo-600"
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
        minWidth: 160,
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
          const r: ResellerLicense = params.data;
          if (!r) return null;
          return <LicenseStatusChip status={r.status} label={r.statusLabel} />;
        }
      },
      {
        headerName: "Actions",
        field: "id",
        minWidth: 110,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => {
          const r: ResellerLicense = params.data;
          if (!r) return null;
          return (
            <div className="flex items-center gap-1.5 py-1">
              <button
                type="button"
                onClick={() => navigate(`/licensing/resellers/${r.id}/edit`)}
                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus-ring"
                title="Edit Reseller License"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setLicenseToDelete(r);
                  setDeleteModalOpen(true);
                }}
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors focus-ring"
                title="Revoke Reseller License"
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
          { label: "Reseller Licenses" }
        ]}
        title="Reseller License Summary"
        description="Channel partner entitlements, allocated customer fleets, vehicle capacity limits, and commission models."
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
        searchPlaceholder="Search reseller, contact, license no..."
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
        onCreateNew={() => navigate("/licensing/resellers/new")}
        createLabel="Add Reseller"
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
        title="Revoke Reseller License"
        description="Are you sure you want to revoke this reseller license? All allocated client sub-accounts and downstream quotas will be suspended."
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Reseller license for <span className="font-bold">{licenseToDelete?.reseller}</span> ({licenseToDelete?.licenseNumber}) will be revoked.
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
              {deleteMutation.isPending ? "Revoking..." : "Confirm Revoke"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ResellerLicenseListPage;
