import React, { useState, useMemo } from "react";
import { UserPlus } from "lucide-react";
import { AppDataTable } from "@/components/common/AppDataTable";
import { TableFilterBar } from "@/components/common/TableFilterBar";
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
        description="Review user accounts, application access, and recent sign-in activity across your fleet organization."
      />

      {/* Standard TableFilterBar */}
      <TableFilterBar
        search={searchTerm}
        onSearchChange={(term) => {
          setSearchTerm(term);
          setPage(1);
        }}
        searchPlaceholder="Search users by name or email..."
        statusFilter={statusFilter}
        onStatusFilterChange={(st) => {
          setStatusFilter(st);
          setPage(1);
        }}
        statusOptions={[
          { label: "All Accounts", value: "all" },
          { label: "Active Only", value: "active" },
          { label: "Inactive Only", value: "inactive" }
        ]}
        onRefresh={() => refetch()}
        onCreateNew={
          canCreate
            ? () => {
                setSelectedUser(null);
                setFormMode("create");
                setFormOpen(true);
              }
            : undefined
        }
        createLabel="Add New User"
      />

      {/* Data Table */}
      <div className="panel-card p-4 sm:p-5 overflow-hidden">
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
