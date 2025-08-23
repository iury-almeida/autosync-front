import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const { isAuthenticated, token, validateToken, logout } = useAuthStore();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated || !token) {
        setIsValidating(false);
        setIsValid(false);
        return;
      }

      try {
        const isValidToken = await validateToken();
        setIsValid(isValidToken);
        
        if (!isValidToken) {
          logout();
        }
      } catch (error) {
        console.error('Erro ao validar token:', error);
        setIsValid(false);
        logout();
      } finally {
        setIsValidating(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, token, validateToken, logout]);

  return {
    isAuthenticated: isAuthenticated && isValid,
    isValidating,
    isValid,
  };
};
