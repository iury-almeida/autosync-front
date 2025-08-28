import { useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';

export const useTokenRefresh = () => {
  const { token, tokenExpiration, refreshToken, isTokenExpired, logout } = useAuthStore();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Limpar intervalo anterior
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    // Se não há token, não fazer nada
    if (!token || !tokenExpiration) {
      return;
    }

    // Verificar se o token expirou
    if (isTokenExpired()) {
      console.log('Token expirado no useTokenRefresh. Fazendo logout...');
      logout();
      return;
    }

    // Calcular tempo até a expiração
    const timeUntilExpiration = tokenExpiration - Date.now();
    const fiveMinutes = 5 * 60 * 1000; // 5 minutos
    const oneMinute = 60 * 1000; // 1 minuto

    // Se o token expira em menos de 5 minutos, tentar renovar
    if (timeUntilExpiration < fiveMinutes && timeUntilExpiration > 0) {
      console.log('Token próximo da expiração. Tentando renovar...');
      refreshToken();
    }

    // Configurar intervalo para verificar a cada minuto
    refreshIntervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const timeLeft = tokenExpiration - currentTime;

      if (timeLeft <= 0) {
        console.log('Token expirado durante verificação. Fazendo logout...');
        logout();
        return;
      }

      // Se faltam menos de 5 minutos, tentar renovar
      if (timeLeft < fiveMinutes && timeLeft > 0) {
        console.log('Token próximo da expiração. Tentando renovar...');
        refreshToken();
      }
    }, oneMinute);

    // Cleanup function
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [token, tokenExpiration, refreshToken, isTokenExpired, logout]);

  // Cleanup quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, []);
};
