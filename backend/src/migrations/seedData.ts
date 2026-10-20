export const SEED_USERS = [
  {
    email: "admin@example.com",
    firstName: "System",
    lastName: "Admin",
    role: "SUPER_ADMIN",
    password: "Admin@123456",
    isActive: true
  },
  {
    email: "user@example.com",
    firstName: "Demo",
    lastName: "User",
    role: "USER",
    password: "User@123456",
    isActive: true
  },
  {
    email: "aarav.patel@orbito.io",
    firstName: "Aarav",
    lastName: "Patel",
    role: "SUPER_ADMIN",
    password: "Password@123",
    isActive: true
  },
  {
    email: "riya.mehta@inorbit.fleet",
    firstName: "Riya",
    lastName: "Mehta",
    role: "FLEET_MANAGER",
    password: "Password@123",
    isActive: true
  },
  {
    email: "karan.johar@apexlogistics.in",
    firstName: "Karan",
    lastName: "Johar",
    role: "BRANCH_OPERATOR",
    password: "Password@123",
    isActive: true
  },
  {
    email: "priya.shah@velocitytrack.com",
    firstName: "Priya",
    lastName: "Shah",
    role: "OPERATIONS_LEAD",
    password: "Password@123",
    isActive: false
  }
];

export const SEED_AUDIT_LOGS = [
  {
    timestamp: new Date("2026-09-09T14:32:18Z"),
    userName: "Aarav Patel",
    userRole: "System Admin",
    userInitials: "AP",
    action: "UPDATE_CONFIG",
    module: "Device Models",
    ipAddress: "103.74.18.41",
    status: "SUCCESS" as const,
    details: "Changed communication port from 5023 to 5027 on model VT-800"
  },
  {
    timestamp: new Date("2026-09-09T13:45:02Z"),
    userName: "Riya Mehta",
    userRole: "Fleet Manager",
    userInitials: "RM",
    action: "USER_INVITE",
    module: "User Access",
    ipAddress: "49.36.12.88",
    status: "SUCCESS" as const,
    details: "Invited neha.desai@apexlogistics.com with Dispatcher profile"
  },
  {
    timestamp: new Date("2026-09-09T11:20:44Z"),
    userName: "Security Daemon",
    userRole: "Automated",
    userInitials: "SD",
    action: "AUTH_LOCKOUT",
    module: "Security Policy",
    ipAddress: "185.220.101.5",
    status: "WARNING" as const,
    details: "5 consecutive failed sign-in attempts for account driver.kunal@inorbit.com"
  },
  {
    timestamp: new Date("2026-09-09T09:15:33Z"),
    userName: "Karan Johar",
    userRole: "Branch Operator",
    userInitials: "KJ",
    action: "DELETE_GEOFENCE",
    module: "Geofence Engine",
    ipAddress: "114.143.22.10",
    status: "SUCCESS" as const,
    details: "Removed decommissioned loading bay zone GEOF-AHM-04"
  },
  {
    timestamp: new Date("2026-09-08T17:50:11Z"),
    userName: "System Kernel",
    userRole: "Platform Worker",
    userInitials: "SK",
    action: "SCHEMA_MIGRATE",
    module: "Database Engine",
    ipAddress: "127.0.0.1",
    status: "SUCCESS" as const,
    details: "Zero-drift migration 002_audit_and_system_config committed cleanly in 42ms"
  },
  {
    timestamp: new Date("2026-09-08T16:04:59Z"),
    userName: "Priya Shah",
    userRole: "Operations Lead",
    userInitials: "PS",
    action: "SIM_SWAP",
    module: "Telematics SIM",
    ipAddress: "49.36.18.204",
    status: "WARNING" as const,
    details: "Initiated e-SIM carrier profile switch for IMEI 864201948201948 to Airtel IoT"
  },
  {
    timestamp: new Date("2026-09-08T12:22:15Z"),
    userName: "Aarav Patel",
    userRole: "System Admin",
    userInitials: "AP",
    action: "SECRET_ROTATION",
    module: "API Gateway",
    ipAddress: "103.74.18.41",
    status: "SUCCESS" as const,
    details: "Rotated live JWT signing keys across all secondary micro-gateways"
  },
  {
    timestamp: new Date("2026-09-08T08:30:00Z"),
    userName: "Dispatch Bot",
    userRole: "Automated",
    userInitials: "DB",
    action: "BATCH_SYNC",
    module: "Vehicle Registry",
    ipAddress: "127.0.0.1",
    status: "SUCCESS" as const,
    details: "Synchronized 240 active vehicle telemetry beacons across Western Corridor"
  }
];

