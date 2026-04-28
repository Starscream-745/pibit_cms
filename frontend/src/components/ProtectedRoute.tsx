import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Preloader from './Preloader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isAuthEnabled, loading } = useAuth();

  if (loading) {
    return <Preloader isLoading={true} />;
  }

  // If auth is disabled, allow access
  if (!isAuthEnabled) {
    return <>{children}</>;
  }

  // If auth is enabled, check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
