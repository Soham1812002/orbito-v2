import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/api/users.api";
import {
  UserFilters,
  CreateUserPayload,
  UpdateUserPayload,
  UserGroupFilters,
  CreateUserGroupPayload,
  UpdateUserGroupPayload
} from "@/types/users.types";
import { showToast } from "@/lib/toast";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: UserFilters) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  groups: ["user-groups"] as const,
  groupLists: () => [...userKeys.groups, "list"] as const,
  groupList: (params?: UserGroupFilters) => [...userKeys.groupLists(), params] as const,
  groupDetails: () => [...userKeys.groups, "detail"] as const,
  groupDetail: (id: string) => [...userKeys.groupDetails(), id] as const,
  roles: ["roles"] as const,
  companies: ["companies"] as const
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
    staleTime: 600_000
  });
};

export const useCompaniesList = () => {
  return useQuery({
    queryKey: userKeys.companies,
    queryFn: () => usersApi.getCompanies(),
    staleTime: 600_000
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

export const useUserGroupList = (params?: UserGroupFilters) => {
  return useQuery({
    queryKey: userKeys.groupList(params),
    queryFn: () => usersApi.getUserGroups(params)
  });
};

export const useUserGroupDetail = (id: string) => {
  return useQuery({
    queryKey: userKeys.groupDetail(id),
    queryFn: () => usersApi.getUserGroupById(id),
    enabled: !!id
  });
};

export const useCreateUserGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserGroupPayload) => usersApi.createUserGroup(payload),
    onSuccess: () => {
      showToast.success("User group created successfully");
      queryClient.invalidateQueries({ queryKey: userKeys.groupLists() });
    }
  });
};

export const useUpdateUserGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserGroupPayload }) =>
      usersApi.updateUserGroup(id, payload),
    onSuccess: (_, variables) => {
      showToast.success("User group updated successfully");
      queryClient.invalidateQueries({ queryKey: userKeys.groupLists() });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: userKeys.groupDetail(variables.id) });
      }
    }
  });
};

export const useDeleteUserGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUserGroup(id),
    onSuccess: () => {
      showToast.success("User group deleted successfully");
      queryClient.invalidateQueries({ queryKey: userKeys.groupLists() });
    }
  });
};
