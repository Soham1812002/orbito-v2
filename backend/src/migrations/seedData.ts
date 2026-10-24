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

export const SEED_DRIVERS = [
  {
    id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    name: "Rajesh Kumar Sharma",
    phone: "+91 98765 43210",
    licenseNumber: "DL-0420180034921",
    avatar: "RK",
    rating: 4.8,
    isActive: true
  },
  {
    id: "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
    name: "Sanjay Tukaram Patil",
    phone: "+91 98220 11984",
    licenseNumber: "MH-1220190048210",
    avatar: "SP",
    rating: 4.7,
    isActive: true
  },
  {
    id: "c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f",
    name: "Bhavin Patel",
    phone: "+91 94280 44321",
    licenseNumber: "GJ-0120150029381",
    avatar: "BP",
    rating: 4.9,
    isActive: true
  },
  {
    id: "d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a",
    name: "Karthik Gowda",
    phone: "+91 99001 23456",
    licenseNumber: "KA-0520210088192",
    avatar: "KG",
    rating: 4.9,
    isActive: true
  },
  {
    id: "e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b",
    name: "Virender Singh",
    phone: "+91 98110 55432",
    licenseNumber: "HR-5520170094182",
    avatar: "VS",
    rating: 4.6,
    isActive: true
  },
  {
    id: "f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c",
    name: "Sunil Shinde",
    phone: "+91 97654 32109",
    licenseNumber: "MH-1420160081290",
    avatar: "SS",
    rating: 4.5,
    isActive: true
  }
];

export const SEED_VEHICLES = [
  {
    plateNumber: "DL 01 CA 9876",
    makeModel: "Tata Signa 4825.TK",
    category: "heavy_truck",
    status: "moving",
    speed: 64,
    heading: 78,
    latitude: 28.6139,
    longitude: 77.209,
    ignition: true,
    fuelPercent: 78,
    batteryPercent: 94,
    odometer: 142850,
    engineTemp: 84,
    lastLocation: "Jewar Toll Plaza, Yamuna Expressway, UP",
    lastUpdated: "Just now",
    deviceImei: "867492048129482",
    driverId: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    companyName: "InOrbit Logistics",
    todayDistance: 312.4,
    immobilizerState: "unlocked"
  },
  {
    plateNumber: "MH 12 RN 4521",
    makeModel: "BharatBenz 3528C",
    category: "heavy_truck",
    status: "moving",
    speed: 58,
    heading: 142,
    latitude: 19.2967,
    longitude: 73.0631,
    ignition: true,
    fuelPercent: 62,
    batteryPercent: 90,
    odometer: 98420,
    engineTemp: 82,
    lastLocation: "Bhiwandi Central Depot, Mumbai Bypass",
    lastUpdated: "1 min ago",
    deviceImei: "867492048129483",
    driverId: "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
    companyName: "Metro Freight Lines",
    todayDistance: 245.8,
    immobilizerState: "unlocked"
  },
  {
    plateNumber: "GJ 01 BV 8832",
    makeModel: "Eicher Pro 3019",
    category: "delivery_van",
    status: "idling",
    speed: 0,
    heading: 210,
    latitude: 23.0225,
    longitude: 72.5714,
    ignition: true,
    fuelPercent: 88,
    batteryPercent: 96,
    odometer: 54100,
    engineTemp: 68,
    lastLocation: "Sanand Auto Corridor, Gate 3, Ahmedabad",
    lastUpdated: "3 mins ago",
    deviceImei: "867492048129484",
    driverId: "c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f",
    companyName: "Gujarat Interstate Movers",
    todayDistance: 118.2,
    immobilizerState: "unlocked"
  },
  {
    plateNumber: "KA 05 MN 3314",
    makeModel: "Mahindra Treo Zor EV",
    category: "electric_cargo",
    status: "moving",
    speed: 42,
    heading: 320,
    latitude: 12.9716,
    longitude: 77.5946,
    ignition: true,
    fuelPercent: 100,
    batteryPercent: 68,
    odometer: 18200,
    engineTemp: 38,
    lastLocation: "Electronic City Phase 1, Bengaluru",
    lastUpdated: "Just now",
    deviceImei: "867492048129485",
    driverId: "d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a",
    companyName: "GreenPulse EV Transport",
    todayDistance: 84.6,
    immobilizerState: "unlocked"
  },
  {
    plateNumber: "HR 55 AB 1002",
    makeModel: "Tata 407 Gold SFC",
    category: "delivery_van",
    status: "stopped",
    speed: 0,
    heading: 0,
    latitude: 28.4595,
    longitude: 77.0266,
    ignition: false,
    fuelPercent: 45,
    batteryPercent: 92,
    odometer: 184500,
    engineTemp: 32,
    lastLocation: "IMT Manesar Sector 8, Haryana",
    lastUpdated: "14 mins ago",
    deviceImei: "867492048129486",
    driverId: "e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b",
    companyName: "North Star Delivery",
    todayDistance: 62.0,
    immobilizerState: "unlocked"
  },
  {
    plateNumber: "MH 14 CC 7789",
    makeModel: "BharatBenz 2823R",
    category: "tanker",
    status: "inactive",
    speed: 0,
    heading: 0,
    latitude: 18.7606,
    longitude: 73.8567,
    ignition: false,
    fuelPercent: 32,
    batteryPercent: 12,
    odometer: 220140,
    engineTemp: 26,
    lastLocation: "Chakan MIDC Staging Yard, Pune",
    lastUpdated: "3 hours ago",
    deviceImei: "867492048129487",
    driverId: "f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c",
    companyName: "Deccan Petroleum Logistics",
    todayDistance: 0,
    immobilizerState: "unlocked"
  }
];

