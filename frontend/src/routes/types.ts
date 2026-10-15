import React from "react";

export interface AppRoute {
  path: string;
  element: React.ReactNode;
  children?: AppRoute[];
  protection?: {
    requiredPermission?: string;
    requiredRole?: string;
  };
  meta?: {
    title: string;
    icon?: string;
    hideFromMenu?: boolean;
  };
}
