export type DateRangePreset = 'today' | 'this_week' | 'this_month' | 'this_year' | 'all_time' | 'custom';

export interface DateRange {
  preset: DateRangePreset;
  startDate?: string;
  endDate?: string;
}

export interface AppSettings {
  language: 'en' | 'id';
  theme: 'light';
  dateFormat: 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd';
  currency: string;
  taxEnabled: boolean;
  taxRate: number; // percentage, e.g., 10 for 10%
  lowStockAlertEnabled: boolean;
  notificationsEnabled: boolean;
}

export type NotificationType = 'info' | 'warning' | 'success' | 'danger';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType:
    | 'business'
    | 'settings'
    | 'product'
    | 'category'
    | 'supplier'
    | 'inventory'
    | 'transaction'
    | 'customer'
    | 'employee'
    | 'expense'
    | 'income'
    | 'system';
  entityId?: string;
  actorId?: string;
  actorName: string;
  summary: string;
  createdAt: string;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
