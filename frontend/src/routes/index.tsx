import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import { AppRoute } from "@/routes/types";
import { AppLayout } from "@/components/layout/AppLayout";

// Lazy-loaded pages for optimized code-splitting
const SignInPage = lazy(() => import("@/pages/auth/SignInPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage"));
const LinkConfirmationPage = lazy(() => import("@/pages/auth/LinkConfirmationPage"));
const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"));
const UserRightsHubPage = lazy(() => import("@/pages/users/UserRightsHubPage"));
const UserListPage = lazy(() => import("@/pages/users/UserListPage"));
const UserFormPage = lazy(() => import("@/pages/users/UserFormPage"));
const UserGroupListPage = lazy(() => import("@/pages/users/UserGroupListPage"));
const UserGroupFormPage = lazy(() => import("@/pages/users/UserGroupFormPage"));
const UnauthorizedPage = lazy(() => import("@/pages/unauthorized/UnauthorizedPage"));
const NotFoundPage = lazy(() => import("@/pages/not-found/NotFoundPage"));
const SystemConfigLayout = lazy(() => import("@/pages/system-config/SystemConfigLayout"));
const SystemConfigHubPage = lazy(() => import("@/pages/system-config/SystemConfigHubPage"));
const AuditLogPage = lazy(() => import("@/pages/system-config/audit-log/AuditLogPage"));
const DynamicConfigModulePage = lazy(() => import("@/pages/system-config/DynamicConfigModulePage"));
const AppConfigLayout = lazy(() => import("@/pages/app-config/AppConfigLayout"));
const AppConfigHubPage = lazy(() => import("@/pages/app-config/AppConfigHubPage"));
const MasterDataXlsPage = lazy(() => import("@/pages/app-config/MasterDataXlsPage"));
const RemoveEntityPage = lazy(() => import("@/pages/app-config/RemoveEntityPage"));
const DynamicAppConfigModulePage = lazy(() => import("@/pages/app-config/DynamicAppConfigModulePage"));

// Reports & Analytics Workspace Pages
const ReportsLayout = lazy(() => import("@/pages/reports/ReportsLayout"));
const ReportsNavigatorPage = lazy(() => import("@/pages/reports/ReportsNavigatorPage"));
const TravelSummaryPage = lazy(() => import("@/pages/reports/views/travel/TravelSummaryPage"));
const TripSummaryOverviewPage = lazy(() => import("@/pages/reports/views/trip/TripSummaryOverviewPage"));
const TripDetailsPage = lazy(() => import("@/pages/reports/views/trip/TripDetailsPage"));
const StoppageSummaryOverviewPage = lazy(() => import("@/pages/reports/views/stoppage/StoppageSummaryOverviewPage"));
const StoppageEventViewPage = lazy(() => import("@/pages/reports/views/stoppage/StoppageEventViewPage"));
const IdleSummaryOverviewPage = lazy(() => import("@/pages/reports/views/idle/IdleSummaryOverviewPage"));
const IdleEventViewPage = lazy(() => import("@/pages/reports/views/idle/IdleEventViewPage"));
const InactiveSummaryOverviewPage = lazy(() => import("@/pages/reports/views/inactive/InactiveSummaryOverviewPage"));
const InactiveEventViewPage = lazy(() => import("@/pages/reports/views/inactive/InactiveEventViewPage"));
const DigitalPortSummaryOverviewPage = lazy(() => import("@/pages/reports/views/digital-port/DigitalPortSummaryOverviewPage"));
const DigitalPortEventViewPage = lazy(() => import("@/pages/reports/views/digital-port/DigitalPortEventViewPage"));
const AcSummaryOverviewPage = lazy(() => import("@/pages/reports/views/ac/AcSummaryOverviewPage"));
const AcEventViewPage = lazy(() => import("@/pages/reports/views/ac/AcEventViewPage"));
const IgnitionSummaryOverviewPage = lazy(() => import("@/pages/reports/views/ignition/IgnitionSummaryOverviewPage"));
const IgnitionDetailedViewPage = lazy(() => import("@/pages/reports/views/ignition/IgnitionDetailedViewPage"));
const VehicleStatusReportPage = lazy(() => import("@/pages/reports/views/status/VehicleStatusReportPage"));
const VehicleLocationReportPage = lazy(() => import("@/pages/reports/views/location/VehicleLocationReportPage"));
const VehicleActivationReportPage = lazy(() => import("@/pages/reports/views/activation/VehicleActivationReportPage"));
const SmsEmailSummaryPage = lazy(() => import("@/pages/reports/views/communication/SmsEmailSummaryPage"));
const DeviceLogPage = lazy(() => import("@/pages/reports/views/logs/DeviceLogPage"));
const SystemLogPage = lazy(() => import("@/pages/reports/views/logs/SystemLogPage"));
const ScheduledReportListPage = lazy(() => import("@/pages/reports/views/scheduled/ScheduledReportListPage"));