export const SEED_USER_GROUPS = [
  {
    id: "11111111-2222-3333-4444-555555555551",
    name: "Fleet Operations Core",
    description: "Full telematics control, vehicle tracking, route playback, and driver assignments.",
    company: "InOrbit Fleet Logistics",
    branch: "Mumbai Central Hub",
    reseller: "Direct Enterprise",
    adminRole: "FLEET_MANAGER",
    allowExcelExport: true,
    allowOperationalManage: true,
    isSystemAdmin: false,
    permissions: [],
    isActive: true
  },
  {
    id: "11111111-2222-3333-4444-555555555552",
    name: "Security & Compliance",
    description: "Oversight of security triggers, device tampering, driver speed limit violations, and audit logs.",
    company: "Velocity Track Ltd",
    branch: "Bengaluru Tech Park",
    reseller: "Direct Enterprise",
    adminRole: "OPERATIONS_LEAD",
    allowExcelExport: true,
    allowOperationalManage: false,
    isSystemAdmin: false,
    permissions: [],
    isActive: true
  },
  {
    id: "11111111-2222-3333-4444-555555555553",
    name: "Driver & Dispatch Desk",
    description: "Daily vehicle movement allocation, route assignment, and trip status tracking.",
    company: "Apex Transport & Cargo",
    branch: "Delhi NCR Depot",
    reseller: "Apex Telecom Reseller",
    adminRole: "BRANCH_OPERATOR",
    allowExcelExport: false,
    allowOperationalManage: false,
    isSystemAdmin: false,
    permissions: [],
    isActive: true
  }
];

