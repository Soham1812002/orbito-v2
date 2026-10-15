export interface AuthUser {
  id: string;
  _id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  permissions?: string[];
}

export const OPERATE_ALL = "OPERATE:ALL";

export function hasPermission(
  user: AuthUser | null | undefined,
  requiredPermission?: string,
  requiredRole?: string
): boolean {
  if (!user) return false;

  const permissions = user.permissions || [];
  const roles = user.roles || [];

  // SuperAdmin bypass
  if (permissions.includes(OPERATE_ALL) || roles.includes("SUPER_ADMIN")) {
    return true;
  }

  if (requiredRole && !roles.includes(requiredRole)) {
    return false;
  }

  if (requiredPermission && !permissions.includes(requiredPermission)) {
    return false;
  }

  return true;
}
