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
  Users,
  ShieldCheck,
  UserCheck,
  Building2,
  Layers,
  Radio,
  Banknote,
  Cpu,
  Sparkles,
  Truck,
  Cog,
  BellRing,
  Grid,
  SlidersHorizontal,
  ClipboardList,
  GitBranch,
  FileSpreadsheet,
  ShieldAlert,
  UserMinus,
  MessageSquare,
  Compass,
  Navigation,
  SquareSlash,
  Clock,
  Flame,
  Snowflake,
  Mail,
  FileCode2,
  Activity,
  CalendarDays
} from "lucide-react";
import { IconComponentType } from "@/components/common/icons/AppIcon";

export type NavigationGroup =
  | "Identity & Access"
  | "Reseller & Billing"
  | "Connectivity & SIM"
  | "Hardware & Devices"
  | "Vehicle Assets"
  | "Operations & Governance"
  | "Organization Hierarchy"
  | "Fleet Assets"
  | "Rules & Governance"
  | "Activity & Motion"
  | "Telemetry & Sensors"
  | "Operations & Tracking"
  | "Communications & Logs"
  | "Automation & Catalog"
  | "Spatial Telematics";

export interface NavSubItemConfig {
  key: string;
  name: string;
  path: string;
  group: NavigationGroup;
  icon?: IconComponentType;
  permission?: string;
  role?: string;
  badge?: number | string;
  badgeType?: "alert" | "counter" | "cyan";
}