export const SEED_COMPANY_LICENSES = [
  {
    company: "InOrbit Logistics",
    branch: "Mumbai Central Hub",
    contactPerson: "Rohan Mehta",
    telephone: "+91 98765 41230",
    licenseType: "Enterprise Commercial Fleet",
    licenseName: "National Cargo Operations Permit",
    licenseNumber: "LIC-IND-2025-0012",
    issuingAuthority: "Ministry of Road Transport & Highways",
    licenseIssueDate: "21 Sep 2025",
    activationDate: "22 Sep 2025",
    expiryDate: "21 Sep 2026",
    extendDate: "—",
    addedVehicles: 86,
    maxVehicles: 100,
    status: "EXPIRES_TODAY",
    statusLabel: "Expires today",
    remark: "Renewal in progress",
    renewalReminder: "30 days before expiry",
    sendRenewalNotification: true,
    isActive: true
  },
  {
    company: "Metro Transport",
    branch: "Pune East Terminal",
    contactPerson: "Kavita Shah",
    telephone: "+91 98220 16842",
    licenseType: "State Carrier License",
    licenseName: "Interstate Goods Transport Authorization",
    licenseNumber: "LIC-MH-2026-0045",
    issuingAuthority: "Maharashtra Transport Commissionerate",
    licenseIssueDate: "10 Jan 2026",
    activationDate: "12 Jan 2026",
    expiryDate: "11 Jan 2027",
    extendDate: "—",
    addedVehicles: 42,
    maxVehicles: 50,
    status: "ACTIVE",
    statusLabel: "Active",
    remark: "Annual fleet license",
    renewalReminder: "30 days before expiry",
    sendRenewalNotification: true,
    isActive: true
  },
  {
    company: "North Star Freight",
    branch: "Ahmedabad Logistics Park",
    contactPerson: "Arjun Patel",
    telephone: "+91 99876 20194",
    licenseType: "Refrigerated Carrier Permit",
    licenseName: "Perishable Cargo Transit Clearance",
    licenseNumber: "LIC-GJ-2025-0089",
    issuingAuthority: "Gujarat Maritime & Transport Board",
    licenseIssueDate: "05 Oct 2025",
    activationDate: "05 Oct 2025",
    expiryDate: "04 Oct 2026",
    extendDate: "—",
    addedVehicles: 73,
    maxVehicles: 75,
    status: "EXPIRING_SOON",
    statusLabel: "Expiring soon",
    remark: "Vehicles capacity near limit",
    renewalReminder: "15 days before expiry",
    sendRenewalNotification: true,
    isActive: true
  },
  {
    company: "Central Fleet Services",
    branch: "Nagpur Central Depot",
    contactPerson: "Neha Joshi",
    telephone: "+91 97654 83017",
    licenseType: "Hazmat Transit License",
    licenseName: "Hazardous Materials Transit Clearance",
    licenseNumber: "LIC-MH-2025-0104",
    issuingAuthority: "PESO Petroleum & Explosives Safety Org",
    licenseIssueDate: "15 Aug 2025",
    activationDate: "16 Aug 2025",
    expiryDate: "15 Sep 2026",
    extendDate: "—",
    addedVehicles: 25,
    maxVehicles: 30,
    status: "EXPIRED",
    statusLabel: "Expired",
    remark: "Awaiting compliance clearance",
    renewalReminder: "60 days before expiry",
    sendRenewalNotification: true,
    isActive: true
  }
];

export const SEED_RESELLER_LICENSES = [
  {
    reseller: "Apex Telecom Reseller",
    contactPerson: "Vikram Malhotra",
    telephone: "+91 98112 34567",
    licenseNumber: "RES-DEL-2025-01",
    licenseModel: "Tier-1 Master Partner",
    activationDate: "15 Jan 2025",
    expiryDate: "14 Jan 2027",
    extendedDate: "—",
    allocatedClients: 18,
    allocatedVehicles: 480,
    vehicleQuota: 600,
    paymentReference: "PAY-APEX-9921",
    notificationEmail: "billing@apextelecom.in",
    renewalReminder: "60 days before expiry",
    remark: "Enterprise partner tier",
    paymentCompleted: true,
    sendExpiryNotification: true,
    status: "ACTIVE",
    statusLabel: "Active",
    isActive: true
  },
  {
    reseller: "Gujarat Fleet Systems",
    contactPerson: "Dharmesh Soni",
    telephone: "+91 94260 78901",
    licenseNumber: "RES-GJ-2025-02",
    licenseModel: "Regional Distributor",
    activationDate: "01 Mar 2025",
    expiryDate: "28 Feb 2027",
    extendedDate: "—",
    allocatedClients: 12,
    allocatedVehicles: 280,
    vehicleQuota: 300,
    paymentReference: "PAY-GFS-8842",
    notificationEmail: "support@gujaratfleet.com",
    renewalReminder: "30 days before expiry",
    remark: "West zone distribution",
    paymentCompleted: true,
    sendExpiryNotification: true,
    status: "EXPIRING_SOON",
    statusLabel: "Expiring soon",
    isActive: true
  }
];

