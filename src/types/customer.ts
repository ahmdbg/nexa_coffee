export type CustomerStatus = 'active' | 'archived';

export type CustomerSegment = 'new' | 'regular' | 'loyal';

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerComputedStats {
  customerId: string;
  totalTransactions: number;
  totalSpending: number;
  averageTransactionValue: number;
  lastPurchaseAt?: string;
  segment: CustomerSegment;
}
