import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, currentUser, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  // If user is logged out or not authenticated when accessing any protected URL directly
  if (!isAuthenticated || !currentUser) {
    if (location.pathname.startsWith('/shisri1207/admin')) {
      return <Navigate to="/shisri1207/admin/login" state={{ from: location.pathname }} replace />;
    }
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Role authorization check
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    if (role === 'USER') return <Navigate to="/user/dashboard" replace />;
    if (role === 'OWNER') return <Navigate to="/owner/dashboard" replace />;
    if (role === 'ADMIN') return <Navigate to="/shisri1207/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
