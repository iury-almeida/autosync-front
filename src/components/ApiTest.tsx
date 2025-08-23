import { useState } from 'react';
import { AuthService } from '../services/authService';

export default function ApiTest() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setTestResult('Testando conexão...');
    
    try {
      // Teste com credenciais inválidas para verificar se a API responde
      const response = await AuthService.login({
        CPFUsuario: '000.000.000-00',
        SenhaUsuario: 'senha_invalida',
        Tentativa: 0
      });
      
      setTestResult(`API respondeu! Status: ${response.status}, Erro: ${response.erro || 'Nenhum'}`);
    } catch (error: any) {
      if (error.message.includes('Network Error')) {
        setTestResult('❌ Erro de rede: Não foi possível conectar ao backend. Verifique se o servidor está rodando.');
      } else if (error.message.includes('timeout')) {
        setTestResult('❌ Timeout: O servidor demorou muito para responder.');
      } else {
        setTestResult(`❌ Erro: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Teste de Conectividade com Backend</h3>
      
      <button
        onClick={testConnection}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Testando...' : 'Testar Conexão'}
      </button>
      
      {testResult && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <p className="text-sm">{testResult}</p>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-600">
        <p><strong>Backend URL:</strong> http://localhost:5165</p>
        <p><strong>Endpoint de teste:</strong> /Login/autenticacao</p>
      </div>
    </div>
  );
}
