import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { licensingApi } from "@/api/licensing.api";
import {
  CompanyLicense,
  UserLicense,
  VehicleLicense,
  ResellerLicense,
  LicenseFilterParams
} from "@/types/licensing.types";
import { showToast } from "@/lib/toast";

export const LICENSING_QUERY_KEYS = {
  stats: ["licensing", "stats"] as const,
  companyLicenses: (params?: LicenseFilterParams) => ["licensing", "companies", params] as const,
  companyLicenseDetail: (id: string) => ["licensing", "companies", "detail", id] as const,
  userLicenses: (params?: LicenseFilterParams) => ["licensing", "users", params] as const,
  userLicenseDetail: (id: string) => ["licensing", "users", "detail", id] as const,
  vehicleLicenses: (params?: LicenseFilterParams) => ["licensing", "vehicles", params] as const,
  vehicleLicenseDetail: (id: string) => ["licensing", "vehicles", "detail", id] as const,
  resellerLicenses: (params?: LicenseFilterParams) => ["licensing", "resellers", params] as const,
  resellerLicenseDetail: (id: string) => ["licensing", "resellers", "detail", id] as const
};

// 0. Statistics Hook
export const useLicensingStats = () => {
  return useQuery({
    queryKey: LICENSING_QUERY_KEYS.stats,
    queryFn: () => licensingApi.getLicensingStats(),
    staleTime: 30_000
  });
};

// 1. Company Licenses Hooks
export const useCompanyLicenses = (params?: LicenseFilterParams) => {
  return useQuery({
    queryKey: LICENSING_QUERY_KEYS.companyLicenses(params),
    queryFn: () => licensingApi.getCompanyLicenses(params),
    staleTime: 30_000
  });
};

export const useCompanyLicenseDetail = (id: string) => {
  return useQuery({
    queryKey: LICENSING_QUERY_KEYS.companyLicenseDetail(id),
    queryFn: () => licensingApi.getCompanyLicenseById(id),
    enabled: !!id
  });
};

export const useCreateCompanyLicense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<CompanyLicense>) => licensingApi.createCompanyLicense(payload),
    onSuccess: (record) => {
      qc.invalidateQueries({ queryKey: ["licensing", "companies"] });
      qc.invalidateQueries({ queryKey: LICENSING_QUERY_KEYS.stats });
      showToast.success(`Company license "${record.licenseNumber}" created successfully`);
    },
    onError: (err: any) => {
      showToast.error(err.message || "Failed to create company license");
    }
  });
};

export const useUpdateCompanyLicense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CompanyLicense> }) =>
      licensingApi.updateCompanyLicense(id, payload),
    onSuccess: (record) => {
      qc.invalidateQueries({ queryKey: ["licensing", "companies"] });
      qc.invalidateQueries({ queryKey: LICENSING_QUERY_KEYS.stats });
      showToast.success(`Company license "${record.licenseNumber}" updated successfully`);
    },
    onError: (err: any) => {
      showToast.error(err.message || "Failed to update company license");
    }
  });
};

export const useDeleteCompanyLicense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => licensingApi.deleteCompanyLicense(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["licensing", "companies"] });
      qc.invalidateQueries({ queryKey: LICENSING_QUERY_KEYS.stats });
      showToast.success("Company license deleted successfully");
    },
    onError: (err: any) => {
      showToast.error(err.message || "Failed to delete company license");
    }
  });
};

// 2. User Licenses Hooks
export const useUserLicenses = (params?: LicenseFilterParams) => {
  return useQuery({
    queryKey: LICENSING_QUERY_KEYS.userLicenses(params),
    queryFn: () => licensingApi.getUserLicenses(params),
    staleTime: 30_000
  });
};

export const useUserLicenseDetail = (id: string) => {
  return useQuery({
    queryKey: LICENSING_QUERY_KEYS.userLicenseDetail(id),
    queryFn: () => licensingApi.getUserLicenseById(id),
    enabled: !!id
  });
};

export const useCreateUserLicense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<UserLicense>) => licensingApi.createUserLicense(payload),
    onSuccess: (record) => {
      qc.invalidateQueries({ queryKey: ["licensing", "users"] });
      qc.invalidateQueries({ queryKey: LICENSING_QUERY_KEYS.stats });
      showToast.success(`User license "${record.licenseNumber}" created successfully`);
    },
    onError: (err: any) => {
      showToast.error(err.message || "Failed to create user license");
    }
  });
};

