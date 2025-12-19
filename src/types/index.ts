// Tipos de usuário
export interface User {
  id: string;
  name: string;
  cpf: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

// Tipos para Usuario baseados na estrutura do banco de dados
export interface Usuario {
  id: number;
  profileId: number;
  name: string;
  
  phone: string;
  email: string;
  cpf: string;
  password: string;
  createdAt: string;
  lastAccess: string;
  status: string;
}

export interface CreateUsuarioData {
  name: string;
  cpf: string;
  password: string; 
  passwordConfirm: string; 
  profileId: number;
  phone: string;
  email: string;
  status: string;
}

export interface UpdateUsuarioData extends Partial<CreateUsuarioData> {
  idUsuario: number;
}

// Tipos de autenticação
export interface LoginCredentials {
  cpf: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Tipos de produto baseados na imagem do sistema
export interface Product {
  id: string;
  codigo: string;
  codigoBarra: string;
  codFabrica: string;
  aplicacao: string;
  produto: string;
  descricaoPDV: string;
  fornecedor: string;
  usaGrade: 'SIM' | 'NÃO';
  marca: string;
  cor: string;
  unidMedida: string;
  observacao: string;
  manual: string;
  ativo: 'SIM' | 'NÃO';
  dataCadastro: string;
  horaCadastro: string;
  dataAlteracao: string;
  horaAlteracao: string;
  usuario: string;
  filial: string;
  matriz: string;
  versao: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  codigo: string;
  codigoBarra: string;
  codFabrica: string;
  aplicacao: string;
  produto: string;
  descricaoPDV: string;
  fornecedor: string;
  usaGrade: 'SIM' | 'NÃO';
  marca: string;
  cor: string;
  unidMedida: string;
  observacao: string;
  manual: string;
  ativo: 'SIM' | 'NÃO';
  // Tributação (opcionais)
  cfopEstado?: string;
  cfopForaEstado?: string;
  origem?: string;
  icmsCsosn?: string;
  icmsCst?: string;
  cofinsCst?: string;
  pisCst?: string;
  ipiCst?: string;
  codigoNcm?: string;
  descricaoNcm?: string;
  codigoCest?: string;
  listaMonofasica?: string;
  aliqIcms?: string;
  aliqIcmsBc?: string;
  aliqCofins?: string;
  aliqPis?: string;
  aliqIpi?: string;
  aliqFcp?: string;
  codBeneficioFiscal?: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

// Tipos de venda
export interface Sale {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'pix';
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateSaleData {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  items: Omit<SaleItem, 'id' | 'productName'>[];
  paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'pix';
}

// Tipos de API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: boolean;
}

// Nova estrutura para resposta de listagem de usuários
export interface ListaUsuariosResponse {
  data: Usuario[];
  status: number;
  message: string;
  pagination: {
    page: number
    limit: number;
    total: number;
    totalPages: number;
  }
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipo para Perfil
export interface Profile {
  id: number;
  name: string;
} 