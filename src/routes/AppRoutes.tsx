import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ForgotPasswordPage } from '../pages/Auth/ForgotPasswordPage';
import { LoginPage } from '../pages/Auth/LoginPage';
import { RegisterPage } from '../pages/Auth/RegisterPage';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { ModuleFoundationPage } from '../pages/ModuleFoundationPage';
import { BusinessSettingsPage } from '../pages/Settings/BusinessSettingsPage';
import { DataManagementPage } from '../pages/Settings/DataManagementPage';
import { PreferencesPage } from '../pages/Settings/PreferencesPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Root Redirect */}
      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />

      {/* Simulated Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Operational Application Routes */}
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="pos" element={<ModuleFoundationPage moduleKey="pos" />} />
        <Route path="inventory" element={<ModuleFoundationPage moduleKey="inventory" />} />
        <Route path="finance" element={<ModuleFoundationPage moduleKey="finance" />} />
        <Route path="employees" element={<ModuleFoundationPage moduleKey="employees" />} />
        <Route path="customers" element={<ModuleFoundationPage moduleKey="customers" />} />
        <Route path="reports" element={<ModuleFoundationPage moduleKey="reports" />} />
        <Route path="ai-assistant" element={<ModuleFoundationPage moduleKey="ai" />} />

        <Route
          path="settings"
          element={<Navigate to="/app/settings/business" replace />}
        />
        <Route path="settings/business" element={<BusinessSettingsPage />} />
        <Route path="settings/preferences" element={<PreferencesPage />} />
        <Route path="settings/data-management" element={<DataManagementPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
    </Routes>
  );
}
