import { Request } from "express";

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
  search?: string;
  sortBy?: string;
  sortDir: "ASC" | "DESC";
  filters: Record<string, any>;
}

export interface PaginatedResult<T> {
  items: T[];
  metadata: {
    totalCount: number;
    currentPage: number;
    limit: number;
    totalPages: number;
  };
}

export const parsePaginationParams = (req: Request): PaginationParams => {
  const query = req.query;

  const page = Math.max(1, parseInt(String(query.page || "1"), 10) || 1);
  const rawLimit = parseInt(String(query.limit || "10"), 10) || 10;
  const limit = Math.min(100, Math.max(1, rawLimit));
  const skip = (page - 1) * limit;

  const search = typeof query.search === "string" && query.search.trim() ? query.search.trim() : undefined;
  const sortBy = typeof query.sortBy === "string" && query.sortBy.trim() ? query.sortBy.trim() : undefined;
  const sortDir = String(query.sortDir || "ASC").toUpperCase() === "DESC" ? "DESC" : "ASC";

  const filters: Record<string, any> = {};
  if (query.filter && typeof query.filter === "object") {
    for (const [key, value] of Object.entries(query.filter)) {
      if (value !== undefined && value !== null && value !== "") {
        filters[key] = value;
      }
    }
  }

  return {
    page,
    limit,
    skip,
    search,
    sortBy,
    sortDir,
    filters
  };
};

export const buildPaginatedEnvelope = <T>(
  items: T[],
  totalCount: number,
  page: number,
  limit: number
): PaginatedResult<T> => {
  const totalPages = Math.ceil(totalCount / limit) || 1;
  return {
    items,
    metadata: {
      totalCount,
      currentPage: page,
      limit,
      totalPages
    }
  };
};
