/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200">
        <div className="w-8 h-8 border-2 border-slate-700 border-t-teal-400 rounded-full animate-spin mb-4" id="load-spinner"></div>
        <p className="text-sm font-mono tracking-widest text-slate-400">MEMBERSHIP AUTHENTICATING...</p>
      </div>
    );
  }

  if (!user) {
    // Save previous path for dynamic landing redirect after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Rollback to main role-matching dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
