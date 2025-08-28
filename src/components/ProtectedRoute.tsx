import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isValidating } = useAuth();
  const { isTokenExpired } = useAuthStore();
  const location = useLocation();

  // Verificar se o token expirou
  if (isTokenExpired()) {
    console.log('Token expirado detectado no ProtectedRoute');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Validando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirecionar para login, salvando a rota atual para retornar após login
    console.log('Usuário não autenticado. Redirecionando para login...');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
} 