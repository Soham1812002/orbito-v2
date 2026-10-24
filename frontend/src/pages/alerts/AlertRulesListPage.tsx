import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  SlidersHorizontal,
  RefreshCw,
  Plus,
  Search,
  ArrowLeft,
  ShieldCheck,
  Bell
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { AppDataTable } from "@/components/common/AppDataTable";
import { TableFilterBar } from "@/components/common/TableFilterBar";
import { Select } from "@/components/common/Select";
import { useAlertRules, useToggleAlertRule, useDeleteAlertRule } from "./alerts.queries";
import { getAlertRuleColumns } from "./alerts.columns";
import { AlertRule } from "./alerts.types";

export const AlertRulesListPage: React.FC = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data, isLoading, refetch, isFetching } = useAlertRules({
    search: search || undefined,
    severity: severityFilter,
    alertType: typeFilter
  });

  const toggleMutation = useToggleAlertRule();
  const deleteMutation = useDeleteAlertRule();

  const handleToggle = (rule: AlertRule) => {
    toggleMutation.mutate(rule.id);
  };

  const handleEdit = (rule: AlertRule) => {
    navigate(`/alerts/${rule.id}/edit`);
  };

  const handleDelete = (rule: AlertRule) => {
    if (window.confirm(`Are you sure you want to delete the alert rule "${rule.name}"?`)) {
      deleteMutation.mutate(rule.id);
    }
  };

  const columns = useMemo(
    () =>
      getAlertRuleColumns({
        onToggle: handleToggle,
        onEdit: handleEdit,
        onDelete: handleDelete
      }),
    []
  );

  const rules = data?.rows || [];

  const filterElements = (
    <>
      <div className="w-full sm:w-40">
        <Select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          sizeVariant="md"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </Select>
      </div>

      <div className="w-full sm:w-44">
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          sizeVariant="md"
        >
          <option value="all">All Alert Types</option>
          <option value="overspeed">Overspeed</option>
          <option value="geofence_breach">Geofence Breach</option>
          <option value="power_cut">Power Disconnect</option>
          <option value="idle_timeout">Excessive Idle</option>
          <option value="harsh_braking">Harsh Braking</option>
        </Select>
      </div>
    </>
  );

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Alerts", href: "/alerts" },
          { label: "Configured Rules" }
        ]}
        title="Configured Alert Policies"
        description="Define and maintain operational thresholds, notification channels, and active monitoring schedules for your fleet."
      />

      <TableFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search rule by name or alert type..."
        filters={filterElements}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        onCreateNew={() => navigate("/alerts/new")}
        createLabel="Create Rule"
        extraActions={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
            onClick={() => navigate("/alerts")}
          >
            Incidents Log
          </Button>
        }
      />

      {/* AG Grid Rules Table Container with Proper Spacing */}
      <div className="panel-card p-4 sm:p-5 overflow-hidden">
        <AppDataTable
          rowData={rules}
          columnDefs={columns}
          isLoading={isLoading}
          total={data?.totalCount || rules.length}
          page={1}
          pageSize={10}
          totalPages={data?.totalPages || 1}
        />
      </div>
    </div>
  );
};

export default AlertRulesListPage;
