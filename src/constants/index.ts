import type { EmployeeRole } from '../types/employee';

export const STORAGE_KEY = 'nexadesk_data';
export const STORAGE_BACKUP_KEY = 'nexadesk_data_backup';
export const CURRENT_SCHEMA_VERSION = 1;

export const APP_NAME = 'NexaDesk';
export const APP_TAGLINE = 'One Platform. Complete Business Control.';

export const CURRENCY_OPTIONS = [
  { code: 'IDR', symbol: 'Rp', label: 'Indonesian Rupiah (IDR)', locale: 'id-ID' },
  { code: 'USD', symbol: '$', label: 'US Dollar (USD)', locale: 'en-US' },
  { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar (SGD)', locale: 'en-SG' },
  { code: 'EUR', symbol: '€', label: 'Euro (EUR)', locale: 'de-DE' },
] as const;

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'e_wallet', label: 'E-Wallet' },
  { value: 'card', label: 'Debit / Credit Card' },
  { value: 'other', label: 'Other' },
] as const;

export const EXPENSE_CATEGORIES = [
  'Rent',
  'Electricity',
  'Water',
  'Salary',
  'Ingredients',
  'Transportation',
  'Marketing',
  'Maintenance',
  'Other',
] as const;

export const INCOME_CATEGORIES = [
  'Catering & Events',
  'Workshop & Training',
  'Equipment Rental',
  'Wholesale Rebate',
  'Other Income',
] as const;

export const ROLE_LABELS: Record<EmployeeRole, string> = {
  owner: 'Business Owner',
  manager: 'Store Manager',
  cashier: 'Cashier',
  inventory_staff: 'Inventory Staff',
};

export const ROLE_PERMISSIONS: Record<EmployeeRole, string[]> = {
  owner: ['All Modules', 'Financial Reports', 'Employee Management', 'Data Management'],
  manager: ['Operations', 'POS & Transactions', 'Inventory', 'Operational Reports'],
  cashier: ['Point of Sale', 'Customer Selection', 'Transaction Receipts'],
  inventory_staff: ['Product Catalog', 'Stock Movements', 'Suppliers'],
};
