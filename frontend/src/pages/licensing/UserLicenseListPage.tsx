import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { ColDef } from "ag-grid-community";
import {
  ArrowLeft,
  Download,
  RefreshCw,
  Plus,
  Search,
  Users,
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
  useUserLicenses,
  useDeleteUserLicense
} from "@/queries/licensing.queries";
import { UserLicense } from "@/types/licensing.types";
import { licensingApi } from "@/api/licensing.api";
import { showToast } from "@/lib/toast";

export const UserLicenseListPage: React.FC = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expiryPeriod, setExpiryPeriod] = useState("any");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [licenseToDelete, setLicenseToDelete] = useState<UserLicense | null>(null);

  const { data, isLoading, refetch } = useUserLicenses({
    page,
    limit: pageSize,
    search: searchTerm.trim() || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    expiryPeriod: expiryPeriod !== "any" ? expiryPeriod : undefined
  });

  const deleteMutation = useDeleteUserLicense();

  const handleExportCsv = async () => {
    await licensingApi.exportUserLicenses({
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
        headerName: "User Profile",
        field: "user",
        minWidth: 220,
        flex: 1.4,
        cellRenderer: (params: any) => {
          const u: UserLicense = params.data;
          if (!u) return null;
          const initials = u.user
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
          return (
            <div className="h-full flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-bold text-xs ring-2 ring-indigo-500/20 shadow-xs">
                {initials || "U"}
              </div>
              <div className="min-w-0 flex flex-col justify-center">
                <p className="font-bold text-xs text-slate-900 dark:text-white truncate leading-tight">
                  {u.user}
                </p>
                <p className="text-[11px] text-slate-400 font-mono truncate leading-none mt-0.5">
                  {u.userEmail || `${u.user.toLowerCase().replace(/\s+/g, ".")}@fleet.in`}
                </p>
              </div>
            </div>
          );
        }
      },
      {
        headerName: "Company",
        field: "company",
        minWidth: 160,
        cellRenderer: (params: any) => (
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Branch",
        field: "branch",
        minWidth: 140,
        cellRenderer: (params: any) => (
          <span className="text-xs text-slate-600 dark:text-slate-400">
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
        headerName: "Allocated Vehicles",
        field: "allocatedVehicles",
        minWidth: 140,
        cellRenderer: (params: any) => (
          <div className="h-full flex items-center">
            <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
              {params.value} <span className="text-2xs font-normal text-slate-400">Vehicles</span>
            </span>
          </div>
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
        headerName: "Extend Date",
        field: "extendDate",
        minWidth: 110,
        cellRenderer: (params: any) => (
          <span className="text-xs font-mono text-slate-500">
            {params.value || "—"}
          </span>
        )
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
          const u: UserLicense = params.data;
          if (!u) return null;
          return <LicenseStatusChip status={u.status} label={u.statusLabel} />;
        }
      },
      {
        headerName: "Actions",
        field: "id",
        minWidth: 110,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => {
          const u: UserLicense = params.data;
          if (!u) return null;
          return (
            <div className="flex items-center gap-1.5 py-1">
              <button
                type="button"
                onClick={() => navigate(`/licensing/users/${u.id}/edit`)}
                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus-ring"
                title="Edit User License"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setLicenseToDelete(u);
                  setDeleteModalOpen(true);
                }}
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors focus-ring"
                title="Delete User License"
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
          { label: "User Licenses" }
        ]}
        title="User License Summary"
        description="Review user access, allocated vehicles, activation dates, expiry status, and renewal information."
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
        searchPlaceholder="Search by user, company or branch..."
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
        onCreateNew={() => navigate("/licensing/users/new")}
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
        title="Revoke User License"
        description="Are you sure you want to revoke this user license? The staff member will lose access to allocated telematics vehicles."
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              User license for <span className="font-bold">{licenseToDelete?.user}</span> ({licenseToDelete?.licenseNumber}) will be revoked immediately.
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

export default UserLicenseListPage;