export const SEED_SYSTEM_CONFIGS: { moduleKey: string; data: Record<string, any>; isActive?: boolean }[] = [
  // 1. Resellers
  { moduleKey: "resellers", data: { code: "IOR-AMD-01", name: "Apex Logistics India", legalEntity: "Apex Fleet Network LLP", state: "Gujarat", maxVehicles: 1240, tokenExpiry: "2027-09-30" }, isActive: true },
  { moduleKey: "resellers", data: { code: "IOR-MUM-04", name: "Velocity Track Systems", legalEntity: "Velocity IoT Pvt Ltd", state: "Maharashtra", maxVehicles: 850, tokenExpiry: "2027-12-15" }, isActive: true },
  { moduleKey: "resellers", data: { code: "IOR-DEL-02", name: "North Star Telematics", legalEntity: "NorthStar Mobility Solutions", state: "Delhi NCR", maxVehicles: 620, tokenExpiry: "2026-11-20" }, isActive: true },
  { moduleKey: "resellers", data: { code: "IOR-BLR-05", name: "Zenith Fleet Connect", legalEntity: "Zenith Automotive Tech", state: "Karnataka", maxVehicles: 900, tokenExpiry: "2027-04-10" }, isActive: true },
  { moduleKey: "resellers", data: { code: "IOR-SUR-08", name: "Surat Express Dispatch", legalEntity: "Surat Logistics Corp", state: "Gujarat", maxVehicles: 450, tokenExpiry: "2026-10-31" }, isActive: false },

  // 2. Reseller Features
  { moduleKey: "reseller-features", data: { resellerName: "Apex Logistics India", planTier: "Enterprise Fleet", maxVehicles: 1240, telematicsMode: "Live CANbus" }, isActive: true },
  { moduleKey: "reseller-features", data: { resellerName: "Velocity Track Systems", planTier: "Enterprise Fleet", maxVehicles: 850, telematicsMode: "Live CANbus" }, isActive: true },
  { moduleKey: "reseller-features", data: { resellerName: "North Star Telematics", planTier: "Professional", maxVehicles: 620, telematicsMode: "Standard GPS" }, isActive: true },
  { moduleKey: "reseller-features", data: { resellerName: "Zenith Fleet Connect", planTier: "Enterprise Fleet", maxVehicles: 900, telematicsMode: "Live CANbus" }, isActive: true },

  // 3. User Groups
  { moduleKey: "user-groups", data: { groupId: "GRP-10001", name: "Fleet Administrators", structure: "Corporate Operations", project: "National Fleet Control", activeUsers: 14 }, isActive: true },
  { moduleKey: "user-groups", data: { groupId: "GRP-10008", name: "West Zone Dispatchers", structure: "Regional Operations", project: "Western Region Dispatch", activeUsers: 28 }, isActive: true },
  { moduleKey: "user-groups", data: { groupId: "GRP-10014", name: "Maintenance Supervisors", structure: "Technical Services", project: "Preventive Maintenance", activeUsers: 9 }, isActive: true },
  { moduleKey: "user-groups", data: { groupId: "GRP-10021", name: "Operational Analysts", structure: "Business Intelligence", project: "Operational Analytics", activeUsers: 6 }, isActive: true },

  // 4. User Profiles
  { moduleKey: "user-profiles", data: { profileName: "Executive Command Profile", role: "SUPER_ADMIN", modulesCount: "All 18 Modules" }, isActive: true },
  { moduleKey: "user-profiles", data: { profileName: "Regional Operations Profile", role: "FLEET_MANAGER", modulesCount: "14 Modules" }, isActive: true },
  { moduleKey: "user-profiles", data: { profileName: "Dispatch Operations Profile", role: "BRANCH_OPERATOR", modulesCount: "8 Modules" }, isActive: true },
  { moduleKey: "user-profiles", data: { profileName: "Auditor & Reporting Profile", role: "USER", modulesCount: "4 Modules" }, isActive: true },

  // 5. SIM Providers
  { moduleKey: "sim-providers", data: { providerName: "Airtel IoT", circle: "Gujarat", supportEmail: "iot.gujarat@airtel.in", customerCare: "+91 1800 103 4400", portalUrl: "https://airtel.in/m2m" }, isActive: true },
  { moduleKey: "sim-providers", data: { providerName: "Jio M2M Connectivity", circle: "Maharashtra & Goa", supportEmail: "support.iot@jio.com", customerCare: "+91 1800 889 9999", portalUrl: "https://jio.com/business" }, isActive: true },
  { moduleKey: "sim-providers", data: { providerName: "Vodafone Idea IoT", circle: "Delhi NCR", supportEmail: "business.care@vodafoneidea.com", customerCare: "+91 1800 123 4567", portalUrl: "https://myvi.in/iot" }, isActive: true },

  // 6. Tariff Plans
  { moduleKey: "tariff-plans", data: { planName: "Fleet Smart 500MB Annual", provider: "Airtel IoT", circle: "Pan India", validityDays: 365, dataAllowance: "500 MB / mo", price: 950 }, isActive: true },
  { moduleKey: "tariff-plans", data: { planName: "Heavy Telematics 2GB Annual", provider: "Jio M2M", circle: "Pan India", validityDays: 365, dataAllowance: "2 GB / mo", price: 1450 }, isActive: true },
  { moduleKey: "tariff-plans", data: { planName: "Standard Fleet 1GB 180D", provider: "Vodafone Idea IoT", circle: "Delhi NCR", validityDays: 180, dataAllowance: "1 GB / mo", price: 680 }, isActive: true },

  // 7. Device Models
  { moduleKey: "device-models", data: { modelCode: "5027", modelName: "VT-800 AIS-140 Fleet Master", port: 5027, protocol: "AIS-140 IRNSS", defaultPassword: "••••••" }, isActive: true },
  { moduleKey: "device-models", data: { modelCode: "5023", modelName: "Teltonika FMB920 Compact", port: 5023, protocol: "Teltonika Codec 8", defaultPassword: "••••••" }, isActive: true },
  { moduleKey: "device-models", data: { modelCode: "5001", modelName: "Coban TK103B Pro", port: 5001, protocol: "GT06 Standard", defaultPassword: "••••••" }, isActive: true },

  // 8. Device Features
  { moduleKey: "device-features", data: { featureName: "Remote Engine Immobilizer", category: "Relay Output", description: "Cuts fuel pump relay remotely upon geofence breach or theft alert" }, isActive: true },
  { moduleKey: "device-features", data: { featureName: "Capacitive Fuel Rod Probe", category: "Sensor Input", description: "Continuous 0-5V fuel tank liquid level monitoring with theft detection" }, isActive: true },
  { moduleKey: "device-features", data: { featureName: "Emergency SOS Panic Button", category: "Digital Input", description: "Direct cabin driver distress switch with audio buzzer trigger" }, isActive: true },

  // 9. Vehicle Types
  { moduleKey: "vehicle-types", data: { typeName: "Heavy Commercial Truck (HCV)", wheels: 10, description: "30T diesel multi-axle freight carrier" }, isActive: true },
  { moduleKey: "vehicle-types", data: { typeName: "Light Motor Vehicle (LMV)", wheels: 4, description: "750 kg to 1.7T last-mile urban delivery vehicle" }, isActive: true },
  { moduleKey: "vehicle-types", data: { typeName: "Refrigerated Van (Reefer)", wheels: 6, description: "15T cold chain perishable delivery truck" }, isActive: true },

  // 10. Vehicle Models
  { moduleKey: "vehicle-models", data: { brand: "Tata Motors", modelName: "Prima 5530.S", vehicleType: "Heavy Commercial Truck", fuelType: "Diesel", bsCategory: "BS-VI" }, isActive: true },
  { moduleKey: "vehicle-models", data: { brand: "Ashok Leyland", modelName: "BOSS 1920", vehicleType: "Medium Commercial Truck", fuelType: "Diesel", bsCategory: "BS-VI" }, isActive: true },
  { moduleKey: "vehicle-models", data: { brand: "Mahindra", modelName: "Bolero Pik-Up", vehicleType: "Light Motor Vehicle", fuelType: "CNG", bsCategory: "BS-VI" }, isActive: true },

  // 11. Vehicle Features
  { moduleKey: "vehicle-features", data: { featureName: "Dual Fuel Tank Monitoring", category: "Fluid Sensors", description: "Sensors deployed on primary and secondary diesel tanks" }, isActive: true },
  { moduleKey: "vehicle-features", data: { featureName: "Driver Cabin Air Conditioning", category: "Comfort & Safety", description: "Cabin environmental controls" }, isActive: true },
  { moduleKey: "vehicle-features", data: { featureName: "Speed Governor System", category: "Regulatory AIS", description: "Electronic limiter capping maximum velocity at 80 km/h" }, isActive: true },

  // 12. Alert Types
  { moduleKey: "alert-types", data: { alertName: "Over-speed Threshold Exceeded", category: "Driving Safety", severity: "HIGH", notificationSound: "alarm_critical.mp3" }, isActive: true },
  { moduleKey: "alert-types", data: { alertName: "Geofence Boundary Breach", category: "Geofence", severity: "HIGH", notificationSound: "klaxon_pulse.mp3" }, isActive: true },
  { moduleKey: "alert-types", data: { alertName: "GPS Wire Disconnected / Tampered", category: "Hardware & Tamper", severity: "HIGH", notificationSound: "siren.mp3" }, isActive: true },

  // 13. POI Types
  { moduleKey: "poi-types", data: { typeName: "Central Distribution Warehouse", iconCode: "warehouse-pin", description: "Primary regional cross-docking logistics base" }, isActive: true },
  { moduleKey: "poi-types", data: { typeName: "Verified Customer Delivery Site", iconCode: "customer-dock", description: "Consignee delivery dock with geofence proximity alert" }, isActive: true },
  { moduleKey: "poi-types", data: { typeName: "Partner Fueling Station", iconCode: "fuel-pump", description: "Authorized fleet card fuel dispensing station" }, isActive: true },

  // 14. Modules
  { moduleKey: "modules", data: { moduleName: "Dashboard Analytics", parentModule: "Core", path: "/dashboard", permission: "VIEW:DASHBOARD" }, isActive: true },
  { moduleKey: "modules", data: { moduleName: "Vehicle Fleet Management", parentModule: "Core", path: "/vehicles", permission: "VIEW:VEHICLE" }, isActive: true },
  { moduleKey: "modules", data: { moduleName: "System Configuration Hub", parentModule: "Administration", path: "/system-config", permission: "VIEW:CONFIG" }, isActive: true },

  // 15. Report Customization
  { moduleKey: "report-customization", data: { customizationName: "Apex Daily Fuel & Ignition Export", reportScreen: "Ignition Summary", company: "Apex Logistics India", metricFormat: "Metric (km, L)" }, isActive: true },
  { moduleKey: "report-customization", data: { customizationName: "Cold Chain Temperature Log", reportScreen: "Maintenance & Sensors", company: "Velocity Track", metricFormat: "Metric (km, L)" }, isActive: true }
];

