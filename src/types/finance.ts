import type { PaymentMethod } from './transaction';

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Income {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialSummary {
  posRevenue: number;
  otherIncome: number;
  totalRevenue: number;
  cogs: number;
  grossProfit: number;
  operatingExpenses: number;
  netProfit: number;
  cashIn: number;
  cashOut: number;
  netCashFlow: number;
}