export const useUpdateUserLicense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<UserLicense> }) =>
      licensingApi.updateUserLicense(id, payload),
    onSuccess: (record) => {
      qc.invalidateQueries({ queryKey: ["licensing", "users"] });
      qc.invalidateQueries({ queryKey: LICENSING_QUERY_KEYS.stats });
      showToast.success(`User license "${record.licenseNumber}" updated successfully`);
    },
    onError: (err: any) => {
      showToast.error(err.message || "Failed to update user license");
    }
  });
};

export const useDeleteUserLicense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => licensingApi.deleteUserLicense(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["licensing", "users"] });
      qc.invalidateQueries({ queryKey: LICENSING_QUERY_KEYS.stats });
      showToast.success("User license deleted successfully");
    },
    onError: (err: any) => {
      showToast.error(err.message || "Failed to delete user license");
    }
  });
};

// 3. Vehicle Licenses Hooks
export const useVehicleLicenses = (params?: LicenseFilterParams) => {
  return useQuery({
    queryKey: LICENSING_QUERY_KEYS.vehicleLicenses(params),
    queryFn: () => licensingApi.getVehicleLicenses(params),
    staleTime: 30_000
  });
};

export const useVehicleLicenseDetail = (id: string) => {
  return useQuery({
    queryKey: LICENSING_QUERY_KEYS.vehicleLicenseDetail(id),
    queryFn: () => licensingApi.getVehicleLicenseById(id),
    enabled: !!id
  });
};

export const useCreateVehicleLicense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<VehicleLicense>) => licensingApi.createVehicleLicense(payload),
    onSuccess: (record) => {
      qc.invalidateQueries({ queryKey: ["licensing", "vehicles"] });
      qc.invalidateQueries({ queryKey: LICENSING_QUERY_KEYS.stats });
      showToast.success(`Vehicle license "${record.licenseNumber}" created successfully`);
    },
    onError: (err: any) => {
      showToast.error(err.message || "Failed to create vehicle license");
    }
  });
};

export const useUpdateVehicleLicense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<VehicleLicense> }) =>
      licensingApi.updateVehicleLicense(id, payload),
    onSuccess: (record) => {
      qc.invalidateQueries({ queryKey: ["licensing", "vehicles"] });
      qc.invalidateQueries({ queryKey: LICENSING_QUERY_KEYS.stats });
      showToast.success(`Vehicle license "${record.licenseNumber}" updated successfully`);
    },
    onError: (err: any) => {
      showToast.error(err.message || "Failed to update vehicle license");
    }
  });
};

export const useDeleteVehicleLicense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => licensingApi.deleteVehicleLicense(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["licensing", "vehicles"] });
      qc.invalidateQueries({ queryKey: LICENSING_QUERY_KEYS.stats });
      showToast.success("Vehicle license deleted successfully");
    },
    onError: (err: any) => {
      showToast.error(err.message || "Failed to delete vehicle license");
    }
  });
};

// 4. Reseller Licenses Hooks
export const useResellerLicenses = (params?: LicenseFilterParams) => {
  return useQuery({
    queryKey: LICENSING_QUERY_KEYS.resellerLicenses(params),
    queryFn: () => licensingApi.getResellerLicenses(params),
    staleTime: 30_000
  });
};

export const useResellerLicenseDetail = (id: string) => {
  return useQuery({
    queryKey: LICENSING_QUERY_KEYS.resellerLicenseDetail(id),
    queryFn: () => licensingApi.getResellerLicenseById(id),
    enabled: !!id
  });
};

export const useCreateResellerLicense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<ResellerLicense>) => licensingApi.createResellerLicense(payload),
    onSuccess: (record) => {
      qc.invalidateQueries({ queryKey: ["licensing", "resellers"] });
      qc.invalidateQueries({ queryKey: LICENSING_QUERY_KEYS.stats });
      showToast.success(`Reseller license "${record.licenseNumber}" created successfully`);
    },
    onError: (err: any) => {
      showToast.error(err.message || "Failed to create reseller license");
    }
  });
};

export const useUpdateResellerLicense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ResellerLicense> }) =>
      licensingApi.updateResellerLicense(id, payload),
    onSuccess: (record) => {
      qc.invalidateQueries({ queryKey: ["licensing", "resellers"] });
      qc.invalidateQueries({ queryKey: LICENSING_QUERY_KEYS.stats });
      showToast.success(`Reseller license "${record.licenseNumber}" updated successfully`);
    },
    onError: (err: any) => {
      showToast.error(err.message || "Failed to update reseller license");
    }
  });
};

export const useDeleteResellerLicense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => licensingApi.deleteResellerLicense(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["licensing", "resellers"] });
      qc.invalidateQueries({ queryKey: LICENSING_QUERY_KEYS.stats });
      showToast.success("Reseller license deleted successfully");
    },
    onError: (err: any) => {
      showToast.error(err.message || "Failed to delete reseller license");
    }
  });
};