// POI Module Pages
const PoiLayout = lazy(() => import("@/pages/poi"));
const PoiHubPage = lazy(() => import("@/pages/poi/PoiHubPage"));
const PoiOverviewPage = lazy(() => import("@/pages/poi/PoiOverviewPage"));
const AddPoiPage = lazy(() => import("@/pages/poi/AddPoiPage"));
const PoiSummaryAPage = lazy(() => import("@/pages/poi/PoiSummaryAPage"));
const PoiSummaryBPage = lazy(() => import("@/pages/poi/PoiSummaryBPage"));
const MissedPoiPage = lazy(() => import("@/pages/poi/MissedPoiPage"));
const CollectionAddressPage = lazy(() => import("@/pages/poi/CollectionAddressPage"));

// Geofence Module Pages
const GeofenceLayout = lazy(() => import("@/pages/geofence"));
const GeofenceHubPage = lazy(() => import("@/pages/geofence/GeofenceHubPage"));
const GeofenceOverviewPage = lazy(() => import("@/pages/geofence/GeofenceOverviewPage"));
const CreateGeofencePage = lazy(() => import("@/pages/geofence/CreateGeofencePage"));
const GeofenceSummaryAPage = lazy(() => import("@/pages/geofence/GeofenceSummaryAPage"));
const GeofenceSummaryBPage = lazy(() => import("@/pages/geofence/GeofenceSummaryBPage"));
const OutOfGeofencePage = lazy(() => import("@/pages/geofence/OutOfGeofencePage"));

// Fleet Telematics & Vehicle Tracking Pages
const VehicleListPage = lazy(() => import("@/pages/vehicles/VehicleListPage"));
const LiveTrackingPage = lazy(() => import("@/pages/vehicles/LiveTrackingPage"));
const RoutePlaybackPage = lazy(() => import("@/pages/vehicles/RoutePlaybackPage"));

// Licensing & Entitlements Module Pages
const LicensingHubPage = lazy(() => import("@/pages/licensing/LicensingHubPage"));
const CompanyLicenseListPage = lazy(() => import("@/pages/licensing/CompanyLicenseListPage"));
const CompanyLicenseFormPage = lazy(() => import("@/pages/licensing/CompanyLicenseFormPage"));
const UserLicenseListPage = lazy(() => import("@/pages/licensing/UserLicenseListPage"));
const UserLicenseFormPage = lazy(() => import("@/pages/licensing/UserLicenseFormPage"));
const VehicleLicenseListPage = lazy(() => import("@/pages/licensing/VehicleLicenseListPage"));
const VehicleLicenseFormPage = lazy(() => import("@/pages/licensing/VehicleLicenseFormPage"));
const ResellerLicenseListPage = lazy(() => import("@/pages/licensing/ResellerLicenseListPage"));
const ResellerLicenseFormPage = lazy(() => import("@/pages/licensing/ResellerLicenseFormPage"));

// Maintenance & Operating Expenses Module Pages
const MaintenanceHubPage = lazy(() => import("@/pages/maintenance/MaintenanceHubPage"));
const ReminderStatusListPage = lazy(() => import("@/pages/maintenance/reminders/ReminderStatusListPage"));
const ReminderConfigOverviewPage = lazy(() => import("@/pages/maintenance/reminders/ReminderConfigOverviewPage"));
const ReminderFormPage = lazy(() => import("@/pages/maintenance/reminders/ReminderFormPage"));
const ExpenseHistoryListPage = lazy(() => import("@/pages/maintenance/expenses/ExpenseHistoryListPage"));
const ExpenseOverviewListPage = lazy(() => import("@/pages/maintenance/expenses/ExpenseOverviewListPage"));
const ExpenseFormPage = lazy(() => import("@/pages/maintenance/expenses/ExpenseFormPage"));