export const SEED_APP_CONFIGS: { moduleKey: string; data: Record<string, any>; isActive?: boolean }[] = [
  // 1. Companies
  {
    moduleKey: "companies",
    data: {
      name: "Apex Logistics India Pvt Ltd",
      code: "CORP-01",
      industry: "Logistics & Freight",
      contactPerson: "Rajesh Varma",
      email: "contact@apexlogistics.in",
      phone: "+91 98200 12345",
      city: "Mumbai",
      state: "Maharashtra",
      address: "Plot 42, Port Logistics Park, JNPT Navi Mumbai",
      pincode: "400707",
      maxVehicles: 250,
      status: "Active"
    },
    isActive: true
  },
  {
    moduleKey: "companies",
    data: {
      name: "TransGlobe Cold Chain Corp",
      code: "CORP-02",
      industry: "Cold Chain Pharma",
      contactPerson: "Dr. Vikram Joshi",
      email: "ops@transglobecold.com",
      phone: "+91 98450 67890",
      city: "Pune",
      state: "Maharashtra",
      address: "Chakan Industrial Zone Phase II",
      pincode: "410501",
      maxVehicles: 120,
      status: "Active"
    },
    isActive: true
  },
  {
    moduleKey: "companies",
    data: {
      name: "SafeHaul Petroleum Carriers",
      code: "CORP-03",
      industry: "Oil & Gas Transport",
      contactPerson: "Hardeep Singh",
      email: "dispatch@safehaulpetro.in",
      phone: "+91 98765 43210",
      city: "Ahmedabad",
      state: "Gujarat",
      address: "GIDC Industrial Estate, Naroda",
      pincode: "382330",
      maxVehicles: 80,
      status: "Active"
    },
    isActive: true
  },
  {
    moduleKey: "companies",
    data: {
      name: "Metro Intercity Transit Lines",
      code: "CORP-04",
      industry: "Passenger Transport",
      contactPerson: "Kavita Reddy",
      email: "fleet@metrointercity.com",
      phone: "+91 99001 23456",
      city: "Bengaluru",
      state: "Karnataka",
      address: "Electronic City Phase 1",
      pincode: "560100",
      maxVehicles: 60,
      status: "Active"
    },
    isActive: true
  },

  // 2. Branches
  {
    moduleKey: "branches",
    data: {
      name: "Mumbai Port Cargo Terminal",
      code: "BOM-01",
      companyId: "Apex Logistics India Pvt Ltd",
      managerName: "Suresh Nair",
      email: "bom01@apexlogistics.in",
      phone: "+91 98201 11223",
      city: "Mumbai",
      state: "Maharashtra",
      landmarkGeofence: "JNPT Container Gate 4",
      status: "Active"
    },
    isActive: true
  },
  {
    moduleKey: "branches",
    data: {
      name: "Pune Central Freight Hub",
      code: "PNQ-01",
      companyId: "TransGlobe Cold Chain Corp",
      managerName: "Milind Shinde",
      email: "pnq01@transglobecold.com",
      phone: "+91 98220 33445",
      city: "Pune",
      state: "Maharashtra",
      landmarkGeofence: "Chakan Cold Vault Zone A",
      status: "Active"
    },
    isActive: true
  },
  {
    moduleKey: "branches",
    data: {
      name: "Ahmedabad Inland Terminal",
      code: "AMD-01",
      companyId: "SafeHaul Petroleum Carriers",
      managerName: "Bhavesh Patel",
      email: "amd01@safehaulpetro.in",
      phone: "+91 98250 55667",
      city: "Ahmedabad",
      state: "Gujarat",
      landmarkGeofence: "Naroda Bulk Fuel Terminal",
      status: "Active"
    },
    isActive: true
  },
  {
    moduleKey: "branches",
    data: {
      name: "Delhi NCR Central Depot",
      code: "DEL-01",
      companyId: "Apex Logistics India Pvt Ltd",
      managerName: "Sunil Sharma",
      email: "del01@apexlogistics.in",
      phone: "+91 98110 77889",
      city: "New Delhi",
      state: "Delhi NCR",
      landmarkGeofence: "Tughlakabad Inland Container Yard",
      status: "Active"
    },
    isActive: true
  },
  {
    moduleKey: "branches",
    data: {
      name: "Bengaluru Express Hub",
      code: "BLR-01",
      companyId: "Metro Intercity Transit Lines",
      managerName: "Anand Kumar",
      email: "blr01@metrointercity.com",
      phone: "+91 98451 99001",
      city: "Bengaluru",
      state: "Karnataka",
      landmarkGeofence: "Whitefield Tech Yard Depot",
      status: "Active"
    },
    isActive: true
  },

  // 3. Added Vehicles
  {
    moduleKey: "vehicles",
    data: {
      plateNumber: "MH-04-AZ-8821",
      vehicleType: "Heavy Commercial Truck",
      makeModel: "Tata Signa 4825.T",
      companyId: "Apex Logistics India Pvt Ltd",
      branchId: "Mumbai Port Cargo Terminal",
      chassisNumber: "MAT712039N1A20194",
      engineNumber: "ENG-CUM-20491",
      odometer: 142500,
      fuelCapacity: 400,
      assignedDriver: "Ramesh Yadav",
      status: "Active"
    },
    isActive: true
  },
  {
    moduleKey: "vehicles",
    data: {
      plateNumber: "MH-12-FC-3392",
      vehicleType: "Refrigerated Van",
      makeModel: "BharatBenz 1617R Reefer",
      companyId: "TransGlobe Cold Chain Corp",
      branchId: "Pune Central Freight Hub",
      chassisNumber: "MBB504192P8B39102",
      engineNumber: "ENG-4D34-90412",
      odometer: 89200,
      fuelCapacity: 215,
      assignedDriver: "Ganesh Kulkarni",
      status: "Active"
    },
    isActive: true
  },
  {
    moduleKey: "vehicles",
    data: {
      plateNumber: "GJ-01-BX-7041",
      vehicleType: "Tanker",
      makeModel: "Ashok Leyland 5525 Tanker",
      companyId: "SafeHaul Petroleum Carriers",
      branchId: "Ahmedabad Inland Terminal",
      chassisNumber: "MAL839201L9C44102",
      engineNumber: "ENG-H6ETI-77192",
      odometer: 210400,
      fuelCapacity: 450,
      assignedDriver: "Vikramjit Singh",
      status: "Active"
    },
    isActive: true
  },
  {
    moduleKey: "vehicles",
    data: {
      plateNumber: "DL-01-EA-1940",
      vehicleType: "Light Motor Vehicle",
      makeModel: "Mahindra Bolero Maxi Truck",
      companyId: "Apex Logistics India Pvt Ltd",
      branchId: "Delhi NCR Central Depot",
      chassisNumber: "MA1729104K3D88192",
      engineNumber: "ENG-M2DICR-11942",
      odometer: 45800,
      fuelCapacity: 60,
      assignedDriver: "Mohammad Aslam",
      status: "Active"
    },
    isActive: true
  },
  {
    moduleKey: "vehicles",
    data: {
      plateNumber: "KA-01-MJ-5510",
      vehicleType: "Bus",
      makeModel: "Volvo B11R Multi-Axle",
      companyId: "Metro Intercity Transit Lines",
      branchId: "Bengaluru Express Hub",
      chassisNumber: "YV3B11R02L1E99201",
      engineNumber: "ENG-D11A-66102",
      odometer: 315000,
      fuelCapacity: 600,
      assignedDriver: "Shekhar Gowda",
      status: "Active"
    },
    isActive: true
  },

  // 4. Employees
  {
    moduleKey: "employees",
    data: {
      employeeCode: "EMP-DRV-101",
      firstName: "Ramesh",
      lastName: "Yadav",
      designation: "Commercial Driver",
      companyId: "Apex Logistics India Pvt Ltd",
      branchId: "Mumbai Port Cargo Terminal",
      phone: "+91 98200 44556",
      email: "ramesh.yadav@apexlogistics.in",
      licenseNumber: "MH-0420150029104",
      licenseExpiry: "2029-08-15",
      status: "Active"
    },
    isActive: true
  },
  {
    moduleKey: "employees",
    data: {
      employeeCode: "EMP-DRV-102",
      firstName: "Ganesh",
      lastName: "Kulkarni",
      designation: "Commercial Driver",
      companyId: "TransGlobe Cold Chain Corp",
      branchId: "Pune Central Freight Hub",
      phone: "+91 98221 66778",
      email: "ganesh.k@transglobecold.com",
      licenseNumber: "MH-1220170094102",
      licenseExpiry: "2028-04-20",
      status: "Active"
    },
    isActive: true
  },
  {
    moduleKey: "employees",
    data: {
      employeeCode: "EMP-MGR-201",
      firstName: "Suresh",
      lastName: "Nair",
      designation: "Depot Supervisor",
      companyId: "Apex Logistics India Pvt Ltd",
      branchId: "Mumbai Port Cargo Terminal",
      phone: "+91 98201 11223",
      email: "bom01@apexlogistics.in",
      licenseNumber: "MH-0120100019482",
      licenseExpiry: "2030-12-31",
      status: "Active"
    },
    isActive: true
  },
  {
    moduleKey: "employees",
    data: {
      employeeCode: "EMP-TEC-301",
      firstName: "Arjun",
      lastName: "Mistri",
      designation: "Telematics Technician",
      companyId: "TransGlobe Cold Chain Corp",
      branchId: "Pune Central Freight Hub",
      phone: "+91 98900 12389",
      email: "arjun.m@telematix.in",
      licenseNumber: "MH-1220190044102",
      licenseExpiry: "2029-01-10",
      status: "Active"
    },
    isActive: true
  },

  // 5. SIM Cards
  {
    moduleKey: "sim-cards",
    data: {
      iccid: "89914902194820194812",
      msisdn: "+91 98200 90101",
      operator: "Airtel M2M",
      apn: "airtelgprs.com",
      dataPlan: "1 GB / mo",
      planExpiry: "2027-12-31",
      status: "Active"
    },
    isActive: true
  },
  {
    moduleKey: "sim-cards",
    data: {
      iccid: "89918603910294819203",
      msisdn: "+91 98800 90202",
      operator: "Jio Enterprise IoT",
      apn: "m2m.jio.com",
      dataPlan: "2 GB / mo",
      planExpiry: "2027-10-31",
      status: "Active"
    },
    isActive: true
  },
  {
    moduleKey: "sim-cards",
    data: {
      iccid: "89911005829104928104",
      msisdn: "+91 98450 90303",
      operator: "Vodafone Idea M2M",
      apn: "iot.vodafone.in",
      dataPlan: "500 MB / mo",
      planExpiry: "2027-08-31",
      status: "Active"
    },
    isActive: true
  },

  // 6. GPS Devices
  {
    moduleKey: "gps-devices",
    data: {
      imei: "864201948201948",
      modelName: "Teltonika FMB920",
      serialNumber: "TT-FMB-920-8841",
      protocol: "Teltonika (5027)",
      firmwareVersion: "03.28.02.Rev.00",
      simIccid: "89914902194820194812",
      status: "Active"
    },
    isActive: true
  },
  {
    moduleKey: "gps-devices",
    data: {
      imei: "865019283746192",
      modelName: "Concox GT06N",
      serialNumber: "CX-GT06-1194",
      protocol: "GT06 (8081)",
      firmwareVersion: "v4.1.9-PROD",
      simIccid: "89918603910294819203",
      status: "Active"
    },
    isActive: true
  },
  {
    moduleKey: "gps-devices",
    data: {
      imei: "863910294819201",
      modelName: "Ruptela Trace5",
      serialNumber: "RUP-TR5-4402",
      protocol: "Ruptela (5030)",
      firmwareVersion: "v1.12.04",
      simIccid: "89911005829104928104",
      status: "Active"
    },
    isActive: true
  },

  // 7. Master Data
  {
    moduleKey: "master-data",
    data: {
      category: "Vehicle Categories",
      itemCode: "CAT_REEFER",
      itemName: "Refrigerated Temperature Controlled",
      displayOrder: 1,
      description: "Insulated trucks equipped with refrigeration chiller",
      status: "Active"
    },
    isActive: true
  },
  {
    moduleKey: "master-data",
    data: {
      category: "Alert Severities",
      itemCode: "SEV_SOS",
      itemName: "Cabin SOS Panic Emergency",
      displayOrder: 1,
      description: "Immediate siren dispatch and security notification",
      status: "Active"
    },
    isActive: true
  },
  {
    moduleKey: "master-data",
    data: {
      category: "Sensor Calibrations",
      itemCode: "CAL_ULTRA_FUEL",
      itemName: "Ultrasonic Fuel Rod Multiplier",
      displayOrder: 2,
      description: "Standard 0.985 factor for dual cylindrical diesel tanks",
      status: "Active"
    },
    isActive: true
  },

  // 8. Company Rules
  {
    moduleKey: "company-rules",
    data: {
      ruleName: "National Highway Speed Governance",
      companyId: "Apex Logistics India Pvt Ltd",
      category: "Speeding",
      thresholdValue: "80 km/h",
      notificationChannel: "In-App + SMS",
      severity: "High",
      status: "Active"
    },
    isActive: true
  },
  {
    moduleKey: "company-rules",
    data: {
      ruleName: "Reefer Pharma Temp Threshold (-20°C)",
      companyId: "TransGlobe Cold Chain Corp",
      category: "Maintenance",
      thresholdValue: "-18°C max",
      notificationChannel: "SMS + Email + Siren Trigger",
      severity: "Critical",
      status: "Active"
    },
    isActive: true
  },
  {
    moduleKey: "company-rules",
    data: {
      ruleName: "Hazmat Night Driving Curfew",
      companyId: "SafeHaul Petroleum Carriers",
      category: "Night Driving Curfew",
      thresholdValue: "23:00 - 05:00",
      notificationChannel: "In-App + SMS",
      severity: "Critical",
      status: "Active"
    },
    isActive: true
  },

  // 9. SMS Allocation
  {
    moduleKey: "sms-allocation",
    data: {
      companyId: "Apex Logistics India Pvt Ltd",
      provider: "Airtel DLT Gateway",
      allocatedQuota: 25000,
      consumedCount: 8420,
      balanceRemaining: 16580,
      alertThreshold: 2500,
      renewalDate: "2027-06-30",
      status: "Active"
    },
    isActive: true
  },
  {
    moduleKey: "sms-allocation",
    data: {
      companyId: "TransGlobe Cold Chain Corp",
      provider: "Jio Commercial Hub",
      allocatedQuota: 15000,
      consumedCount: 4190,
      balanceRemaining: 10810,
      alertThreshold: 1500,
      renewalDate: "2027-08-31",
      status: "Active"
    },
    isActive: true
  },

  // 10. Added Devices
  {
    moduleKey: "added-devices",
    data: {
      vehiclePlate: "MH-04-AZ-8821",
      gpsImei: "864201948201948",
      sensorType: "Fuel Ultrasonic Sensor + Door Switch",
      technicianName: "Arjun Mistri",
      installationDate: "2026-03-12",
      calibrationFactor: "0.985 L/mV",
      health: "Online",
      status: "Active"
    },
    isActive: true
  },
  {
    moduleKey: "added-devices",
    data: {
      vehiclePlate: "MH-12-FC-3392",
      gpsImei: "865019283746192",
      sensorType: "Dual Temperature Probe (-40 to +80C)",
      technicianName: "Arjun Mistri",
      installationDate: "2026-04-18",
      calibrationFactor: "1.000 degC",
      health: "Online",
      status: "Active"
    },
    isActive: true
  },

  // 11. Remove Entity Archive Log
  {
    moduleKey: "remove-entity",
    data: {
      entityType: "GPS Device",
      entityId: "869018273645190",
      entityName: "Legacy TK103 Unit",
      reason: "Hardware Damaged / RMA",
      notes: "Lightning surge damage at terminal",
      decommissionedBy: "Fleet Admin",
      decommissionedAt: "2026-08-10T10:30:00Z"
    },
    isActive: false
  }
];

