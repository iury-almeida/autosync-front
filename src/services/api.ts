import axios from 'axios';
import type { ApiResponse } from '../types';
import { useAuthStore } from '../stores/authStore';

// Configuração base do axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5165',
  timeout: 10000,
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore.getState();
    const { token, isTokenExpired } = authStore;
    
    // Verificar se o token expirou antes de fazer a requisição
    if (token && isTokenExpired()) {
      console.log('Token expirado detectado no interceptor de requisição');
      authStore.logout();
      // Redirecionar para login
      window.location.href = '/login';
      return Promise.reject(new Error('Token expirado'));
    }

    if (token) {
      try {
        // O token já vem com "Bearer " do backend, então não precisamos adicionar novamente
        config.headers.Authorization = token;
      } catch (error) {
        console.error('Erro ao adicionar token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const authStore = useAuthStore.getState();
    
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      console.log('Erro 401 detectado. Fazendo logout...');
      authStore.logout();
      
      // Redirecionar para login apenas se não estiver já na página de login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Funções auxiliares para requisições
export const apiGet = async <T>(url: string): Promise<ApiResponse<T>> => {
  const response = await api.get(url);
  return response.data;
};

export const apiPost = async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
  const response = await api.post(url, data);
  return response.data;
};

export const apiPut = async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
  const response = await api.put(url, data);
  return response.data;
};

export const apiDelete = async <T>(url: string): Promise<ApiResponse<T>> => {
  const response = await api.delete(url);
  return response.data;
};

export default api; 