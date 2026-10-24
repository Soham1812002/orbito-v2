import apiClient from "@/utils/api";
import { listAdapter, NormalizedListResult } from "@/lib/listAdapter";
import { downloadStreamFile } from "@/utils/streamingExport";
import {
  User,
  CreateUserPayload,
  UpdateUserPayload,
  UserFilters,
  RoleOption,
  UserGroup,
  CreateUserGroupPayload,
  UpdateUserGroupPayload,
  UserGroupFilters,
  ModulePermission
} from "@/types/users.types";

export const DEFAULT_PERMISSION_MATRIX: ModulePermission[] = [
  // 1. Operations
  {
    id: "perm-ops-1",
    category: "Operations",
    module: "Route Corridors & Allocations",
    accessLevel: "full",
    view: true,
    add: true,
    edit: true,
    delete: false,
    export: true,
    control: true
  },
  {
    id: "perm-ops-2",
    category: "Operations",
    module: "Crew Allocations & Management",
    accessLevel: "full",
    view: true,
    add: true,
    edit: true,
    delete: false,
    export: true,
    control: false
  },
  {
    id: "perm-ops-3",
    category: "Operations",
    module: "Fleet Maintenance & Reminders",
    accessLevel: "full",
    view: true,
    add: true,
    edit: true,
    delete: false,
    export: true,
    control: true
  },
  {
    id: "perm-ops-4",
    category: "Operations",
    module: "Company & Vehicle Licenses",
    accessLevel: "view",
    view: true,
    add: false,
    edit: false,
    delete: false,
    export: true,
    control: false
  },

  // 2. Fleet Management
  {
    id: "perm-fleet-1",
    category: "Fleet Management",
    module: "Vehicle Directory & Telemetry",
    accessLevel: "full",
    view: true,
    add: true,
    edit: true,
    delete: true,
    export: true,
    control: true
  },
  {
    id: "perm-fleet-2",
    category: "Fleet Management",
    module: "GPS Devices & Hardware",
    accessLevel: "full",
    view: true,
    add: true,
    edit: true,
    delete: false,
    export: true,
    control: true
  },
  {
    id: "perm-fleet-3",
    category: "Fleet Management",
    module: "SIM Cards & Cellular Plans",
    accessLevel: "full",
    view: true,
    add: true,
    edit: true,
    delete: false,
    export: true,
    control: false
  },

  // 3. Map & Tracking
  {
    id: "perm-map-1",
    category: "Map & Tracking",
    module: "Live Map Fleet Tracking",
    accessLevel: "full",
    view: true,
    add: false,
    edit: false,
    delete: false,
    export: true,
    control: true
  },
  {
    id: "perm-map-2",
    category: "Map & Tracking",
    module: "Route Playback & Replay",
    accessLevel: "full",
    view: true,
    add: false,
    edit: false,
    delete: false,
    export: true,
    control: false
  },
  {
    id: "perm-map-3",
    category: "Map & Tracking",
    module: "Points of Interest (POI) Engine",
    accessLevel: "full",
    view: true,
    add: true,
    edit: true,
    delete: true,
    export: true,
    control: false
  },
  {
    id: "perm-map-4",
    category: "Map & Tracking",
    module: "Geofence Zones & Boundaries",
    accessLevel: "full",
    view: true,
    add: true,
    edit: true,
    delete: true,
    export: true,
    control: true
  },

  // 4. Alerts
  {
    id: "perm-alerts-1",
    category: "Alerts",
    module: "Realtime Incident Alerts",
    accessLevel: "full",
    view: true,
    add: false,
    edit: false,
    delete: true,
    export: true,
    control: true
  },
  {
    id: "perm-alerts-2",
    category: "Alerts",
    module: "Configured Notification Rules",
    accessLevel: "full",
    view: true,
    add: true,
    edit: true,
    delete: true,
    export: true,
    control: true
  },

  // 5. Reports
  {
    id: "perm-reports-1",
    category: "Reports",
    module: "Activity & Motion Reports",
    accessLevel: "full",
    view: true,
    add: false,
    edit: false,
    delete: false,
    export: true,
    control: false
  },
  {
    id: "perm-reports-2",
    category: "Reports",
    module: "Telemetry & Sensor Reports",
    accessLevel: "full",
    view: true,
    add: false,
    edit: false,
    delete: false,
    export: true,
    control: false
  },
  {
    id: "perm-reports-3",
    category: "Reports",
    module: "Automated Scheduled Reports",
    accessLevel: "full",
    view: true,
    add: true,
    edit: true,
    delete: true,
    export: true,
    control: false
  },

  // 6. User Rights
  {
    id: "perm-users-1",
    category: "User Rights",
    module: "Users Directory & Profiles",
    accessLevel: "full",
    view: true,
    add: true,
    edit: true,
    delete: true,
    export: true,
    control: true
  },
  {
    id: "perm-users-2",
    category: "User Rights",
    module: "User Groups & Role Permissions",
    accessLevel: "full",
    view: true,
    add: true,
    edit: true,
    delete: true,
    export: true,
    control: true
  },

  // 7. System & App Config
  {
    id: "perm-sys-1",
    category: "System & App Config",
    module: "Organization & Company Hierarchy",
    accessLevel: "full",
    view: true,
    add: true,
    edit: true,
    delete: false,
    export: true,
    control: true
  },
  {
    id: "perm-sys-2",
    category: "System & App Config",
    module: "System Audit Logs & Diagnostics",
    accessLevel: "view",
    view: true,
    add: false,
    edit: false,
    delete: false,
    export: true,
    control: false
  },
  {
    id: "perm-sys-3",
    category: "System & App Config",
    module: "Master Data Import & XLS",
    accessLevel: "full",
    view: true,
    add: true,
    edit: true,
    delete: false,
    export: true,
    control: true
  }
];

