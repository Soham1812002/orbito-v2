import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { userFormSchema, UserFormData } from "@/schemas/users.schema";
import { User } from "@/types/users.types";
import { useCreateUser, useUpdateUser, useRolesList } from "@/queries/users.queries";

interface EntityFormProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "copy";
  selectedUser?: User | null;
}

export const EntityForm: React.FC<EntityFormProps> = ({
  isOpen,
  onClose,
  mode,
  selectedUser
}) => {
  const { data: roles = [] } = useRolesList();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const isEdit = mode === "edit";
  const title = isEdit ? "Edit User Account" : mode === "copy" ? "Duplicate User" : "Create New User";
  const description = isEdit
    ? "Update user details and access privileges."
    : "Enter details for the new user account.";

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      isActive: true,
      roleIds: []
    }
  });

  const selectedRoleIds = watch("roleIds") || [];

  useEffect(() => {
    if (selectedUser && (mode === "edit" || mode === "copy")) {
      reset({
        email: mode === "copy" ? `copy_${selectedUser.email}` : selectedUser.email,
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        password: "",
        isActive: selectedUser.isActive,
        roleIds: selectedUser.roleIds || []
      });
    } else {
      reset({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        isActive: true,
        roleIds: []
      });
    }
  }, [selectedUser, mode, reset, isOpen]);

  const handleToggleRole = (roleId: string) => {
    if (selectedRoleIds.includes(roleId)) {
      setValue("roleIds", selectedRoleIds.filter((id) => id !== roleId));
    } else {
      setValue("roleIds", [...selectedRoleIds, roleId]);
    }
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      if (isEdit && selectedUser) {
        await updateUserMutation.mutateAsync({
          id: selectedUser.id,
          payload: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            isActive: data.isActive,
            roleIds: data.roleIds,
            ...(data.password ? { password: data.password } : {})
          }
        });
      } else {
        await createUserMutation.mutateAsync({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          password: data.password || "Password@123",
          isActive: data.isActive,
          roleIds: data.roleIds
        });
      }
      onClose();
    } catch {
      // Error is handled by Axios interceptor
    }
  };

  const isSubmitting = createUserMutation.isPending || updateUserMutation.isPending;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} description={description} maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            placeholder="John"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="user@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label={isEdit ? "New Password (leave blank to keep current)" : "Password"}
          type="password"
          placeholder="••••••••"
          helperText={!isEdit ? "Minimum 6 characters required" : undefined}
          error={errors.password?.message}
          {...register("password")}
        />

        {/* Roles Selection */}
        {roles.length > 0 && (
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Assign Roles
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {roles.map((role) => {
                const isSelected = selectedRoleIds.includes(role.id);
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleToggleRole(role.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border ${
                      isSelected
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-500"
                        : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {role.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Status Toggle */}
        <div className="flex items-center gap-2 pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              {...register("isActive")}
            />
            <span>Active Account</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? "Save Changes" : "Create Account"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
