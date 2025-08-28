import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Clock, User, LogOut } from 'lucide-react';

export default function AuthStatus() {
  const { user, token, isAuthenticated, logout, tokenExpiration, isTokenExpired } = useAuthStore();
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    const updateTimeRemaining = () => {
      if (!tokenExpiration) {
        setTimeRemaining('');
        return;
      }

      const now = Date.now();
      const timeLeft = tokenExpiration - now;

      if (timeLeft <= 0) {
        setTimeRemaining('Expirado');
        logout();
        return;
      }

      const minutes = Math.floor(timeLeft / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [tokenExpiration, logout]);

  if (!isAuthenticated || !token) {
    return null;
  }

  const isExpired = isTokenExpired();
  const isExpiringSoon = tokenExpiration && (tokenExpiration - Date.now()) < 5 * 60 * 1000; // 5 minutos

  return (
    <div className="flex items-center space-x-4 text-sm">
      {/* Informações do usuário */}
      <div className="flex items-center space-x-2 text-gray-700">
        <User className="h-4 w-4" />
        <span className="font-medium">{user?.name || 'Usuário'}</span>
      </div>

      {/* Tempo restante do token */}
      {tokenExpiration && (
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
          isExpired 
            ? 'bg-red-100 text-red-700' 
            : isExpiringSoon 
              ? 'bg-yellow-100 text-yellow-700' 
              : 'bg-green-100 text-green-700'
        }`}>
          <Clock className="h-3 w-3" />
          <span className="font-mono text-xs">
            {isExpired ? 'Expirado' : timeRemaining}
          </span>
        </div>
      )}

      {/* Botão de logout */}
      <button
        onClick={logout}
        className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
        title="Sair do sistema"
      >
        <LogOut className="h-4 w-4" />
        <span>Sair</span>
      </button>
    </div>
  );
}
