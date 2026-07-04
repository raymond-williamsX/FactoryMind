import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import DashboardShell from "@/pages/dashboard/DashboardShell";
import PlantsShell from "@/pages/plants/PlantsShell";
import AnalyticsShell from "@/pages/analytics/AnalyticsShell";
import SettingsShell from "@/pages/settings/SettingsShell";
import NotFound from "@/pages/errors/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Redirect base URL to dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Functional Sub-views */}
        <Route path="dashboard" element={<DashboardShell />} />
        <Route path="plants" element={<PlantsShell />} />
        <Route path="analytics" element={<AnalyticsShell />} />
        <Route path="settings" element={<SettingsShell />} />
        
        {/* 404 Catch-All within standard sidebar layout */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
