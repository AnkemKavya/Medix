import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout/Layout';
import { LoginPage } from '../pages/Login/LoginPage';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { PatientListPage } from '../pages/Patients/PatientListPage';
import { PatientRegistrationPage } from '../pages/Patients/PatientRegistrationPage';
import { PatientProfilePage } from '../pages/Patients/PatientProfilePage';
import { DoctorsPage } from '../pages/Doctors/DoctorsPage';
import { StaffPage } from '../pages/Staff/StaffPage';
import { AppointmentsPage } from '../pages/Appointments/AppointmentsPage';
import { AdmissionsPage } from '../pages/Admissions/AdmissionsPage';
import { BillingPage } from '../pages/Billing/BillingPage';
import { PharmacyPage } from '../pages/Pharmacy/PharmacyPage';
import { LaboratoryPage } from '../pages/Laboratory/LaboratoryPage';
import { ReportsPage } from '../pages/Reports/ReportsPage';
import { SettingsPage } from '../pages/Settings/SettingsPage';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Hospital Application Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        
        {/* Patients */}
        <Route path="patients" element={<PatientListPage />} />
        <Route path="patients/new" element={<PatientRegistrationPage />} />
        <Route path="patients/:id" element={<PatientProfilePage />} />

        {/* Doctors & Staff */}
        <Route path="doctors" element={<DoctorsPage />} />
        <Route path="staff" element={<StaffPage />} />

        {/* Appointments */}
        <Route path="appointments" element={<AppointmentsPage />} />

        {/* Inpatient Admissions & Beds */}
        <Route path="admissions" element={<AdmissionsPage />} />

        {/* Billing & Invoices */}
        <Route path="billing" element={<BillingPage />} />

        {/* Pharmacy & Prescriptions */}
        <Route path="pharmacy" element={<PharmacyPage />} />

        {/* Laboratory & Pathology */}
        <Route path="laboratory" element={<LaboratoryPage />} />

        {/* Reports & Analytics */}
        <Route path="reports" element={<ReportsPage />} />

        {/* Hospital & System Settings */}
        <Route path="settings" element={<SettingsPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};
