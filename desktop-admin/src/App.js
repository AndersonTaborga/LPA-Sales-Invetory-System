import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import SalesPage from './pages/SalesPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import UsersPage from './pages/UsersPage';
import ReportsPage from './pages/ReportsPage';
import HelpPage from './pages/HelpPage';
import PrivateRoute from './pages/PrivateRoute';
import Layout from './components/Layout';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

export default function App() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* Protected routes with shared layout */}
          <Route
            path="/app"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            {/* Nested routes */}
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="sales" element={<SalesPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="help" element={<HelpPage />} />
            {/* Add other protected routes here */}
          </Route>

          {/* Fallback routes for compatibility */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <ProductsPage />
              </PrivateRoute>
            }
          />

          {/* 404 route - must be last */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
