import { apiGet, apiPost, apiPut, apiDelete } from './api';
import type { Usuario, CreateUsuarioData, UpdateUsuarioData, ApiResponse, ListaUsuariosResponse, Profile } from '../types';

class UsuarioService {
  // Listar todos os usuários
  async listarUsuarios(): Promise<ApiResponse<Usuario[]>> {
    const response = await apiGet<ListaUsuariosResponse>('/api/users') as unknown as ListaUsuariosResponse;
    
    // Transformar a resposta para o formato esperado pelo frontend
    if (response.data) {
      return {
        status: true,
        data: response.data,
        message: 'Usuários carregados com sucesso'
      };
    }
    
    return {
      status: false,
      data: [],
      message: 'Erro ao carregar usuários'
    };
  }

  // Buscar usuário por ID
  async buscarUsuarioPorId(idUsuario: number): Promise<ApiResponse<Usuario>> {
    return await apiGet<Usuario>(`/Usuario/${idUsuario}`);
  }

  // Cadastrar novo usuário
  async cadastrarUsuario(data: CreateUsuarioData): Promise<ApiResponse<Usuario>> {
    return await apiPost<Usuario>('/api/users', data);
  }

  // Atualizar usuário
  async atualizarUsuario(id: number, data: UpdateUsuarioData): Promise<ApiResponse<Usuario>> {
    return await apiPut<Usuario>(`/api/users/${id}`, data);
  }

  // Excluir usuário
  async excluirUsuario(idUsuario: number): Promise<ApiResponse<void>> {
    return await apiDelete<void>(`/Usuario/${idUsuario}`);
  }

  // Listar perfis
  async listarPerfis(): Promise<Profile[]> {
    try {
      const response = await apiGet<Profile[]>('/api/profiles');
      return response.data || [];
    } catch (error) {
      console.error('Erro ao buscar perfis:', error);
      return [];
    }
  }
}

export const usuarioService = new UsuarioService();
