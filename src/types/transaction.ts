export type PaymentMethod =
  | 'cash'
  | 'bank_transfer'
  | 'e_wallet'
  | 'card'
  | 'other';

export type TransactionStatus = 'completed' | 'cancelled';

export interface TransactionItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  subtotal: number;
}

export interface Transaction {
  id: string;
  transactionNumber: string;
  customerId?: string;
  employeeId?: string;
  items: TransactionItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentAmount: number;
  changeAmount: number;
  status: TransactionStatus;
  notes?: string;
  createdAt: string;
  cancelledAt?: string;
  cancellationReason?: string;
}
