import apiClient from "@/utils/api";
import { NormalizedListResult } from "@/lib/listAdapter";
import { downloadStreamFile } from "@/utils/streamingExport";
import {
  CompanyLicense,
  UserLicense,
  VehicleLicense,
  ResellerLicense,
  LicenseFilterParams
} from "@/types/licensing.types";

const FALLBACK_COMPANY_LICENSES: CompanyLicense[] = [
  {
    id: "comp-lic-1",
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
    isActive: true,
    createdAt: "2025-09-21T10:00:00Z",
    updatedAt: "2026-09-21T10:00:00Z"
  },
  {
    id: "comp-lic-2",
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
    isActive: true,
    createdAt: "2026-01-10T11:00:00Z",
    updatedAt: "2026-01-12T11:00:00Z"
  },
  {
    id: "comp-lic-3",
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
    isActive: true,
    createdAt: "2025-10-05T09:30:00Z",
    updatedAt: "2026-10-05T09:30:00Z"
  },
  {
    id: "comp-lic-4",
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
    isActive: true,
    createdAt: "2025-08-15T10:00:00Z",
    updatedAt: "2026-08-15T10:00:00Z"
  }
];

const FALLBACK_USER_LICENSES: UserLicense[] = [
  {
    id: "user-lic-1",
    user: "Aarav Patel",
    userId: "usr-1",
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
    isActive: true,
    createdAt: "2025-01-01T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z"
  },
  {
    id: "user-lic-2",
    user: "Riya Mehta",
    userId: "usr-2",
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
    isActive: true,
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2026-01-15T10:00:00Z"
  }
];

const FALLBACK_VEHICLE_LICENSES: VehicleLicense[] = [
  {
    id: "veh-lic-1",
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
    isActive: true,
    createdAt: "2025-02-10T10:00:00Z",
    updatedAt: "2026-02-10T10:00:00Z"
  },
  {
    id: "veh-lic-2",
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
    isActive: true,
    createdAt: "2025-03-15T10:00:00Z",
    updatedAt: "2026-03-15T10:00:00Z"
  }
];

const FALLBACK_RESELLER_LICENSES: ResellerLicense[] = [
  {
    id: "res-lic-1",
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
    isActive: true,
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2026-01-15T10:00:00Z"
  },
  {
    id: "res-lic-2",
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
    isActive: true,
    createdAt: "2025-03-01T10:00:00Z",
    updatedAt: "2026-03-01T10:00:00Z"
  }
];

