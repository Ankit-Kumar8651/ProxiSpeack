import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/** Blocks every wrapped page until the user has logged in with ID + password. */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        Checking your session…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

/** Login / Signup pages: logged-in users are sent straight to the dashboard. */
export const GuestRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth();
  if (authLoading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

export default ProtectedRoute;
