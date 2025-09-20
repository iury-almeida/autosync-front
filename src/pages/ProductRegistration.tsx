import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  Search, 
  Eye,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import type { CreateProductData } from '../types';
import { productService } from '../services/productService';

// Schema de validação para produtos
const productSchema = z.object({
  codigo: z.string().min(1, 'Código é obrigatório'),
  codigoBarra: z.string().optional(),
  codFabrica: z.string().optional(),
  aplicacao: z.string().optional(),
  produto: z.string().min(1, 'Produto é obrigatório'),
  descricaoPDV: z.string().optional(),
  fornecedor: z.string().optional(),
  usaGrade: z.enum(['SIM', 'NÃO']),
  codFornecedor: z.string().optional(),
  codigoFornecedor: z.string().optional(),
  cor: z.string().optional(),
  unidMedida: z.string().optional(),
  observacao: z.string().optional(),
  manual: z.string().optional(),
  ativo: z.enum(['SIM', 'NÃO']),
  // Tributação (campos opcionais)
  cfopEstado: z.string().optional(),
  cfopForaEstado: z.string().optional(),
  origem: z.string().optional(),
  icmsCsosn: z.string().optional(),
  icmsCst: z.string().optional(),
  cofinsCst: z.string().optional(),
  pisCst: z.string().optional(),
  ipiCst: z.string().optional(),
  codigoNcm: z.string().optional(),
  descricaoNcm: z.string().optional(),
  codigoCest: z.string().optional(),
  listaMonofasica: z.string().optional(),
  aliqIcms: z.string().optional(),
  aliqIcmsBc: z.string().optional(),
  aliqCofins: z.string().optional(),
  aliqPis: z.string().optional(),
  aliqIpi: z.string().optional(),
  aliqFcp: z.string().optional(),
  codBeneficioFiscal: z.string().optional(),
  // Markup (campos opcionais)
  compra: z.string().optional(),
  descontoMax: z.string().optional(),
  comissaoMax: z.string().optional(),
  despesa: z.string().optional(),
  custo: z.string().optional(),
  margem: z.string().optional(),
  valorBruto: z.string().optional(),
  revenda: z.string().optional(),
  promocaoQtd: z.string().optional(),
  qtd: z.string().optional(),
  queima: z.string().optional(),
  dataInicial: z.string().optional(),
  dataFinal: z.string().optional()
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductRegistration() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'PRODUTO' | 'TRIBUTACAO' | 'MARKUP'>('PRODUTO');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      usaGrade: 'NÃO',
      ativo: 'SIM',
      codigoBarra: 'SEM GTIN',
      manual: 'SEM MANUAL',
    },
  });

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const response = await productService.createProduct(data as CreateProductData);
      
      if (response.status) {
        showMessage('success', 'Produto salvo com sucesso!');
        reset();
      } else {
        showMessage('error', response.message || 'Erro ao salvar produto');
      }
    } catch (error: any) {
      console.error('Erro ao salvar produto:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao salvar produto';
      showMessage('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleDelete = async () => {
  //   if (confirm('Tem certeza que deseja excluir este produto?')) {
  //     // TODO: Implementar exclusão quando tiver um produto carregado
  //     showMessage('error', 'Funcionalidade de exclusão será implementada');
  //   }
  // };

  // const handleSearch = () => {
  //   // TODO: Implementar busca
  //   showMessage('error', 'Funcionalidade de busca será implementada');
  // };

  // const handleCopy = () => {
  //   // TODO: Implementar cópia
  //   showMessage('error', 'Funcionalidade de cópia será implementada');
  // };

  // const handlePrint = () => {
  //   // TODO: Implementar impressão
  //   showMessage('error', 'Funcionalidade de impressão será implementada');
  // };

  const handleViewManual = () => {
    const manual = watch('manual');
    if (manual && manual !== 'SEM MANUAL') {
      window.open(manual, '_blank');
    } else {
      showMessage('error', 'Nenhum manual disponível');
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Volta para a página anterior
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
                           <h1 className="text-2xl font-bold">CADASTRAR PRODUTO</h1>
           </div>
           <div className="flex items-center space-x-2">
             <button
               onClick={handleSubmit(onSubmit)}
               disabled={isLoading}
               className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm disabled:opacity-50"
             >
               <Save className="h-4 w-4" />
               <span>Salvar</span>
             </button>
           </div>
         </div>
       </div>

             {/* Conteúdo Principal */}
       <div className="p-6">
         <div className="bg-white rounded-lg shadow-lg">
           {/* Conteúdo do Formulário */}
           <div className="p-6">
            <div className="space-y-6">
                <div className="flex border-b">
                  <button type="button" onClick={() => setActiveTab('PRODUTO')} className={`px-4 py-2 -mb-px border-b-2 font-medium text-sm ${activeTab === 'PRODUTO' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}>Produto</button>
                  <button type="button" onClick={() => setActiveTab('TRIBUTACAO')} className={`ml-4 px-4 py-2 -mb-px border-b-2 font-medium text-sm ${activeTab === 'TRIBUTACAO' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}>Tributação</button>
                  <button type="button" onClick={() => setActiveTab('MARKUP')} className={`ml-4 px-4 py-2 -mb-px border-b-2 font-medium text-sm ${activeTab === 'MARKUP' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}>Markup</button>
                </div>
                {activeTab === 'PRODUTO' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Código */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('codigo')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="461"
                    />
                    {errors.codigo && (
                      <p className="mt-1 text-sm text-red-600">{errors.codigo.message}</p>
                    )}
                  </div>

                  {/* Código Barra */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código Barra
                    </label>
                    <input
                      {...register('codigoBarra')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="SEM GTIN"
                    />
                  </div>

                  {/* Código Fábrica */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código Fabricante
                    </label>
                    <input
                      {...register('codFabrica')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="879624"
                    />
                  </div>

                  {/* Aplicação */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aplicação
                    </label>
                    <input
                      {...register('aplicacao')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="CBR 650F 15 ADPTA"
                    />
                  </div>

                  {/* Produto */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Produto <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('produto')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="CCP HORNET 600 08 ED C/RET KMC ACO 1045"
                    />
                    {errors.produto && (
                      <p className="mt-1 text-sm text-red-600">{errors.produto.message}</p>
                    )}
                  </div>

                  {/* Descrição PDV */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição PDV
                    </label>
                    <input
                      {...register('descricaoPDV')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="CCP HORNET 600 08 ED C/RET KMC ACO 1045"
                    />
                  </div>

                  {/* Fornecedor */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fornecedor
                    </label>
                    <div className="relative">
                      <input
                        {...register('fornecedor')}
                        type="text"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="454 COMERCIAL MOTOCICLO S/A"
                      />
                      <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Usa Grade */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Usa Grade
                    </label>
                    <select
                      {...register('usaGrade')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="NÃO">NÃO</option>
                      <option value="SIM">SIM</option>
                    </select>
                  </div>

                  {/* codFornecedor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código Fornecedor
                    </label>
                    <div className="relative">
                      <input
                        {...register('codFornecedor')}
                        type="text"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1 PADRÃO"
                      />
                      <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Cor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código Montadora
                    </label>
                    <input
                      {...register('cor')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Código Fornecedor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código Fornecedor
                    </label>
                    <input
                      {...register('codigoFornecedor')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Código do fornecedor"
                    />
                  </div>

                  {/* Unid. Medida */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unid. Medida
                    </label>
                    <div className="relative">
                      <input
                        {...register('unidMedida')}
                        type="text"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1 UN"
                      />
                      <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Observação */}
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observação
                    </label>
                    <textarea
                      {...register('observacao')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="ANEL PIST INAGO 0,50 RD 135 KIT TRANSMISSÃO HORNET 08 ED C/RET 1045-COD VAZ H00079X-H03978X-COD MOTOCICLO 774088/879624"
                    />
                  </div>

                  {/* Manual */}
                   <div className="md:col-span-2">
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                       Manual
                     </label>
                     <div className="flex space-x-2">
                       <input
                         {...register('manual')}
                         type="text"
                         className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         placeholder="SEM MANUAL"
                       />
                       <button
                         type="button"
                         onClick={handleViewManual}
                         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                       >
                         <Eye className="h-4 w-4" />
                       </button>
                     </div>
                   </div>

                   {/* Ativo */}
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                       Ativo
                     </label>
                     <select
                       {...register('ativo')}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     >
                       <option value="SIM">SIM</option>
                       <option value="NÃO">NÃO</option>
                     </select>
                   </div>
                 </div>
               )}
               {activeTab === 'TRIBUTACAO' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">CFOP Estado</label>
                     <input {...register('cfopEstado')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">CFOP Fora Estado</label>
                     <input {...register('cfopForaEstado')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Origem</label>
                     <input {...register('origem')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">ICMS/CSOSN</label>
                     <input {...register('icmsCsosn')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">ICMS CST</label>
                     <input {...register('icmsCst')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">COFINS CST</label>
                     <input {...register('cofinsCst')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">PIS CST</label>
                     <input {...register('pisCst')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">IPI CST</label>
                     <input {...register('ipiCst')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Código NCM</label>
                     <input {...register('codigoNcm')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                   </div>
                   <div className="md:col-span-2">
                     <label className="block text-sm font-medium text-gray-700 mb-1">Descrição NCM</label>
                     <input {...register('descricaoNcm')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Código CEST</label>
                     <input {...register('codigoCest')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Lista Monofásica</label>
                     <input {...register('listaMonofasica')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Alíq. ICMS</label>
                     <input {...register('aliqIcms')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Alíq. ICMS BC</label>
                     <input {...register('aliqIcmsBc')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Alíq. COFINS</label>
                     <input {...register('aliqCofins')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Alíq. PIS</label>
                     <input {...register('aliqPis')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Alíq. IPI</label>
                     <input {...register('aliqIpi')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Alíq. FCP</label>
                     <input {...register('aliqFcp')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                   </div>
                   <div className="md:col-span-2">
                     <label className="block text-sm font-medium text-gray-700 mb-1">Cod. Benefício Fiscal</label>
                     <input {...register('codBeneficioFiscal')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                   </div>
                 </div>
               )}
               {activeTab === 'MARKUP' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Compra</label>
                     <input {...register('compra')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0,00" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Desconto Max</label>
                     <input {...register('descontoMax')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0,00" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Comissão Max</label>
                     <input {...register('comissaoMax')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0,00" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Despesa</label>
                     <input {...register('despesa')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0,00" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Custo</label>
                     <input {...register('custo')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0,00" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Margem</label>
                     <input {...register('margem')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0,00" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Valor Bruto</label>
                     <input {...register('valorBruto')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0,00" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Revenda</label>
                     <input {...register('revenda')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0,00" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Promoção Qtd</label>
                     <input {...register('promocaoQtd')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Qtd</label>
                     <input {...register('qtd')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Queima</label>
                     <input {...register('queima')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0,00" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
                     <input {...register('dataInicial')} type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
                     <input {...register('dataFinal')} type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                   </div>
                 </div>
               )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
