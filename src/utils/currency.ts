import { CURRENCY_OPTIONS } from '../constants';

export function formatCurrency(amount: number, currencyCode = 'USD'): string {
  const currencyMeta = CURRENCY_OPTIONS.find((c) => c.code === currencyCode);
  const locale = currencyMeta?.locale ?? 'en-US';
  const maximumFractionDigits = currencyCode === 'IDR' ? 0 : 2;
  const minimumFractionDigits = currencyCode === 'IDR' ? 0 : 2;

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(amount);
  } catch {
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatPercentage(value: number, fractionDigits = 1): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(fractionDigits)}%`;
}
