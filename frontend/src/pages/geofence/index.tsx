import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { PageLoadingFallback } from "@/components/feedback/PageLoadingFallback";

export const GeofenceLayout: React.FC = () => {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <Outlet />
    </Suspense>
  );
};

export default GeofenceLayout;
