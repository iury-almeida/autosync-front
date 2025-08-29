import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  Eye,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  EyeOff
} from 'lucide-react';
import type { CreateUsuarioData } from '../types';
import { usuarioService } from '../services/usuarioService';
import { useCpfFormat } from '../hooks/useCpfFormat';
import { usePhoneFormat } from '../hooks/usePhoneFormat';

// Schema de validação para usuários
const usuarioSchema = z.object({
  idPerfil: z.number().min(1, 'Perfil é obrigatório'),
  nomeCompleto: z.string().min(1, 'Nome completo é obrigatório'),
  apelido: z.string().optional(), // Não é obrigatório no backend
  temNomeSocial: z.string().refine(val => val === 'S' || val === 'N', 'Deve ser S ou N'),
  nomeSocial: z.string().optional(),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('Email inválido'),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmarSenha: z.string().min(1, 'Confirmação de senha é obrigatória'),
  status: z.string().min(1, 'Status é obrigatório'),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

type UsuarioFormData = z.infer<typeof usuarioSchema>;

export default function UsuarioRegistration() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { cpf, setCpf, handleCpfChange } = useCpfFormat();
  const { phone, setPhone, handlePhoneChange } = usePhoneFormat();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
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

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const onSubmit = async (data: UsuarioFormData) => {
    console.log('onSubmit foi chamado!');
    setIsLoading(true);
    setMessage(null);
    
    // Preparar dados para enviar ao backend
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

    const dadosParaEnviar = {
      ...data,
      nomeSocial: data.temNomeSocial === 'S' ? data.nomeSocial || '' : '',
      confirmarSenha: data.confirmarSenha,
      status: mapStatus(data.status),
    };
    
    console.log('Dados do formulário:', data);
    console.log('Dados para enviar:', dadosParaEnviar);
    console.log('Erros de validação:', errors);
    
    try {
      const response = await usuarioService.cadastrarUsuario(dadosParaEnviar as CreateUsuarioData);
      
      if (response.status) {
        navigate('/usuarios');
      } else {
        showMessage('error', response.message || 'Erro ao cadastrar usuário');
      }
    } catch (error: any) {
      console.error('Erro ao cadastrar usuário:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao cadastrar usuário';
      showMessage('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Removido handleReset não utilizado

  const handleGoBack = () => {
    navigate(-1);
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
              title="Voltar para a página anterior"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </button>
            <h1 className="text-2xl font-bold">CADASTRAR USUÁRIO</h1>
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
        <form onSubmit={handleSubmit(onSubmit)}>
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
                     Senha <span className="text-red-500">*</span>
                   </label>
                   <div className="relative">
                     <input
                       {...register('senha')}
                       type={showPassword ? 'text' : 'password'}
                       className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="Digite a senha"
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
                     Confirmar Senha <span className="text-red-500">*</span>
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
        </form>
      </div>
    </div>
  );
}
