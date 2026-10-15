import React from "react";
import { SidebarProvider } from "./SidebarContext";

export const GlobalContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return <SidebarProvider>{children}</SidebarProvider>;
};