export const SEED_VEHICLE_LICENSES = [
  {
    company: "InOrbit Logistics",
    branch: "Mumbai Central Hub",
    vehicle: "Tata Signa 4825.TK",
    registrationNumber: "DL 01 CA 9876",
    gpsDevice: "Concox AT4 Asset Tracker",
    imei: "867492048129482",
    simNumber: "899100098765432100",
    licenseType: "Commercial Fleet Heavy",
    licenseNumber: "VL-2025-001",
    issuingAuthority: "Delhi RTO",
    licenseIssueDate: "10 Feb 2025",
    activationDate: "11 Feb 2025",
    expiryDate: "10 Feb 2027",
    extendedDate: "—",
    assignedUser: "Aarav Patel",
    licenseAmount: "₹4,800/yr",
    paymentReference: "TXN-882109",
    renewalReminder: "30 days before expiry",
    notificationEmail: "fleet@inorbit.io",
    paymentCompleted: true,
    sendExpiryNotification: true,
    status: "ACTIVE",
    statusLabel: "Active",
    isActive: true
  },
  {
    company: "Metro Freight Lines",
    branch: "Pune East Terminal",
    vehicle: "BharatBenz 3528C",
    registrationNumber: "MH 12 RN 4521",
    gpsDevice: "Teltonika FMB920",
    imei: "867492048129483",
    simNumber: "899100098765432101",
    licenseType: "Interstate Haulage",
    licenseNumber: "VL-2025-002",
    issuingAuthority: "Maharashtra Transport Dept",
    licenseIssueDate: "15 Mar 2025",
    activationDate: "16 Mar 2025",
    expiryDate: "15 Mar 2027",
    extendedDate: "—",
    assignedUser: "Riya Mehta",
    licenseAmount: "₹4,800/yr",
    paymentReference: "TXN-991204",
    renewalReminder: "30 days before expiry",
    notificationEmail: "admin@metrofreight.in",
    paymentCompleted: true,
    sendExpiryNotification: true,
    status: "ACTIVE",
    statusLabel: "Active",
    isActive: true
  }
];

export const SEED_USER_LICENSES = [
  {
    user: "Aarav Patel",
    userEmail: "aarav.patel@orbito.io",
    userRole: "SUPER_ADMIN",
    company: "InOrbit Logistics",
    branch: "Mumbai Central Hub",
    telephone: "+91 98201 12345",
    licenseType: "Enterprise Admin Seat",
    licenseNumber: "UL-2025-001",
    licenseKey: "ORB-ADM-9921-X8",
    allocatedVehicles: 250,
    activationDate: "01 Jan 2025",
    expiryDate: "31 Dec 2028",
    extendDate: "—",
    licenseAmount: "₹12,000/yr",
    paymentStatus: "PAID",
    paymentReference: "REF-ORB-001",
    renewalReminder: "60 days before expiry",
    remark: "Root organization administrator",
    sendActivationEmail: true,
    sendRenewalNotification: true,
    status: "ACTIVE",
    statusLabel: "Active",
    isActive: true
  },
  {
    user: "Riya Mehta",
    userEmail: "riya.mehta@inorbit.fleet",
    userRole: "FLEET_MANAGER",
    company: "InOrbit Logistics",
    branch: "Mumbai Central Hub",
    telephone: "+91 98202 23456",
    licenseType: "Fleet Manager Seat",
    licenseNumber: "UL-2025-002",
    licenseKey: "ORB-MGR-4412-B2",
    allocatedVehicles: 100,
    activationDate: "15 Jan 2025",
    expiryDate: "14 Jan 2027",
    extendDate: "—",
    licenseAmount: "₹6,000/yr",
    paymentStatus: "PAID",
    paymentReference: "REF-ORB-002",
    renewalReminder: "30 days before expiry",
    remark: "Western corridor fleet lead",
    sendActivationEmail: true,
    sendRenewalNotification: true,
    status: "ACTIVE",
    statusLabel: "Active",
    isActive: true
  }
];

