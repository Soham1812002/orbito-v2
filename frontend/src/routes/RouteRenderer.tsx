import React from "react";
import { Routes, Route } from "react-router-dom";
import { AppRoute } from "./types";
import { ProtectedRoute } from "./ProtectedRoute";

interface RouteRendererProps {
  routes: AppRoute[];
}

export const RouteRenderer: React.FC<RouteRendererProps> = ({ routes }) => {
  const renderRoutes = (routeList: AppRoute[]) => {
    return routeList.map((route, index) => {
      let element = route.element;

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
