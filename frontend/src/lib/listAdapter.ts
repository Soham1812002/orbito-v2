export interface NormalizedListResult<T> {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function listAdapter<T = any>(response: any): NormalizedListResult<T> {
  const data = response?.data || response;

  let rawItems: any[] = [];
  let total = 0;
  let page = 1;
  let pageSize = 10;
  let totalPages = 1;

  if (Array.isArray(data)) {
    rawItems = data;
    total = data.length;
    totalPages = 1;
  } else if (data && typeof data === "object") {
    rawItems = Array.isArray(data.items)
      ? data.items
      : Array.isArray(data.rows)
      ? data.rows
      : Array.isArray(data.data)
      ? data.data
      : [];

    const meta = data.metadata || data.meta || {};
    total = meta.totalCount ?? meta.total ?? rawItems.length;
    page = meta.currentPage ?? meta.page ?? 1;
    pageSize = meta.limit ?? meta.pageSize ?? 10;
    totalPages = meta.totalPages ?? (Math.ceil(total / pageSize) || 1);
  }

  // Canonical ID normalization: ensure both id and _id exist on each item
  const rows = rawItems.map((item) => {
    if (item && typeof item === "object") {
      const canonicalId = item.id || item._id;
      return {
        ...item,
        id: canonicalId,
        _id: canonicalId
      };
    }
    return item;
  });

  return {
    rows,
    total,
    page,
    pageSize,
    totalPages
  };
}
