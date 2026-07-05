import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) return null; // or spinner

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}

export function VendorProtectedRoute({ children }) {
  const { isAuthenticated, authLoading, user } = useAuth();

  if (authLoading) return null; // or spinner

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but not a vendor, redirect to main page
  if (user?.role !== 'vendor') {
    return <Navigate to="/MainPage" replace />;
  }

  return children;
}
