import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Save, 
  Eye,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  EyeOff
} from 'lucide-react';
import type { UpdateUsuarioData, Usuario } from '../types';
import { usuarioService } from '../services/usuarioService';
import { useCpfFormat } from '../hooks/useCpfFormat';
import { usePhoneFormat } from '../hooks/usePhoneFormat';

// Schema de validação para usuários (edição)
const usuarioSchema = z.object({
  idPerfil: z.number().min(1, 'Perfil é obrigatório'),
  nomeCompleto: z.string().min(1, 'Nome completo é obrigatório'),
  apelido: z.string().optional(), // Não é obrigatório no backend
  temNomeSocial: z.string().refine(val => val === 'S' || val === 'N', 'Deve ser S ou N'),
  nomeSocial: z.string().optional(),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('Email inválido'),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos'),
  senha: z.string().optional().refine((val) => !val || val.length >= 6, {
    message: 'Senha deve ter pelo menos 6 caracteres'
  }),
  confirmarSenha: z.string().optional(),
  status: z.string().min(1, 'Status é obrigatório'),
}).superRefine((data, ctx) => {
  const senhaInformada = !!data.senha && data.senha.trim() !== '';
  const confirmarInformado = !!data.confirmarSenha && data.confirmarSenha.trim() !== '';
  if (senhaInformada || confirmarInformado) {
    if (!senhaInformada || !confirmarInformado) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmarSenha'],
        message: 'Preencha e confirme a nova senha',
      });
    } else if (data.senha !== data.confirmarSenha) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmarSenha'],
        message: 'As senhas não coincidem',
      });
    }
  }
});

type UsuarioFormData = z.infer<typeof usuarioSchema>;

