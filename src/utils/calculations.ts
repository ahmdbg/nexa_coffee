import type {
  Expense,
  FinancialSummary,
  Income,
  Product,
  Transaction,
} from '../types';

export function calculateTransactionTotals(params: {
  items: Array<{ quantity: number; unitPrice: number }>;
  discount: number;
  taxEnabled: boolean;
  taxRate: number;
}): { subtotal: number; discount: number; tax: number; total: number } {
  const subtotal = params.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const safeDiscount = Math.max(0, Math.min(params.discount, subtotal));
  const taxableAmount = Math.max(0, subtotal - safeDiscount);
  const tax = params.taxEnabled ? Number(((taxableAmount * params.taxRate) / 100).toFixed(2)) : 0;
  const total = Number((taxableAmount + tax).toFixed(2));

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(safeDiscount.toFixed(2)),
    tax,
    total,
  };
}

export function calculateFinancialSummary(params: {
  transactions: Transaction[];
  expenses: Expense[];
  income: Income[];
}): FinancialSummary {
  const completedTx = params.transactions.filter((tx) => tx.status === 'completed');

  const posRevenue = completedTx.reduce((sum, tx) => sum + tx.total, 0);
  const otherIncome = params.income.reduce((sum, inc) => sum + inc.amount, 0);
  const totalRevenue = posRevenue + otherIncome;

  const cogs = completedTx.reduce(
    (sum, tx) =>
      sum + tx.items.reduce((itemSum, item) => itemSum + item.costPrice * item.quantity, 0),
    0
  );

  const operatingExpenses = params.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const grossProfit = totalRevenue - cogs;
  const netProfit = posRevenue + otherIncome - operatingExpenses - cogs;

  const cashIn = completedTx.reduce((sum, tx) => sum + tx.total, 0) + otherIncome;
  const cashOut = operatingExpenses;
  const netCashFlow = cashIn - cashOut;

  return {
    posRevenue: Number(posRevenue.toFixed(2)),
    otherIncome: Number(otherIncome.toFixed(2)),
    totalRevenue: Number(totalRevenue.toFixed(2)),
    cogs: Number(cogs.toFixed(2)),
    grossProfit: Number(grossProfit.toFixed(2)),
    operatingExpenses: Number(operatingExpenses.toFixed(2)),
    netProfit: Number(netProfit.toFixed(2)),
    cashIn: Number(cashIn.toFixed(2)),
    cashOut: Number(cashOut.toFixed(2)),
    netCashFlow: Number(netCashFlow.toFixed(2)),
  };
}

export function calculateInventoryValuation(products: Product[]): {
  totalUnits: number;
  costValue: number;
  retailValue: number;
} {
  const activeProducts = products.filter((p) => p.status === 'active');
  return activeProducts.reduce(
    (acc, product) => {
      acc.totalUnits += product.stock;
      acc.costValue += product.stock * product.costPrice;
      acc.retailValue += product.stock * product.sellingPrice;
      return acc;
    },
    { totalUnits: 0, costValue: 0, retailValue: 0 }
  );
}
