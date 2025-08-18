// Tipos de usuário
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

// Tipos de autenticação
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Tipos de produto/estoque
export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  price: number;
  cost: number;
  stockQuantity: number;
  minStockLevel: number;
  category: string;
  brand?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  sku: string;
  price: number;
  cost: number;
  stockQuantity: number;
  minStockLevel: number;
  category: string;
  brand?: string;
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
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 