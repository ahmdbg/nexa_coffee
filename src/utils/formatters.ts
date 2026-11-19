import { PAYMENT_METHODS, ROLE_LABELS } from '../constants';
import type { EmployeeRole, PaymentMethod } from '../types';

export function formatPaymentMethod(method?: PaymentMethod | string): string {
  const found = PAYMENT_METHODS.find((m) => m.value === method);
  return found ? found.label : method ?? '—';
}

export function formatRoleLabel(role: EmployeeRole): string {
  return ROLE_LABELS[role] ?? role;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return 'N';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
