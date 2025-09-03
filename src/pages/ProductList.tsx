import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  Eye,
  Package
} from 'lucide-react';

// Dados mockados para demonstração
const mockProducts = [
  {
    id: 1,
    codigo: '461',
    produto: 'CCP HORNET 600 08 ED C/RET KMC ACO 1045',
    codigoBarra: 'SEM GTIN',
    codFabrica: '879624',
    aplicacao: 'CBR 650F 15 ADPTA',
    fornecedor: '454 COMERCIAL MOTOCICLO S/A',
    ativo: 'SIM',
    contEstoque: 'SIM',
    garantia: '12 meses',
    materiaPrima: 'Aço 1045',
    grupo: '1 GRUPO PADRÃO',
    subGrupo: '1 SUBGRUPO PADRÃO',
    unidEntrada: '1 UN',
    unidSaida: '1 UN',
    observacao: 'ANEL PIST INAGO 0,50 RD 135 KIT TRANSMISSÃO HORNET 08 ED C/RET 1045-COD VAZ H00079X-H03978X-COD MOTOCICLO 774088/879624',
    manual: 'SEM MANUAL',
    usaGrade: 'NÃO',
    modelo: '1 PADRÃO',
    marca: '1 PADRÃO',
    cor: '',
    descricaoPDV: 'CCP HORNET 600 08 ED C/RET KMC ACO 1045',
  },
  {
    id: 2,
    codigo: '462',
    produto: 'Motor Elétrico 1HP',
    codigoBarra: '7891234567890',
    codFabrica: 'MOT001',
    aplicacao: 'Bombas e Compressores',
    fornecedor: 'WEG',
    ativo: 'SIM',
    contEstoque: 'SIM',
    garantia: '24 meses',
    materiaPrima: 'Ferro Fundido',
    grupo: 'Motores',
    subGrupo: 'Elétricos',
    unidEntrada: '1 UN',
    unidSaida: '1 UN',
    observacao: 'Motor elétrico trifásico 220V/380V',
    manual: 'https://weg.com/manual-mot001.pdf',
    usaGrade: 'NÃO',
    modelo: 'WEG W22',
    marca: 'WEG',
    cor: 'Verde',
    descricaoPDV: 'Motor Elétrico 1HP WEG',
  },
  {
    id: 3,
    codigo: '463',
    produto: 'Rolamento 6205',
    codigoBarra: '7894561237890',
    codFabrica: 'ROL205',
    aplicacao: 'Eixos e Mancais',
    fornecedor: 'SKF',
    ativo: 'SIM',
    contEstoque: 'SIM',
    garantia: '12 meses',
    materiaPrima: 'Aço Especial',
    grupo: 'Rolamentos',
    subGrupo: 'Rolamentos de Esferas',
    unidEntrada: '1 UN',
    unidSaida: '1 UN',
    observacao: 'Rolamento de esferas rígido',
    manual: 'SEM MANUAL',
    usaGrade: 'NÃO',
    modelo: '6205-2RS',
    marca: 'SKF',
    cor: 'Prata',
    descricaoPDV: 'Rolamento 6205 SKF',
  },
];

export default function ProductList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  // const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  const handleAddProduct = () => {
    navigate('/produtos/cadastro');
  };

  const handleEditProduct = (productId: number) => {
    navigate(`/produtos/editar/${productId}`);
  };

  const handleViewProduct = (productId: number) => {
    navigate(`/produtos/visualizar/${productId}`);
  };

  const handleDeleteProduct = (productId: number) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      // TODO: Implementar exclusão
      console.log('Excluir produto:', productId);
    }
  };

  const filteredProducts = mockProducts.filter(product =>
    product.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.codigoBarra.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cabeçalho Fixo */}
      <div className="bg-blue-600 text-white px-6 py-4 sticky top-16 z-40 shadow-md rounded-lg mx-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">PRODUTOS</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleAddProduct}
              className="flex items-center space-x-1 bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar Produto</span>
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="p-6 space-y-6">

      {/* Filtros e Busca */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por código, produto ou código de barras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button className="btn-secondary flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </button>
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código Barra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fornecedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.codigo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="max-w-xs truncate" title={product.produto}>
                      {product.produto}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.codigoBarra}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="max-w-xs truncate" title={product.fornecedor}>
                      {product.fornecedor}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.ativo === 'SIM' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.ativo === 'SIM' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewProduct(product.id)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditProduct(product.id)}
                        className="text-green-600 hover:text-green-900 transition-colors"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Anterior
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Próximo
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredProducts.length}</span> de{' '}
                  <span className="font-medium">{mockProducts.length}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Anterior
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Próximo
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mensagem quando não há produtos */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum produto encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Tente ajustar os termos de busca.' : 'Comece adicionando seu primeiro produto.'}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <button
                onClick={handleAddProduct}
                className="btn-primary flex items-center mx-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Produto
              </button>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
