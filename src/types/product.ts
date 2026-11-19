export type ProductStatus = 'active' | 'archived';

export interface Category {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  categoryId: string;
  supplierId?: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  minimumStock: number;
  unit: string;
  image?: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}
