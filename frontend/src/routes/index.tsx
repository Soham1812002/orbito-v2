import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import { AppRoute } from "./types";
import { AppLayout } from "../components/layout/AppLayout";

// Lazy-loaded pages for optimized code-splitting
const SignInPage = lazy(() => import("../pages/auth/SignInPage"));
const ForgotPasswordPage = lazy(() => import("../pages/auth/ForgotPasswordPage"));
const LinkConfirmationPage = lazy(() => import("../pages/auth/LinkConfirmationPage"));
const DashboardPage = lazy(() => import("../pages/dashboard/DashboardPage"));
const UsersPage = lazy(() => import("../pages/users"));
const UnauthorizedPage = lazy(() => import("../pages/unauthorized/UnauthorizedPage"));
const NotFoundPage = lazy(() => import("../pages/not-found/NotFoundPage"));
const SystemConfigLayout = lazy(() => import("../pages/system-config/SystemConfigLayout"));
const SystemConfigHubPage = lazy(() => import("../pages/system-config/SystemConfigHubPage"));
const AuditLogPage = lazy(() => import("../pages/system-config/audit-log/AuditLogPage"));
const DynamicConfigModulePage = lazy(() => import("../pages/system-config/DynamicConfigModulePage"));
const AppConfigLayout = lazy(() => import("../pages/app-config/AppConfigLayout"));
const AppConfigHubPage = lazy(() => import("../pages/app-config/AppConfigHubPage"));
const MasterDataXlsPage = lazy(() => import("../pages/app-config/MasterDataXlsPage"));
const RemoveEntityPage = lazy(() => import("../pages/app-config/RemoveEntityPage"));
const DynamicAppConfigModulePage = lazy(() => import("../pages/app-config/DynamicAppConfigModulePage"));

export const routes: AppRoute[] = [
  {
    path: "/sign-in",
    element: <SignInPage />,
    meta: { title: "Sign In", hideFromMenu: true }
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
    meta: { title: "Forgot Password", hideFromMenu: true }
  },
  {
    path: "/link-confirmation",
    element: <LinkConfirmationPage />,
    meta: { title: "Reset Link Sent", hideFromMenu: true }
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "",
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
        protection: {}, // Requires authenticated session
        meta: { title: "Dashboard", icon: "LayoutDashboard" }
      },
      {
        path: "users",
        element: <UsersPage />,
        protection: {
          requiredPermission: "VIEW:USER"
        },
        meta: { title: "Users", icon: "Users" }
      },
      {
        path: "system-config",
        element: <SystemConfigLayout />,
        protection: {},
        meta: { title: "System Config", icon: "Sliders" },
        children: [
          {
            path: "",
            element: <SystemConfigHubPage />
          },
          {
            path: "audit-log",
            element: <AuditLogPage />
          },
          {
            path: "users",
            element: <UsersPage />
          },
          {
            path: ":moduleKey",
            element: <DynamicConfigModulePage />
          }
        ]
      },
      {
        path: "app-config",
        element: <AppConfigLayout />,
        protection: {},
        meta: { title: "App Config", icon: "Settings" },
        children: [
          {
            path: "",
            element: <AppConfigHubPage />
          },
          {
            path: "master-data-xls",
            element: <MasterDataXlsPage />
          },
          {
            path: "remove-entity",
            element: <RemoveEntityPage />
          },
          {
            path: ":moduleKey",
            element: <DynamicAppConfigModulePage />
          }
        ]
      },
      {
        path: "unauthorized",
        element: <UnauthorizedPage />,
        meta: { title: "Unauthorized", hideFromMenu: true }
      }
    ]
  },
  {
    path: "*",
    element: <NotFoundPage />,
    meta: { title: "Not Found", hideFromMenu: true }
  }
];
