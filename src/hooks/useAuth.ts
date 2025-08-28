import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const { 
    isAuthenticated, 
    token, 
    validateToken, 
    logout, 
    isTokenExpired,
    refreshToken 
  } = useAuthStore();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated || !token) {
        setIsValidating(false);
        setIsValid(false);
        return;
      }

      // Verificar se o token expirou
      if (isTokenExpired()) {
        console.log('Token expirado detectado no hook useAuth');
        setIsValidating(false);
        setIsValid(false);
        logout();
        return;
      }

      try {
        const isValidToken = await validateToken();
        setIsValid(isValidToken);
        
        if (!isValidToken) {
          logout();
        } else {
          // Se o token é válido, tentar renovar se estiver próximo da expiração
          const { tokenExpiration } = useAuthStore.getState();
          if (tokenExpiration) {
            const timeUntilExpiration = tokenExpiration - Date.now();
            const fiveMinutes = 5 * 60 * 1000; // 5 minutos
            
            if (timeUntilExpiration < fiveMinutes && timeUntilExpiration > 0) {
              console.log('Token próximo da expiração. Tentando renovar...');
              await refreshToken();
            }
          }
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
  }, [isAuthenticated, token, validateToken, logout, isTokenExpired, refreshToken]);

  return {
    isAuthenticated: isAuthenticated && isValid,
    isValidating,
    isValid,
  };
};
