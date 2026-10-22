import React, { useState, useMemo } from "react";
import { UserPlus, Filter } from "lucide-react";
import { AppDataTable } from "@/components/common/AppDataTable";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { getUserColumns } from "./Entity.columns";
import { EntityForm } from "./EntityForm";
import { useUserList, useDeleteUser } from "@/queries/users.queries";
import { User } from "@/types/users.types";
import { useAppSelector } from "@/redux/hooks";
import { hasPermission } from "@/utils/permissions";

import { PageHeader } from "@/components/layout/PageHeader";

export const EntityList: React.FC = () => {
  const { currentUser } = useAppSelector((state) => state.user);

  // Pagination & Search State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal State
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit" | "copy">("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Delete Confirmation State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const canCreate = hasPermission(currentUser, "CREATE:USER");
  const canEdit = hasPermission(currentUser, "UPDATE:USER");
  const canDelete = hasPermission(currentUser, "DELETE:USER");

  const queryParams = useMemo(() => {
    const params: any = {
      page,
      limit: pageSize,
      search: searchTerm.trim() || undefined
    };
    if (statusFilter !== "all") {
      params.filter = { isActive: statusFilter === "active" };
    }
    return params;
  }, [page, pageSize, searchTerm, statusFilter]);

  const { data, isLoading, refetch } = useUserList(queryParams);
  const deleteMutation = useDeleteUser();

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleCopy = (user: User) => {
    setSelectedUser(user);
    setFormMode("copy");
    setFormOpen(true);
  };

  const handleDeletePrompt = (user: User) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteMutation.mutateAsync(userToDelete.id);
      setDeleteModalOpen(false);
      setUserToDelete(null);
    } catch {
      // Handled by Axios interceptor
    }
  };

  const columns = useMemo(
    () =>
      getUserColumns({
        onEdit: handleEdit,
        onCopy: handleCopy,
        onDelete: handleDeletePrompt,
        canEdit,
        canDelete
      }),
    [canEdit, canDelete]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "System Config", href: "/system-config" },
          { label: "User Management" }
        ]}
        title="User Overview"
        badge={data?.total ? `${data.total} USERS` : undefined}
        description="Review user accounts, application access, and recent sign-in activity across your fleet organization."
        actions={
          canCreate ? (
            <Button
              onClick={() => {
                setSelectedUser(null);
                setFormMode("create");
                setFormOpen(true);
              }}
              leftIcon={<UserPlus className="h-4 w-4" />}
            >
              Add New User
            </Button>
          ) : undefined
        }
      />

      {/* Filter Bar */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 shadow-sm">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <span>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-transparent font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Accounts</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-4 shadow-sm backdrop-blur-sm">
        <AppDataTable<User>
          rowData={data?.rows || []}
          columnDefs={columns}
          isLoading={isLoading}
          total={data?.total || 0}
          page={page}
          pageSize={pageSize}
          totalPages={data?.totalPages || 1}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(1);
          }}
          searchTerm={searchTerm}
          onSearchChange={(term) => {
            setSearchTerm(term);
            setPage(1);
          }}
          onRefresh={() => refetch()}
        />
      </div>

      {/* Entity Form Modal */}
      <EntityForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        mode={formMode}
        selectedUser={selectedUser}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm User Deletion"
        description="Are you sure you want to soft delete this user record?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            User <strong className="text-slate-900 dark:text-slate-200">{userToDelete?.email}</strong> will be marked as deleted. Records are preserved via soft deletion.
          </p>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              isLoading={deleteMutation.isPending}
            >
              Confirm Deletion
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EntityList;
