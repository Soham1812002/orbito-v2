import apiClient from "@/utils/api";
import { listAdapter, NormalizedListResult } from "@/lib/listAdapter";
import { User, CreateUserPayload, UpdateUserPayload, UserFilters, RoleOption } from "@/types/users.types";

const mockRoles: RoleOption[] = [
  { id: "role-1", _id: "role-1", name: "SUPER_ADMIN", description: "Full platform root control" },
  { id: "role-2", _id: "role-2", name: "FLEET_MANAGER", description: "Fleet vehicle and route operations" },
  { id: "role-3", _id: "role-3", name: "DISPATCHER", description: "Daily trip assignments and status logs" },
  { id: "role-4", _id: "role-4", name: "TECHNICIAN", description: "Device installation and telemetry diagnostics" },
  { id: "role-5", _id: "role-5", name: "VIEWER", description: "Read-only access to reports and tracking" }
];

let mockUsers: User[] = [
  {
    id: "user-1",
    _id: "user-1",
    email: "soham.parekh@inorbitfleet.com",
    firstName: "Soham",
    lastName: "Parekh",
    fullName: "Soham Parekh",
    isActive: true,
    roles: ["SUPER_ADMIN"],
    roleIds: ["role-1"],
    createdAt: "2026-01-15T09:00:00Z",
    updatedAt: "2026-10-22T17:40:00Z"
  },
  {
    id: "user-2",
    _id: "user-2",
    email: "rahul.sharma@inorbitfleet.com",
    firstName: "Rahul",
    lastName: "Sharma",
    fullName: "Rahul Sharma",
    isActive: true,
    roles: ["FLEET_MANAGER"],
    roleIds: ["role-2"],
    createdAt: "2026-02-10T11:30:00Z",
    updatedAt: "2026-10-21T14:15:00Z"
  },
  {
    id: "user-3",
    _id: "user-3",
    email: "dinesh.mehta@inorbitfleet.com",
    firstName: "Dinesh",
    lastName: "Mehta",
    fullName: "Dinesh Mehta",
    isActive: true,
    roles: ["TECHNICIAN"],
    roleIds: ["role-4"],
    createdAt: "2026-03-01T08:20:00Z",
    updatedAt: "2026-10-20T10:05:00Z"
  },
  {
    id: "user-4",
    _id: "user-4",
    email: "priya.nair@inorbitfleet.com",
    firstName: "Priya",
    lastName: "Nair",
    fullName: "Priya Nair",
    isActive: true,
    roles: ["DISPATCHER"],
    roleIds: ["role-3"],
    createdAt: "2026-04-18T14:45:00Z",
    updatedAt: "2026-10-18T16:20:00Z"
  },
  {
    id: "user-5",
    _id: "user-5",
    email: "anand.verma@inorbitfleet.com",
    firstName: "Anand",
    lastName: "Verma",
    fullName: "Anand Verma",
    isActive: false,
    roles: ["VIEWER"],
    roleIds: ["role-5"],
    createdAt: "2026-05-22T16:00:00Z",
    updatedAt: "2026-09-30T12:00:00Z"
  }
];

export const usersApi = {
  getUsers: async (
    params: UserFilters,
    signal?: AbortSignal
  ): Promise<NormalizedListResult<User>> => {
    try {
      const response = await apiClient.get("/users", {
        params,
        signal
      });
      if (response.data?.result || response.data?.items) {
        return listAdapter<User>(response.data);
      }
    } catch {
      // Graceful fallback to mock data
    }

    let items = [...mockUsers];
    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (u) =>
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.roles.some((r) => r.toLowerCase().includes(q))
      );
    }
    if (params.filter?.isActive !== undefined && params.filter?.isActive !== "all") {
      const activeBool = params.filter.isActive === true || params.filter.isActive === "true";
      items = items.filter((u) => u.isActive === activeBool);
    }

    return listAdapter<User>({
      rows: items,
      total: items.length,
      page: params.page || 1,
      pageSize: params.limit || 10,
      totalPages: Math.ceil(items.length / (params.limit || 10)) || 1
    });
  },

  getUserById: async (id: string, signal?: AbortSignal): Promise<User> => {
    try {
      const response = await apiClient.get(`/users/${id}`, { signal });
      if (response.data?.result) return response.data.result;
    } catch {
      // Graceful fallback
    }
    const found = mockUsers.find((u) => u.id === id || u._id === id);
    if (!found) throw new Error("User not found");
    return found;
  },

  createUser: async (payload: CreateUserPayload): Promise<{ id: string }> => {
    try {
      const response = await apiClient.post("/users", payload);
      if (response.data?.result) return response.data.result;
    } catch {
      // Graceful fallback
    }
    const newId = `user-${Date.now()}`;
    const newUser: User = {
      id: newId,
      _id: newId,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      fullName: `${payload.firstName} ${payload.lastName}`.trim(),
      isActive: payload.isActive ?? true,
      roles: payload.roleIds?.length ? ["OPERATOR"] : ["VIEWER"],
      roleIds: payload.roleIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockUsers = [newUser, ...mockUsers];
    return { id: newId };
  },

  updateUser: async (id: string, payload: UpdateUserPayload): Promise<{ id: string }> => {
    try {
      const response = await apiClient.put(`/users/${id}`, payload);
      if (response.data?.result) return response.data.result;
    } catch {
      // Graceful fallback
    }
    mockUsers = mockUsers.map((u) => {
      if (u.id === id || u._id === id) {
        return {
          ...u,
          ...payload,
          fullName: `${payload.firstName ?? u.firstName} ${payload.lastName ?? u.lastName}`.trim(),
          updatedAt: new Date().toISOString()
        };
      }
      return u;
    });
    return { id };
  },

  deleteUser: async (id: string): Promise<{ id: string }> => {
    try {
      const response = await apiClient.delete(`/users/${id}`);
      if (response.data?.result) return response.data.result;
    } catch {
      // Graceful fallback
    }
    mockUsers = mockUsers.filter((u) => u.id !== id && u._id !== id);
    return { id };
  },

  getRoles: async (): Promise<RoleOption[]> => {
    try {
      const response = await apiClient.get("/roles");
      if (response.data?.result) return response.data.result;
    } catch {
      // Graceful fallback
    }
    return mockRoles;
  }
};
