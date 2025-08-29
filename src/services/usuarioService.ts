import { apiGet, apiPost, apiPut, apiDelete } from './api';
import type { Usuario, CreateUsuarioData, UpdateUsuarioData, ApiResponse, ListaUsuariosResponse } from '../types';

class UsuarioService {
  // Listar todos os usuários
  async listarUsuarios(): Promise<ApiResponse<Usuario[]>> {
    const response = await apiGet<ListaUsuariosResponse>('/Usuario/listarusuarios') as unknown as ListaUsuariosResponse;
    
    // Transformar a resposta para o formato esperado pelo frontend
    if (response.acesso === 'ok' && response.listaUsuarios) {
      return {
        status: true,
        data: response.listaUsuarios.dados,
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
    return await apiPost<Usuario>('/Usuario/cadastrarusuario', data);
  }

  // Atualizar usuário
  async atualizarUsuario(idUsuario: number, data: UpdateUsuarioData): Promise<ApiResponse<Usuario>> {
    return await apiPut<Usuario>(`/Usuario/${idUsuario}`, data);
  }

  // Excluir usuário
  async excluirUsuario(idUsuario: number): Promise<ApiResponse<void>> {
    return await apiDelete<void>(`/Usuario/${idUsuario}`);
  }
}

export const usuarioService = new UsuarioService();
