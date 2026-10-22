import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { PageLoadingFallback } from "@/components/feedback/PageLoadingFallback";

export const SystemConfigLayout: React.FC = () => {
  return (
    <div className="w-full">
      <Suspense fallback={<PageLoadingFallback />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default SystemConfigLayout;
