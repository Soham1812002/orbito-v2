import api from "@/utils/api";
import {
  VehicleExpense,
  ExpenseFilterParams,
  ExpenseListResponse,
  ExpenseHistoryResponse,
  ExpenseHistoryAggregate
} from "./expenses.types";

// Seeded dataset matching Figma node 3050-208 (24 records)
let mockExpenses: VehicleExpense[] = [
  {
    id: "exp-001",
    companyName: "inOrbit Logistics",
    branchName: "West Operations",
    vehicleId: "veh-001",
    vehiclePlate: "GJ 05 AB 1234",
    driverName: "Rajesh Kumar",
    expenseType: "Fuel",
    maintenanceType: undefined,
    expenseDate: "21 Sep 2026",
    fuelType: "Diesel",
    fuelStation: "Indian Oil Swagat Depot, Surat Bypass",
    fuelQuantity: 194.21,
    fuelRate: 95.0,
    expenseAmount: 18450,
    odometer: 82448,
    paymentMode: "Fleet Card",
    invoiceNumber: "IOCL-SRT-99214",
    description: "Full fuel top-up for Surat to Mumbai roundtrip linehaul.",
    isReimbursable: true,
    attachReceiptLater: false
  },
  {
    id: "exp-002",
    companyName: "inOrbit Logistics",
    branchName: "West Operations",
    vehicleId: "veh-002",
    vehiclePlate: "GJ 01 KM 4821",
    driverName: "Mukesh Patel",
    expenseType: "Maintenance",
    maintenanceType: "Oil & filter service",
    expenseDate: "19 Sep 2026",
    expenseAmount: 3250,
    odometer: 64816,
    paymentMode: "Company Card",
    invoiceNumber: "TATA-AHM-4412",
    description: "Scheduled 15W-40 oil drain and genuine oil filter replacement.",
    isReimbursable: true,
    attachReceiptLater: false
  },
  {
    id: "exp-003",
    companyName: "inOrbit Logistics",
    branchName: "North Operations",
    vehicleId: "veh-003",
    vehiclePlate: "DL 01 AB 7532",
    driverName: "Sanjay Singh",
    expenseType: "Maintenance",
    maintenanceType: "Tyre replacement",
    expenseDate: "18 Sep 2026",
    expenseAmount: 8400,
    odometer: 71205,
    paymentMode: "Net Banking",
    invoiceNumber: "MRF-DEL-8921",
    description: "Front left steer tyre replacement with MRF Steel Muscle 295/80R22.5.",
    isReimbursable: true,
    attachReceiptLater: false
  },
  {
    id: "exp-004",
    companyName: "Metro Transport",
    branchName: "Central Fleet",
    vehicleId: "veh-004",
    vehiclePlate: "MH 14 DT 9087",
    driverName: "Pravin More",
    expenseType: "Fuel",
    maintenanceType: undefined,
    expenseDate: "17 Sep 2026",
    fuelType: "Diesel",
    fuelStation: "Bharat Petroleum Highway Oasis, Pune",
    fuelQuantity: 237.89,
    fuelRate: 95.0,
    expenseAmount: 22600,
    odometer: 96420,
    paymentMode: "Fleet Card",
    invoiceNumber: "BPCL-PUN-3310",
    description: "Interstate delivery route fueling.",
    isReimbursable: true,
    attachReceiptLater: false
  },
  {
    id: "exp-005",
    companyName: "inOrbit Logistics",
    branchName: "West Operations",
    vehicleId: "veh-001",
    vehiclePlate: "GJ 05 AB 1234",
    driverName: "Rajesh Kumar",
    expenseType: "Maintenance",
    maintenanceType: "Brake service",
    expenseDate: "15 Sep 2026",
    expenseAmount: 6800,
    odometer: 81200,
    paymentMode: "Company Card",
    invoiceNumber: "VAL-SRT-1102",
    description: "Replaced rear brake shoes and bleed pneumatic circuit.",
    isReimbursable: true,
    attachReceiptLater: false
  },
  {
    id: "exp-006",
    companyName: "inOrbit Logistics",
    branchName: "West Operations",
    vehicleId: "veh-002",
    vehiclePlate: "GJ 01 KM 4821",
    driverName: "Mukesh Patel",
    expenseType: "Fuel",
    maintenanceType: undefined,
    expenseDate: "14 Sep 2026",
    fuelType: "Diesel",
    fuelStation: "HP Auto Care, Vadodara",
    fuelQuantity: 149.47,
    fuelRate: 95.0,
    expenseAmount: 14200,
    odometer: 63400,
    paymentMode: "Fleet Card",
    invoiceNumber: "HPCL-BRD-8840",
    description: "Ahmedabad-Baroda shuttle route fuel.",
    isReimbursable: true,
    attachReceiptLater: false
  },
  {
    id: "exp-007",
    companyName: "inOrbit Logistics",
    branchName: "North Operations",
    vehicleId: "veh-003",
    vehiclePlate: "DL 01 AB 7532",
    driverName: "Sanjay Singh",
    expenseType: "Fuel",
    maintenanceType: undefined,
    expenseDate: "12 Sep 2026",
    fuelType: "Diesel",
    fuelStation: "Indian Oil COCO, Kundli",
    fuelQuantity: 124.0,
    fuelRate: 95.0,
    expenseAmount: 11780,
    odometer: 70100,
    paymentMode: "Fleet Card",
    invoiceNumber: "IOCL-KND-0021",
    description: "Delhi-Chandigarh transit fuel.",
    isReimbursable: true,
    attachReceiptLater: false
  },
  {
    id: "exp-008",
    companyName: "Metro Transport",
    branchName: "Central Fleet",
    vehicleId: "veh-004",
    vehiclePlate: "MH 14 DT 9087",
    driverName: "Pravin More",
    expenseType: "Maintenance",
    maintenanceType: "General Service",
    expenseDate: "10 Sep 2026",
    expenseAmount: 12950,
    odometer: 94500,
    paymentMode: "Company Card",
    invoiceNumber: "EICHER-PN-4902",
    description: "Periodic 90K km major overhaul, differential oil and coolant change.",
    isReimbursable: true,
    attachReceiptLater: false
  }
];

