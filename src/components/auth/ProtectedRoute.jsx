import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const FullPageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background px-4">
    <div className="text-center">
      <div className="w-12 h-12 mx-auto rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      <p className="mt-4 text-sm text-muted-foreground">Checking your sign-in session...</p>
    </div>
  </div>
);

export const ProtectedRoute = () => {
  const { isAuthenticated, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export const PublicOnlyRoute = () => {
  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return <FullPageLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/disaster-learning-modules" replace />;
  }

  return <Outlet />;
};
