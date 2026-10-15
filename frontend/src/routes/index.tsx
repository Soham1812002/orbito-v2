import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import { AppRoute } from "./types";
import { AppLayout } from "../components/layout/AppLayout";

// Lazy-loaded pages for optimized code-splitting
const SignInPage = lazy(() => import("../pages/auth/SignInPage"));
const DashboardPage = lazy(() => import("../pages/dashboard/DashboardPage"));
const UsersPage = lazy(() => import("../pages/users"));
const UnauthorizedPage = lazy(() => import("../pages/unauthorized/UnauthorizedPage"));
const NotFoundPage = lazy(() => import("../pages/not-found/NotFoundPage"));

export const routes: AppRoute[] = [
  {
    path: "/sign-in",
    element: <SignInPage />,
    meta: { title: "Sign In", hideFromMenu: true }
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
