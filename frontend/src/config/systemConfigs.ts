import { ConfigEntityConfig } from "@/types/config.types";

export const systemConfigRegistry: Record<string, ConfigEntityConfig> = {
  // 1. Resellers
  resellers: {
    moduleKey: "resellers",
    title: "Reseller Overview",
    singularTitle: "Reseller",
    category: "Reseller & Billing",
    badge: "RESELLERS",
    description: "Manage reseller contracts, operating addresses, fleet capacity, and token validity across the network.",
    columns: [
      { key: "code", label: "Reseller Code" },
      { key: "name", label: "Reseller Name" },
      { key: "legalEntity", label: "Legal Entity" },
      { key: "state", label: "State / Region" },
      { key: "maxVehicles", label: "Max Vehicles" },
      { key: "tokenExpiry", label: "Token Expiry" }
    ],
    fields: [
      { key: "name", label: "Reseller Name", type: "text", required: true, placeholder: "e.g. Apex Telematics LLP" },
      { key: "code", label: "Reseller Code", type: "text", required: true, placeholder: "e.g. IOR-AMD-01" },
      { key: "legalEntity", label: "Legal Entity Name", type: "text", required: true, placeholder: "e.g. Apex Logistics India Pvt Ltd" },
      {
        key: "state",
        label: "State / Region",
        type: "select",
        required: true,
        options: [
          { label: "Gujarat", value: "Gujarat" },
          { label: "Maharashtra", value: "Maharashtra" },
          { label: "Delhi NCR", value: "Delhi NCR" },
          { label: "Karnataka", value: "Karnataka" },
          { label: "Tamil Nadu", value: "Tamil Nadu" }
        ]
      },
      { key: "maxVehicles", label: "Maximum Vehicle Allocation", type: "number", required: true, placeholder: "1000" },
      { key: "tokenExpiry", label: "Token Expiry Date", type: "text", placeholder: "2027-09-30" }
    ]
  },

  // 2. Reseller Features
  "reseller-features": {
    moduleKey: "reseller-features",
    title: "Reseller Assign Features",
    singularTitle: "Feature Allocation",
    category: "Reseller & Billing",
    badge: "CAPABILITY MATRIX",
    description: "Assign platform plan capabilities and screen-level access quotas across registered reseller entities.",
    columns: [
      { key: "resellerName", label: "Reseller" },
      { key: "planTier", label: "Plan Tier" },
      { key: "maxVehicles", label: "Vehicle Quota" },
      { key: "telematicsMode", label: "Telematics Mode" }
    ],
    fields: [
      { key: "resellerName", label: "Reseller Name", type: "text", required: true },
      {
        key: "planTier",
        label: "Plan Tier",
        type: "select",
        required: true,
        options: [
          { label: "Enterprise Fleet (All Features)", value: "Enterprise Fleet" },
          { label: "Professional Telematics", value: "Professional" },
          { label: "Standard Track Only", value: "Standard" }
        ]
      },
      { key: "maxVehicles", label: "Allocated Quota", type: "number", required: true },
      {
        key: "telematicsMode",
        label: "Telematics Mode",
        type: "select",
        options: [
          { label: "Live 5s Polling + CANbus OBD", value: "Live CANbus" },
          { label: "Standard 30s GPS Tracking", value: "Standard GPS" },
          { label: "Periodic Asset Tracking", value: "Periodic" }
        ]
      }
    ]
  },

  // 3. User Groups
  "user-groups": {
    moduleKey: "user-groups",
    title: "User Group Overview",
    singularTitle: "User Group",
    category: "Identity & Access",
    badge: "GROUPS",
    description: "Manage organizational structures, project scopes, and user assignments across the fleet network.",
    columns: [
      { key: "groupId", label: "Group Code" },
      { key: "name", label: "Group Name" },
      { key: "structure", label: "Organizational Structure" },
      { key: "project", label: "Project Scope" },
      { key: "activeUsers", label: "Active Members" }
    ],
    fields: [
      { key: "name", label: "Group Name", type: "text", required: true, placeholder: "e.g. West Zone Live Tracking" },
      { key: "structure", label: "Organizational Structure", type: "text", required: true, placeholder: "e.g. Regional Operations" },
      { key: "project", label: "Project Name", type: "text", required: true, placeholder: "e.g. Western Region Dispatch" }
    ]
  },

  // 4. Roles
  roles: {
    moduleKey: "roles",
    title: "Role Management",
    singularTitle: "Role",
    category: "Identity & Access",
    badge: "ROLES",
    description: "Configure system roles, privileges, and action authorization.",
    columns: [
      { key: "roleName", label: "Role Name" },
      { key: "description", label: "Description" },
      { key: "usersCount", label: "Assigned Users" }
    ],
    fields: [
      { key: "roleName", label: "Role Name", type: "text", required: true, placeholder: "e.g. Dispatcher" },
      { key: "description", label: "Description", type: "textarea", placeholder: "Explain responsibilities and permissions" }
    ]
  },

  // 5. User Profiles
  "user-profiles": {
    moduleKey: "user-profiles",
    title: "User Profile List",
    singularTitle: "User Profile",
    category: "Identity & Access",
    badge: "PROFILES",
    description: "Manage module-level granular CRUD permissions per user profile.",
    columns: [
      { key: "profileName", label: "Profile Name" },
      { key: "role", label: "Default Role" },
      { key: "modulesCount", label: "Accessible Modules" }
    ],
    fields: [
      { key: "profileName", label: "Profile Name", type: "text", required: true },
      {
        key: "role",
        label: "Associated Role",
        type: "select",
        required: true,
        options: [
          { label: "SUPER_ADMIN", value: "SUPER_ADMIN" },
          { label: "FLEET_MANAGER", value: "FLEET_MANAGER" },
          { label: "DISPATCHER", value: "DISPATCHER" },
          { label: "VIEWER", value: "VIEWER" }
        ]
      }
    ]
  },

  // 6. SIM Providers
  "sim-providers": {
    moduleKey: "sim-providers",
    title: "SIM Provider Overview",
    singularTitle: "SIM Provider",
    category: "Connectivity & SIM",
    badge: "PROVIDERS",
    description: "Manage mobile network telecom providers and customer support hotlines by service circle.",
    columns: [
      { key: "providerName", label: "Network Provider" },
      { key: "circle", label: "Telecom Circle" },
      { key: "supportEmail", label: "Support Email" },
      { key: "customerCare", label: "Customer Care Tel" },
      { key: "portalUrl", label: "Carrier M2M Portal" }
    ],
    fields: [
      { key: "providerName", label: "Provider Name", type: "text", required: true, placeholder: "e.g. Airtel M2M" },
      {
        key: "circle",
        label: "Telecom Circle",
        type: "select",
        required: true,
        options: [
          { label: "Gujarat", value: "Gujarat" },
          { label: "Maharashtra & Goa", value: "Maharashtra & Goa" },
          { label: "Delhi NCR", value: "Delhi NCR" },
          { label: "Karnataka", value: "Karnataka" },
          { label: "Pan India", value: "Pan India" }
        ]
      },
      { key: "supportEmail", label: "Support Email", type: "text", required: true, placeholder: "iot-support@airtel.com" },
      { key: "customerCare", label: "Customer Care Tel", type: "text", required: true, placeholder: "+91 1800 102 9933" },
      { key: "portalUrl", label: "M2M Portal URL", type: "text", placeholder: "https://airtel.in/iot" }
    ]
  },

  // 7. Tariff Plans
  "tariff-plans": {
    moduleKey: "tariff-plans",
    title: "Tariff Plan Overview",
    singularTitle: "Tariff Plan",
    category: "Connectivity & SIM",
    badge: "PLANS",
    description: "Manage SIM data rates, billing allowances, and validity periods by provider.",
    columns: [
      { key: "planName", label: "Plan Name" },
      { key: "provider", label: "Provider" },
      { key: "circle", label: "Circle" },
      { key: "validityDays", label: "Validity (Days)" },
      { key: "dataAllowance", label: "Data Cap" },
      { key: "price", label: "Rate (₹)" }
    ],
    fields: [
      { key: "planName", label: "Plan Name", type: "text", required: true, placeholder: "e.g. Telematics Pro 1GB/Mo" },
      { key: "provider", label: "Provider Name", type: "text", required: true, placeholder: "Airtel IoT" },
      { key: "validityDays", label: "Validity (Days)", type: "number", required: true, placeholder: "365" },
      { key: "dataAllowance", label: "Monthly Data Allowance", type: "text", required: true, placeholder: "2 GB" },
      { key: "price", label: "Price (INR ₹)", type: "number", required: true, placeholder: "1200" }
    ]
  },

  // 8. Device Models
  "device-models": {
    moduleKey: "device-models",
    title: "Device Model List",
    singularTitle: "Device Model",
    category: "Hardware & Devices",
    badge: "MODELS",
    description: "Manage GPS telematics tracker hardware, TCP ports, and protocol configs.",
    columns: [
      { key: "modelCode", label: "Model Code" },
      { key: "modelName", label: "Model Name" },
      { key: "port", label: "TCP/UDP Port" },
      { key: "protocol", label: "Protocol" },
      { key: "defaultPassword", label: "Default PWD" }
    ],
    fields: [
      { key: "modelCode", label: "Model Code", type: "text", required: true, placeholder: "5027" },
      { key: "modelName", label: "Hardware Model Name", type: "text", required: true, placeholder: "VT-800 4G Pro" },
      { key: "port", label: "Communication Port", type: "number", required: true, placeholder: "5027" },
      { key: "protocol", label: "Parser Protocol", type: "text", placeholder: "GT06 / JT808 / Teltonika" },
      { key: "defaultPassword", label: "Default Device Password", type: "text", placeholder: "000000" }
    ]
  },

  // 9. Device Features
  "device-features": {
    moduleKey: "device-features",
    title: "Device Feature List",
    singularTitle: "Device Feature",
    category: "Hardware & Devices",
    badge: "FEATURES",
    description: "Define immobilizers, fuel probes, SOS, RFID, and temperature sensors.",
    columns: [
      { key: "featureName", label: "Feature Name" },
      { key: "category", label: "Hardware Category" },
      { key: "description", label: "Description" }
    ],
    fields: [
      { key: "featureName", label: "Feature Name", type: "text", required: true, placeholder: "e.g. Remote Engine Immobilizer" },
      {
        key: "category",
        label: "Feature Category",
        type: "select",
        options: [
          { label: "Control Output (Relay)", value: "Relay Output" },
          { label: "Analog Sensor (Fuel/Temp)", value: "Sensor Input" },
          { label: "Digital Input (Ignition/Door)", value: "Digital Input" },
          { label: "Driver ID (RFID/iButton)", value: "Identity Module" }
        ]
      },
      { key: "description", label: "Description", type: "textarea", placeholder: "Operational capabilities and wiring spec" }
    ]
  },

  // 10. Vehicle Types
  "vehicle-types": {
    moduleKey: "vehicle-types",
    title: "Vehicle Type List",
    singularTitle: "Vehicle Type",
    category: "Vehicle Assets",
    badge: "TYPES",
    description: "Classify fleet vehicles by category, tonnage, and wheel configuration.",
    columns: [
      { key: "typeName", label: "Type Name" },
      { key: "wheels", label: "Wheel Count" },
      { key: "description", label: "Classification Description" }
    ],
    fields: [
      { key: "typeName", label: "Type Name", type: "text", required: true, placeholder: "e.g. Heavy Commercial Vehicle (HCV)" },
      { key: "wheels", label: "Number of Wheels", type: "number", required: true, placeholder: "10" },
      { key: "description", label: "Description", type: "textarea", placeholder: "Tonnage, licensing class, and speed governor limit" }
    ]
  },

  // 11. Vehicle Models
  "vehicle-models": {
    moduleKey: "vehicle-models",
    title: "Vehicle Model List",
    singularTitle: "Vehicle Model",
    category: "Vehicle Assets",
    badge: "VEHICLE MODELS",
    description: "Maintain manufacturer brands, models, fuel specifications, and icons.",
    columns: [
      { key: "brand", label: "Brand" },
      { key: "modelName", label: "Model Name" },
      { key: "vehicleType", label: "Vehicle Type" },
      { key: "fuelType", label: "Fuel Specification" },
      { key: "bsCategory", label: "Emission Standard" }
    ],
    fields: [
      { key: "brand", label: "Manufacturer Brand", type: "text", required: true, placeholder: "e.g. Tata Motors" },
      { key: "modelName", label: "Model Name", type: "text", required: true, placeholder: "e.g. Prima 5530.S" },
      { key: "vehicleType", label: "Vehicle Type", type: "text", required: true, placeholder: "Heavy Commercial Truck" },
      {
        key: "fuelType",
        label: "Fuel Specification",
        type: "select",
        options: [
          { label: "Diesel", value: "Diesel" },
          { label: "CNG", value: "CNG" },
          { label: "Electric (EV)", value: "Electric" }
        ]
      },
      {
        key: "bsCategory",
        label: "Bharat Stage Emission Category",
        type: "select",
        options: [
          { label: "BS-VI (Phase 2 OBD)", value: "BS-VI" },
          { label: "BS-IV", value: "BS-IV" },
          { label: "Zero Emission EV", value: "EV Zero Emission" }
        ]
      }
    ]
  },

  // 12. Vehicle Features
  "vehicle-features": {
    moduleKey: "vehicle-features",
    title: "Vehicle Feature List",
    singularTitle: "Vehicle Feature",
    category: "Vehicle Assets",
    badge: "FEATURES",
    description: "Configure optional vehicle attributes (refrigeration, tail-lift, PTO).",
    columns: [
      { key: "featureName", label: "Feature Name" },
      { key: "category", label: "Feature Category" },
      { key: "description", label: "Description" }
    ],
    fields: [
      { key: "featureName", label: "Feature Name", type: "text", required: true, placeholder: "Fuel Monitoring" },
      { key: "category", label: "Feature Category", type: "text", placeholder: "Sensor / Auxiliary" },
      { key: "description", label: "Description", type: "textarea", placeholder: "Feature usage instructions" }
    ]
  },

  // 13. Alert Types
  "alert-types": {
    moduleKey: "alert-types",
    title: "Alert Type List",
    singularTitle: "Alert Type",
    category: "Operations & Governance",
    badge: "ALERT TYPES",
    description: "Define alert events, severity tiers, notification sounds, and broadcast rules.",
    columns: [
      { key: "alertName", label: "Alert Name" },
      { key: "category", label: "Category" },
      { key: "severity", label: "Severity" },
      { key: "notificationSound", label: "Sound Tone" }
    ],
    fields: [
      { key: "alertName", label: "Alert Name", type: "text", required: true, placeholder: "Overspeed Violation" },
      {
        key: "category",
        label: "Alert Category",
        type: "select",
        options: [
          { label: "Driving Safety", value: "Driving Safety" },
          { label: "Geofence Compliance", value: "Geofence" },
          { label: "Hardware & Tamper", value: "Hardware & Tamper" },
          { label: "Maintenance Due", value: "Maintenance" }
        ]
      },
      {
        key: "severity",
        label: "Default Severity Tier",
        type: "select",
        options: [
          { label: "HIGH (Critical)", value: "HIGH" },
          { label: "MEDIUM (Warning)", value: "MEDIUM" },
          { label: "LOW (Informational)", value: "LOW" }
        ]
      },
      { key: "notificationSound", label: "Sound Tone File", type: "text", placeholder: "alert_klaxon.mp3" }
    ]
  },

  // 14. POI Types
  "poi-types": {
    moduleKey: "poi-types",
    title: "POI Type List",
    singularTitle: "POI Type",
    category: "Operations & Governance",
    badge: "TYPES",
    description: "Classify points of interest (depots, warehouses, ports, customer hubs).",
    columns: [
      { key: "typeName", label: "POI Category Name" },
      { key: "iconCode", label: "Map Marker Icon" },
      { key: "description", label: "Operational Purpose" }
    ],
    fields: [
      { key: "typeName", label: "POI Type Name", type: "text", required: true, placeholder: "e.g. Distribution Warehouse" },
      { key: "iconCode", label: "Marker Icon Token", type: "text", placeholder: "warehouse-marker" },
      { key: "description", label: "Description", type: "textarea", placeholder: "Usage criteria for dispatch and route plans" }
    ]
  },

  // 15. Modules
  modules: {
    moduleKey: "modules",
    title: "System Module List",
    singularTitle: "Navigation Module",
    category: "Operations & Governance",
    badge: "MODULES",
    description: "Manage application navigation hierarchy, route paths, and permissions.",
    columns: [
      { key: "moduleName", label: "Module Name" },
      { key: "parentModule", label: "Parent Section" },
      { key: "path", label: "Route Path" },
      { key: "permission", label: "Required Permission" }
    ],
    fields: [
      { key: "moduleName", label: "Module Name", type: "text", required: true, placeholder: "e.g. Telematics Maps" },
      { key: "parentModule", label: "Parent Section", type: "text", required: true, placeholder: "Core Navigation" },
      { key: "path", label: "Route Path", type: "text", required: true, placeholder: "/telematics-maps" },
      { key: "permission", label: "Required Permission", type: "text", placeholder: "VIEW:MAPS" }
    ]
  },

  // 16. Report Customization
  "report-customization": {
    moduleKey: "report-customization",
    title: "Report Customization",
    singularTitle: "Report Schema",
    category: "Operations & Governance",
    badge: "REPORTS",
    description: "Customize report schemas, column projections, and metrics by company.",
    columns: [
      { key: "customizationName", label: "Report Schema Name" },
      { key: "reportScreen", label: "Target Screen" },
      { key: "company", label: "Assigned Company" },
      { key: "metricFormat", label: "Metric Units" }
    ],
    fields: [
      { key: "customizationName", label: "Schema Name", type: "text", required: true, placeholder: "Ignition Summary Custom Export" },
      { key: "reportScreen", label: "Report Screen", type: "text", required: true, placeholder: "Ignition Summary" },
      { key: "company", label: "Company Filter", type: "text", required: true, placeholder: "Apex Logistics India" },
      {
        key: "metricFormat",
        label: "Measurement Standard",
        type: "select",
        options: [
          { label: "Metric (km, L, km/h)", value: "Metric (km, L)" },
          { label: "Imperial (mi, gal, mph)", value: "Imperial (mi, gal)" }
        ]
      }
    ]
  }
};
