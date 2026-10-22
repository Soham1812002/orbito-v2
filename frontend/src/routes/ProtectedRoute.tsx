import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { hasPermission } from "@/utils/permissions";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredRole
}) => {
  const location = useLocation();
  const { currentUser, isAuthenticated } = useAppSelector((state) => state.user);

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  const authorized = hasPermission(currentUser, requiredPermission, requiredRole);
  if (!authorized) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
