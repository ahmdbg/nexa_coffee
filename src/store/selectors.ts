import type {
  AppNotification,
  Category,
  Customer,
  CustomerComputedStats,
  DateRange,
  Employee,
  Expense,
  FinancialSummary,
  Income,
  NexaDeskData,
  Product,
  Transaction,
} from '../types';
import { calculateFinancialSummary, calculateInventoryValuation } from '../utils/calculations';
import { isDateInRange } from '../utils/date';

export function selectActiveCategories(data: NexaDeskData | null): Category[] {
  if (!data) return [];
  return data.categories.filter((c) => c.status === 'active');
}

export function selectActiveProducts(data: NexaDeskData | null): Product[] {
  if (!data) return [];
  return data.products.filter((p) => p.status === 'active');
}

export function selectLowStockProducts(data: NexaDeskData | null): Product[] {
  return selectActiveProducts(data).filter(
    (p) => p.stock > 0 && p.stock <= p.minimumStock
  );
}

export function selectOutOfStockProducts(data: NexaDeskData | null): Product[] {
  return selectActiveProducts(data).filter((p) => p.stock <= 0);
}

export function selectCompletedTransactions(
  data: NexaDeskData | null,
  range?: DateRange
): Transaction[] {
  if (!data) return [];
  return data.transactions.filter(
    (tx) =>
      tx.status === 'completed' &&
      (!range || isDateInRange(tx.createdAt, range))
  );
}

export function selectExpensesInRange(
  data: NexaDeskData | null,
  range?: DateRange
): Expense[] {
  if (!data) return [];
  return data.expenses.filter(
    (exp) => !range || isDateInRange(exp.date, range)
  );
}

export function selectIncomeInRange(
  data: NexaDeskData | null,
  range?: DateRange
): Income[] {
  if (!data) return [];
  return data.income.filter(
    (inc) => !range || isDateInRange(inc.date, range)
  );
}

export function selectFinancialSummary(
  data: NexaDeskData | null,
  range?: DateRange
): FinancialSummary {
  if (!data) {
    return {
      posRevenue: 0,
      otherIncome: 0,
      totalRevenue: 0,
      cogs: 0,
      grossProfit: 0,
      operatingExpenses: 0,
      netProfit: 0,
      cashIn: 0,
      cashOut: 0,
      netCashFlow: 0,
    };
  }
  return calculateFinancialSummary({
    transactions: selectCompletedTransactions(data, range),
    expenses: selectExpensesInRange(data, range),
    income: selectIncomeInRange(data, range),
  });
}

export function selectInventoryValuation(data: NexaDeskData | null) {
  if (!data) return { totalUnits: 0, costValue: 0, retailValue: 0 };
  return calculateInventoryValuation(data.products);
}

export interface TopSellingProductRow {
  productId: string;
  productName: string;
  sku: string;
  quantitySold: number;
  revenue: number;
  profit: number;
  contributionPercent: number;
}

export function selectTopSellingProducts(
  data: NexaDeskData | null,
  range?: DateRange,
  limit = 5
): TopSellingProductRow[] {
  const completed = selectCompletedTransactions(data, range);
  const map = new Map<string, Omit<TopSellingProductRow, 'contributionPercent'>>();
  let totalItemRevenue = 0;

  completed.forEach((tx) => {
    tx.items.forEach((item) => {
      totalItemRevenue += item.subtotal;
      const existing = map.get(item.productId);
      const itemProfit = (item.unitPrice - item.costPrice) * item.quantity;
      if (existing) {
        existing.quantitySold += item.quantity;
        existing.revenue += item.subtotal;
        existing.profit += itemProfit;
      } else {
        map.set(item.productId, {
          productId: item.productId,
          productName: item.productName,
          sku: item.sku,
          quantitySold: item.quantity,
          revenue: item.subtotal,
          profit: itemProfit,
        });
      }
    });
  });

  return Array.from(map.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
    .map((row) => ({
      ...row,
      revenue: Number(row.revenue.toFixed(2)),
      profit: Number(row.profit.toFixed(2)),
      contributionPercent:
        totalItemRevenue > 0
          ? Number(((row.revenue / totalItemRevenue) * 100).toFixed(1))
          : 0,
    }));
}

export function selectCustomerStats(
  data: NexaDeskData | null,
  customer: Customer
): CustomerComputedStats {
  const completed = selectCompletedTransactions(data).filter(
    (tx) => tx.customerId === customer.id
  );
  const totalTransactions = completed.length;
  const totalSpending = Number(
    completed.reduce((sum, tx) => sum + tx.total, 0).toFixed(2)
  );
  const averageTransactionValue =
    totalTransactions > 0
      ? Number((totalSpending / totalTransactions).toFixed(2))
      : 0;
  const sortedDates = completed
    .map((tx) => tx.createdAt)
    .sort((a, b) => b.localeCompare(a));

  let segment: CustomerComputedStats['segment'] = 'new';
  if (totalTransactions >= 3 || totalSpending >= 100) {
    segment = 'loyal';
  } else if (totalTransactions >= 2) {
    segment = 'regular';
  }

  return {
    customerId: customer.id,
    totalTransactions,
    totalSpending,
    averageTransactionValue,
    lastPurchaseAt: sortedDates[0],
    segment,
  };
}

export function selectActiveEmployees(data: NexaDeskData | null): Employee[] {
  if (!data) return [];
  return data.employees.filter((e) => e.status === 'active');
}

export function selectUnreadNotifications(data: NexaDeskData | null): AppNotification[] {
  if (!data) return [];
  return data.notifications.filter((n) => !n.read);
}
