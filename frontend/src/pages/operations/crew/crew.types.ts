export interface CrewAllocation {
  id: string;
  companyName?: string;
  branchName?: string;
  vehicleId: string;
  vehiclePlate: string;
  primaryDriverId: string;
  primaryDriverName: string;
  primaryDriverPhone: string;
  secondaryDriverId?: string;
  secondaryDriverName?: string;
  cleanerId?: string;
  cleanerName?: string;
  shiftName: string;
  startDate: string;
  endDate?: string;
  dutyStatus: "on_duty" | "off_duty" | "standby";
  notes?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CrewAllocationFilters {
  search?: string;
  shiftName?: string;
  dutyStatus?: string;
  page?: number;
  limit?: number;
}

export interface CrewAllocationFormData {
  companyName?: string;
  branchName?: string;
  vehicleId: string;
  vehiclePlate: string;
  primaryDriverId: string;
  primaryDriverName: string;
  primaryDriverPhone: string;
  secondaryDriverId?: string;
  secondaryDriverName?: string;
  cleanerId?: string;
  cleanerName?: string;
  shiftName: string;
  startDate: string;
  endDate?: string;
  dutyStatus: "on_duty" | "off_duty" | "standby";
  notes?: string;
  isActive: boolean;
}
