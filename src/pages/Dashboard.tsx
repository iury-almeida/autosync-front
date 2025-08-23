import { Package, ShoppingCart, TrendingUp, AlertTriangle, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthStatus from '../components/AuthStatus';

const stats = [
  {
    name: 'Total de Produtos',
    value: '1,234',
    change: '+12%',
    changeType: 'positive',
    icon: Package,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    name: 'Vendas do Mês',
    value: 'R$ 45,678',
    change: '+8%',
    changeType: 'positive',
    icon: ShoppingCart,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    name: 'Receita Total',
    value: 'R$ 123,456',
    change: '+15%',
    changeType: 'positive',
    icon: TrendingUp,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    name: 'Produtos em Baixa',
    value: '23',
    change: '-5%',
    changeType: 'negative',
    icon: AlertTriangle,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
];

const recentSales = [
  {
    id: '1',
    customer: 'João Silva',
    amount: 'R$ 1,200',
    date: '2024-01-15',
    status: 'completed',
    items: 3,
  },
  {
    id: '2',
    customer: 'Maria Santos',
    amount: 'R$ 850',
    date: '2024-01-14',
    status: 'completed',
    items: 2,
  },
  {
    id: '3',
    customer: 'Pedro Costa',
    amount: 'R$ 2,100',
    date: '2024-01-13',
    status: 'pending',
    items: 5,
  },
  {
    id: '4',
    customer: 'Ana Oliveira',
    amount: 'R$ 750',
    date: '2024-01-12',
    status: 'completed',
    items: 1,
  },
];

const lowStockProducts = [
  {
    name: 'Motor Elétrico 1HP',
    sku: 'MOT-001',
    quantity: 2,
    minQuantity: 5,
    status: 'critical',
  },
  {
    name: 'Rolamento 6205',
    sku: 'ROL-205',
    quantity: 1,
    minQuantity: 10,
    status: 'critical',
  },
  {
    name: 'Correia V-10',
    sku: 'COR-V10',
    quantity: 3,
    minQuantity: 5,
    status: 'warning',
  },
  {
    name: 'Filtro de Ar',
    sku: 'FIL-001',
    quantity: 4,
    minQuantity: 8,
    status: 'warning',
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  function handleAddProduct(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral do seu negócio</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Nova Venda
          </button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-3">
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos e tabelas */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Vendas recentes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Vendas Recentes</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Ver todas
            </button>
          </div>
          <div className="space-y-4">
            {recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{sale.customer}</p>
                    <p className="text-xs text-gray-500">{sale.date} • {sale.items} itens</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{sale.amount}</p>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      sale.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {sale.status === 'completed' ? 'Concluída' : 'Pendente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Produtos em baixa */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Produtos em Baixa</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Ver todos
            </button>
          </div>
          <div className="space-y-4">
            {lowStockProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    product.status === 'critical' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    <AlertTriangle className={`h-5 w-5 ${
                      product.status === 'critical' ? 'text-red-600' : 'text-yellow-600'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${
                    product.status === 'critical' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {product.quantity} unidades
                  </p>
                  <p className="text-xs text-gray-500">Mín: {product.minQuantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ações rápidas */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Ações Rápidas</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button className="flex items-center justify-center px-6 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 group">
            <ShoppingCart className="h-6 w-6 text-primary-600 mr-3 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-gray-900">Nova Venda</span>
          </button>
          <button 
            onClick={handleAddProduct}
            className="flex items-center justify-center px-6 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
          >
            <Package className="h-6 w-6 text-primary-600 mr-3 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-gray-900">Adicionar Produto</span>
          </button>
          <button className="flex items-center justify-center px-6 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 group">
            <TrendingUp className="h-6 w-6 text-primary-600 mr-3 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-gray-900">Ver Relatórios</span>
          </button>
          <button className="flex items-center justify-center px-6 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 group">
            <AlertTriangle className="h-6 w-6 text-primary-600 mr-3 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-gray-900">Estoque Baixo</span>
          </button>
        </div>
      </div>

      {/* Status da Autenticação */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Status da Autenticação</h3>
        <AuthStatus />
      </div>
    </div>
  );
} 