import axios from 'axios';
import type { ApiResponse } from '../types';

// Configuração base do axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5165',
  timeout: 10000,
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage');
    if (token) {
      try {
        const authData = JSON.parse(token);
        if (authData.state?.token) {
          // O token já vem com "Bearer " do backend, então não precisamos adicionar novamente
          config.headers.Authorization = authData.state.token;
        }
      } catch (error) {
        console.error('Erro ao parsear token:', error);
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
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
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