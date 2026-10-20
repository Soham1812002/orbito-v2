import React from "react";
import {
  LayoutDashboard,
  Car,
  FileText,
  MapPin,
  Map,
  Bell,
  CreditCard,
  Wrench,
  Sliders,
  Settings,
  Users
} from "lucide-react";
import { IconComponentType } from "../../common/icons/AppIcon";

export interface NavItemConfig {
  key: string;
  name: string;
  path: string;
  icon: IconComponentType;
  permission?: string;
  role?: string;
  badge?: number | string;
  badgeType?: "alert" | "counter" | "cyan";
}

export interface NavSectionConfig {
  id: string;
  title?: string;
  items: NavItemConfig[];
}

export const navigationSections: NavSectionConfig[] = [
  {
    id: "core",
    items: [
      {
        key: "dashboard",
        name: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard
      },
      {
        key: "vehicles",
        name: "Vehicles",
        path: "/vehicles",
        icon: Car,
        permission: "VIEW:VEHICLE"
      },
      {
        key: "reports",
        name: "Reports",
        path: "/reports",
        icon: FileText,
        permission: "VIEW:REPORT"
      },
      {
        key: "poi",
        name: "POI",
        path: "/poi",
        icon: MapPin,
        permission: "VIEW:POI"
      },
      {
        key: "geofence",
        name: "Geofence",
        path: "/geofence",
        icon: Map,
        permission: "VIEW:GEOFENCE"
      },
      {
        key: "alerts",
        name: "Alerts",
        path: "/alerts",
        icon: Bell,
        badge: 3,
        badgeType: "alert"
      }
    ]
  },
  {
    id: "operations",
    title: "Operations",
    items: [
      {
        key: "licensing",
        name: "Licensing",
        path: "/licensing",
        icon: CreditCard
      },
      {
        key: "maintenance",
        name: "Maintenance",
        path: "/maintenance",
        icon: Wrench
      }
    ]
  },
  {
    id: "system",
    title: "Administration",
    items: [
      {
        key: "sys-config",
        name: "Sys Config",
        path: "/system-config",
        icon: Sliders
      },
      {
        key: "app-config",
        name: "App Config",
        path: "/app-config",
        icon: Settings
      },
      {
        key: "users",
        name: "User Rights",
        path: "/users",
        icon: Users,
        permission: "VIEW:USER"
      }
    ]
  }
];
