import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { AppConfigEntityPage } from "./AppConfigEntityPage";
import { appConfigRegistry } from "./configs";

export const DynamicAppConfigModulePage: React.FC = () => {
  const { moduleKey } = useParams<{ moduleKey: string }>();
  const normalizedKey = moduleKey?.toLowerCase().trim();

  if (!normalizedKey || !appConfigRegistry[normalizedKey]) {
    return <Navigate to="/app-config" replace />;
  }

  const config = appConfigRegistry[normalizedKey];
  return <AppConfigEntityPage key={normalizedKey} config={config} />;
};

export default DynamicAppConfigModulePage;
