import apiClient from "../../utils/api";
import { listAdapter, NormalizedListResult } from "../../lib/listAdapter";
import { User, CreateUserPayload, UpdateUserPayload, UserFilters, RoleOption } from "./Entity.types";

export const usersApi = {
  getUsers: async (
    params: UserFilters,
    signal?: AbortSignal
  ): Promise<NormalizedListResult<User>> => {
    const response = await apiClient.get("/users", {
      params,
      signal
    });
    return listAdapter<User>(response.data);
  },

  getUserById: async (id: string, signal?: AbortSignal): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`, { signal });
    return response.data.result;
  },

  createUser: async (payload: CreateUserPayload): Promise<{ id: string }> => {
    const response = await apiClient.post("/users", payload);
    return response.data.result;
  },

  updateUser: async (id: string, payload: UpdateUserPayload): Promise<{ id: string }> => {
    const response = await apiClient.put(`/users/${id}`, payload);
    return response.data.result;
  },

  deleteUser: async (id: string): Promise<{ id: string }> => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data.result;
  },

  getRoles: async (): Promise<RoleOption[]> => {
    const response = await apiClient.get("/roles");
    return response.data.result || [];
  }
};
