import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Criar uma instância do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Rota pública */}
          <Route path="/login" element={<Login />} />
          
          {/* Rota raiz - redirecionar para dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Rotas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Rotas para módulos futuros */}
          <Route
            path="/estoque"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Estoque</h1>
                      <p className="text-gray-600">Módulo em desenvolvimento</p>
                    </div>
                    <div className="card">
                      <p className="text-gray-600">Funcionalidade de estoque será implementada em breve.</p>
                    </div>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/vendas"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Vendas</h1>
                      <p className="text-gray-600">Módulo em desenvolvimento</p>
                    </div>
                    <div className="card">
                      <p className="text-gray-600">Funcionalidade de vendas será implementada em breve.</p>
                    </div>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/relatorios"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
                      <p className="text-gray-600">Módulo em desenvolvimento</p>
                    </div>
                    <div className="card">
                      <p className="text-gray-600">Funcionalidade de relatórios será implementada em breve.</p>
                    </div>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Rota 404 */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Página não encontrada</h1>
                      <p className="text-gray-600">A página que você está procurando não existe.</p>
                    </div>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
