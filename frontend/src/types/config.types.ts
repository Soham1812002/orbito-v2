import React from "react";

export interface ConfigFieldDef {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "checkbox" | "password";
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  helperText?: string;
}

export interface ConfigColumnDef {
  key: string;
  label: string;
  render?: (val: any, row: any) => React.ReactNode;
}

export interface ConfigEntityConfig {
  moduleKey: string;
  title: string;
  singularTitle: string;
  category: string;
  badge: string;
  description: string;
  initialItems?: Record<string, any>[];
  columns: ConfigColumnDef[];
  fields: ConfigFieldDef[];
}

export interface SystemConfigItem extends Record<string, any> {
  id: string;
  _id?: string;
  moduleKey?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppConfigItem extends Record<string, any> {
  id: string;
  _id?: string;
  moduleKey?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppConfigStats {
  companies: number;
  branches: number;
  vehicles: number;
  devices: number;
  employees: number;
  totalConfigs: number;
  counts: Record<string, number>;
}