export const SEED_GEOFENCES = [
  {
    name: "Ahmedabad Western Logistics Hub Yard",
    type: "circular" as const,
    category: "Yard",
    company: "InOrbit Logistics",
    branch: "Western Hub",
    centerLatitude: 22.9868,
    centerLongitude: 72.4876,
    radiusMeters: 500,
    speedLimitKmh: 20,
    assignedVehiclesCount: 48,
    alertOnEnter: true,
    alertOnExit: true,
    alertOnOverstay: true,
    maxDwellMinutes: 120,
    description: "Container yard parking perimeter with 20 km/h yard speed enforcement.",
    isActive: true
  },
  {
    name: "Sanand Auto Industrial Corridor Zone",
    type: "polygon" as const,
    category: "Plant",
    company: "InOrbit Logistics",
    branch: "Western Hub",
    centerLatitude: 22.9922,
    centerLongitude: 72.3789,
    coordinates: [
      { lat: 22.995, lng: 72.375 },
      { lat: 22.996, lng: 72.385 },
      { lat: 22.988, lng: 72.386 },
      { lat: 22.987, lng: 72.376 }
    ],
    speedLimitKmh: 30,
    assignedVehiclesCount: 32,
    alertOnEnter: true,
    alertOnExit: true,
    alertOnOverstay: false,
    description: "Manufacturing zone and inward parts receiving security boundary.",
    isActive: true
  },
  {
    name: "Delhi Capital Freight Depot Perimeter",
    type: "circular" as const,
    category: "Warehouse",
    company: "InOrbit Logistics",
    branch: "North Region",
    centerLatitude: 28.5355,
    centerLongitude: 77.1264,
    radiusMeters: 750,
    speedLimitKmh: 25,
    assignedVehiclesCount: 64,
    alertOnEnter: true,
    alertOnExit: true,
    alertOnOverstay: true,
    maxDwellMinutes: 180,
    description: "Airport logistics and arterial container handling perimeter.",
    isActive: true
  },
  {
    name: "Pune Chakan Heavy Vehicle Yard",
    type: "polygon" as const,
    category: "Yard",
    company: "Apex Fleetworks",
    branch: "Maharashtra Central",
    centerLatitude: 18.7606,
    centerLongitude: 73.8567,
    coordinates: [
      { lat: 18.765, lng: 73.852 },
      { lat: 18.766, lng: 73.862 },
      { lat: 18.756, lng: 73.861 },
      { lat: 18.755, lng: 73.851 }
    ],
    speedLimitKmh: 15,
    assignedVehiclesCount: 28,
    alertOnEnter: true,
    alertOnExit: true,
    alertOnOverstay: true,
    maxDwellMinutes: 240,
    description: "Heavy truck maintenance depot with automated dispatch alerts.",
    isActive: true
  },
  {
    name: "Yamuna Expressway Toll Monitoring Zone",
    type: "circular" as const,
    category: "Restricted Zone",
    company: "InOrbit Logistics",
    branch: "North Region",
    centerLatitude: 28.1206,
    centerLongitude: 77.5382,
    radiusMeters: 300,
    speedLimitKmh: 40,
    assignedVehiclesCount: 86,
    alertOnEnter: true,
    alertOnExit: true,
    alertOnOverstay: false,
    description: "Expressway toll checkpoint tracking zone.",
    isActive: true
  }
];

export const SEED_POIS = [
  {
    name: "Ahmedabad Warehouse Depot",
    company: "InOrbit Logistics",
    branch: "Western Hub",
    geoCode: "AHM-DPT-001",
    category: "Depot",
    street: "Sarkhej–Sanand Highway",
    city: "Ahmedabad",
    state: "Gujarat",
    latitude: 22.9868,
    longitude: 72.4876,
    radiusMeters: 100,
    description: "Main consolidation point for north-western regional parcel dispatches.",
    isActive: true
  },
  {
    name: "Sanand Manufacturing Plant",
    company: "InOrbit Logistics",
    branch: "Western Hub",
    geoCode: "SND-PLT-014",
    category: "Plant",
    street: "GIDC Phase II",
    city: "Sanand",
    state: "Gujarat",
    latitude: 22.9922,
    longitude: 72.3789,
    radiusMeters: 150,
    description: "Automotive component stamping facility and outward cargo docks.",
    isActive: true
  },
  {
    name: "Delhi Logistics Hub",
    company: "InOrbit Logistics",
    branch: "North Region",
    geoCode: "DEL-HUB-002",
    category: "Logistics Hub",
    street: "NH 8, Mahipalpur",
    city: "New Delhi",
    state: "Delhi",
    latitude: 28.5355,
    longitude: 77.1264,
    radiusMeters: 200,
    description: "Capital freight interchange for northern arterial corridors.",
    isActive: true
  },
  {
    name: "Chakan Staging Yard",
    company: "Apex Fleetworks",
    branch: "Maharashtra Central",
    geoCode: "CHK-YRD-009",
    category: "Yard",
    street: "Chakan MIDC Phase 3",
    city: "Pune",
    state: "Maharashtra",
    latitude: 18.7606,
    longitude: 73.8567,
    radiusMeters: 100,
    description: "Heavy truck staging and pre-dispatch technical review zone.",
    isActive: true
  },
  {
    name: "Mumbai Sea Port Freight Gate",
    company: "InOrbit Logistics",
    branch: "Western Hub",
    geoCode: "BOM-PRT-022",
    category: "Port",
    street: "JNPT Access Road",
    city: "Navi Mumbai",
    state: "Maharashtra",
    latitude: 18.9482,
    longitude: 72.9514,
    radiusMeters: 250,
    description: "Export container gate scanning and terminal entry documentation zone.",
    isActive: true
  }
];


