import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ColDef } from "ag-grid-community";
import {
  ShieldCheck,
  Plus,
  RefreshCw,
  Download,
  Search,
  ArrowLeft,
  Building2,
  Users,
  Edit,
  Trash2,
  CheckCircle2
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { AppDataTable, TwoLineCell } from "@/components/common/AppDataTable";
import { TableFilterBar } from "@/components/common/TableFilterBar";
import { Select } from "@/components/common/Select";
import { useUserGroupList, useDeleteUserGroup, useCompaniesList } from "@/queries/users.queries";
import { UserGroup } from "@/types/users.types";
import { usersApi } from "@/api/users.api";
import { showToast } from "@/lib/toast";

export const UserGroupListPage: React.FC = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("All Companies");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortDir, setSortDir] = useState<"ASC" | "DESC" | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<UserGroup | null>(null);

  // Debounce search input by 300ms and reset to Page 1
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to Page 1 on company or status filter change
  useEffect(() => {
    setPage(1);
  }, [companyFilter, statusFilter]);

  const { data: companies = ["All Companies"] } = useCompaniesList();

  const queryParams = useMemo(() => ({
    page,
    limit: pageSize,
    search: debouncedSearch.trim() || undefined,
    sortBy,
    sortDir,
    company: companyFilter !== "All Companies" ? companyFilter : undefined,
    isActive: statusFilter === "all" ? undefined : statusFilter === "active"
  }), [page, pageSize, debouncedSearch, companyFilter, statusFilter, sortBy, sortDir]);

  const { data, isLoading, isFetching, refetch } = useUserGroupList(queryParams);

  // Real database counts directly from backend API
  const allCount = data?.allCount ?? data?.total ?? 0;
  const activeCount = data?.activeCount ?? 0;
  const inactiveCount = data?.inactiveCount ?? data?.suspendedCount ?? 0;

  // Fallback to max available page if current page exceeds totalPages (e.g. after deletion on last page)
  useEffect(() => {
    if (data?.totalPages && page > data.totalPages) {
      setPage(data.totalPages);
    }
  }, [data?.totalPages, page]);

  const deleteMutation = useDeleteUserGroup();

  const handleExportCsv = async () => {
    await usersApi.exportUserGroups({
      search: debouncedSearch.trim() || undefined,
      company: companyFilter !== "All Companies" ? companyFilter : undefined,
      isActive: statusFilter === "all" ? undefined : statusFilter === "active",
      sortBy,
      sortDir
    });
  };

  const caseInsensitiveComparator = (valueA: string = "", valueB: string = "") => {
    return (valueA || "").localeCompare(valueB || "", undefined, { sensitivity: "base" });
  };

  const confirmDelete = async () => {
    if (!groupToDelete) return;
    try {
      await deleteMutation.mutateAsync(groupToDelete.id);
      setDeleteModalOpen(false);
      setGroupToDelete(null);
    } catch {
      // Handled by toast
    }
  };

  const columns = useMemo<ColDef<any>[]>(
    () => [
      {
        headerName: "Group Name & Identity",
        field: "name",
        minWidth: 280,
        flex: 2,
        comparator: caseInsensitiveComparator,
        cellRenderer: (params: any) => {
          const g: UserGroup = params.data;
          if (!g) return null;
          const roleLabel = g.adminRole
            ? g.adminRole.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())
            : "Standard";
          const branchLabel = g.branch && g.branch.trim() !== "" ? g.branch : "Headquarters";
          const subtitle = `${branchLabel} · ${roleLabel}`;

          return (
            <div
              className="flex items-center gap-3 py-1 min-w-0"
              title={g.description ? `${g.name}: ${g.description}` : g.name}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-bold text-xs border border-indigo-500/20 shadow-xs">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <TwoLineCell
                primary={g.name}
                secondary={subtitle}
              />
            </div>
          );
        }
      },
      {
        headerName: "Company",
        field: "company",
        minWidth: 180,
        flex: 1,
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
        headerName: "System Role",
        field: "adminRole",
        minWidth: 150,
        comparator: caseInsensitiveComparator,
        cellRenderer: (params: any) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-2xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            {params.value}
          </span>
        )
      },
      {
        headerName: "Members",
        field: "userCount",
        minWidth: 120,
        sortable: false,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-1.5 py-1 text-slate-700 dark:text-slate-300">
            <Users className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-bold text-xs">{params.value || 0}</span>
            <span className="text-2xs text-slate-400">Users</span>
          </div>
        )
      },
      {
        headerName: "Status",
        field: "isActive",
        minWidth: 110,
        sortable: false,
        cellRenderer: (params: any) => {
          return params.value ? (
            <div className="h-full flex items-center gap-1.5 font-medium text-xs text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 shadow-xs" />
              Active
            </div>
          ) : (
            <div className="h-full flex items-center gap-1.5 font-medium text-xs text-slate-500 dark:text-slate-400">
              <span className="h-2 w-2 rounded-full bg-slate-400 shrink-0" />
              Inactive
            </div>
          );
        }
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
          const g: UserGroup = params.data;
          if (!g) return null;
          return (
            <div className="flex items-center justify-center gap-1.5 py-1 w-full">
              <button
                type="button"
                onClick={() => navigate(`/users/groups/${g.id}/edit`)}
                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus-ring"
                title="Edit Group & RBAC Matrix"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (g.isSystemAdmin) {
                    showToast.error("System Admin root group cannot be deleted");
                    return;
                  }
                  setGroupToDelete(g);
                  setDeleteModalOpen(true);
                }}
                disabled={g.isSystemAdmin}
                className={`p-1.5 rounded-lg transition-colors focus-ring ${
                  g.isSystemAdmin
                    ? "text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-50"
                    : "text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
                title={g.isSystemAdmin ? "System Admin root group cannot be deleted" : "Delete User Group"}
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
          { label: "User Rights", href: "/users" }
        ]}
        title="User Groups & RBAC"
        description="Organize staff into operational security groups, enforce granular module access, and control command permissions."
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
        searchPlaceholder="Search company, group, or role..."
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={[
          { label: `All (${allCount})`, value: "all" },
          { label: `Active (${activeCount})`, value: "active" },
          { label: `Inactive (${inactiveCount})`, value: "inactive" }
        ]}
        filters={
          <div className="w-full sm:w-56">
            <Select
              sizeVariant="sm"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              options={companies.map((c) => ({ label: c, value: c }))}
            />
          </div>
        }
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        onExport={handleExportCsv}
        exportLabel="Export Excel"
        onCreateNew={() => navigate("/users/groups/new")}
        createLabel="Add Group"
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

      {/* Delete Group Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Remove User Group"
        description="Are you sure you want to delete this operational security group?"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300">
            <p className="font-bold">Access Reassignment Warning:</p>
            <p className="mt-1">
              Deleting <strong>{groupToDelete?.name}</strong> will unassign <strong>{groupToDelete?.userCount || 0} user accounts</strong> from this security policy. Those users will fall back to default View-Only permissions.
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
              {deleteMutation.isPending ? "Deleting..." : "Confirm Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserGroupListPage;
