import React from "react";
import { TableFilterBar } from "@/components/common/TableFilterBar";
import { Select } from "@/components/common/Select";

interface GeofenceFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  type?: string;
  onTypeChange?: (value: string) => void;
  category?: string;
  onCategoryChange?: (value: string) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  onCreateNew?: () => void;
  createLabel?: string;
  isRefreshing?: boolean;
  placeholder?: string;
}

export const GeofenceFilterBar: React.FC<GeofenceFilterBarProps> = ({
  search,
  onSearchChange,
  type = "ALL",
  onTypeChange,
  category = "ALL",
  onCategoryChange,
  onRefresh,
  onExport,
  onCreateNew,
  createLabel = "Create Geofence",
  isRefreshing = false,
  placeholder = "Search geofence name, category, or branch..."
}) => {
  const filterElements = (
    <>
      {onTypeChange && (
        <div className="w-full sm:w-36">
          <Select
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
            sizeVariant="md"
          >
            <option value="ALL">All Types</option>
            <option value="circular">Circular</option>
            <option value="polygon">Polygon</option>
          </Select>
        </div>
      )}

      {onCategoryChange && (
        <div className="w-full sm:w-40">
          <Select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            sizeVariant="md"
          >
            <option value="ALL">All Categories</option>
            <option value="Warehouse">Warehouse</option>
            <option value="Plant">Plant</option>
            <option value="Yard">Yard</option>
            <option value="Restricted Zone">Restricted Zone</option>
            <option value="Customer Depot">Customer Depot</option>
          </Select>
        </div>
      )}
    </>
  );

  return (
    <TableFilterBar
      search={search}
      onSearchChange={onSearchChange}
      searchPlaceholder={placeholder}
      filters={filterElements}
      onRefresh={onRefresh}
      isRefreshing={isRefreshing}
      onExport={onExport}
      exportLabel="Export Excel"
      onCreateNew={onCreateNew}
      createLabel={createLabel}
    />
  );
};

export default GeofenceFilterBar;

