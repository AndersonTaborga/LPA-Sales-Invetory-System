import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if there's a saved token when loading the application
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Here you can make a call to validate the token
      // For now, we'll just set that the user is logged in
      setUser({ username: 'user', email: 'user@example.com' });
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const result = await apiService.login(email, password);
      
      if (result.success && result.data.success) {
        localStorage.setItem('token', result.data.token);
        setUser(result.data.user);
        return result.data;
      } else {
        throw new Error(result.data?.error || result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/', { replace: true });
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 