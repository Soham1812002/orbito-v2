import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/api/users.api";
import { UserFilters, CreateUserPayload, UpdateUserPayload } from "@/types/users.types";
import { showToast } from "@/lib/toast";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: UserFilters) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  roles: ["roles"] as const
};

export const useUserList = (params: UserFilters) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: ({ signal }) => usersApi.getUsers(params, signal)
  });
};

export const useUserDetail = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: ({ signal }) => usersApi.getUserById(id, signal),
    enabled: !!id
  });
};

export const useRolesList = () => {
  return useQuery({
    queryKey: userKeys.roles,
    queryFn: () => usersApi.getRoles(),
    staleTime: 600_000 // 10 minutes cache for roles
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => usersApi.createUser(payload),
    onSuccess: () => {
      showToast.success("User created successfully");
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    }
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      usersApi.updateUser(id, payload),
    onSuccess: (_, variables) => {
      showToast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
    }
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: () => {
      showToast.success("User removed successfully");
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    }
  });
};