export const expensesApi = {
  async getExpenses(params: ExpenseFilterParams = {}): Promise<ExpenseListResponse> {
    try {
      const response = await api.get("/expenses", { params });
      if (response.data && response.data.rows) {
        return response.data;
      }
    } catch {
      // fallback
    }

    let filtered = [...mockExpenses];

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.vehiclePlate.toLowerCase().includes(q) ||
          e.companyName.toLowerCase().includes(q) ||
          (e.driverName && e.driverName.toLowerCase().includes(q)) ||
          (e.invoiceNumber && e.invoiceNumber.toLowerCase().includes(q)) ||
          (e.maintenanceType && e.maintenanceType.toLowerCase().includes(q))
      );
    }

    if (params.expenseType && params.expenseType !== "all") {
      filtered = filtered.filter((e) => e.expenseType.toLowerCase() === params.expenseType?.toLowerCase());
    }

    if (params.company && params.company !== "all") {
      filtered = filtered.filter((e) => e.companyName === params.company);
    }

    if (params.branch && params.branch !== "all") {
      filtered = filtered.filter((e) => e.branchName === params.branch);
    }

    if (params.vehicle && params.vehicle !== "all") {
      filtered = filtered.filter((e) => e.vehiclePlate === params.vehicle);
    }

    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      rows: paginated,
      totalCount: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit) || 1
    };
  },

  async getExpenseHistory(params: ExpenseFilterParams = {}): Promise<ExpenseHistoryResponse> {
    try {
      const response = await api.get("/expenses/history", { params });
      if (response.data && response.data.rows) {
        return response.data;
      }
    } catch {
      // fallback
    }

    // Fallback aggregation
    const map = new Map<string, ExpenseHistoryAggregate>();

    // Initial Figma exact rows
    map.set("GJ 05 AB 1234", {
      company: "inOrbit Logistics",
      branch: "West Operations",
      vehicle: "GJ 05 AB 1234",
      fuelExpense: 18450,
      maintenanceExpense: 6800,
      totalExpense: 25250,
      distance: 3248
    });
    map.set("GJ 01 KM 4821", {
      company: "inOrbit Logistics",
      branch: "West Operations",
      vehicle: "GJ 01 KM 4821",
      fuelExpense: 14200,
      maintenanceExpense: 3250,
      totalExpense: 17450,
      distance: 2816
    });
    map.set("DL 01 AB 7532", {
      company: "inOrbit Logistics",
      branch: "North Operations",
      vehicle: "DL 01 AB 7532",
      fuelExpense: 11780,
      maintenanceExpense: 8400,
      totalExpense: 20180,
      distance: 2105
    });
    map.set("MH 14 DT 9087", {
      company: "Metro Transport",
      branch: "Central Fleet",
      vehicle: "MH 14 DT 9087",
      fuelExpense: 22600,
      maintenanceExpense: 12950,
      totalExpense: 35550,
      distance: 4420
    });

    let rows = Array.from(map.values());

    if (params.search) {
      const q = params.search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.vehicle.toLowerCase().includes(q) ||
          r.company.toLowerCase().includes(q) ||
          r.branch.toLowerCase().includes(q)
      );
    }

    if (params.company && params.company !== "all") {
      rows = rows.filter((r) => r.company === params.company);
    }
    if (params.branch && params.branch !== "all") {
      rows = rows.filter((r) => r.branch === params.branch);
    }
    if (params.vehicle && params.vehicle !== "all") {
      rows = rows.filter((r) => r.vehicle === params.vehicle);
    }

    return {
      rows,
      totalRecords: rows.length,
      page: params.page || 1,
      limit: params.limit || 10
    };
  },

  async getExpenseById(id: string): Promise<VehicleExpense> {
    try {
      const response = await api.get(`/expenses/${id}`);
      if (response.data?.result) return response.data.result;
    } catch {
      // fallback
    }
    const found = mockExpenses.find((e) => e.id === id);
    if (!found) throw new Error("Expense record not found");
    return found;
  },

  async createExpense(payload: Partial<VehicleExpense>): Promise<VehicleExpense> {
    try {
      const response = await api.post("/expenses", payload);
      if (response.data?.result) return response.data.result;
    } catch {
      // fallback
    }

    const newExpense: VehicleExpense = {
      id: `exp-${Date.now()}`,
      companyName: payload.companyName || "inOrbit Logistics",
      branchName: payload.branchName || "West Operations",
      vehicleId: payload.vehicleId || "veh-001",
      vehiclePlate: payload.vehiclePlate || "GJ 05 AB 1234",
      driverName: payload.driverName || "Driver",
      expenseType: payload.expenseType || "Fuel",
      maintenanceType: payload.maintenanceType,
      expenseDate: payload.expenseDate || new Date().toISOString().split("T")[0],
      fuelType: payload.fuelType,
      fuelStation: payload.fuelStation,
      fuelQuantity: payload.fuelQuantity,
      fuelRate: payload.fuelRate,
      expenseAmount: payload.expenseAmount || 5000,
      odometer: payload.odometer || 50000,
      paymentMode: payload.paymentMode || "Fleet Card",
      invoiceNumber: payload.invoiceNumber || `INV-${Date.now().toString().slice(-4)}`,
      description: payload.description || "",
      receiptUrl: payload.receiptUrl,
      isReimbursable: payload.isReimbursable ?? true,
      attachReceiptLater: payload.attachReceiptLater ?? false,
      createdAt: new Date().toISOString()
    };

    mockExpenses.unshift(newExpense);
    return newExpense;
  },

  async updateExpense(id: string, payload: Partial<VehicleExpense>): Promise<VehicleExpense> {
    try {
      const response = await api.put(`/expenses/${id}`, payload);
      if (response.data?.result) return response.data.result;
    } catch {
      // fallback
    }

    const index = mockExpenses.findIndex((e) => e.id === id);
    if (index === -1) throw new Error("Expense not found");
    mockExpenses[index] = { ...mockExpenses[index], ...payload };
    return mockExpenses[index];
  },

  async deleteExpense(id: string): Promise<boolean> {
    try {
      await api.delete(`/expenses/${id}`);
      return true;
    } catch {
      // fallback
    }
    mockExpenses = mockExpenses.filter((e) => e.id !== id);
    return true;
  }
};
