import { apiGet, apiPost, apiPut, apiDelete } from './api';
import type { Product, CreateProductData, UpdateProductData, PaginatedResponse } from '../types';

// Serviços para produtos
export const productService = {
  // Buscar todos os produtos com paginação
  getProducts: async (page = 1, limit = 10, search?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }
    
    return apiGet<PaginatedResponse<Product>>(`/products?${params.toString()}`);
  },

  // Buscar produto por ID
  getProductById: async (id: string) => {
    return apiGet<Product>(`/products/${id}`);
  },

  // Buscar produto por código
  getProductByCode: async (code: string) => {
    return apiGet<Product>(`/products/code/${code}`);
  },

  // Criar novo produto
  createProduct: async (data: CreateProductData) => {
    return apiPost<Product>('/products', data);
  },

  // Atualizar produto
  updateProduct: async (data: UpdateProductData) => {
    return apiPut<Product>(`/products/${data.id}`, data);
  },

  // Excluir produto
  deleteProduct: async (id: string) => {
    return apiDelete<void>(`/products/${id}`);
  },

  // Buscar produtos por fornecedor
  getProductsBySupplier: async (supplier: string) => {
    return apiGet<Product[]>(`/products/supplier/${supplier}`);
  },

  // Buscar produtos por grupo
  getProductsByGroup: async (group: string) => {
    return apiGet<Product[]>(`/products/group/${group}`);
  },

  // Buscar produtos ativos
  getActiveProducts: async () => {
    return apiGet<Product[]>('/products/active');
  },

  // Buscar produtos em baixa
  getLowStockProducts: async (minQuantity = 5) => {
    return apiGet<Product[]>(`/products/low-stock?minQuantity=${minQuantity}`);
  },
};

export default productService;
