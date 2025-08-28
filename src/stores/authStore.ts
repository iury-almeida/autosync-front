import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginCredentials } from '../types';
import { AuthService } from '../services/authService';
import type { LoginRequest } from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginAttempts: number;
  tokenExpiration: number | null; // Timestamp de expiração do token
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  resetLoginAttempts: () => void;
  validateToken: () => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
  isTokenExpired: () => boolean;
}

type AuthStore = AuthState & AuthActions;

// Duração do token em milissegundos (30 minutos)
const TOKEN_DURATION = 30 * 60 * 1000;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      loginAttempts: 0,
      tokenExpiration: null,

      // Ações
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          // Converter para o formato esperado pela API
          const loginRequest: LoginRequest = {
            CPFUsuario: credentials.cpf,
            SenhaUsuario: credentials.password,
            Tentativa: get().loginAttempts
          };

          const response = await AuthService.login(loginRequest);
          
          if (response.status) {
            // Login bem-sucedido - salvar token
            //unpack  token and get expiration time "expires"
            const token = response.token;
            if (!token) {
              throw new Error('Token não recebido do servidor');
            }

            // Calcular expiração do token (30 minutos a partir de agora)
            const expiration = Date.now() + TOKEN_DURATION;

            set({
              token: token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              loginAttempts: 0, // Reset das tentativas
              tokenExpiration: expiration,
              // Criar um usuário básico baseado no token
              user: {
                id: '1', // Será atualizado quando tivermos endpoint de perfil
                name: 'Usuário',
                cpf: credentials.cpf,
                role: 'user',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            });

            console.log('Login realizado com sucesso. Token salvo:', token);
            console.log('Token expira em:', new Date(expiration).toLocaleString());
          } else {
            // Login falhou
            const newAttempts = (response.qtdTentativa || get().loginAttempts) + 1;
            set({
              isLoading: false,
              error: response.erro || 'Erro ao fazer login',
              loginAttempts: newAttempts,
            });
            throw new Error(response.erro || 'Erro ao fazer login');
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Erro ao fazer login',
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          loginAttempts: 0,
          tokenExpiration: null,
        });
        console.log('Logout realizado. Token removido.');
      },

      setUser: (user: User) => {
        set({ user });
      },

      setToken: (token: string) => {
        const expiration = Date.now() + TOKEN_DURATION;
        set({ token, isAuthenticated: true, tokenExpiration: expiration });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      resetLoginAttempts: () => {
        set({ loginAttempts: 0 });
      },

      isTokenExpired: () => {
        const { tokenExpiration } = get();
        if (!tokenExpiration) return true;
        return Date.now() >= tokenExpiration;
      },

      validateToken: async () => {
        const { token, isAuthenticated, tokenExpiration } = get();
        
        if (!token || !isAuthenticated) {
          return false;
        }

        // Verificar se o token expirou
        if (tokenExpiration && Date.now() >= tokenExpiration) {
          console.log('Token expirado. Fazendo logout...');
          get().logout();
          return false;
        }

        try {
          // Aqui você pode implementar uma chamada para validar o token no backend
          // Por exemplo, chamar um endpoint /api/validate-token
          // Por enquanto, vamos apenas verificar se o token existe e não expirou
          return !!token;
        } catch (error) {
          console.error('Erro ao validar token:', error);
          get().logout();
          return false;
        }
      },

      refreshToken: async () => {
        const { token } = get();
        
        if (!token) {
          return false;
        }

        try {
          // Aqui você pode implementar uma chamada para renovar o token
          // Por enquanto, vamos apenas estender a expiração
          const newExpiration = Date.now() + TOKEN_DURATION;
          set({ tokenExpiration: newExpiration });
          console.log('Token renovado. Nova expiração:', new Date(newExpiration).toLocaleString());
          return true;
        } catch (error) {
          console.error('Erro ao renovar token:', error);
          get().logout();
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        tokenExpiration: state.tokenExpiration,
      }),
    }
  )
); 