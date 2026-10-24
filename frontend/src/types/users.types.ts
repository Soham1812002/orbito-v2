export interface User {
  id: string;
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  company: string;
  branch?: string;
  reseller?: string;
  group: string;
  groupId?: string;
  role: string;
  roles?: string[];
  roleIds?: string[];
  phone: string;
  allocationGroup: string;
  expiryDate?: string;
  isActive: boolean;
  language?: string;
  timezone?: string;
  dateFormat?: string;
  measurementUnit?: "km" | "mph";
  features?: {
    liveTracking: boolean;
    dashboardCharts: boolean;
    routePlayback: boolean;
    emailAlerts: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  company?: string;
  branch?: string;
  reseller?: string;
  allocationGroup?: string;
  role?: string;
  phone?: string;
  isActive?: boolean;
  language?: string;
  timezone?: string;
  dateFormat?: string;
  measurementUnit?: "km" | "mph";
  features?: {
    liveTracking: boolean;
    dashboardCharts: boolean;
    routePlayback: boolean;
    emailAlerts: boolean;
  };
  roleIds?: string[];
  groupId?: string;
}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {
  id?: string;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  company?: string;
  sortBy?: string;
  sortDir?: "ASC" | "DESC";
  filter?: {
    isActive?: boolean | string;
    company?: string;
    role?: string;
  };
}

export interface RoleOption {
  id: string;
  _id?: string;
  name: string;
  description?: string;
}

export interface ModulePermission {
  id: string;
  category: string;
  module: string;
  accessLevel: "full" | "view" | "custom" | "none";
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
  control: boolean;
}

export interface UserGroup {
  id: string;
  _id?: string;
  name: string;
  description: string;
  company: string;
  branch: string;
  reseller: string;
  adminRole: string;
  userCount: number;
  isActive: boolean;
  allowExcelExport: boolean;
  allowOperationalManage: boolean;
  isSystemAdmin: boolean;
  permissions: ModulePermission[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserGroupPayload {
  name: string;
  description: string;
  company: string;
  branch?: string;
  reseller?: string;
  adminRole: string;
  isActive?: boolean;
  allowExcelExport?: boolean;
  allowOperationalManage?: boolean;
  isSystemAdmin?: boolean;
  permissions: ModulePermission[];
}

export interface UpdateUserGroupPayload extends Partial<CreateUserGroupPayload> {
  id?: string;
}

export interface UserGroupFilters {
  page?: number;
  limit?: number;
  search?: string;
  company?: string;
}
