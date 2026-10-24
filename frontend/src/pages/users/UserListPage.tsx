import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { ColDef } from "ag-grid-community";
import {
  UserPlus,
  RefreshCw,
  Download,
  Search,
  Filter,
  ArrowLeft,
  Building2,
  Lock,
  Unlock,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { AppDataTable, TwoLineCell } from "@/components/common/AppDataTable";
import { TableFilterBar } from "@/components/common/TableFilterBar";
import { Select } from "@/components/common/Select";
import { useUserList, useDeleteUser, useUpdateUser, useCompaniesList } from "@/queries/users.queries";
import { User } from "@/types/users.types";
import { usersApi } from "@/api/users.api";
import { showToast } from "@/lib/toast";

export const UserListPage: React.FC = () => {
  const navigate = useNavigate();

  // Filters & State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("All Companies");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Delete Confirmation Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const { data: companies = ["All Companies"] } = useCompaniesList();

  const queryParams = useMemo(() => {
    return {
      page,
      limit: pageSize,
      search: searchTerm.trim() || undefined,
      company: companyFilter !== "All Companies" ? companyFilter : undefined,
      filter: {
        isActive: statusFilter === "all" ? undefined : statusFilter === "active"
      }
    };
  }, [page, pageSize, searchTerm, companyFilter, statusFilter]);

  const { data, isLoading, refetch } = useUserList(queryParams);
  const deleteMutation = useDeleteUser();
  const updateMutation = useUpdateUser();

  const allCount = data?.total ?? 8;
  const activeCount = data?.rows?.filter((u: User) => u.isActive).length ?? 8;
  const suspendedCount = allCount - activeCount;

  const handleToggleStatus = async (user: User) => {
    try {
      await updateMutation.mutateAsync({
        id: user.id,
        payload: { isActive: !user.isActive }
      });
      showToast.success(`User ${user.fullName} is now ${!user.isActive ? "Active" : "Suspended"}`);
    } catch {
      // Error handled by interceptor
    }
  };

  const handleExportCsv = async () => {
    await usersApi.exportUsers({
      search: searchTerm,
      company: companyFilter !== "All Companies" ? companyFilter : undefined,
      isActive: statusFilter === "all" ? undefined : statusFilter === "active"
    });
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteMutation.mutateAsync(userToDelete.id);
      setDeleteModalOpen(false);
      setUserToDelete(null);
    } catch {
      // Handled by toast
    }
  };

  const columns = useMemo<ColDef<any>[]>(
    () => [
      {
        headerName: "User Profile",
        field: "fullName",
        minWidth: 240,
        flex: 1.5,
        cellRenderer: (params: any) => {
          const u: User = params.data;
          if (!u) return null;
          const initials = `${u.firstName?.[0] || ""}${u.lastName?.[0] || ""}`.toUpperCase();
          return (
            <div className="h-full flex items-center gap-3 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-blue-500 text-white font-bold text-xs ring-2 ring-blue-500/20 shadow-xs">
                {initials || "U"}
              </div>
              <TwoLineCell
                primary={u.fullName}
                secondary={<span className="font-mono">{u.email}</span>}
              />
            </div>
          );
        }
      },
      {
        headerName: "Company",
        field: "company",
        minWidth: 180,
        flex: 1.2,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-1.5 py-1">
            <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
              {params.value}
            </span>
          </div>
        )
      },
      {
        headerName: "Operational Group",
        field: "group",
        minWidth: 170,
        flex: 1,
        cellRenderer: (params: any) => (
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {params.value || "Default Group"}
          </span>
        )
      },
      {
        headerName: "Role",
        field: "role",
        minWidth: 140,
        cellRenderer: (params: any) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-2xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Contact / Phone",
        field: "phone",
        minWidth: 140,
        cellRenderer: (params: any) => (
          <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Allocation Corridor",
        field: "allocationGroup",
        minWidth: 180,
        cellRenderer: (params: any) => (
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Status",
        field: "isActive",
        minWidth: 110,
        cellRenderer: (params: any) => {
          const active = params.value;
          return active ? (
            <div className="h-full flex items-center gap-1.5 font-medium text-xs text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 shadow-xs" />
              Active
            </div>
          ) : (
            <div className="h-full flex items-center gap-1.5 font-medium text-xs text-slate-500 dark:text-slate-400">
              <span className="h-2 w-2 rounded-full bg-slate-400 shrink-0" />
              Suspended
            </div>
          );
        }
      },
      {
        headerName: "Actions",
        field: "id",
        minWidth: 130,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => {
          const u: User = params.data;
          if (!u) return null;
          return (
            <div className="flex items-center gap-1.5 py-1">
              <button
                type="button"
                onClick={() => navigate(`/users/${u.id}/edit`)}
                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus-ring"
                title="Edit User Details"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleToggleStatus(u)}
                className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus-ring"
                title={u.isActive ? "Suspend User" : "Activate User"}
              >
                {u.isActive ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4 text-amber-500" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setUserToDelete(u);
                  setDeleteModalOpen(true);
                }}
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus-ring"
                title="Delete User Account"
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
          { label: "User Rights", href: "/users" },
          { label: "Users Directory" }
        ]}
        title="User Overview"
        description="Monitor staff logins, security roles, allocation groups, and active portal sessions."
        actions={
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate("/users")}
          >
            Back to Hub
          </Button>
        }
      />

      {/* Standard TableFilterBar */}
      <TableFilterBar
        search={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search company, user, or allocation group..."
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={[
          { label: `All (${allCount})`, value: "all" },
          { label: `Active (${activeCount})`, value: "active" },
          { label: `Suspended (${suspendedCount})`, value: "suspended" }
        ]}
        filters={
          <div className="w-full sm:w-56">
            <Select
              sizeVariant="sm"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
            >
              {companies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
        }
        onRefresh={() => refetch()}
        onExport={handleExportCsv}
        exportLabel="Export Excel"
        onCreateNew={() => navigate("/users/new")}
        createLabel="Add User"
      />

      {/* Data Table */}
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
        title="Remove User Account"
        description="Are you sure you want to deactivate and remove this user account?"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300">
            <p className="font-bold">Permanent Revocation Warning:</p>
            <p className="mt-1">
              Revoking access for <strong>{userToDelete?.fullName}</strong> ({userToDelete?.email}) will immediately terminate any active dashboard sessions and disable their telematics permissions.
            </p>
          </div>
          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              leftIcon={<Trash2 className="h-4 w-4" />}
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Removing..." : "Confirm Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserListPage;
