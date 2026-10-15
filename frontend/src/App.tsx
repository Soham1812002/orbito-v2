import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { RouteRenderer } from "./routes/RouteRenderer";
import { routes } from "./routes";

const RouteLoadingFallback = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="flex flex-col items-center gap-3">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent dark:border-indigo-400"></div>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Loading module...</p>
    </div>
  </div>
);

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoadingFallback />}>
        <AuthProvider>
          <RouteRenderer routes={routes} />
        </AuthProvider>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
