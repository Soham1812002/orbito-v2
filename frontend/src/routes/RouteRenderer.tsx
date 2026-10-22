import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AppRoute } from "@/routes/types";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { PageLoadingFallback } from "@/components/feedback/PageLoadingFallback";

interface RouteRendererProps {
  routes: AppRoute[];
}

export const RouteRenderer: React.FC<RouteRendererProps> = ({ routes }) => {
  const renderRoutes = (routeList: AppRoute[]) => {
    return routeList.map((route, index) => {
      let element = (
        <Suspense fallback={<PageLoadingFallback />}>
          {route.element}
        </Suspense>
      );

      if (route.protection) {
        element = (
          <ProtectedRoute
            requiredPermission={route.protection.requiredPermission}
            requiredRole={route.protection.requiredRole}
          >
            {element}
          </ProtectedRoute>
        );
      }

      if (route.children && route.children.length > 0) {
        return (
          <Route key={`${route.path}-${index}`} path={route.path} element={element}>
            {renderRoutes(route.children)}
          </Route>
        );
      }

      return <Route key={`${route.path}-${index}`} path={route.path} element={element} />;
    });
  };

  return <Routes>{renderRoutes(routes)}</Routes>;
};