export default function UsuarioEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const { cpf, setCpf, handleCpfChange } = useCpfFormat();
  const { phone, setPhone, handlePhoneChange } = usePhoneFormat();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: {
      idPerfil: 1,
      temNomeSocial: 'N',
      status: 'ATIVO',
    },
    mode: 'onChange',
  });

  const temNomeSocial = watch('temNomeSocial');

  useEffect(() => {
    if (location.state?.usuario) {
      const usuarioData = location.state.usuario as Usuario;
      setUsuario(usuarioData);
      
      // Preencher o formulário com os dados do usuário
      setValue('idPerfil', usuarioData.idPerfil);
      setValue('nomeCompleto', usuarioData.nomeCompleto);
      setValue('apelido', usuarioData.apelido);
      setValue('temNomeSocial', usuarioData.temNomeSocial);
      setValue('nomeSocial', usuarioData.nomeSocial || '');
      setValue('email', usuarioData.email);
      setValue('status', usuarioData.status);
      
      // Formatar e definir CPF e telefone
      setCpf(usuarioData.cpf);
      setPhone(usuarioData.telefone);
      setValue('cpf', usuarioData.cpf);
      setValue('telefone', usuarioData.telefone);
    } else {
      // Se não há usuário no state, redirecionar para a lista
      navigate('/usuarios');
    }
  }, [location.state, navigate, setValue, setCpf, setPhone]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const onSubmit = async (data: UsuarioFormData) => {
    if (!usuario) return;
    
    setIsLoading(true);
    setMessage(null);
    
    try {
      // Mapear status e preparar payload exigido pelo backend
      const mapStatus = (s: string) => {
        switch (s) {
          case 'ATIVO':
            return 'A';
          case 'INATIVO':
            return 'I';
          case 'BLOQUEADO':
            return 'B';
          default:
            return s;
        }
      };

      const updateData: UpdateUsuarioData = {
        ...data,
        idUsuario: usuario.idUsuario,
        nomeSocial: data.temNomeSocial === 'S' ? data.nomeSocial || '' : '',
        status: mapStatus(data.status),
      } as any;

      // Só incluir senha/confirmarSenha se ambos foram informados
      if (data.senha && data.senha.trim() !== '' && data.confirmarSenha && data.confirmarSenha.trim() !== '') {
        updateData.senha = data.senha;
        (updateData as any).confirmarSenha = data.confirmarSenha;
      }
      
      const response = await usuarioService.atualizarUsuario(usuario.idUsuario, updateData);
      
      if ((response as any).status === true) {
        navigate('/usuarios');
      } else {
        showMessage('error', response.message || 'Erro ao atualizar usuário');
      }
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      const errorBackend = error.response?.data;
      const errorMessage = errorBackend?.message || errorBackend?.title || error.message || 'Erro ao atualizar usuário';
      showMessage('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Removido botão cancelar

  const handleGoBack = () => {
    navigate('/usuarios');
  };

  const handleCpfInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleCpfChange(value);
    setValue('cpf', value.replace(/\D/g, ''));
  };

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handlePhoneChange(value);
    setValue('telefone', value.replace(/\D/g, ''));
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

      {/* Cabeçalho Fixo */}
      <div className="bg-blue-600 text-white px-6 py-4 sticky top-16 z-40 shadow-md rounded-lg mx-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleGoBack}
              className="flex items-center space-x-1 bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm transition-colors"
              title="Voltar para a lista"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </button>
            <h1 className="text-2xl font-bold">EDITAR USUÁRIO</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading || !isValid}
              className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              <span>Salvar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Perfil */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Perfil <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('idPerfil', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>Administrador</option>
                    <option value={2}>Usuário</option>
                    <option value={3}>Gerente</option>
                  </select>
                  {errors.idPerfil && (
                    <p className="mt-1 text-sm text-red-600">{errors.idPerfil.message}</p>
                  )}
                </div>

                {/* Nome Completo */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('nomeCompleto')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Digite o nome completo"
                  />
                  {errors.nomeCompleto && (
                    <p className="mt-1 text-sm text-red-600">{errors.nomeCompleto.message}</p>
                  )}
                </div>

                {/* Apelido */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apelido
                  </label>
                  <input
                    {...register('apelido')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Digite o apelido"
                  />
                  {errors.apelido && (
                    <p className="mt-1 text-sm text-red-600">{errors.apelido.message}</p>
                  )}
                </div>

                {/* Tem Nome Social */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="temNomeSocial"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={temNomeSocial === 'S'}
                    onChange={(e) => {
                      setValue('temNomeSocial', e.target.checked ? 'S' : 'N');
                    }}
                  />
                  <label htmlFor="temNomeSocial" className="text-sm font-medium text-gray-700">
                    Possui Nome Social
                  </label>
                </div>

                {/* Nome Social */}
                {temNomeSocial === 'S' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Social
                    </label>
                    <input
                      {...register('nomeSocial')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Digite o nome social"
                    />
                  </div>
                )}

                {/* Telefone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={phone}
                    onChange={handlePhoneInputChange}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(11) 99999-9999"
                  />
                  {errors.telefone && (
                    <p className="mt-1 text-sm text-red-600">{errors.telefone.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="usuario@exemplo.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* CPF */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CPF <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={cpf}
                    onChange={handleCpfInputChange}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="000.000.000-00"
                  />
                  {errors.cpf && (
                    <p className="mt-1 text-sm text-red-600">{errors.cpf.message}</p>
                  )}
                </div>

                {/* Senha */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nova Senha
                  </label>
                  <div className="relative">
                    <input
                      {...register('senha')}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Digite a nova senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.senha && (
                    <p className="mt-1 text-sm text-red-600">{errors.senha.message}</p>
                  )}
                </div>

                {/* Confirmar Senha */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <input
                      {...register('confirmarSenha')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Confirme a senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmarSenha && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmarSenha.message}</p>
                  )}
                </div>



                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="ATIVO">Ativo</option>
                    <option value="INATIVO">Inativo</option>
                    <option value="BLOQUEADO">Bloqueado</option>
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