// Alerts Module Pages
const AlertIncidentListPage = lazy(() => import("@/pages/alerts/AlertIncidentListPage"));
const AlertRulesListPage = lazy(() => import("@/pages/alerts/AlertRulesListPage"));
const AlertRuleFormPage = lazy(() => import("@/pages/alerts/AlertRuleFormPage"));

// Advance Operations Module Pages (Phase 1)
const RoutePathListPage = lazy(() => import("@/pages/operations/routes/RoutePathListPage"));
const RoutePathFormPage = lazy(() => import("@/pages/operations/routes/RoutePathFormPage"));
const RouteAllocationListPage = lazy(() => import("@/pages/operations/allocations/RouteAllocationListPage"));
const RouteAllocationFormPage = lazy(() => import("@/pages/operations/allocations/RouteAllocationFormPage"));
const CrewAllocationListPage = lazy(() => import("@/pages/operations/crew/CrewAllocationListPage"));
const CrewAllocationFormPage = lazy(() => import("@/pages/operations/crew/CrewAllocationFormPage"));
const ImmobilizerAuditListPage = lazy(() => import("@/pages/operations/immobilizer/ImmobilizerAuditListPage"));
const ComplianceReminderListPage = lazy(() => import("@/pages/operations/compliance/ComplianceReminderListPage"));
const ComplianceReminderFormPage = lazy(() => import("@/pages/operations/compliance/ComplianceReminderFormPage"));

