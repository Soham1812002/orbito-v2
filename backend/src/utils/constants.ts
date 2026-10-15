export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  USER: "USER"
} as const;

export const PERMISSIONS = {
  OPERATE_ALL: "OPERATE:ALL",
  VIEW_USER: "VIEW:USER",
  CREATE_USER: "CREATE:USER",
  UPDATE_USER: "UPDATE:USER",
  DELETE_USER: "DELETE:USER",
  VIEW_ROLE: "VIEW:ROLE",
  CREATE_ROLE: "CREATE:ROLE",
  UPDATE_ROLE: "UPDATE:ROLE"
} as const;

export const API_ROUTES = {
  BASE: "/v1/api",
  AUTH: "/v1/api/auth",
  USERS: "/v1/api/users"
} as const;
