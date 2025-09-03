import { useState, useEffect } from 'react';
import { AlertTriangle, X, Clock } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export default function TokenExpirationAlert() {
  const { tokenExpiration, refreshToken, logout } = useAuthStore();
  const [showAlert, setShowAlert] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    if (!tokenExpiration) {
      setShowAlert(false);
      return;
    }

    const updateAlert = () => {
      const now = Date.now();
      const timeLeft = tokenExpiration - now;
      const fiveMinutes = 5 * 60 * 1000; // 5 minutos
      // const oneMinute = 60 * 1000; // 1 minuto

      if (timeLeft <= 0) {
        setShowAlert(false);
        logout();
        return;
      }

      if (timeLeft < fiveMinutes && timeLeft > 0) {
        const minutes = Math.floor(timeLeft / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        setShowAlert(true);
      } else {
        setShowAlert(false);
      }
    };

    updateAlert();
    const interval = setInterval(updateAlert, 1000);

    return () => clearInterval(interval);
  }, [tokenExpiration, logout]);

  const handleRefresh = async () => {
    try {
      await refreshToken();
      setShowAlert(false);
    } catch (error) {
      console.error('Erro ao renovar token:', error);
    }
  };

  const handleLogout = () => {
    logout();
    setShowAlert(false);
  };

  if (!showAlert) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-yellow-800">
              Sessão expirando
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Sua sessão expira em:</p>
              <div className="flex items-center mt-1">
                <Clock className="h-4 w-4 mr-1" />
                <span className="font-mono font-bold">{timeRemaining}</span>
              </div>
            </div>
            <div className="mt-3 flex space-x-2">
              <button
                onClick={handleRefresh}
                className="bg-yellow-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-yellow-700 transition-colors"
              >
                Renovar Sessão
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-gray-700 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={() => setShowAlert(false)}
              className="text-yellow-400 hover:text-yellow-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
