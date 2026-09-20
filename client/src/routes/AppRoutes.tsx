import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AdminLogin from '../pages/AdminLogin';
import FindRooms from '../pages/FindRooms';
import OwnerProperties from '../pages/OwnerProperties';
import OwnerProfile from '../pages/OwnerProfile';
import UserDashboard from '../pages/dashboards/UserDashboard';
import OwnerDashboard from '../pages/dashboards/OwnerDashboard';
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import PropertyDetails from '../pages/PropertyDetails';
import RenterProfile from '../pages/RenterProfile';
import Settings from '../pages/Settings';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route
          index
          element={
            isAuthenticated ? (
              <Navigate to={`/${role?.toLowerCase()}/dashboard`} replace />
            ) : (
              <Home />
            )
          }
        />
        <Route
          path="find-rooms"
          element={
            isAuthenticated && role === 'OWNER' ? (
              <Navigate to="/owner/dashboard" replace />
            ) : (
              <FindRooms />
            )
          }
        />
        <Route path="properties/:id" element={<PropertyDetails />} />

        {/* Auth Routes - Redirect if already logged in */}
        <Route
          path="login"
          element={isAuthenticated ? <Navigate to={`/${role?.toLowerCase()}/dashboard`} replace /> : <Login />}
        />
        <Route
          path="register"
          element={isAuthenticated ? <Navigate to={`/${role?.toLowerCase()}/dashboard`} replace /> : <Register />}
        />
        <Route
          path="admin"
          element={
            isAuthenticated && role === 'ADMIN' ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <AdminLogin />
            )
          }
        />
        <Route
          path="admin/login"
          element={
            isAuthenticated ? (
              <Navigate to={`/${role?.toLowerCase()}/dashboard`} replace />
            ) : (
              <AdminLogin />
            )
          }
        />

        {/* User Routes */}
        <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
          <Route path="user/dashboard" element={<UserDashboard />} />
          <Route path="user/profile" element={<RenterProfile />} />
          <Route path="user/settings" element={<Settings />} />
        </Route>

        {/* Owner Routes */}
        <Route element={<ProtectedRoute allowedRoles={['OWNER']} />}>
          <Route path="owner/dashboard" element={<OwnerDashboard />} />
          <Route path="owner/properties" element={<OwnerProperties />} />
          <Route path="owner/profile" element={<OwnerProfile />} />
          <Route path="owner/settings" element={<Settings />} />
        </Route>

        {/* Generic Authenticated Settings Route */}
        <Route element={<ProtectedRoute allowedRoles={['USER', 'OWNER', 'ADMIN']} />}>
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
