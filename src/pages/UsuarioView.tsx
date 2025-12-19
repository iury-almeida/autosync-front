import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Edit, 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import type { Usuario } from '../types';
import { useCpfFormat } from '../hooks/useCpfFormat';

export default function UsuarioView() {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const { formatCpf } = useCpfFormat();

  useEffect(() => {
    if (location.state?.usuario) {
      const usuarioData = location.state.usuario as Usuario;
      setUsuario(usuarioData);
    } else {
      // Se não há usuário no state, redirecionar para a lista
      navigate('/usuarios');
    }
  }, [location.state, navigate]);

  const handleEdit = () => {
    if (usuario) {
      navigate('/usuarios/editar', { state: { usuario } });
    }
  };

  const handleGoBack = () => {
    navigate('/usuarios');
  };

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ATIVO':
        return <CheckCircle className="h-4 w-4" />;
      case 'INATIVO':
        return <XCircle className="h-4 w-4" />;
      case 'BLOQUEADO':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPerfilLabel = (idPerfil: number) => {
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
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando usuário...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
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
            <h1 className="text-2xl font-bold">DETALHES DO USUÁRIO</h1>
          </div>
          <button
            onClick={handleEdit}
            className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span>Editar</span>
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6">
            {/* Cabeçalho do Usuário */}
            <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-gray-200">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{usuario.name}</h2>
              </div>
              <div className="ml-auto">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(usuario.status)}`}>
                  {getStatusIcon(usuario.status)}
                  <span className="ml-1">{usuario.status}</span>
                </span>
              </div>
            </div>

            {/* Informações do Usuário */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Informações Pessoais */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Informações Pessoais
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Nome Completo</label>
                    <p className="text-sm text-gray-900">{usuario.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">CPF</label>
                    <p className="text-sm text-gray-900">{formatCpf(usuario.cpf)}</p>
                  </div>
                </div>
              </div>

              {/* Informações de Contato */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-blue-600" />
                  Informações de Contato
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm text-gray-900 flex items-center">
                      <Mail className="h-3 w-3 mr-1 text-gray-400" />
                      {usuario.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Telefone</label>
                    <p className="text-sm text-gray-900 flex items-center">
                      <Phone className="h-3 w-3 mr-1 text-gray-400" />
                      {usuario.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informações do Sistema */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-600" />
                  Informações do Sistema
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Perfil</label>
                    <p className="text-sm text-gray-900 flex items-center">
                      <Shield className="h-3 w-3 mr-1 text-gray-400" />
                      {getPerfilLabel(usuario.profileId)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(usuario.status)}`}>
                      {getStatusIcon(usuario.status)}
                      <span className="ml-1">{usuario.status}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Informações de Data */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Informações de Data
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Data de Cadastro</label>
                    <p className="text-sm text-gray-900 flex items-center">
                      <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                      {formatDate(usuario.createdAt)}
                    </p>
                  </div>
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-500">Último Acesso</label>
                    <p className="text-sm text-gray-900 flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-gray-400" />
                      {usuario.ultimoAcesso ? formatDate(usuario.ultimoAcesso) : 'Nunca acessou'}
                    </p>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Informações Adicionais */}
            {/* <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Adicionais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">ID do Usuário</label>
                  <p className="text-sm text-gray-900 font-mono">{usuario.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">ID do Perfil</label>
                  <p className="text-sm text-gray-900 font-mono">{usuario.profileId}</p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
