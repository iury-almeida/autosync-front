import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Filter,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  Calendar,
  Shield
} from 'lucide-react';
import type { Usuario } from '../types';
import { usuarioService } from '../services/usuarioService';
import { useCpfFormat } from '../hooks/useCpfFormat';

export default function UsuarioList() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pagination, setPagination] = useState({
    paginaAtual: 1,
    tamanhoPagina: 10,
    totalPaginas: 1,
    totalRegistros: 0
  });
  const { formatCpf } = useCpfFormat();

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const loadUsuarios = async () => {
    setIsLoading(true);
    try {
      const response = await usuarioService.listarUsuarios();
      if (response.status) {
        setUsuarios(response.data);
        setFilteredUsuarios(response.data);
        
        // Atualizar informações de paginação se disponíveis
        if (response.data && response.data.length > 0) {
          // Por enquanto, vamos usar valores padrão
          // Em uma implementação futura, podemos adicionar paginação real
          setPagination({
            paginaAtual: 1,
            tamanhoPagina: 10,
            totalPaginas: 1,
            totalRegistros: response.data.length
          });
        }
      } else {
        showMessage('error', response.message || 'Erro ao carregar usuários');
      }
    } catch (error: any) {
      console.error('Erro ao carregar usuários:', error);
      showMessage('error', 'Erro ao carregar usuários');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  useEffect(() => {
    let filtered = usuarios;

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(usuario =>
        usuario.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.apelido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.cpf.includes(searchTerm)
      );
    }

    // Filtro por status
    if (statusFilter !== 'TODOS') {
      filtered = filtered.filter(usuario => usuario.status === statusFilter);
    }

    setFilteredUsuarios(filtered);
  }, [usuarios, searchTerm, statusFilter]);

  const handleDelete = async (idUsuario: number, nomeCompleto: string) => {
    if (confirm(`Tem certeza que deseja excluir o usuário "${nomeCompleto}"?`)) {
      try {
        const response = await usuarioService.excluirUsuario(idUsuario);
        if (response.status) {
          showMessage('success', 'Usuário excluído com sucesso!');
          loadUsuarios(); // Recarrega a lista
        } else {
          showMessage('error', response.message || 'Erro ao excluir usuário');
        }
      } catch (error: any) {
        console.error('Erro ao excluir usuário:', error);
        showMessage('error', 'Erro ao excluir usuário');
      }
    }
  };

  const handleEdit = (usuario: Usuario) => {
    navigate('/usuarios/editar', { state: { usuario } });
  };

  const handleView = (usuario: Usuario) => {
    navigate('/usuarios/visualizar', { state: { usuario } });
  };

  const handleNew = () => {
    navigate('/usuarios/cadastrar');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'ATIVO':
        return 'bg-green-100 text-green-800';
      case 'INATIVO':
        return 'bg-gray-100 text-gray-800';
      case 'BLOQUEADO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerfilLabel = (idPerfil: number | undefined) => {
    if (!idPerfil) return 'Perfil não informado';
    
    switch (idPerfil) {
      case 1:
        return 'Administrador';
      case 2:
        return 'Usuário';
      case 3:
        return 'Gerente';
      default:
        return 'Desconhecido';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mensagem de feedback */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="bg-blue-600 text-white px-6 py-4 sticky top-16 z-40 shadow-md rounded-lg mx-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleGoBack}
              className="flex items-center space-x-1 bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </button>
            <h1 className="text-2xl font-bold">LISTA DE USUÁRIOS</h1>
          </div>
          <button
            onClick={handleNew}
            className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Usuário</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome, email ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por Status */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="TODOS">Todos os Status</option>
                <option value="ATIVO">Ativo</option>
                <option value="INATIVO">Inativo</option>
                <option value="BLOQUEADO">Bloqueado</option>
              </select>
            </div>

                         {/* Contador */}
             <div className="flex items-center justify-end">
               <span className="text-sm text-gray-600">
                 {filteredUsuarios.length} de {pagination.totalRegistros} usuário(s) encontrado(s)
               </span>
             </div>
          </div>
        </div>

        {/* Lista de Usuários */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando usuários...</p>
            </div>
          ) : filteredUsuarios.length === 0 ? (
            <div className="p-8 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum usuário encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Perfil
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cadastro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsuarios.map((usuario) => {
                    // Verifica se o usuário existe antes de renderizar
                    if (!usuario) return null;
                    
                    return (
                      <tr key={usuario.idUsuario} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {usuario.nomeCompleto || 'Nome não informado'}
                            </div>
                                                         <div className="text-sm text-gray-500">
                               {usuario.apelido || '-'}
                             </div>
                             {usuario.temNomeSocial === 'S' && usuario.nomeSocial && (
                               <div className="text-xs text-blue-600">
                                 Nome Social: {usuario.nomeSocial}
                               </div>
                             )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <Mail className="h-3 w-3 text-gray-400 mr-1" />
                            {usuario.email || 'Email não informado'}
                          </div>
                          <div className="flex items-center mb-1">
                            <Phone className="h-3 w-3 text-gray-400 mr-1" />
                            {usuario.telefone || 'Telefone não informado'}
                          </div>
                          <div className="text-xs text-gray-500">
                            CPF: {usuario.cpf ? formatCpf(usuario.cpf) : '-'
                            }
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900">
                            {getPerfilLabel(usuario.idPerfil)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(usuario.status)}`}>
                          {usuario.status || 'Status não informado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                          {formatDate(usuario.dataCadastro)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleView(usuario)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(usuario)}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(usuario.idUsuario, usuario.nomeCompleto)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                                          </tr>
                    );
                  })}
                  </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
