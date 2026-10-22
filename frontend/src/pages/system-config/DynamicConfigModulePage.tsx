import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { ConfigEntityPage } from "@/pages/system-config/ConfigEntityPage";
import { systemConfigRegistry } from "@/config/systemConfigs";

export const DynamicConfigModulePage: React.FC = () => {
  const { moduleKey } = useParams<{ moduleKey: string }>();
  const normalizedKey = moduleKey?.toLowerCase().trim();

  if (!normalizedKey || !systemConfigRegistry[normalizedKey]) {
    return <Navigate to="/system-config" replace />;
  }

  const config = systemConfigRegistry[normalizedKey];
  return <ConfigEntityPage key={normalizedKey} config={config} />;
};

export default DynamicConfigModulePage;
