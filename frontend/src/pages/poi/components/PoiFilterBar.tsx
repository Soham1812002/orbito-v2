import React from "react";
import { TableFilterBar } from "@/components/common/TableFilterBar";
import { Select } from "@/components/common/Select";

interface PoiFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  company?: string;
  onCompanyChange?: (value: string) => void;
  branch?: string;
  onBranchChange?: (value: string) => void;
  category?: string;
  onCategoryChange?: (value: string) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  onCreateNew?: () => void;
  createLabel?: string;
  isRefreshing?: boolean;
  categories?: string[];
  placeholder?: string;
}

export const PoiFilterBar: React.FC<PoiFilterBarProps> = ({
  search,
  onSearchChange,
  company = "ALL",
  onCompanyChange,
  branch = "ALL",
  onBranchChange,
  category = "ALL",
  onCategoryChange,
  onRefresh,
  onExport,
  onCreateNew,
  createLabel = "Add POI",
  isRefreshing = false,
  categories = [
    "Toll Plaza",
    "Depot",
    "Plant",
    "Logistics Hub",
    "Staging Yard",
    "Client Site"
  ],
  placeholder = "Search by place, geocode, or address..."
}) => {
  const filterElements = (
    <>
      {onCompanyChange && (
        <div className="w-full sm:w-36">
          <Select
            value={company}
            onChange={(e) => onCompanyChange(e.target.value)}
            sizeVariant="md"
          >
            <option value="ALL">All Companies</option>
            <option value="InOrbit Logistics">InOrbit Logistics</option>
            <option value="Apex Fleetworks">Apex Fleetworks</option>
            <option value="TransGlobal Freight">TransGlobal Freight</option>
          </Select>
        </div>
      )}

      {onBranchChange && (
        <div className="w-full sm:w-36">
          <Select
            value={branch}
            onChange={(e) => onBranchChange(e.target.value)}
            sizeVariant="md"
          >
            <option value="ALL">All Branches</option>
            <option value="Western Hub">Western Hub</option>
            <option value="North Region">North Region</option>
            <option value="Maharashtra Central">Maharashtra Central</option>
            <option value="Southern Maritime">Southern Maritime</option>
          </Select>
        </div>
      )}

      {onCategoryChange && categories.length > 0 && (
        <div className="w-full sm:w-36">
          <Select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            sizeVariant="md"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
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

export default PoiFilterBar;

