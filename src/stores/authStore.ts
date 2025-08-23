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
}

type AuthStore = AuthState & AuthActions;

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
            const token = response.token;
            if (!token) {
              throw new Error('Token não recebido do servidor');
            }

            set({
              token: token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              loginAttempts: 0, // Reset das tentativas
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
        });
        console.log('Logout realizado. Token removido.');
      },

      setUser: (user: User) => {
        set({ user });
      },

      setToken: (token: string) => {
        set({ token, isAuthenticated: true });
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

      validateToken: async () => {
        const { token, isAuthenticated } = get();
        
        if (!token || !isAuthenticated) {
          return false;
        }

        try {
          // Aqui você pode implementar uma chamada para validar o token
          // Por exemplo, chamar um endpoint /api/validate-token
          // Por enquanto, vamos apenas verificar se o token existe
          return !!token;
        } catch (error) {
          console.error('Erro ao validar token:', error);
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
      }),
    }
  )
); 