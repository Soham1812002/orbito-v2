import React, { useState, useMemo, useEffect } from "react";
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
import { useAppSelector } from "@/redux/hooks";
import { User } from "@/types/users.types";
import { usersApi } from "@/api/users.api";
import { showToast } from "@/lib/toast";
import { StatusBadge } from "@/components/common/StatusBadge";

export const UserListPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.user);

  // Filters & State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("All Companies");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortDir, setSortDir] = useState<"ASC" | "DESC" | undefined>(undefined);

  // Debounce search input by 300ms and reset to Page 1
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to Page 1 on status or company filter change
  useEffect(() => {
    setPage(1);
  }, [companyFilter, statusFilter]);

  // Delete Confirmation Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const { data: companies = ["All Companies"] } = useCompaniesList();

  const queryParams = useMemo(() => {
    return {
      page,
      limit: pageSize,
      search: debouncedSearch.trim() || undefined,
      sortBy,
      sortDir,
      filter: {
        company: companyFilter !== "All Companies" ? companyFilter : undefined,
        isActive: statusFilter === "all" ? undefined : statusFilter === "active"
      }
    };
  }, [page, pageSize, debouncedSearch, companyFilter, statusFilter, sortBy, sortDir]);

  const { data, isLoading, isFetching, refetch } = useUserList(queryParams);

  // Fallback to max available page if current page exceeds totalPages (e.g. after deletion on last page)
  useEffect(() => {
    if (data?.totalPages && page > data.totalPages) {
      setPage(data.totalPages);
    }
  }, [data?.totalPages, page]);
  const deleteMutation = useDeleteUser();
  const updateMutation = useUpdateUser();

  // Real database counts directly from backend API
  const allCount = data?.allCount ?? 0;
  const activeCount = data?.activeCount ?? 0;
  const suspendedCount = data?.suspendedCount ?? 0;

  const handleToggleStatus = async (user: User) => {
    try {
      await updateMutation.mutateAsync({
        id: user.id,
        payload: { isActive: !user.isActive }
      });
    } catch {
      // Error handled by interceptor
    }
  };

  const handleExportCsv = async () => {
    await usersApi.exportUsers({
      search: debouncedSearch.trim() || undefined,
      company: companyFilter !== "All Companies" ? companyFilter : undefined,
      isActive: statusFilter === "all" ? undefined : statusFilter === "active",
      sortBy,
      sortDir
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

  const formatPhoneDisplay = (phone?: string): string => {
    if (!phone) return "—";
    const cleaned = phone.trim();
    if (/^\+91\s\d{5}\s\d{5}$/.test(cleaned)) return cleaned;

    const digits = cleaned.replace(/\D/g, "");
    const core = digits.startsWith("91") && digits.length >= 12 ? digits.slice(2) : digits;
    if (core.length === 10) {
      return `+91 ${core.slice(0, 5)} ${core.slice(5)}`;
    }
    return cleaned;
  };

  const caseInsensitiveComparator = (valueA: string = "", valueB: string = "") => {
    return (valueA || "").localeCompare(valueB || "", undefined, { sensitivity: "base" });
  };

const columns = useMemo<ColDef<any>[]>(
  () => [
    {
      headerName: "User Profile",
      field: "fullName",
      minWidth: 240,
      flex: 1.5,
      comparator: caseInsensitiveComparator,
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
      comparator: caseInsensitiveComparator,
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
      headerName: "Role",
      field: "role",
      minWidth: 140,
      comparator: caseInsensitiveComparator,
      cellRenderer: (params: any) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-2xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          {params.value}
        </span>
      )
    },
    {
      headerName: "Phone Number",
      field: "phone",
      minWidth: 140,
      sortable: false,
      cellRenderer: (params: any) => (
        <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
          {formatPhoneDisplay(params.value)}
        </span>
      )
    },
    {
      headerName: "Security & Allocation",
      field: "group",
      minWidth: 210,
      flex: 1.2,
      comparator: caseInsensitiveComparator,
      cellRenderer: (params: any) => {
        const u: User = params.data;
        if (!u) return null;
        return (
          <TwoLineCell
            primary={u.group || "Default Policy"}
            secondary={u.allocationGroup || "All India Logistics"}
          />
        );
      }
    },
    {
      headerName: "Status",
      field: "isActive",
      minWidth: 110,
      sortable: false,
      cellRenderer: (params: any) => (
        <StatusBadge status={params.value ? "active" : "paused"} label={params.value ? "Active" : "Suspended"} />
      )
    },
    {
      headerName: "Actions",
      field: "id",
      width: 120,
      minWidth: 120,
      maxWidth: 130,
      sortable: false,
      filter: false,
      headerClass: "ag-header-cell-center",
      cellClass: "justify-center",
      cellRenderer: (params: any) => {
        const u: User = params.data;
        if (!u) return null;
        const isSelf =
          u.id === currentUser?.id ||
          (!!currentUser?.email && u.email?.toLowerCase() === currentUser?.email?.toLowerCase());

        return (
          <div className="flex items-center justify-center gap-1.5 py-1 w-full">
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
              disabled={updateMutation.isPending || isSelf}
              onClick={() => !isSelf && handleToggleStatus(u)}
              className={`p-1.5 rounded-lg transition-colors focus-ring ${
                isSelf
                  ? "text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-40"
                  : "text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
              title={
                isSelf
                  ? "Cannot deactivate your own active account"
                  : u.isActive
                  ? "Suspend User"
                  : "Activate User"
              }
            >
              {u.isActive ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4 text-amber-500" />}
            </button>
            <button
              type="button"
              disabled={isSelf}
              onClick={() => {
                if (isSelf) return;
                setUserToDelete(u);
                setDeleteModalOpen(true);
              }}
              className={`p-1.5 rounded-lg transition-colors focus-ring ${
                isSelf
                  ? "text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-40"
                  : "text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title={isSelf ? "Cannot delete your own active account" : "Delete User Account"}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      }
    }
  ],
  [navigate, currentUser]
);

return (
  <div className="space-y-6">
    <PageHeader
      breadcrumbs={[
        { label: "User Rights", href: "/users" }
      ]}
      title="Users Directory"
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
      searchPlaceholder="Search users, company..."
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
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCompanyFilter(e.target.value)}
            options={companies.map((c) => ({ label: c, value: c }))}
          />
        </div>
      }
      onRefresh={() => refetch()}
      isRefreshing={isFetching}
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
        isFetching={isFetching}
        total={data?.total}
        page={page}
        pageSize={pageSize}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
        totalPages={data?.totalPages}
        onPageChange={(p) => setPage(p)}
        onSortChange={(col, dir) => {
          if (col !== sortBy || dir !== sortDir) {
            setSortBy(col);
            setSortDir(dir);
            setPage(1);
          }
        }}
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