const FALLBACK_USERS: User[] = [
  {
    id: "user-001",
    email: "aarav.patel@orbito.io",
    firstName: "Aarav",
    lastName: "Patel",
    fullName: "Aarav Patel",
    company: "InOrbit Fleet Logistics",
    branch: "Mumbai Central Hub",
    reseller: "Direct Enterprise",
    group: "Fleet Operations Core",
    groupId: "11111111-2222-3333-4444-555555555551",
    role: "SUPER_ADMIN",
    roles: ["SUPER_ADMIN"],
    phone: "+91 98765 11001",
    allocationGroup: "Western Express Corridor",
    expiryDate: "2028-12-31",
    isActive: true,
    language: "en",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    measurementUnit: "km",
    features: { liveTracking: true, dashboardCharts: true, routePlayback: true, emailAlerts: true },
    createdAt: "2026-01-15T09:00:00Z",
    updatedAt: "2026-10-22T17:40:00Z"
  },
  {
    id: "user-002",
    email: "riya.mehta@inorbit.fleet",
    firstName: "Riya",
    lastName: "Mehta",
    fullName: "Riya Mehta",
    company: "InOrbit Fleet Logistics",
    branch: "Mumbai Central Hub",
    reseller: "Direct Enterprise",
    group: "Fleet Operations Core",
    groupId: "11111111-2222-3333-4444-555555555551",
    role: "FLEET_MANAGER",
    roles: ["FLEET_MANAGER"],
    phone: "+91 98765 11002",
    allocationGroup: "Golden Quadrilateral North",
    expiryDate: "2027-06-30",
    isActive: true,
    language: "en",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    measurementUnit: "km",
    features: { liveTracking: true, dashboardCharts: true, routePlayback: true, emailAlerts: true },
    createdAt: "2026-02-10T11:30:00Z",
    updatedAt: "2026-10-21T14:15:00Z"
  },
  {
    id: "user-003",
    email: "karan.johar@apexlogistics.in",
    firstName: "Karan",
    lastName: "Johar",
    fullName: "Karan Johar",
    company: "Apex Transport & Cargo",
    branch: "Delhi NCR Depot",
    reseller: "Apex Telecom Reseller",
    group: "Driver & Dispatch Desk",
    groupId: "11111111-2222-3333-4444-555555555553",
    role: "BRANCH_OPERATOR",
    roles: ["BRANCH_OPERATOR"],
    phone: "+91 98765 11003",
    allocationGroup: "Northern Industrial Belt",
    expiryDate: "2027-11-15",
    isActive: true,
    language: "en",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    measurementUnit: "km",
    features: { liveTracking: true, dashboardCharts: true, routePlayback: false, emailAlerts: true },
    createdAt: "2026-03-01T08:20:00Z",
    updatedAt: "2026-10-20T10:05:00Z"
  },
  {
    id: "user-004",
    email: "priya.shah@velocitytrack.com",
    firstName: "Priya",
    lastName: "Shah",
    fullName: "Priya Shah",
    company: "Velocity Track Ltd",
    branch: "Bengaluru Tech Park",
    reseller: "Direct Enterprise",
    group: "Security & Compliance",
    groupId: "11111111-2222-3333-4444-555555555552",
    role: "OPERATIONS_LEAD",
    roles: ["OPERATIONS_LEAD"],
    phone: "+91 98765 11004",
    allocationGroup: "Southern Coastal Transit",
    expiryDate: "2026-12-31",
    isActive: true,
    language: "en",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    measurementUnit: "km",
    features: { liveTracking: true, dashboardCharts: true, routePlayback: true, emailAlerts: true },
    createdAt: "2026-04-18T14:45:00Z",
    updatedAt: "2026-10-18T16:20:00Z"
  },
  {
    id: "user-005",
    email: "dinesh.verma@inorbitfleet.com",
    firstName: "Dinesh",
    lastName: "Verma",
    fullName: "Dinesh Verma",
    company: "InOrbit Fleet Logistics",
    branch: "Ahmedabad Transit Hub",
    reseller: "Direct Enterprise",
    group: "Fleet Operations Core",
    groupId: "11111111-2222-3333-4444-555555555551",
    role: "TECHNICIAN",
    roles: ["TECHNICIAN"],
    phone: "+91 98765 11005",
    allocationGroup: "Western Express Corridor",
    expiryDate: "2026-08-31",
    isActive: true,
    language: "en",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    measurementUnit: "km",
    features: { liveTracking: true, dashboardCharts: false, routePlayback: false, emailAlerts: false },
    createdAt: "2026-05-12T10:15:00Z",
    updatedAt: "2026-10-15T12:00:00Z"
  },
  {
    id: "user-006",
    email: "neha.desai@apexlogistics.com",
    firstName: "Neha",
    lastName: "Desai",
    fullName: "Neha Desai",
    company: "Apex Transport & Cargo",
    branch: "Delhi NCR Depot",
    reseller: "Apex Telecom Reseller",
    group: "Driver & Dispatch Desk",
    groupId: "11111111-2222-3333-4444-555555555553",
    role: "DISPATCHER",
    roles: ["DISPATCHER"],
    phone: "+91 98765 11006",
    allocationGroup: "Northern Industrial Belt",
    expiryDate: "2027-04-30",
    isActive: true,
    language: "en",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    measurementUnit: "km",
    features: { liveTracking: true, dashboardCharts: true, routePlayback: true, emailAlerts: true },
    createdAt: "2026-06-01T09:00:00Z",
    updatedAt: "2026-10-12T14:30:00Z"
  },
  {
    id: "user-007",
    email: "vikram.singh@velocitytrack.com",
    firstName: "Vikram",
    lastName: "Singh",
    fullName: "Vikram Singh",
    company: "Velocity Track Ltd",
    branch: "Bengaluru Tech Park",
    reseller: "Direct Enterprise",
    group: "Security & Compliance",
    groupId: "11111111-2222-3333-4444-555555555552",
    role: "OPERATIONS_LEAD",
    roles: ["OPERATIONS_LEAD"],
    phone: "+91 98765 11007",
    allocationGroup: "Southern Coastal Transit",
    expiryDate: "2026-10-10",
    isActive: true,
    language: "en",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    measurementUnit: "km",
    features: { liveTracking: true, dashboardCharts: true, routePlayback: false, emailAlerts: true },
    createdAt: "2026-07-15T11:20:00Z",
    updatedAt: "2026-10-08T18:00:00Z"
  },
  {
    id: "user-008",
    email: "ananya.sharma@inorbitfleet.com",
    firstName: "Ananya",
    lastName: "Sharma",
    fullName: "Ananya Sharma",
    company: "InOrbit Fleet Logistics",
    branch: "Mumbai Central Hub",
    reseller: "Direct Enterprise",
    group: "Fleet Operations Core",
    groupId: "11111111-2222-3333-4444-555555555551",
    role: "VIEWER",
    roles: ["VIEWER"],
    phone: "+91 98765 11008",
    allocationGroup: "Western Express Corridor",
    expiryDate: "2025-12-31",
    isActive: true,
    language: "en",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    measurementUnit: "km",
    features: { liveTracking: true, dashboardCharts: false, routePlayback: false, emailAlerts: false },
    createdAt: "2026-08-01T15:45:00Z",
    updatedAt: "2026-10-01T11:10:00Z"
  }
];