export interface NavItemConfig {
  key: string;
  name: string;
  path: string;
  icon: IconComponentType;
  permission?: string;
  role?: string;
  badge?: number | string;
  badgeType?: "alert" | "counter" | "cyan";
  children?: NavSubItemConfig[];
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
        permission: "VIEW:REPORT",
        children: [
          {
            key: "reports-navigator",
            name: "Reports Hub",
            path: "/reports",
            group: "Automation & Catalog",
            icon: Grid
          },
          {
            key: "travel-summary",
            name: "Travel Summary",
            path: "/reports/travel-summary",
            group: "Activity & Motion",
            icon: Compass
          },
          {
            key: "trip-summary",
            name: "Trip Summary",
            path: "/reports/trip-summary",
            group: "Activity & Motion",
            icon: Navigation
          },
          {
            key: "stoppage-summary",
            name: "Stoppage Summary",
            path: "/reports/stoppage-summary",
            group: "Activity & Motion",
            icon: SquareSlash
          },
          {
            key: "idle-summary",
            name: "Idle Summary",
            path: "/reports/idle-summary",
            group: "Activity & Motion",
            icon: Clock
          },
          {
            key: "ignition-summary",
            name: "Ignition Summary",
            path: "/reports/ignition-summary",
            group: "Telemetry & Sensors",
            icon: Flame
          },
          {
            key: "inactive-summary",
            name: "Inactive Summary",
            path: "/reports/inactive-summary",
            group: "Telemetry & Sensors",
            icon: Radio
          },
          {
            key: "ac-summary",
            name: "AC Summary",
            path: "/reports/ac-summary",
            group: "Telemetry & Sensors",
            icon: Snowflake
          },
          {
            key: "digital-port",
            name: "Digital Port Summary",
            path: "/reports/digital-port-summary",
            group: "Telemetry & Sensors",
            icon: Cpu
          },
          {
            key: "vehicle-status",
            name: "Vehicle Status",
            path: "/reports/vehicle-status",
            group: "Operations & Tracking",
            icon: Car
          },
          {
            key: "vehicle-location",
            name: "Vehicle Location",
            path: "/reports/vehicle-location",
            group: "Operations & Tracking",
            icon: MapPin
          },
          {
            key: "vehicle-activation",
            name: "Vehicle Activation",
            path: "/reports/vehicle-activation",
            group: "Operations & Tracking",
            icon: ShieldCheck
          },
          {
            key: "sms-email",
            name: "SMS & Email Logs",
            path: "/reports/sms-email-summary",
            group: "Communications & Logs",
            icon: Mail
          },
          {
            key: "device-log",
            name: "Device Log",
            path: "/reports/device-log",
            group: "Communications & Logs",
            icon: FileCode2
          },
          {
            key: "system-log",
            name: "System Log",
            path: "/reports/system-log",
            group: "Communications & Logs",
            icon: Activity
          },
          {
            key: "scheduled-reports",
            name: "Scheduled Reports",
            path: "/reports/scheduled-reports",
            group: "Automation & Catalog",
            icon: CalendarDays
          }
        ]
      },
      {
        key: "poi",
        name: "POI",
        path: "/poi",
        icon: MapPin,
        permission: "VIEW:POI",
        children: [
          {
            key: "poi-hub",
            name: "POI Hub",
            path: "/poi",
            icon: Compass,
            group: "Spatial Telematics"
          },
          {
            key: "poi-overview",
            name: "POI Overview",
            path: "/poi/overview",
            icon: MapPin,
            group: "Spatial Telematics"
          },
          {
            key: "poi-add",
            name: "Add POI",
            path: "/poi/new",
            icon: Navigation,
            group: "Spatial Telematics"
          },
          {
            key: "poi-summary-a",
            name: "POI Summary-A",
            path: "/poi/summary-a",
            icon: Clock,
            group: "Spatial Telematics"
          },
          {
            key: "poi-summary-b",
            name: "POI Summary-B",
            path: "/poi/summary-b",
            icon: Truck,
            group: "Spatial Telematics"
          },
          {
            key: "poi-missed",
            name: "Missed POI",
            path: "/poi/missed",
            icon: ShieldAlert,
            group: "Spatial Telematics"
          },
          {
            key: "poi-collection",
            name: "Collection Address",
            path: "/poi/collection-address",
            icon: FileSpreadsheet,
            group: "Spatial Telematics"
          }
        ]
      },
      {
        key: "geofence",
        name: "Geofence",
        path: "/geofence",
        icon: Map,
        permission: "VIEW:GEOFENCE",
        children: [
          {
            key: "geofence-hub",
            name: "Geofence Hub",
            path: "/geofence",
            icon: Compass,
            group: "Spatial Telematics"
          },
          {
            key: "geofence-overview",
            name: "Geofence Directory",
            path: "/geofence/overview",
            icon: Map,
            group: "Spatial Telematics"
          },
          {
            key: "geofence-new",
            name: "Create Geofence",
            path: "/geofence/new",
            icon: Navigation,
            group: "Spatial Telematics"
          },
          {
            key: "geofence-summary-a",
            name: "Zone Activity (A)",
            path: "/geofence/summary-a",
            icon: Activity,
            group: "Spatial Telematics"
          },
          {
            key: "geofence-summary-b",
            name: "Vehicle Crossings (B)",
            path: "/geofence/summary-b",
            icon: Truck,
            group: "Spatial Telematics"
          },
          {
            key: "geofence-out",
            name: "Out-of-Geofence",
            path: "/geofence/out-of-geofence",
            icon: ShieldAlert,
            group: "Spatial Telematics"
          }
        ]
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
        icon: Sliders,
        children: [
          // 1. Identity & Access
          {
            key: "users",
            name: "User Overview",
            path: "/system-config/users",
            group: "Identity & Access",
            icon: Users
          },
          {
            key: "user-groups",
            name: "User Groups",
            path: "/system-config/user-groups",
            group: "Identity & Access",
            icon: Users
          },
          {
            key: "roles",
            name: "Roles",
            path: "/system-config/roles",
            group: "Identity & Access",
            icon: ShieldCheck
          },
          {
            key: "user-profiles",
            name: "User Profiles",
            path: "/system-config/user-profiles",
            group: "Identity & Access",
            icon: UserCheck
          },
          // 2. Reseller & Billing
          {
            key: "resellers",
            name: "Resellers",
            path: "/system-config/resellers",
            group: "Reseller & Billing",
            icon: Building2
          },
          {
            key: "reseller-features",
            name: "Reseller Features",
            path: "/system-config/reseller-features",
            group: "Reseller & Billing",
            icon: Layers
          },
          // 3. Connectivity & SIM
          {
            key: "sim-providers",
            name: "SIM Providers",
            path: "/system-config/sim-providers",
            group: "Connectivity & SIM",
            icon: Radio
          },
          {
            key: "tariff-plans",
            name: "Tariff Plans",
            path: "/system-config/tariff-plans",
            group: "Connectivity & SIM",
            icon: Banknote
          },
          // 4. Hardware & Devices
          {
            key: "device-models",
            name: "Device Models",
            path: "/system-config/device-models",
            group: "Hardware & Devices",
            icon: Cpu
          },
          {
            key: "device-features",
            name: "Device Features",
            path: "/system-config/device-features",
            group: "Hardware & Devices",
            icon: Sparkles
          },
          // 5. Vehicle Assets
          {
            key: "vehicle-types",
            name: "Vehicle Types",
            path: "/system-config/vehicle-types",
            group: "Vehicle Assets",
            icon: Truck
          },
          {
            key: "vehicle-models",
            name: "Vehicle Models",
            path: "/system-config/vehicle-models",
            group: "Vehicle Assets",
            icon: Car
          },
          {
            key: "vehicle-features",
            name: "Vehicle Features",
            path: "/system-config/vehicle-features",
            group: "Vehicle Assets",
            icon: Cog
          },
          // 6. Operations & Governance
          {
            key: "alert-types",
            name: "Alert Types",
            path: "/system-config/alert-types",
            group: "Operations & Governance",
            icon: BellRing
          },
          {
            key: "poi-types",
            name: "POI Types",
            path: "/system-config/poi-types",
            group: "Operations & Governance",
            icon: MapPin
          },
          {
            key: "modules",
            name: "System Modules",
            path: "/system-config/modules",
            group: "Operations & Governance",
            icon: Grid
          },
          {
            key: "report-customization",
            name: "Report Customization",
            path: "/system-config/report-customization",
            group: "Operations & Governance",
            icon: SlidersHorizontal
          },
          {
            key: "audit-log",
            name: "Audit Log",
            path: "/system-config/audit-log",
            group: "Operations & Governance",
            icon: ClipboardList
          }
        ]
      },
      {
        key: "app-config",
        name: "App Config",
        path: "/app-config",
        icon: Settings,
        children: [
          // 1. Organization Hierarchy
          {
            key: "companies",
            name: "Companies",
            path: "/app-config/companies",
            group: "Organization Hierarchy",
            icon: Building2
          },
          {
            key: "branches",
            name: "Branches",
            path: "/app-config/branches",
            group: "Organization Hierarchy",
            icon: GitBranch
          },
          {
            key: "employees",
            name: "Employees",
            path: "/app-config/employees",
            group: "Organization Hierarchy",
            icon: Users
          },
          // 2. Fleet Assets
          {
            key: "vehicles",
            name: "Added Vehicles",
            path: "/app-config/vehicles",
            group: "Fleet Assets",
            icon: Truck
          },
          {
            key: "added-devices",
            name: "Added Devices",
            path: "/app-config/added-devices",
            group: "Fleet Assets",
            icon: Layers
          },
          // 3. Hardware & Connectivity
          {
            key: "gps-devices",
            name: "GPS Devices",
            path: "/app-config/gps-devices",
            group: "Hardware & Devices",
            icon: Cpu
          },
          {
            key: "sim-cards",
            name: "SIM Cards",
            path: "/app-config/sim-cards",
            group: "Connectivity & SIM",
            icon: Radio
          },
          // 4. Rules & Governance
          {
            key: "master-data",
            name: "Master Data",
            path: "/app-config/master-data",
            group: "Rules & Governance",
            icon: FileSpreadsheet
          },
          {
            key: "master-data-xls",
            name: "Master Data (XLS)",
            path: "/app-config/master-data-xls",
            group: "Rules & Governance",
            icon: FileSpreadsheet,
            badge: "BULK",
            badgeType: "cyan"
          },
          {
            key: "company-rules",
            name: "Company Rules",
            path: "/app-config/company-rules",
            group: "Rules & Governance",
            icon: ShieldAlert
          },
          {
            key: "remove-entity",
            name: "Remove Entity",
            path: "/app-config/remove-entity",
            group: "Rules & Governance",
            icon: UserMinus
          },
          {
            key: "sms-allocation",
            name: "SMS Allocation",
            path: "/app-config/sms-allocation",
            group: "Rules & Governance",
            icon: MessageSquare
          }
        ]
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
