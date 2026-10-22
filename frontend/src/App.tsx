import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthProvider";
import { RouteRenderer } from "@/routes/RouteRenderer";
import { routes } from "@/routes";
import { PageLoadingFallback } from "@/components/feedback/PageLoadingFallback";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoadingFallback variant="full" message="Initializing Orbito Fleet Workspace..." />}>
        <AuthProvider>
          <RouteRenderer routes={routes} />
        </AuthProvider>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