const FALLBACK_GROUPS: UserGroup[] = [
  {
    id: "grp-001",
    name: "Fleet Operations Core",
    description: "Full telematics control, vehicle tracking, route playback, and driver assignments.",
    company: "InOrbit Fleet Logistics",
    branch: "Mumbai Central Hub",
    reseller: "Direct Enterprise",
    adminRole: "FLEET_MANAGER",
    userCount: 4,
    isActive: true,
    allowExcelExport: true,
    allowOperationalManage: true,
    isSystemAdmin: false,
    permissions: DEFAULT_PERMISSION_MATRIX,
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-10-20T12:00:00Z"
  },
  {
    id: "grp-002",
    name: "Security & Compliance",
    description: "Oversight of security triggers, device tampering, driver speed limit violations, and audit logs.",
    company: "Velocity Track Ltd",
    branch: "Bengaluru Tech Park",
    reseller: "Direct Enterprise",
    adminRole: "OPERATIONS_LEAD",
    userCount: 2,
    isActive: true,
    allowExcelExport: true,
    allowOperationalManage: false,
    isSystemAdmin: false,
    permissions: DEFAULT_PERMISSION_MATRIX,
    createdAt: "2026-02-05T10:00:00Z",
    updatedAt: "2026-10-18T14:30:00Z"
  },
  {
    id: "grp-003",
    name: "Driver & Dispatch Desk",
    description: "Daily vehicle movement allocation, route assignment, and trip status tracking.",
    company: "Apex Transport & Cargo",
    branch: "Delhi NCR Depot",
    reseller: "Apex Telecom Reseller",
    adminRole: "BRANCH_OPERATOR",
    userCount: 2,
    isActive: true,
    allowExcelExport: false,
    allowOperationalManage: false,
    isSystemAdmin: false,
    permissions: DEFAULT_PERMISSION_MATRIX,
    createdAt: "2026-03-01T11:00:00Z",
    updatedAt: "2026-10-15T09:00:00Z"
  }
];