export const licensingApi = {
  async getLicensingStats(): Promise<any> {
    try {
      const res = await apiClient.get("/licensing/stats");
      return res.data?.data || res.data;
    } catch {
      return {
        companyLicensesCount: FALLBACK_COMPANY_LICENSES.length,
        userLicensesCount: FALLBACK_USER_LICENSES.length,
        vehicleLicensesCount: FALLBACK_VEHICLE_LICENSES.length,
        resellerLicensesCount: FALLBACK_RESELLER_LICENSES.length,
        expiringSoonCount: 2,
        expiredCount: 1
      };
    }
  },

  // ==========================================
  // 1. Company Licenses
  // ==========================================
  async getCompanyLicenses(params?: LicenseFilterParams): Promise<NormalizedListResult<CompanyLicense>> {
    try {
      const res = await apiClient.get("/licensing/company", { params });
      return res.data;
    } catch {
      let rows = [...FALLBACK_COMPANY_LICENSES];
      if (params?.search) {
        const q = params.search.toLowerCase();
        rows = rows.filter(
          (c) =>
            c.company.toLowerCase().includes(q) ||
            c.branch.toLowerCase().includes(q) ||
            c.licenseNumber.toLowerCase().includes(q)
        );
      }
      if (params?.status && params.status !== "all") {
        rows = rows.filter((c) => c.status === params.status);
      }
      return {
        rows,
        total: rows.length,
        page: params?.page || 1,
        pageSize: params?.limit || 10,
        totalPages: 1
      };
    }
  },

  async getCompanyLicenseById(id: string): Promise<CompanyLicense> {
    try {
      const res = await apiClient.get(`/licensing/company/${id}`);
      return res.data?.data || res.data;
    } catch {
      const found = FALLBACK_COMPANY_LICENSES.find((c) => c.id === id);
      if (!found) throw new Error("Company license not found");
      return found;
    }
  },

  async createCompanyLicense(payload: Partial<CompanyLicense>): Promise<CompanyLicense> {
    const res = await apiClient.post("/licensing/company", payload);
    return res.data?.data || res.data;
  },

  async updateCompanyLicense(id: string, payload: Partial<CompanyLicense>): Promise<CompanyLicense> {
    const res = await apiClient.put(`/licensing/company/${id}`, payload);
    return res.data?.data || res.data;
  },

  async deleteCompanyLicense(id: string): Promise<void> {
    await apiClient.delete(`/licensing/company/${id}`);
  },

  async exportCompanyLicenses(params?: LicenseFilterParams): Promise<void> {
    try {
      await downloadStreamFile("/licensing/company/export", "company_licenses_export.csv", params);
    } catch {
      const list = await licensingApi.getCompanyLicenses(params);
      const headers = "Company,Branch,Contact Person,Telephone,License Type,License Number,Activation Date,Expiry Date,Added Vehicles,Max Vehicles,Remark,Status\n";
      const rows = list.rows
        .map(
          (c) =>
            `"${c.company}","${c.branch}","${c.contactPerson}","${c.telephone}","${c.licenseType}","${c.licenseNumber}","${c.activationDate}","${c.expiryDate}","${c.addedVehicles}","${c.maxVehicles}","${c.remark || ""}","${c.statusLabel || c.status}"`
        )
        .join("\n");
      const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `company_licenses_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  },

  // ==========================================
  // 2. User Licenses
  // ==========================================
  async getUserLicenses(params?: LicenseFilterParams): Promise<NormalizedListResult<UserLicense>> {
    try {
      const res = await apiClient.get("/licensing/user", { params });
      return res.data;
    } catch {
      let rows = [...FALLBACK_USER_LICENSES];
      if (params?.search) {
        const q = params.search.toLowerCase();
        rows = rows.filter(
          (u) =>
            u.user.toLowerCase().includes(q) ||
            u.userEmail?.toLowerCase().includes(q) ||
            u.company.toLowerCase().includes(q)
        );
      }
      if (params?.status && params.status !== "all") {
        rows = rows.filter((u) => u.status === params.status);
      }
      return {
        rows,
        total: rows.length,
        page: params?.page || 1,
        pageSize: params?.limit || 10,
        totalPages: 1
      };
    }
  },

  async getUserLicenseById(id: string): Promise<UserLicense> {
    try {
      const res = await apiClient.get(`/licensing/user/${id}`);
      return res.data?.data || res.data;
    } catch {
      const found = FALLBACK_USER_LICENSES.find((u) => u.id === id);
      if (!found) throw new Error("User license not found");
      return found;
    }
  },

  async createUserLicense(payload: Partial<UserLicense>): Promise<UserLicense> {
    const res = await apiClient.post("/licensing/user", payload);
    return res.data?.data || res.data;
  },

  async updateUserLicense(id: string, payload: Partial<UserLicense>): Promise<UserLicense> {
    const res = await apiClient.put(`/licensing/user/${id}`, payload);
    return res.data?.data || res.data;
  },

  async deleteUserLicense(id: string): Promise<void> {
    await apiClient.delete(`/licensing/user/${id}`);
  },

  async exportUserLicenses(params?: LicenseFilterParams): Promise<void> {
    try {
      await downloadStreamFile("/licensing/user/export", "user_licenses_export.csv", params);
    } catch {
      const list = await licensingApi.getUserLicenses(params);
      const headers = "User,Email,Company,Branch,Telephone,License Type,Allocated Vehicles,Activation Date,Expiry Date,Extend Date,Remark,Status\n";
      const rows = list.rows
        .map(
          (u) =>
            `"${u.user}","${u.userEmail || ""}","${u.company}","${u.branch}","${u.telephone}","${u.licenseType}","${u.allocatedVehicles}","${u.activationDate}","${u.expiryDate}","${u.extendDate || "—"}","${u.remark || ""}","${u.statusLabel || u.status}"`
        )
        .join("\n");
      const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `user_licenses_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  },

  // ==========================================
  // 3. Vehicle Licenses
  // ==========================================
  async getVehicleLicenses(params?: LicenseFilterParams): Promise<NormalizedListResult<VehicleLicense>> {
    try {
      const res = await apiClient.get("/licensing/vehicle", { params });
      return res.data;
    } catch {
      let rows = [...FALLBACK_VEHICLE_LICENSES];
      if (params?.search) {
        const q = params.search.toLowerCase();
        rows = rows.filter(
          (v) =>
            v.vehicle.toLowerCase().includes(q) ||
            v.registrationNumber.toLowerCase().includes(q) ||
            v.imei.includes(q)
        );
      }
      if (params?.status && params.status !== "all") {
        rows = rows.filter((v) => v.status === params.status);
      }
      return {
        rows,
        total: rows.length,
        page: params?.page || 1,
        pageSize: params?.limit || 10,
        totalPages: 1
      };
    }
  },

  async getVehicleLicenseById(id: string): Promise<VehicleLicense> {
    try {
      const res = await apiClient.get(`/licensing/vehicle/${id}`);
      return res.data?.data || res.data;
    } catch {
      const found = FALLBACK_VEHICLE_LICENSES.find((v) => v.id === id);
      if (!found) throw new Error("Vehicle license not found");
      return found;
    }
  },

  async createVehicleLicense(payload: Partial<VehicleLicense>): Promise<VehicleLicense> {
    const res = await apiClient.post("/licensing/vehicle", payload);
    return res.data?.data || res.data;
  },

  async updateVehicleLicense(id: string, payload: Partial<VehicleLicense>): Promise<VehicleLicense> {
    const res = await apiClient.put(`/licensing/vehicle/${id}`, payload);
    return res.data?.data || res.data;
  },

  async deleteVehicleLicense(id: string): Promise<void> {
    await apiClient.delete(`/licensing/vehicle/${id}`);
  },

  async exportVehicleLicenses(params?: LicenseFilterParams): Promise<void> {
    try {
      await downloadStreamFile("/licensing/vehicle/export", "vehicle_licenses_export.csv", params);
    } catch {
      const list = await licensingApi.getVehicleLicenses(params);
      const headers = "Company,Branch,Vehicle Plate,Registration No,GPS Device,IMEI,SIM Number,License Number,Issue Date,Activation Date,Expiry Date,Extend Date,Assigned User,Status\n";
      const rows = list.rows
        .map(
          (v) =>
            `"${v.company}","${v.branch}","${v.vehicle}","${v.registrationNumber}","${v.gpsDevice}","${v.imei}","${v.simNumber}","${v.licenseNumber}","${v.licenseIssueDate}","${v.activationDate}","${v.expiryDate}","${v.extendedDate || "—"}","${v.assignedUser || ""}","${v.statusLabel || v.status}"`
        )
        .join("\n");
      const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vehicle_licenses_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  },

  // ==========================================
  // 4. Reseller Licenses
  // ==========================================
  async getResellerLicenses(params?: LicenseFilterParams): Promise<NormalizedListResult<ResellerLicense>> {
    try {
      const res = await apiClient.get("/licensing/reseller", { params });
      return res.data;
    } catch {
      let rows = [...FALLBACK_RESELLER_LICENSES];
      if (params?.search) {
        const q = params.search.toLowerCase();
        rows = rows.filter(
          (r) =>
            r.reseller.toLowerCase().includes(q) ||
            r.contactPerson.toLowerCase().includes(q) ||
            r.licenseNumber.includes(q)
        );
      }
      if (params?.status && params.status !== "all") {
        rows = rows.filter((r) => r.status === params.status);
      }
      return {
        rows,
        total: rows.length,
        page: params?.page || 1,
        pageSize: params?.limit || 10,
        totalPages: 1
      };
    }
  },

  async getResellerLicenseById(id: string): Promise<ResellerLicense> {
    try {
      const res = await apiClient.get(`/licensing/reseller/${id}`);
      return res.data?.data || res.data;
    } catch {
      const found = FALLBACK_RESELLER_LICENSES.find((r) => r.id === id);
      if (!found) throw new Error("Reseller license not found");
      return found;
    }
  },

  async createResellerLicense(payload: Partial<ResellerLicense>): Promise<ResellerLicense> {
    const res = await apiClient.post("/licensing/reseller", payload);
    return res.data?.data || res.data;
  },

  async updateResellerLicense(id: string, payload: Partial<ResellerLicense>): Promise<ResellerLicense> {
    const res = await apiClient.put(`/licensing/reseller/${id}`, payload);
    return res.data?.data || res.data;
  },

  async deleteResellerLicense(id: string): Promise<void> {
    await apiClient.delete(`/licensing/reseller/${id}`);
  },

  async exportResellerLicenses(params?: LicenseFilterParams): Promise<void> {
    try {
      await downloadStreamFile("/licensing/reseller/export", "reseller_licenses_export.csv", params);
    } catch {
      const list = await licensingApi.getResellerLicenses(params);
      const headers = "Reseller,Contact Person,Telephone,License Number,License Model,Activation Date,Expiry Date,Extend Date,Allocated Clients,Allocated Vehicles,Quota,Status\n";
      const rows = list.rows
        .map(
          (r) =>
            `"${r.reseller}","${r.contactPerson}","${r.telephone}","${r.licenseNumber}","${r.licenseModel}","${r.activationDate}","${r.expiryDate}","${r.extendedDate || "—"}","${r.allocatedClients}","${r.allocatedVehicles}","${r.vehicleQuota}","${r.statusLabel || r.status}"`
        )
        .join("\n");
      const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reseller_licenses_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }
};
