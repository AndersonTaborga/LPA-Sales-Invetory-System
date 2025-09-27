import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import Layout from './Layout';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Layout>{children}</Layout>;
}
