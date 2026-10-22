import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import { AppRoute } from "@/routes/types";
import { AppLayout } from "@/components/layout/AppLayout";

// Lazy-loaded pages for optimized code-splitting
const SignInPage = lazy(() => import("@/pages/auth/SignInPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage"));
const LinkConfirmationPage = lazy(() => import("@/pages/auth/LinkConfirmationPage"));
const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"));
const UsersPage = lazy(() => import("@/pages/users"));
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
        element: <UsersPage />,
        protection: {
          requiredPermission: "VIEW:USER"
        },
        meta: { title: "Users", icon: "Users" }
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
            element: <UsersPage />
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