export const routes: AppRoute[] = [
  {
    path: "/sign-in",
    element: <SignInPage />,
    meta: { title: "Sign In", hideFromMenu: true }
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
    meta: { title: "Forgot Password", hideFromMenu: true }
  },
  {
    path: "/link-confirmation",
    element: <LinkConfirmationPage />,
    meta: { title: "Reset Link Sent", hideFromMenu: true }
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "",
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
        protection: {}, // Requires authenticated session
        meta: { title: "Dashboard", icon: "LayoutDashboard" }
      },
      {
        path: "users",
        element: <UserRightsHubPage />,
        protection: {
          requiredPermission: "VIEW:USER"
        },
        meta: { title: "User Rights", icon: "Users" }
      },
      {
        path: "users/list",
        element: <UserListPage />,
        protection: {
          requiredPermission: "VIEW:USER"
        },
        meta: { title: "Users Directory", icon: "Users" }
      },
      {
        path: "users/new",
        element: <UserFormPage />,
        protection: {
          requiredPermission: "CREATE:USER"
        },
        meta: { title: "Add User", icon: "UserPlus" }
      },
      {
        path: "users/:id/edit",
        element: <UserFormPage />,
        protection: {
          requiredPermission: "UPDATE:USER"
        },
        meta: { title: "Edit User", icon: "Edit" }
      },
      {
        path: "users/groups",
        element: <UserGroupListPage />,
        protection: {
          requiredPermission: "VIEW:USER"
        },
        meta: { title: "User Groups", icon: "ShieldCheck" }
      },
      {
        path: "users/groups/new",
        element: <UserGroupFormPage />,
        protection: {
          requiredPermission: "CREATE:USER"
        },
        meta: { title: "New User Group", icon: "Plus" }
      },
      {
        path: "users/groups/:id/edit",
        element: <UserGroupFormPage />,
        protection: {
          requiredPermission: "UPDATE:USER"
        },
        meta: { title: "Edit User Group", icon: "Edit" }
      },
      {
        path: "vehicles",
        element: <VehicleListPage />,
        protection: {
          requiredPermission: "VIEW:VEHICLE"
        },
        meta: { title: "Vehicles", icon: "Car" }
      },
      {
        path: "live-tracking",
        element: <LiveTrackingPage />,
        protection: {
          requiredPermission: "VIEW:VEHICLE"
        },
        meta: { title: "Live Tracking", icon: "Navigation" }
      },
      {
        path: "playback",
        element: <RoutePlaybackPage />,
        protection: {
          requiredPermission: "VIEW:VEHICLE"
        },
        meta: { title: "Route Playback", icon: "Clock" }
      },
      {
        path: "playback/:vehicleId",
        element: <RoutePlaybackPage />,
        protection: {
          requiredPermission: "VIEW:VEHICLE"
        },
        meta: { title: "Route Playback", icon: "Clock", hideFromMenu: true }
      },
      {
        path: "system-config",
        element: <SystemConfigLayout />,
        protection: {},
        meta: { title: "System Config", icon: "Sliders" },
        children: [
          {
            path: "",
            element: <SystemConfigHubPage />
          },
          {
            path: "audit-log",
            element: <AuditLogPage />
          },
          {
            path: "users",
            element: <Navigate to="/users/list" replace />
          },
          {
            path: "user-groups",
            element: <Navigate to="/users/groups" replace />
          },
          {
            path: "roles",
            element: <Navigate to="/users/groups" replace />
          },
          {
            path: "user-profiles",
            element: <Navigate to="/users/list" replace />
          },
          {
            path: ":moduleKey",
            element: <DynamicConfigModulePage />
          }
        ]
      },
      {
        path: "app-config",
        element: <AppConfigLayout />,
        protection: {},
        meta: { title: "App Config", icon: "Settings" },
        children: [
          {
            path: "",
            element: <AppConfigHubPage />
          },
          {
            path: "master-data-xls",
            element: <MasterDataXlsPage />
          },
          {
            path: "remove-entity",
            element: <RemoveEntityPage />
          },
          {
            path: ":moduleKey",
            element: <DynamicAppConfigModulePage />
          }
        ]
      },
      {
        path: "reports",
        element: <ReportsLayout />,
        protection: {},
        meta: { title: "Fleet Reports", icon: "FileText" },
        children: [
          {
            path: "",
            element: <ReportsNavigatorPage />
          },
          {
            path: "travel-summary",
            element: <TravelSummaryPage />
          },
          {
            path: "trip-summary",
            element: <TripSummaryOverviewPage />
          },
          {
            path: "trip-summary/:vehicleId",
            element: <TripDetailsPage />
          },
          {
            path: "stoppage-summary",
            element: <StoppageSummaryOverviewPage />
          },
          {
            path: "stoppage-summary/:vehicleId",
            element: <StoppageEventViewPage />
          },
          {
            path: "idle-summary",
            element: <IdleSummaryOverviewPage />
          },
          {
            path: "idle-summary/:vehicleId",
            element: <IdleEventViewPage />
          },
          {
            path: "inactive-summary",
            element: <InactiveSummaryOverviewPage />
          },
          {
            path: "inactive-summary/:vehicleId",
            element: <InactiveEventViewPage />
          },
          {
            path: "digital-port-summary",
            element: <DigitalPortSummaryOverviewPage />
          },
          {
            path: "digital-port-summary/:vehicleId",
            element: <DigitalPortEventViewPage />
          },
          {
            path: "ac-summary",
            element: <AcSummaryOverviewPage />
          },
          {
            path: "ac-summary/:vehicleId",
            element: <AcEventViewPage />
          },
          {
            path: "ignition-summary",
            element: <IgnitionSummaryOverviewPage />
          },
          {
            path: "ignition-summary/:vehicleId",
            element: <IgnitionDetailedViewPage />
          },
          {
            path: "vehicle-status",
            element: <VehicleStatusReportPage />
          },
          {
            path: "vehicle-location",
            element: <VehicleLocationReportPage />
          },
          {
            path: "vehicle-activation",
            element: <VehicleActivationReportPage />
          },
          {
            path: "sms-email-summary",
            element: <SmsEmailSummaryPage />
          },
          {
            path: "device-log",
            element: <DeviceLogPage />
          },
          {
            path: "system-log",
            element: <SystemLogPage />
          },
          {
            path: "scheduled-reports",
            element: <ScheduledReportListPage />
          }
        ]
      },
      {
        path: "poi",
        element: <PoiLayout />,
        protection: {},
        meta: { title: "POI", icon: "MapPin" },
        children: [
          { path: "", element: <PoiHubPage /> },
          { path: "overview", element: <PoiOverviewPage /> },
          { path: "new", element: <AddPoiPage /> },
          { path: "summary-a", element: <PoiSummaryAPage /> },
          { path: "summary-b", element: <PoiSummaryBPage /> },
          { path: "missed", element: <MissedPoiPage /> },
          { path: "collection-address", element: <CollectionAddressPage /> }
        ]
      },
      {
        path: "geofence",
        element: <GeofenceLayout />,
        protection: {},
        meta: { title: "Geofence", icon: "Map" },
        children: [
          { path: "", element: <GeofenceHubPage /> },
          { path: "overview", element: <GeofenceOverviewPage /> },
          { path: "new", element: <CreateGeofencePage /> },
          { path: "summary-a", element: <GeofenceSummaryAPage /> },
          { path: "summary-b", element: <GeofenceSummaryBPage /> },
          { path: "out-of-geofence", element: <OutOfGeofencePage /> }
        ]
      },
      // Licensing & Entitlements Module
      {
        path: "licensing",
        element: <LicensingHubPage />,
        protection: {},
        meta: { title: "Licensing Hub", icon: "ShieldCheck" }
      },
      {
        path: "licensing/companies",
        element: <CompanyLicenseListPage />,
        protection: {},
        meta: { title: "Company Licenses", icon: "Building2" }
      },
      {
        path: "licensing/companies/new",
        element: <CompanyLicenseFormPage />,
        protection: {},
        meta: { title: "New Company License", hideFromMenu: true }
      },
      {
        path: "licensing/companies/:id/edit",
        element: <CompanyLicenseFormPage />,
        protection: {},
        meta: { title: "Edit Company License", hideFromMenu: true }
      },
      {
        path: "licensing/users",
        element: <UserLicenseListPage />,
        protection: {},
        meta: { title: "User Licenses", icon: "Users" }
      },
      {
        path: "licensing/users/new",
        element: <UserLicenseFormPage />,
        protection: {},
        meta: { title: "New User License", hideFromMenu: true }
      },
      {
        path: "licensing/users/:id/edit",
        element: <UserLicenseFormPage />,
        protection: {},
        meta: { title: "Edit User License", hideFromMenu: true }
      },
      {
        path: "licensing/vehicles",
        element: <VehicleLicenseListPage />,
        protection: {},
        meta: { title: "Vehicle Licenses", icon: "Truck" }
      },
      {
        path: "licensing/vehicles/new",
        element: <VehicleLicenseFormPage />,
        protection: {},
        meta: { title: "New Vehicle License", hideFromMenu: true }
      },
      {
        path: "licensing/vehicles/:id/edit",
        element: <VehicleLicenseFormPage />,
        protection: {},
        meta: { title: "Edit Vehicle License", hideFromMenu: true }
      },
      {
        path: "licensing/resellers",
        element: <ResellerLicenseListPage />,
        protection: {},
        meta: { title: "Reseller Licenses", icon: "Network" }
      },
      {
        path: "licensing/resellers/new",
        element: <ResellerLicenseFormPage />,
        protection: {},
        meta: { title: "New Reseller License", hideFromMenu: true }
      },
      {
        path: "licensing/resellers/:id/edit",
        element: <ResellerLicenseFormPage />,
        protection: {},
        meta: { title: "Edit Reseller License", hideFromMenu: true }
      },
      // Maintenance & Reminders Module
      {
        path: "maintenance",
        element: <MaintenanceHubPage />,
        protection: {},
        meta: { title: "Maintenance Module", icon: "Wrench" }
      },
      {
        path: "maintenance/reminders/status",
        element: <ReminderStatusListPage />,
        protection: {},
        meta: { title: "Reminder Status", icon: "Bell" }
      },
      {
        path: "maintenance/reminders/overview",
        element: <ReminderConfigOverviewPage />,
        protection: {},
        meta: { title: "Reminder Overview", icon: "CalendarDays" }
      },
      {
        path: "maintenance/reminders/new",
        element: <ReminderFormPage />,
        protection: {},
        meta: { title: "Add Reminder", hideFromMenu: true }
      },
      {
        path: "maintenance/reminders/:id/edit",
        element: <ReminderFormPage />,
        protection: {},
        meta: { title: "Edit Reminder", hideFromMenu: true }
      },
      // Operating Expenses Module
      {
        path: "maintenance/expenses/history",
        element: <ExpenseHistoryListPage />,
        protection: {},
        meta: { title: "Expense History", icon: "FileSpreadsheet" }
      },
      {
        path: "maintenance/expenses/overview",
        element: <ExpenseOverviewListPage />,
        protection: {},
        meta: { title: "Expense Overview", icon: "ClipboardList" }
      },
      {
        path: "maintenance/expenses/new",
        element: <ExpenseFormPage />,
        protection: {},
        meta: { title: "Add Expense", hideFromMenu: true }
      },
      {
        path: "maintenance/expenses/:id/edit",
        element: <ExpenseFormPage />,
        protection: {},
        meta: { title: "Edit Expense", hideFromMenu: true }
      },
      // Alerts Management Module
      {
        path: "alerts",
        element: <AlertIncidentListPage />,
        protection: {
          requiredPermission: "VIEW:ALERT"
        },
        meta: { title: "Alert Incidents Log", icon: "BellRing" }
      },
      {
        path: "alerts/rules",
        element: <AlertRulesListPage />,
        protection: {
          requiredPermission: "VIEW:ALERT"
        },
        meta: { title: "Configured Rules", icon: "SlidersHorizontal" }
      },
      {
        path: "alerts/new",
        element: <AlertRuleFormPage />,
        protection: {
          requiredPermission: "MANAGE:ALERT"
        },
        meta: { title: "New Alert Rule", hideFromMenu: true }
      },
      {
        path: "alerts/:id/edit",
        element: <AlertRuleFormPage />,
        protection: {
          requiredPermission: "MANAGE:ALERT"
        },
        meta: { title: "Edit Alert Rule", hideFromMenu: true }
      },
      // Advance Operations & Dispatch Module (Phase 1)
      {
        path: "operations",
        element: <Navigate to="/operations/routes" replace />
      },
      {
        path: "operations/routes",
        element: <RoutePathListPage />,
        protection: {
          requiredPermission: "VIEW:DISPATCH"
        },
        meta: { title: "Route Corridors", icon: "Compass" }
      },
      {
        path: "operations/routes/new",
        element: <RoutePathFormPage />,
        protection: {
          requiredPermission: "MANAGE:DISPATCH"
        },
        meta: { title: "Add Route Corridor", hideFromMenu: true }
      },
      {
        path: "operations/routes/:id/edit",
        element: <RoutePathFormPage />,
        protection: {
          requiredPermission: "MANAGE:DISPATCH"
        },
        meta: { title: "Edit Route Corridor", hideFromMenu: true }
      },
      {
        path: "operations/allocations",
        element: <RouteAllocationListPage />,
        protection: {
          requiredPermission: "VIEW:DISPATCH"
        },
        meta: { title: "Corridor Allocations", icon: "Layers" }
      },
      {
        path: "operations/allocations/new",
        element: <RouteAllocationFormPage />,
        protection: {
          requiredPermission: "MANAGE:DISPATCH"
        },
        meta: { title: "Add Corridor Allocation", hideFromMenu: true }
      },
      {
        path: "operations/allocations/:id/edit",
        element: <RouteAllocationFormPage />,
        protection: {
          requiredPermission: "MANAGE:DISPATCH"
        },
        meta: { title: "Edit Corridor Allocation", hideFromMenu: true }
      },
      {
        path: "operations/crew",
        element: <CrewAllocationListPage />,
        protection: {
          requiredPermission: "VIEW:DISPATCH"
        },
        meta: { title: "Crew Rosters", icon: "Users" }
      },
      {
        path: "operations/crew/new",
        element: <CrewAllocationFormPage />,
        protection: {
          requiredPermission: "MANAGE:DISPATCH"
        },
        meta: { title: "Assign Crew", hideFromMenu: true }
      },
      {
        path: "operations/crew/:id/edit",
        element: <CrewAllocationFormPage />,
        protection: {
          requiredPermission: "MANAGE:DISPATCH"
        },
        meta: { title: "Edit Crew Assignment", hideFromMenu: true }
      },
      {
        path: "operations/immobilizer",
        element: <ImmobilizerAuditListPage />,
        protection: {
          requiredPermission: "VIEW:DISPATCH"
        },
        meta: { title: "Immobilizer Log", icon: "PowerOff" }
      },
      {
        path: "operations/compliance",
        element: <ComplianceReminderListPage />,
        protection: {
          requiredPermission: "VIEW:COMPLIANCE"
        },
        meta: { title: "General Reminders", icon: "FileText" }
      },
      {
        path: "operations/compliance/new",
        element: <ComplianceReminderFormPage />,
        protection: {
          requiredPermission: "MANAGE:COMPLIANCE"
        },
        meta: { title: "Add Reminder", hideFromMenu: true }
      },
      {
        path: "operations/compliance/:id/edit",
        element: <ComplianceReminderFormPage />,
        protection: {
          requiredPermission: "MANAGE:COMPLIANCE"
        },
        meta: { title: "Edit Reminder", hideFromMenu: true }
      },
      {
        path: "unauthorized",
        element: <UnauthorizedPage />,
        meta: { title: "Unauthorized", hideFromMenu: true }
      }
    ]
  },
  {
    path: "*",
    element: <NotFoundPage />,
    meta: { title: "Not Found", hideFromMenu: true }
  }
];
