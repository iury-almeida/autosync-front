import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, LogIn, Package, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useCpfFormat } from '../hooks/useCpfFormat';

// Schema de validação
const loginSchema = z.object({
  cpf: z.string()
    .min(11, 'CPF deve ter pelo menos 11 dígitos')
    .max(14, 'CPF inválido')
    .transform((val) => val.replace(/\D/g, '')), // Remove caracteres não numéricos
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError, loginAttempts, resetLoginAttempts } = useAuthStore();
  const { cpf, handleCpfChange } = useCpfFormat();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    try {
      await login(data);
      // Redirecionar para a página original ou dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      // Erro já tratado no store
    }
  };

  // Reset das tentativas quando o componente montar
  useEffect(() => {
    resetLoginAttempts();
  }, [resetLoginAttempts]);

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Formulário */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Bem-vindo ao AutoSync
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sistema de Gestão de Peças
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
                  CPF
                </label>
                <input
                  {...register('cpf')}
                  type="text"
                  id="cpf"
                  value={cpf}
                  onChange={(e) => handleCpfChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="000.000.000-00"
                />
                {errors.cpf && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                    {errors.cpf.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <p className="text-sm text-red-600">
                    {error}
                  </p>
                </div>
                {loginAttempts > 0 && (
                  <p className="text-xs text-red-500 mt-2">
                    Tentativa {loginAttempts} de 3
                  </p>
                )}
              </div>
            )}

            {loginAttempts >= 3 && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                  <p className="text-sm text-orange-600">
                    Múltiplas tentativas de login. Sua conta pode ter sido bloqueada temporariamente.
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || loginAttempts >= 3}
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Entrar no Sistema
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
              <strong>Credenciais de Teste:</strong><br />
              123.456.789-00 / 123456
            </p>
          </div>
        </div>
      </div>

      {/* Lado direito - Ilustração */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 py-12">
          <div className="max-w-lg">
            <h1 className="text-4xl font-bold text-white mb-6">
              Gerencie seu estoque de forma inteligente
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Controle vendas, estoque e relatórios em uma única plataforma. 
              Simplifique a gestão da sua loja de peças.
            </p>
            
            {/* Cards de features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Controle de Estoque</h3>
                  <p className="text-primary-200 text-sm">Gerencie produtos e quantidades</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Vendas e Relatórios</h3>
                  <p className="text-primary-200 text-sm">Acompanhe o crescimento do negócio</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Gestão de Clientes</h3>
                  <p className="text-primary-200 text-sm">Organize informações dos clientes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white bg-opacity-5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>
    </div>
  );
} 