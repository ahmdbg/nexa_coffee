import type { Business } from './business';
import type { AppNotification, AppSettings, AuditLog } from './common';
import type { Customer } from './customer';
import type { Employee } from './employee';
import type { Expense, Income } from './finance';
import type { InventoryMovement } from './inventory';
import type { Category, Product, Supplier } from './product';
import type { Transaction } from './transaction';

export interface NexaDeskData {
  schemaVersion: number;
  business: Business;
  settings: AppSettings;
  products: Product[];
  categories: Category[];
  suppliers: Supplier[];
  inventoryMovements: InventoryMovement[];
  transactions: Transaction[];
  customers: Customer[];
  employees: Employee[];
  expenses: Expense[];
  income: Income[];
  notifications: AppNotification[];
  auditLogs: AuditLog[];
}

export * from './business';
export * from './common';
export * from './customer';
export * from './employee';
export * from './finance';
export * from './inventory';
export * from './product';
export * from './transaction';
