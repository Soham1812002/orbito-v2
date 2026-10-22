export interface User {
  id: string;
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isActive: boolean;
  roles: string[];
  roleIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive?: boolean;
  roleIds?: string[];
}

export interface UpdateUserPayload {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  roleIds?: string[];
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "ASC" | "DESC";
  filter?: {
    isActive?: boolean | string;
  };
}

export interface RoleOption {
  id: string;
  _id: string;
  name: string;
  description?: string;
}
