import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import type { DateRange, DateRangePreset } from '../types';

export function formatDate(
  isoString: string | Date,
  pattern: 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd' = 'dd/MM/yyyy'
): string {
  const date = typeof isoString === 'string' ? parseISO(isoString) : isoString;
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, pattern);
}

export function formatDateTime(isoString: string | Date): string {
  const date = typeof isoString === 'string' ? parseISO(isoString) : isoString;
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, 'dd MMM yyyy, HH:mm');
}

export function resolveDateBounds(
  range: DateRange,
  referenceDate = new Date()
): { start: Date; end: Date } | null {
  switch (range.preset) {
    case 'today':
      return { start: startOfDay(referenceDate), end: endOfDay(referenceDate) };
    case 'this_week':
      return {
        start: startOfWeek(referenceDate, { weekStartsOn: 1 }),
        end: endOfWeek(referenceDate, { weekStartsOn: 1 }),
      };
    case 'this_month':
      return { start: startOfMonth(referenceDate), end: endOfMonth(referenceDate) };
    case 'this_year':
      return { start: startOfYear(referenceDate), end: endOfYear(referenceDate) };
    case 'custom':
      if (range.startDate && range.endDate) {
        return {
          start: startOfDay(parseISO(range.startDate)),
          end: endOfDay(parseISO(range.endDate)),
        };
      }
      return null;
    case 'all_time':
    default:
      return null;
  }
}

export function isDateInRange(isoString: string, range: DateRange, referenceDate = new Date()): boolean {
  const bounds = resolveDateBounds(range, referenceDate);
  if (!bounds) return true;
  const date = parseISO(isoString);
  if (Number.isNaN(date.getTime())) return false;
  return isWithinInterval(date, bounds);
}

export const DATE_RANGE_LABELS: Record<DateRangePreset, string> = {
  today: 'Today',
  this_week: 'This Week',
  this_month: 'This Month',
  this_year: 'This Year',
  all_time: 'All Time',
  custom: 'Custom Range',
};
