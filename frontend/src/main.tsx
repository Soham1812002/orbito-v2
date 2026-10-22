import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { I18nextProvider } from "react-i18next";
import { store } from "@/redux/store";
import { queryClient } from "@/lib/queryClient";
import { ThemeProvider } from "@/context/ThemeContext";
import { GlobalContextProvider } from "@/context/GlobalContextProvider";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import i18n from "@/lib/i18n";
import App from "@/App";
import "@/index.css";

// Register AG Grid Community Features globally
ModuleRegistry.registerModules([AllCommunityModule]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Toaster position="top-right" />
          <I18nextProvider i18n={i18n}>
            <GlobalContextProvider>
              <App />
            </GlobalContextProvider>
          </I18nextProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
