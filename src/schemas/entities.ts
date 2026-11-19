import { z } from 'zod';

export const businessSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Business name is required').max(120),
  category: z.string().min(1, 'Business category is required'),
  description: z.string().optional(),
  logo: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid business email').optional().or(z.literal('')),
  currency: z.string().min(3).max(5),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const appSettingsSchema = z.object({
  language: z.enum(['en', 'id']),
  theme: z.literal('light'),
  dateFormat: z.enum(['dd/MM/yyyy', 'MM/dd/yyyy', 'yyyy-MM-dd']),
  currency: z.string().min(3).max(5),
  taxEnabled: z.boolean(),
  taxRate: z.number().min(0).max(100),
  lowStockAlertEnabled: z.boolean(),
  notificationsEnabled: z.boolean(),
});

export const categorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Category name is required').max(80),
  description: z.string().optional(),
  status: z.enum(['active', 'archived']),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const supplierSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Supplier name is required').max(120),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid supplier email').optional().or(z.literal('')),
  address: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const productSchema = z.object({
  id: z.string().min(1),
  sku: z.string().min(1, 'SKU is required').max(64),
  barcode: z.string().optional(),
  name: z.string().min(1, 'Product name is required').max(120),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  supplierId: z.string().optional(),
  costPrice: z.number().min(0, 'Cost price cannot be negative'),
  sellingPrice: z.number().min(0, 'Selling price cannot be negative'),
  stock: z.number().min(0, 'Stock cannot be negative'),
  minimumStock: z.number().min(0, 'Minimum stock cannot be negative'),
  unit: z.string().min(1, 'Unit is required').max(30),
  image: z.string().optional(),
  status: z.enum(['active', 'archived']),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const inventoryMovementSchema = z.object({
  id: z.string().min(1),
  productId: z.string().min(1),
  type: z.enum(['stock_in', 'stock_out', 'adjustment', 'return']),
  quantity: z.number().min(0),
  previousStock: z.number().min(0),
  newStock: z.number().min(0),
  referenceId: z.string().optional(),
  note: z.string().optional(),
  createdAt: z.string().min(1),
  createdBy: z.string().optional(),
});

export const transactionItemSchema = z.object({
  id: z.string().min(1),
  productId: z.string().min(1),
  productName: z.string().min(1),
  sku: z.string().min(1),
  quantity: z.number().int().positive('Quantity must be at least 1'),
  unitPrice: z.number().min(0),
  costPrice: z.number().min(0),
  subtotal: z.number().min(0),
});

export const transactionSchema = z.object({
  id: z.string().min(1),
  transactionNumber: z.string().min(1),
  customerId: z.string().optional(),
  employeeId: z.string().optional(),
  items: z.array(transactionItemSchema).min(1, 'Transaction must have at least one item'),
  subtotal: z.number().min(0),
  discount: z.number().min(0),
  tax: z.number().min(0),
  total: z.number().min(0),
  paymentMethod: z.enum(['cash', 'bank_transfer', 'e_wallet', 'card', 'other']),
  paymentAmount: z.number().min(0),
  changeAmount: z.number().min(0),
  status: z.enum(['completed', 'cancelled']),
  notes: z.string().optional(),
  createdAt: z.string().min(1),
  cancelledAt: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const customerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Customer name is required').max(120),
  phone: z.string().optional(),
  email: z.string().email('Invalid customer email').optional().or(z.literal('')),
  address: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['active', 'archived']),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const employeeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Employee name is required').max(120),
  position: z.string().min(1, 'Position is required').max(80),
  role: z.enum(['owner', 'manager', 'cashier', 'inventory_staff']),
  phone: z.string().optional(),
  email: z.string().email('Invalid employee email').optional().or(z.literal('')),
  salary: z.number().min(0).optional(),
  status: z.enum(['active', 'inactive']),
  joinDate: z.string().min(1),
  avatar: z.string().optional(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const expenseSchema = z.object({
  id: z.string().min(1),
  category: z.string().min(1, 'Expense category is required'),
  description: z.string().min(1, 'Description is required').max(250),
  amount: z.number().positive('Amount must be greater than 0'),
  date: z.string().min(1),
  paymentMethod: z.enum(['cash', 'bank_transfer', 'e_wallet', 'card', 'other']).optional(),
  notes: z.string().optional(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const incomeSchema = z.object({
  id: z.string().min(1),
  category: z.string().min(1, 'Income category is required'),
  description: z.string().min(1, 'Description is required').max(250),
  amount: z.number().positive('Amount must be greater than 0'),
  date: z.string().min(1),
  paymentMethod: z.enum(['cash', 'bank_transfer', 'e_wallet', 'card', 'other']).optional(),
  notes: z.string().optional(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const notificationSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  message: z.string().min(1),
  type: z.enum(['info', 'warning', 'success', 'danger']),
  read: z.boolean(),
  link: z.string().optional(),
  createdAt: z.string().min(1),
});

export const auditLogSchema = z.object({
  id: z.string().min(1),
  action: z.string().min(1),
  entityType: z.enum([
    'business',
    'settings',
    'product',
    'category',
    'supplier',
    'inventory',
    'transaction',
    'customer',
    'employee',
    'expense',
    'income',
    'system',
  ]),
  entityId: z.string().optional(),
  actorId: z.string().optional(),
  actorName: z.string().min(1),
  summary: z.string().min(1),
  createdAt: z.string().min(1),
});
