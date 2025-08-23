import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';

export default function AuthStatus() {
  const { token, isAuthenticated, user } = useAuthStore();
  const [showToken, setShowToken] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToken = async () => {
    if (token) {
      try {
        await navigator.clipboard.writeText(token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Erro ao copiar token:', error);
      }
    }
  };

  if (!isAuthenticated || !token) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-600">Não autenticado</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-green-800">Status da Autenticação</h3>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-green-600">Autenticado</span>
        </div>
      </div>

      {user && (
        <div className="text-sm">
          <p className="text-green-700"><strong>Usuário:</strong> {user.name}</p>
          <p className="text-green-700"><strong>CPF:</strong> {user.cpf}</p>
          <p className="text-green-700"><strong>Perfil:</strong> {user.role}</p>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-green-800">Token JWT</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowToken(!showToken)}
              className="text-green-600 hover:text-green-800 transition-colors"
            >
              {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <button
              onClick={copyToken}
              className="text-green-600 hover:text-green-800 transition-colors"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
        
        {showToken ? (
          <div className="bg-white p-2 rounded border text-xs font-mono text-green-700 break-all">
            {token}
          </div>
        ) : (
          <div className="bg-white p-2 rounded border text-xs font-mono text-green-700">
            {token.substring(0, 50)}...
          </div>
        )}
      </div>

      <div className="text-xs text-green-600">
        <p><strong>Comprimento do token:</strong> {token.length} caracteres</p>
        <p><strong>Tipo:</strong> JWT Bearer Token</p>
      </div>
    </div>
  );
}
