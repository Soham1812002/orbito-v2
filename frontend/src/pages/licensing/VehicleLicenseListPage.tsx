import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { ColDef } from "ag-grid-community";
import {
  ArrowLeft,
  Download,
  RefreshCw,
  Plus,
  Search,
  Truck,
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
  useVehicleLicenses,
  useDeleteVehicleLicense
} from "@/queries/licensing.queries";
import { VehicleLicense } from "@/types/licensing.types";
import { licensingApi } from "@/api/licensing.api";
import { showToast } from "@/lib/toast";

export const VehicleLicenseListPage: React.FC = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expiryPeriod, setExpiryPeriod] = useState("any");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [licenseToDelete, setLicenseToDelete] = useState<VehicleLicense | null>(null);

  const { data, isLoading, refetch } = useVehicleLicenses({
    page,
    limit: pageSize,
    search: searchTerm.trim() || undefined,
    company: companyFilter !== "all" ? companyFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    expiryPeriod: expiryPeriod !== "any" ? expiryPeriod : undefined
  });

  const deleteMutation = useDeleteVehicleLicense();

  const handleExportCsv = async () => {
    await licensingApi.exportVehicleLicenses({
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
        headerName: "Company",
        field: "company",
        minWidth: 160,
        flex: 1.1,
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
        headerName: "Vehicle",
        field: "vehicle",
        minWidth: 150,
        cellRenderer: (params: any) => {
          const v: VehicleLicense = params.data;
          if (!v) return null;
          return (
            <div className="py-1">
              <span className="font-mono font-bold text-xs bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                {v.vehicle}
              </span>
            </div>
          );
        }
      },
      {
        headerName: "GPS Device",
        field: "gpsDevice",
        minWidth: 150,
        cellRenderer: (params: any) => (
          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            {params.value}
          </span>
        )
      },
      {
        headerName: "IMEI No.",
        field: "imei",
        minWidth: 150,
        cellRenderer: (params: any) => (
          <span className="text-xs font-mono text-slate-700 dark:text-slate-300">
            {params.value}
          </span>
        )
      },
      {
        headerName: "SIM Number",
        field: "simNumber",
        minWidth: 140,
        cellRenderer: (params: any) => (
          <span className="text-xs font-mono text-slate-700 dark:text-slate-300">
            {params.value}
          </span>
        )
      },
      {
        headerName: "License Issue Date",
        field: "licenseIssueDate",
        minWidth: 130,
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
        headerName: "Extended Date",
        field: "extendedDate",
        minWidth: 110,
        cellRenderer: (params: any) => (
          <span className="text-xs font-mono text-slate-500">
            {params.value || "—"}
          </span>
        )
      },
      {
        headerName: "User / Reg No.",
        field: "assignedUser",
        minWidth: 150,
        cellRenderer: (params: any) => {
          const v: VehicleLicense = params.data;
          if (!v) return null;
          return (
            <div className="py-1">
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                {v.assignedUser || "Unassigned"}
              </p>
              <p className="text-2xs font-mono text-slate-400">
                {v.registrationNumber}
              </p>
            </div>
          );
        }
      },
      {
        headerName: "License Expiry",
        field: "status",
        minWidth: 130,
        cellRenderer: (params: any) => {
          const v: VehicleLicense = params.data;
          if (!v) return null;
          return <LicenseStatusChip status={v.status} label={v.statusLabel} />;
        }
      },
      {
        headerName: "Actions",
        field: "id",
        minWidth: 110,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => {
          const v: VehicleLicense = params.data;
          if (!v) return null;
          return (
            <div className="flex items-center gap-1.5 py-1">
              <button
                type="button"
                onClick={() => navigate(`/licensing/vehicles/${v.id}/edit`)}
                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus-ring"
                title="Edit Vehicle License"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setLicenseToDelete(v);
                  setDeleteModalOpen(true);
                }}
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors focus-ring"
                title="Revoke Vehicle License"
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
          { label: "Vehicle Licenses" }
        ]}
        title="Vehicle License Summary"
        description="Manage telematics device authorizations, GPS SIM allocations, and vehicle operating licenses."
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
        searchPlaceholder="Search plate, IMEI, SIM, company..."
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
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-full sm:w-40">
              <Select
                sizeVariant="sm"
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
              >
                <option value="all">All Companies</option>
                <option value="InOrbit Logistics">InOrbit Logistics</option>
                <option value="Metro Transport">Metro Transport</option>
                <option value="North Star Freight">North Star Freight</option>
                <option value="Central Fleet Services">Central Fleet Services</option>
              </Select>
            </div>
            <div className="w-full sm:w-40">
              <Select
                sizeVariant="sm"
                value={expiryPeriod}
                onChange={(e) => setExpiryPeriod(e.target.value)}
              >
                <option value="any">Any Period</option>
                <option value="today">Expiring Today</option>
                <option value="this_month">Expiring This Month</option>
                <option value="next_30">Next 30 Days</option>
                <option value="next_90">Next 90 Days</option>
              </Select>
            </div>
          </div>
        }
        onRefresh={() => refetch()}
        isRefreshing={isLoading}
        onExport={handleExportCsv}
        exportLabel="Export Excel"
        onCreateNew={() => navigate("/licensing/vehicles/new")}
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
        title="Revoke Vehicle License"
        description="Are you sure you want to revoke this vehicle license? The vehicle telemetry will be deactivated on the telematics gateway."
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Vehicle license for <span className="font-mono font-bold">{licenseToDelete?.vehicle}</span> ({licenseToDelete?.licenseNumber}) will be revoked.
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

export default VehicleLicenseListPage;
