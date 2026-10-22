import { ConfigEntityConfig } from "@/types/config.types";
export type { ConfigEntityConfig } from "@/types/config.types";

export const appConfigRegistry: Record<string, ConfigEntityConfig> = {
  // 1. Companies
  companies: {
    moduleKey: "companies",
    title: "Company Overview",
    singularTitle: "Company",
    category: "Organization Hierarchy",
    badge: "COMPANIES",
    description: "Manage corporate accounts, enterprise clients, billing entities, and assigned fleet quotas.",
    columns: [
      { key: "code", label: "Company Code" },
      { key: "name", label: "Company Legal Name" },
      { key: "industry", label: "Industry" },
      { key: "contactPerson", label: "Contact Person" },
      { key: "phone", label: "Direct Phone" },
      { key: "city", label: "City / Region" },
      { key: "maxVehicles", label: "Vehicle Quota" },
      { key: "status", label: "Account Status" }
    ],
    fields: [
      { key: "name", label: "Company Legal Name", type: "text", required: true, placeholder: "e.g. Apex Logistics India Pvt Ltd" },
      { key: "code", label: "Company Short Code", type: "text", required: true, placeholder: "e.g. CORP-01" },
      {
        key: "industry",
        label: "Industry Domain",
        type: "select",
        required: true,
        options: [
          { label: "Logistics & Freight", value: "Logistics & Freight" },
          { label: "Cold Chain Pharma", value: "Cold Chain Pharma" },
          { label: "Oil & Gas Transport", value: "Oil & Gas Transport" },
          { label: "Passenger Transport & Bus", value: "Passenger Transport" },
          { label: "Mining & Heavy Haulage", value: "Mining & Heavy Haulage" }
        ]
      },
      { key: "contactPerson", label: "Primary Contact Person", type: "text", required: true, placeholder: "e.g. Rajesh Varma" },
      { key: "email", label: "Official Contact Email", type: "text", required: true, placeholder: "ops@company.in" },
      { key: "phone", label: "Contact Phone Number", type: "text", required: true, placeholder: "+91 98200 12345" },
      { key: "city", label: "Registered City", type: "text", required: true, placeholder: "Mumbai" },
      {
        key: "state",
        label: "State / Territory",
        type: "select",
        required: true,
        options: [
          { label: "Maharashtra", value: "Maharashtra" },
          { label: "Gujarat", value: "Gujarat" },
          { label: "Delhi NCR", value: "Delhi NCR" },
          { label: "Karnataka", value: "Karnataka" },
          { label: "Tamil Nadu", value: "Tamil Nadu" },
          { label: "Rajasthan", value: "Rajasthan" },
          { label: "West Bengal", value: "West Bengal" }
        ]
      },
      { key: "address", label: "Operating / Registered Address", type: "textarea", placeholder: "Plot number, Industrial Area..." },
      { key: "pincode", label: "Postal PIN Code", type: "text", placeholder: "400707" },
      { key: "maxVehicles", label: "Allocated Fleet Capacity", type: "number", required: true, placeholder: "250" },
      {
        key: "status",
        label: "Account Status",
        type: "select",
        options: [
          { label: "Active", value: "Active" },
          { label: "Inactive", value: "Inactive" },
          { label: "Suspended", value: "Suspended" }
        ]
      }
    ]
  },

  // 2. Branches
  branches: {
    moduleKey: "branches",
    title: "Branch Overview",
    singularTitle: "Branch",
    category: "Organization Hierarchy",
    badge: "BRANCHES",
    description: "Manage regional operating depots, dispatch terminals, and base geofence coordinates.",
    columns: [
      { key: "code", label: "Branch Code" },
      { key: "name", label: "Branch Terminal Name" },
      { key: "companyId", label: "Parent Company" },
      { key: "managerName", label: "Branch Manager" },
      { key: "city", label: "City" },
      { key: "landmarkGeofence", label: "Base Landmark / Geofence" },
      { key: "status", label: "Status" }
    ],
    fields: [
      {
        key: "companyId",
        label: "Parent Company",
        type: "select",
        required: true,
        options: [
          { label: "Apex Logistics India Pvt Ltd", value: "Apex Logistics India Pvt Ltd" },
          { label: "TransGlobe Cold Chain Corp", value: "TransGlobe Cold Chain Corp" },
          { label: "SafeHaul Petroleum Carriers", value: "SafeHaul Petroleum Carriers" },
          { label: "Metro Intercity Transit Lines", value: "Metro Intercity Transit Lines" }
        ]
      },
      { key: "name", label: "Branch Name", type: "text", required: true, placeholder: "e.g. Mumbai Port Cargo Terminal" },
      { key: "code", label: "Branch Code", type: "text", required: true, placeholder: "e.g. BOM-01" },
      { key: "managerName", label: "Branch Manager", type: "text", required: true, placeholder: "e.g. Suresh Nair" },
      { key: "phone", label: "Terminal Phone", type: "text", required: true, placeholder: "+91 98201 11223" },
      { key: "email", label: "Branch Email", type: "text", placeholder: "bom01@apexlogistics.in" },
      { key: "city", label: "City", type: "text", required: true, placeholder: "Mumbai" },
      { key: "state", label: "State", type: "text", required: true, placeholder: "Maharashtra" },
      { key: "landmarkGeofence", label: "Base Landmark / Geofence Name", type: "text", placeholder: "JNPT Container Gate 4" },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: [
          { label: "Active", value: "Active" },
          { label: "Inactive", value: "Inactive" }
        ]
      }
    ]
  },

  // 3. Added Vehicles
  vehicles: {
    moduleKey: "vehicles",
    title: "Added Vehicle Overview",
    singularTitle: "Vehicle",
    category: "Fleet Assets",
    badge: "FLEET ASSETS",
    description: "Manage registered fleet vehicles, license plates, engine specifications, and telematics status.",
    columns: [
      { key: "plateNumber", label: "Plate Number" },
      { key: "vehicleType", label: "Vehicle Type" },
      { key: "makeModel", label: "Make & Model" },
      { key: "branchId", label: "Operating Branch" },
      { key: "fuelCapacity", label: "Tank (L)" },
      { key: "odometer", label: "Odometer (km)" },
      { key: "assignedDriver", label: "Primary Driver" },
      { key: "status", label: "Status" }
    ],
    fields: [
      {
        key: "companyId",
        label: "Company",
        type: "select",
        required: true,
        options: [
          { label: "Apex Logistics India Pvt Ltd", value: "Apex Logistics India Pvt Ltd" },
          { label: "TransGlobe Cold Chain Corp", value: "TransGlobe Cold Chain Corp" },
          { label: "SafeHaul Petroleum Carriers", value: "SafeHaul Petroleum Carriers" },
          { label: "Metro Intercity Transit Lines", value: "Metro Intercity Transit Lines" }
        ]
      },
      {
        key: "branchId",
        label: "Operating Branch",
        type: "select",
        required: true,
        options: [
          { label: "Mumbai Port Cargo Terminal", value: "Mumbai Port Cargo Terminal" },
          { label: "Pune Central Freight Hub", value: "Pune Central Freight Hub" },
          { label: "Ahmedabad Inland Terminal", value: "Ahmedabad Inland Terminal" },
          { label: "Delhi NCR Central Depot", value: "Delhi NCR Central Depot" },
          { label: "Bengaluru Express Hub", value: "Bengaluru Express Hub" }
        ]
      },
      { key: "plateNumber", label: "Registration Plate Number", type: "text", required: true, placeholder: "e.g. MH-04-AZ-8821" },
      {
        key: "vehicleType",
        label: "Vehicle Type / Classification",
        type: "select",
        required: true,
        options: [
          { label: "Heavy Commercial Truck", value: "Heavy Commercial Truck" },
          { label: "Refrigerated Van", value: "Refrigerated Van" },
          { label: "Tanker", value: "Tanker" },
          { label: "Light Motor Vehicle", value: "Light Motor Vehicle" },
          { label: "Bus", value: "Bus" }
        ]
      },
      { key: "makeModel", label: "Make & Model", type: "text", required: true, placeholder: "e.g. Tata Signa 4825.T" },
      { key: "chassisNumber", label: "Chassis / VIN Number", type: "text", placeholder: "MAT712039N1A20194" },
      { key: "engineNumber", label: "Engine Serial Number", type: "text", placeholder: "ENG-CUM-20491" },
      { key: "odometer", label: "Current Odometer (km)", type: "number", required: true, placeholder: "142500" },
      { key: "fuelCapacity", label: "Fuel Tank Capacity (Liters)", type: "number", required: true, placeholder: "400" },
      { key: "assignedDriver", label: "Assigned Primary Driver", type: "text", placeholder: "e.g. Ramesh Yadav" },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: [
          { label: "Active", value: "Active" },
          { label: "In Maintenance", value: "In Maintenance" },
          { label: "Inactive", value: "Inactive" }
        ]
      }
    ]
  },

  // 4. Employees
  employees: {
    moduleKey: "employees",
    title: "Employee Overview",
    singularTitle: "Employee",
    category: "Organization Hierarchy",
    badge: "EMPLOYEES",
    description: "Manage commercial drivers, dispatch supervisors, telematics technicians, and license credentials.",
    columns: [
      { key: "employeeCode", label: "Employee Code" },
      { key: "firstName", label: "First Name" },
      { key: "lastName", label: "Last Name" },
      { key: "designation", label: "Role / Designation" },
      { key: "branchId", label: "Assigned Branch" },
      { key: "phone", label: "Contact Phone" },
      { key: "licenseNumber", label: "Driver License No." },
      { key: "status", label: "Duty Status" }
    ],
    fields: [
      {
        key: "companyId",
        label: "Company",
        type: "select",
        required: true,
        options: [
          { label: "Apex Logistics India Pvt Ltd", value: "Apex Logistics India Pvt Ltd" },
          { label: "TransGlobe Cold Chain Corp", value: "TransGlobe Cold Chain Corp" },
          { label: "SafeHaul Petroleum Carriers", value: "SafeHaul Petroleum Carriers" },
          { label: "Metro Intercity Transit Lines", value: "Metro Intercity Transit Lines" }
        ]
      },
      {
        key: "branchId",
        label: "Assigned Branch",
        type: "select",
        required: true,
        options: [
          { label: "Mumbai Port Cargo Terminal", value: "Mumbai Port Cargo Terminal" },
          { label: "Pune Central Freight Hub", value: "Pune Central Freight Hub" },
          { label: "Ahmedabad Inland Terminal", value: "Ahmedabad Inland Terminal" },
          { label: "Delhi NCR Central Depot", value: "Delhi NCR Central Depot" },
          { label: "Bengaluru Express Hub", value: "Bengaluru Express Hub" }
        ]
      },
      { key: "employeeCode", label: "Employee ID", type: "text", required: true, placeholder: "e.g. EMP-DRV-101" },
      { key: "firstName", label: "First Name", type: "text", required: true, placeholder: "Ramesh" },
      { key: "lastName", label: "Last Name", type: "text", required: true, placeholder: "Yadav" },
      {
        key: "designation",
        label: "Designation / Role",
        type: "select",
        required: true,
        options: [
          { label: "Commercial Driver", value: "Commercial Driver" },
          { label: "Depot Supervisor", value: "Depot Supervisor" },
          { label: "Telematics Technician", value: "Telematics Technician" },
          { label: "Route Controller", value: "Route Controller" }
        ]
      },
      { key: "phone", label: "Mobile Contact", type: "text", required: true, placeholder: "+91 98200 44556" },
      { key: "email", label: "Email Address", type: "text", placeholder: "driver@apexlogistics.in" },
      { key: "licenseNumber", label: "Driving License Number", type: "text", placeholder: "MH-0420150029104" },
      { key: "licenseExpiry", label: "License Expiry Date", type: "text", placeholder: "2029-08-15" },
      {
        key: "status",
        label: "Duty Status",
        type: "select",
        options: [
          { label: "Active", value: "Active" },
          { label: "On Leave", value: "On Leave" },
          { label: "Inactive", value: "Inactive" }
        ]
      }
    ]
  },

  // 5. SIM Cards
  "sim-cards": {
    moduleKey: "sim-cards",
    title: "SIM Card Overview",
    singularTitle: "SIM Card",
    category: "Hardware & Connectivity",
    badge: "SIM CARDS",
    description: "Manage telematics M2M SIM cards, carrier APNs, data plan validity, and mobile station numbers.",
    columns: [
      { key: "iccid", label: "ICCID (19-20 Digits)" },
      { key: "msisdn", label: "Mobile MSISDN" },
      { key: "operator", label: "Carrier / Operator" },
      { key: "apn", label: "APN Configuration" },
      { key: "dataPlan", label: "Data Quota" },
      { key: "planExpiry", label: "Validity Expiry" },
      { key: "status", label: "Status" }
    ],
    fields: [
      {
        key: "operator",
        label: "Telecom Carrier",
        type: "select",
        required: true,
        options: [
          { label: "Airtel M2M", value: "Airtel M2M" },
          { label: "Jio Enterprise IoT", value: "Jio Enterprise IoT" },
          { label: "Vodafone Idea M2M", value: "Vodafone Idea M2M" },
          { label: "BSNL IoT", value: "BSNL IoT" }
        ]
      },
      { key: "iccid", label: "ICCID Number (20 Digits)", type: "text", required: true, placeholder: "89914902194820194812" },
      { key: "msisdn", label: "SIM Phone Number (MSISDN)", type: "text", required: true, placeholder: "+91 98200 90101" },
      { key: "apn", label: "Access Point Name (APN)", type: "text", required: true, placeholder: "airtelgprs.com" },
      {
        key: "dataPlan",
        label: "Data Quota Plan",
        type: "select",
        required: true,
        options: [
          { label: "500 MB / mo", value: "500 MB / mo" },
          { label: "1 GB / mo", value: "1 GB / mo" },
          { label: "2 GB / mo", value: "2 GB / mo" },
          { label: "Unlimited Pooled", value: "Unlimited Pooled" }
        ]
      },
      { key: "planExpiry", label: "Plan Expiry Date", type: "text", placeholder: "2027-12-31" },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: [
          { label: "Active", value: "Active" },
          { label: "Stock", value: "Stock" },
          { label: "Suspended", value: "Suspended" }
        ]
      }
    ]
  },

  // 6. GPS Devices
  "gps-devices": {
    moduleKey: "gps-devices",
    title: "GPS Device Overview",
    singularTitle: "GPS Device",
    category: "Hardware & Connectivity",
    badge: "HARDWARE GPS",
    description: "Manage GPS hardware trackers, manufacturer IMEIs, telematics communication ports, and firmware.",
    columns: [
      { key: "imei", label: "Device IMEI (15 Digits)" },
      { key: "modelName", label: "Hardware Model" },
      { key: "serialNumber", label: "Serial Number" },
      { key: "protocol", label: "Protocol / Port" },
      { key: "firmwareVersion", label: "Firmware" },
      { key: "simIccid", label: "Bound SIM ICCID" },
      { key: "status", label: "Device State" }
    ],
    fields: [
      { key: "imei", label: "Hardware IMEI (15 Digits)", type: "text", required: true, placeholder: "864201948201948" },
      {
        key: "modelName",
        label: "Device Model",
        type: "select",
        required: true,
        options: [
          { label: "Teltonika FMB920", value: "Teltonika FMB920" },
          { label: "Concox GT06N", value: "Concox GT06N" },
          { label: "Ruptela Trace5", value: "Ruptela Trace5" },
          { label: "Queclink GV300", value: "Queclink GV300" },
          { label: "Meitrack T333", value: "Meitrack T333" }
        ]
      },
      { key: "serialNumber", label: "Manufacturer Serial Number", type: "text", placeholder: "TT-FMB-920-8841" },
      {
        key: "protocol",
        label: "Protocol & Gateway Port",
        type: "select",
        required: true,
        options: [
          { label: "Teltonika (Port 5027)", value: "Teltonika (5027)" },
          { label: "GT06 (Port 8081)", value: "GT06 (8081)" },
          { label: "Ruptela (Port 5030)", value: "Ruptela (5030)" },
          { label: "Meitrack (Port 5020)", value: "Meitrack (5020)" }
        ]
      },
      { key: "firmwareVersion", label: "Installed Firmware Version", type: "text", placeholder: "03.28.02.Rev.00" },
      { key: "simIccid", label: "Installed SIM ICCID", type: "text", placeholder: "89914902194820194812" },
      {
        key: "status",
        label: "Device State",
        type: "select",
        options: [
          { label: "Active", value: "Active" },
          { label: "Inventory", value: "Inventory" },
          { label: "In Testing", value: "In Testing" },
          { label: "RMA", value: "RMA" }
        ]
      }
    ]
  },

  // 7. Master Data
  "master-data": {
    moduleKey: "master-data",
    title: "Master Data Overview",
    singularTitle: "Master Data Item",
    category: "Rules & Governance",
    badge: "MASTER LOOKUPS",
    description: "Manage system-wide lookup classifications, sensor calibration factors, and vehicle category registries.",
    columns: [
      { key: "category", label: "Master Domain" },
      { key: "itemCode", label: "Item Code" },
      { key: "itemName", label: "Display Label" },
      { key: "displayOrder", label: "Sort Order" },
      { key: "description", label: "Description" },
      { key: "status", label: "Status" }
    ],
    fields: [
      {
        key: "category",
        label: "Master Domain / Category",
        type: "select",
        required: true,
        options: [
          { label: "Vehicle Categories", value: "Vehicle Categories" },
          { label: "Alert Severities", value: "Alert Severities" },
          { label: "Sensor Calibrations", value: "Sensor Calibrations" },
          { label: "Fuel Types", value: "Fuel Types" },
          { label: "Geofence Types", value: "Geofence Types" }
        ]
      },
      { key: "itemCode", label: "Item Code / Key", type: "text", required: true, placeholder: "e.g. CAT_REEFER" },
      { key: "itemName", label: "Item Name / Display Title", type: "text", required: true, placeholder: "e.g. Refrigerated Temperature Controlled" },
      { key: "displayOrder", label: "Display Order", type: "number", required: true, placeholder: "1" },
      { key: "description", label: "Description / Calibration Notes", type: "textarea", placeholder: "Notes regarding this lookup classification..." },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: [
          { label: "Active", value: "Active" },
          { label: "Inactive", value: "Inactive" }
        ]
      }
    ]
  },

  // 8. Company Rules
  "company-rules": {
    moduleKey: "company-rules",
    title: "Company Rules Overview",
    singularTitle: "Company Rule",
    category: "Rules & Governance",
    badge: "SAFETY RULES",
    description: "Configure safety speed caps, engine idling alert thresholds, continuous driving rest periods, and curfews.",
    columns: [
      { key: "ruleName", label: "Rule Title" },
      { key: "companyId", label: "Target Company" },
      { key: "category", label: "Rule Domain" },
      { key: "thresholdValue", label: "Threshold Trigger" },
      { key: "notificationChannel", label: "Dispatch Channel" },
      { key: "severity", label: "Severity" },
      { key: "status", label: "Status" }
    ],
    fields: [
      {
        key: "companyId",
        label: "Company",
        type: "select",
        required: true,
        options: [
          { label: "Apex Logistics India Pvt Ltd", value: "Apex Logistics India Pvt Ltd" },
          { label: "TransGlobe Cold Chain Corp", value: "TransGlobe Cold Chain Corp" },
          { label: "SafeHaul Petroleum Carriers", value: "SafeHaul Petroleum Carriers" },
          { label: "Metro Intercity Transit Lines", value: "Metro Intercity Transit Lines" }
        ]
      },
      { key: "ruleName", label: "Rule Name", type: "text", required: true, placeholder: "e.g. National Highway Speed Governance" },
      {
        key: "category",
        label: "Rule Domain",
        type: "select",
        required: true,
        options: [
          { label: "Speeding Limit", value: "Speeding" },
          { label: "Engine Idling Duration", value: "Engine Idling" },
          { label: "Night Driving Curfew", value: "Night Driving Curfew" },
          { label: "Continuous Driving Rest", value: "Continuous Driving" },
          { label: "Maintenance & Sensors", value: "Maintenance" }
        ]
      },
      { key: "thresholdValue", label: "Threshold Trigger Value", type: "text", required: true, placeholder: "e.g. 80 km/h or 15 mins" },
      {
        key: "notificationChannel",
        label: "Notification Channel",
        type: "select",
        required: true,
        options: [
          { label: "In-App + SMS", value: "In-App + SMS" },
          { label: "In-App Only", value: "In-App Only" },
          { label: "SMS + Email + Siren Trigger", value: "SMS + Email + Siren Trigger" }
        ]
      },
      {
        key: "severity",
        label: "Alert Severity",
        type: "select",
        required: true,
        options: [
          { label: "Low", value: "Low" },
          { label: "Medium", value: "Medium" },
          { label: "High", value: "High" },
          { label: "Critical", value: "Critical" }
        ]
      },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: [
          { label: "Active", value: "Active" },
          { label: "Inactive", value: "Inactive" }
        ]
      }
    ]
  },

  // 9. Remove Entity Archive
  "remove-entity": {
    moduleKey: "remove-entity",
    title: "Remove Entity Audit Log",
    singularTitle: "Decommission Record",
    category: "Rules & Governance",
    badge: "DECOMMISSION LOG",
    description: "Historical audit log of decommissioned vehicles, retired GPS units, cancelled SIMs, and departing drivers.",
    columns: [
      { key: "entityType", label: "Asset Type" },
      { key: "entityId", label: "Asset Identifier" },
      { key: "entityName", label: "Asset Description" },
      { key: "reason", label: "Decommission Reason" },
      { key: "decommissionedBy", label: "Operator" },
      { key: "decommissionedAt", label: "Decommission Date" }
    ],
    fields: [
      {
        key: "entityType",
        label: "Asset Classification",
        type: "select",
        required: true,
        options: [
          { label: "Vehicle", value: "Vehicle" },
          { label: "GPS Device", value: "GPS Device" },
          { label: "SIM Card", value: "SIM Card" },
          { label: "Driver", value: "Driver" },
          { label: "Branch", value: "Branch" }
        ]
      },
      { key: "entityId", label: "Asset Identifier / Plate / IMEI", type: "text", required: true, placeholder: "e.g. 869018273645190" },
      { key: "entityName", label: "Asset Name / Model", type: "text", required: true, placeholder: "e.g. Legacy TK103 Unit" },
      {
        key: "reason",
        label: "Decommission Justification",
        type: "select",
        required: true,
        options: [
          { label: "Hardware Damaged / RMA", value: "Hardware Damaged / RMA" },
          { label: "Asset Sold / Disposed", value: "Asset Sold / Disposed" },
          { label: "Lease Terminated", value: "Lease Terminated" },
          { label: "Contract Closed", value: "Contract Closed" }
        ]
      },
      { key: "notes", label: "Engineering & Audit Explanation", type: "textarea", placeholder: "Detailed remarks regarding this removal..." }
    ]
  },

  // 10. SMS Allocation
  "sms-allocation": {
    moduleKey: "sms-allocation",
    title: "SMS Allocation Overview",
    singularTitle: "SMS Quota",
    category: "Rules & Governance",
    badge: "SMS QUOTA",
    description: "Track enterprise SMS gateway balances, monthly message consumption rates, and alert thresholds.",
    columns: [
      { key: "companyId", label: "Company" },
      { key: "provider", label: "DLT Gateway Provider" },
      { key: "allocatedQuota", label: "Allocated Messages" },
      { key: "consumedCount", label: "Consumed" },
      { key: "balanceRemaining", label: "Balance Remaining" },
      { key: "renewalDate", label: "Renewal Date" },
      { key: "status", label: "Quota Status" }
    ],
    fields: [
      {
        key: "companyId",
        label: "Target Enterprise",
        type: "select",
        required: true,
        options: [
          { label: "Apex Logistics India Pvt Ltd", value: "Apex Logistics India Pvt Ltd" },
          { label: "TransGlobe Cold Chain Corp", value: "TransGlobe Cold Chain Corp" },
          { label: "SafeHaul Petroleum Carriers", value: "SafeHaul Petroleum Carriers" },
          { label: "Metro Intercity Transit Lines", value: "Metro Intercity Transit Lines" }
        ]
      },
      {
        key: "provider",
        label: "SMS Gateway Provider",
        type: "select",
        required: true,
        options: [
          { label: "Airtel DLT Gateway", value: "Airtel DLT Gateway" },
          { label: "Jio Commercial Hub", value: "Jio Commercial Hub" },
          { label: "Tanla Route Enterprise", value: "Tanla Route Enterprise" },
          { label: "Gupshup Cloud Gateway", value: "Gupshup Cloud Gateway" }
        ]
      },
      { key: "allocatedQuota", label: "Allocated Message Volume", type: "number", required: true, placeholder: "25000" },
      { key: "consumedCount", label: "Currently Consumed", type: "number", placeholder: "0" },
      { key: "balanceRemaining", label: "Remaining Balance", type: "number", placeholder: "25000" },
      { key: "alertThreshold", label: "Low Balance Alert Threshold", type: "number", placeholder: "2500" },
      { key: "renewalDate", label: "Renewal Date", type: "text", placeholder: "2027-06-30" },
      {
        key: "status",
        label: "Quota Status",
        type: "select",
        options: [
          { label: "Active", value: "Active" },
          { label: "Depleted", value: "Depleted" },
          { label: "Suspended", value: "Suspended" }
        ]
      }
    ]
  },

  // 11. Added Devices
  "added-devices": {
    moduleKey: "added-devices",
    title: "Added Devices Overview",
    singularTitle: "Device Bundle",
    category: "Hardware & Connectivity",
    badge: "TELEMETRY BUNDLES",
    description: "Manage integrated telemetry installations linking GPS trackers with fuel rods and temperature probes.",
    columns: [
      { key: "vehiclePlate", label: "Mounted Vehicle Plate" },
      { key: "gpsImei", label: "Primary GPS IMEI" },
      { key: "sensorType", label: "Auxiliary Sensors" },
      { key: "technicianName", label: "Installing Technician" },
      { key: "calibrationFactor", label: "Calibration Factor" },
      { key: "health", label: "Telemetry Health" },
      { key: "status", label: "Status" }
    ],
    fields: [
      { key: "vehiclePlate", label: "Vehicle Registration Plate", type: "text", required: true, placeholder: "e.g. MH-04-AZ-8821" },
      { key: "gpsImei", label: "Primary GPS Device IMEI", type: "text", required: true, placeholder: "864201948201948" },
      {
        key: "sensorType",
        label: "Attached Sensor Configuration",
        type: "select",
        required: true,
        options: [
          { label: "Fuel Ultrasonic Sensor + Door Switch", value: "Fuel Ultrasonic Sensor + Door Switch" },
          { label: "Dual Temperature Probe (-40 to +80C)", value: "Dual Temperature Probe (-40 to +80C)" },
          { label: "Capacitive Fuel Rod + SOS Siren", value: "Capacitive Fuel Rod + SOS Siren" },
          { label: "CANbus OBD-II Engine Tap", value: "CANbus OBD-II Engine Tap" }
        ]
      },
      { key: "technicianName", label: "Field Technician Name", type: "text", required: true, placeholder: "e.g. Arjun Mistri" },
      { key: "installationDate", label: "Installation Date", type: "text", placeholder: "2026-03-12" },
      { key: "calibrationFactor", label: "Sensor Calibration Factor", type: "text", placeholder: "0.985 L/mV" },
      {
        key: "health",
        label: "Live Telemetry Status",
        type: "select",
        options: [
          { label: "Online", value: "Online" },
          { label: "Idle", value: "Idle" },
          { label: "Offline", value: "Offline" }
        ]
      },
      {
        key: "status",
        label: "Installation Status",
        type: "select",
        options: [
          { label: "Active", value: "Active" },
          { label: "Calibrating", value: "Calibrating" },
          { label: "Offline", value: "Offline" }
        ]
      }
    ]
  }
};
