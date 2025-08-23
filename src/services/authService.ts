import api from './api';

export interface LoginRequest {
  CPFUsuario: string;
  SenhaUsuario: string;
  Tentativa: number;
}

export interface LoginResponse {
  status: boolean; // Corrigido para minúsculo conforme retorno da API
  token?: string;
  erro?: string;
  qtdTentativa?: number;
}

export interface ResetPasswordRequest {
  EmailUsuario: string;
}

export interface ResetPasswordResponse {
  status: boolean;
  mensagem?: string;
  erro?: string;
}

export interface NewPasswordRequest {
  IdUsuario: number;
  NovaSenha: string;
  NovaSenhaConfirmacao: string;
}

export interface NewPasswordResponse {
  status: boolean;
  mensagem?: string;
  erro?: string;
}

export class AuthService {
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/Login/autenticacao', null, {
        params: credentials
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erro ao fazer login');
    }
  }

  static async resetPassword(email: string): Promise<ResetPasswordResponse> {
    try {
      const response = await api.post<ResetPasswordResponse>('/Login/recuperarsenha', null, {
        params: { EmailUsuario: email }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erro ao solicitar recuperação de senha');
    }
  }

  static async validateResetToken(token: string): Promise<{ status: boolean; idUsuario?: string; erro?: string }> {
    try {
      const response = await api.get('/Login/novasenha', {
        params: { Token: token }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erro ao validar token');
    }
  }

  static async setNewPassword(data: NewPasswordRequest): Promise<NewPasswordResponse> {
    try {
      const response = await api.post<NewPasswordResponse>('/Login/novasenha', null, {
        params: data
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erro ao definir nova senha');
    }
  }
}
