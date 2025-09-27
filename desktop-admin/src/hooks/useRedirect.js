import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const useRedirect = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const redirectTo = (path, options = {}) => {
    navigate(path, { replace: true, ...options });
  };

  const redirectIfAuthenticated = (path = '/app/dashboard') => {
    if (isAuthenticated) {
      redirectTo(path);
    }
  };

  const redirectIfNotAuthenticated = (path = '/') => {
    if (!isAuthenticated) {
      redirectTo(path);
    }
  };

  return {
    redirectTo,
    redirectIfAuthenticated,
    redirectIfNotAuthenticated
  };
};

// Hook para redirecionamento automático baseado em autenticação
export const useAuthRedirect = (
  authenticatedPath = '/app/dashboard',
  unauthenticatedPath = '/'
) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && window.location.pathname === unauthenticatedPath) {
        navigate(authenticatedPath, { replace: true });
      } else if (!isAuthenticated && window.location.pathname !== unauthenticatedPath) {
        navigate(unauthenticatedPath, { replace: true });
      }
    }
  }, [isAuthenticated, loading, navigate, authenticatedPath, unauthenticatedPath]);
}; 