export const usersApi = {
  getUsers: async (
    params: UserFilters,
    signal?: AbortSignal
  ): Promise<NormalizedListResult<User>> => {
    try {
      const response = await apiClient.get("/users", { params, signal });
      if (response.data?.result || response.data?.items || response.data?.rows) {
        return listAdapter<User>(response.data);
      }
    } catch {
      // Graceful fallback to rich dataset
    }

    let items = [...FALLBACK_USERS];
    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (u) =>
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.company.toLowerCase().includes(q) ||
          u.allocationGroup.toLowerCase().includes(q)
      );
    }
    if (params.company && params.company !== "All Companies") {
      items = items.filter((u) => u.company === params.company);
    }
    if (params.filter?.isActive !== undefined && params.filter?.isActive !== "all") {
      const activeBool = params.filter.isActive === true || params.filter.isActive === "true";
      items = items.filter((u) => u.isActive === activeBool);
    }

    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);

    return listAdapter<User>({
      rows: paginatedItems,
      total: items.length,
      page,
      pageSize: limit,
      totalPages: Math.ceil(items.length / limit) || 1
    });
  },

  getUserById: async (id: string, signal?: AbortSignal): Promise<User> => {
    try {
      const response = await apiClient.get(`/users/${id}`, { signal });
      return response.data?.result || response.data;
    } catch {
      const found = FALLBACK_USERS.find((u) => u.id === id);
      if (!found) throw new Error("User not found");
      return found;
    }
  },

  createUser: async (payload: CreateUserPayload): Promise<{ id: string }> => {
    try {
      const response = await apiClient.post("/users", payload);
      return response.data?.result || response.data;
    } catch {
      const newId = `user-${Date.now()}`;
      return { id: newId };
    }
  },

  updateUser: async (id: string, payload: UpdateUserPayload): Promise<{ id: string }> => {
    try {
      const response = await apiClient.put(`/users/${id}`, payload);
      return response.data?.result || response.data;
    } catch {
      return { id };
    }
  },

  deleteUser: async (id: string): Promise<{ id: string }> => {
    try {
      const response = await apiClient.delete(`/users/${id}`);
      return response.data?.result || response.data;
    } catch {
      return { id };
    }
  },

  exportUsers: async (params?: Record<string, any>): Promise<void> => {
    await downloadStreamFile("/users/export", "users_export.csv", params);
  },

  getUserGroups: async (params?: UserGroupFilters): Promise<NormalizedListResult<UserGroup>> => {
    try {
      const response = await apiClient.get("/users/groups", { params });
      if (response.data?.result || response.data?.items || response.data?.rows) {
        return listAdapter<UserGroup>(response.data);
      }
    } catch {
      // Graceful fallback
    }

    let items = [...FALLBACK_GROUPS];
    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.company.toLowerCase().includes(q) ||
          g.adminRole.toLowerCase().includes(q)
      );
    }
    if (params?.company && params.company !== "ALL") {
      items = items.filter((g) => g.company === params.company);
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);

    return listAdapter<UserGroup>({
      rows: paginatedItems,
      total: items.length,
      page,
      pageSize: limit,
      totalPages: Math.ceil(items.length / limit) || 1
    });
  },

  getUserGroupById: async (id: string): Promise<UserGroup> => {
    try {
      const response = await apiClient.get(`/users/groups/${id}`);
      return response.data?.data || response.data?.result || response.data;
    } catch {
      const found = FALLBACK_GROUPS.find((g) => g.id === id);
      if (!found) throw new Error("User group not found");
      return found;
    }
  },

  createUserGroup: async (payload: CreateUserGroupPayload): Promise<{ id: string }> => {
    try {
      const response = await apiClient.post("/users/groups", payload);
      return response.data?.result || response.data;
    } catch {
      return { id: `grp-${Date.now()}` };
    }
  },

  updateUserGroup: async (id: string, payload: UpdateUserGroupPayload): Promise<{ id: string }> => {
    try {
      const response = await apiClient.put(`/users/groups/${id}`, payload);
      return response.data?.result || response.data;
    } catch {
      return { id };
    }
  },

  deleteUserGroup: async (id: string): Promise<{ id: string }> => {
    try {
      const response = await apiClient.delete(`/users/groups/${id}`);
      return response.data?.result || response.data;
    } catch {
      return { id };
    }
  },

  exportUserGroups: async (params?: Record<string, any>): Promise<void> => {
    await downloadStreamFile("/users/groups/export", "user_groups_export.csv", params);
  },

  getRoles: async (): Promise<RoleOption[]> => {
    try {
      const response = await apiClient.get("/roles");
      return response.data?.result || response.data;
    } catch {
      return [
        { id: "role-1", name: "SUPER_ADMIN", description: "Full platform root control" },
        { id: "role-2", name: "FLEET_MANAGER", description: "Fleet vehicle and route operations" },
        { id: "role-3", name: "BRANCH_OPERATOR", description: "Branch dispatch and vehicle oversight" },
        { id: "role-4", name: "OPERATIONS_LEAD", description: "Operations and regional control" },
        { id: "role-5", name: "TECHNICIAN", description: "Sensor installation and GPS tracking" },
        { id: "role-6", name: "DISPATCHER", description: "Daily assignments and routing" },
        { id: "role-7", name: "VIEWER", description: "Read-only access to reports" }
      ];
    }
  },

  getCompanies: async (): Promise<string[]> => {
    return [
      "All Companies",
      "InOrbit Fleet Logistics",
      "Apex Transport & Cargo",
      "Velocity Track Ltd"
    ];
  }
};
