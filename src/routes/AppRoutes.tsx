import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import DashboardShell from "@/pages/dashboard/DashboardShell";
import PlantsShell from "@/pages/plants/PlantsShell";
import AnalyticsShell from "@/pages/analytics/AnalyticsShell";
import SettingsShell from "@/pages/settings/SettingsShell";
import NotFound from "@/pages/errors/NotFound";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import Unauthorized from "@/pages/auth/Unauthorized";
import Forbidden from "@/pages/auth/Forbidden";

import AuthGuard from "@/components/auth/AuthGuard";
import RoleGuard from "@/components/auth/RoleGuard";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Gateway Routes */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="unauthorized" element={<Unauthorized />} />
      <Route path="forbidden" element={<Forbidden />} />

      {/* Protected Production Control Routes */}
      <Route
        path="/"
        element={
          <AuthGuard>
            <AppLayout />
          </AuthGuard>
        }
      >
        {/* Redirect base URL to dashboard overview */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Module Sub-views wrapped in permission guards */}
        <Route
          path="dashboard"
          element={
            <RoleGuard requiredPermission="view:dashboard">
              <DashboardShell />
            </RoleGuard>
          }
        />
        <Route
          path="plants"
          element={
            <RoleGuard requiredPermission="view:plants">
              <PlantsShell />
            </RoleGuard>
          }
        />
        <Route
          path="analytics"
          element={
            <RoleGuard requiredPermission="view:analytics">
              <AnalyticsShell />
            </RoleGuard>
          }
        />
        <Route
          path="settings"
          element={
            <RoleGuard requiredPermission="view:settings">
              <SettingsShell />
            </RoleGuard>
          }
        />
        
        {/* 404 Catch-All within standard sidebar layout */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
