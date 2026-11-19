import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers } from 'lucide-react';
import { PageHeader } from '../components/common';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui';
import { useAppStore } from '../store/appStore';
import {
  selectActiveProducts,
  selectCompletedTransactions,
  selectFinancialSummary,
  selectLowStockProducts,
} from '../store/selectors';
import { formatCurrency } from '../utils/currency';

export type ModuleKey =
  | 'pos'
  | 'inventory'
  | 'finance'
  | 'employees'
  | 'customers'
  | 'reports'
  | 'ai';

interface ModuleMeta {
  title: string;
  description: string;
  phaseLabel: string;
  plannedCapabilities: string[];
}

const MODULE_META: Record<ModuleKey, ModuleMeta> = {
  pos: {
    title: 'Point of Sale (POS)',
    description:
      'Interactive checkout terminal with cart management, stock validation, and printable receipts.',
    phaseLabel: 'Scheduled: Phase 2 — Core Operations',
    plannedCapabilities: [
      'Product browsing grid with live category filters and stock validation',
      'Shopping cart with discount, optional tax, and cash change calculation',
      'Atomic checkout updating transactions, product stock, and inventory movements',
      'Receipt preview & controlled transaction cancellation with stock restoration',
    ],
  },
  inventory: {
    title: 'Inventory Management',
    description:
      'Centralized catalog, category management, suppliers, and complete stock movement ledger.',
    phaseLabel: 'Scheduled: Phase 2 — Core Operations',
    plannedCapabilities: [
      'Create, edit, archive, and inspect products with SKU & supplier links',
      'Stock In, Stock Out, Stock Adjustment, and Return movement tracking',
      'Automated low-stock and out-of-stock threshold monitoring',
      'Category and supplier directory management',
    ],
  },
  finance: {
    title: 'Financial Management',
    description:
      'Revenue overview, expense ledger, non-POS income, Profit & Loss, and Cash Flow analysis.',
    phaseLabel: 'Scheduled: Phase 2 & 3 — Core & Business Management',
    plannedCapabilities: [
      'POS revenue derived automatically without double counting',
      'COGS calculated from transaction item cost-price snapshots',
      'Expense and non-POS other income CRUD with category filtering',
      'Distinct Profit & Loss statement and Cash Flow ledger',
    ],
  },
  employees: {
    title: 'Employee Management',
    description:
      'Staff directory, role assignments, employment status, and workspace activity logs.',
    phaseLabel: 'Scheduled: Phase 3 — Business Management',
    plannedCapabilities: [
      'Employee directory with position, contact info, and optional salary',
      'Role configuration (Owner, Manager, Cashier, Inventory Staff)',
      'Preserved employee references in historical transactions',
    ],
  },
  customers: {
    title: 'Customer Management (CRM)',
    description:
      'Customer profiles with purchase history and transaction-derived lifetime metrics.',
    phaseLabel: 'Scheduled: Phase 3 — Business Management',
    plannedCapabilities: [
      'Customer directory with add, edit, and archive support',
      'Total transactions, total spending, and average order value derived from completed sales',
      'Transparent customer segmentation (New, Regular, Loyal)',
    ],
  },
  reports: {
    title: 'Reports & Analytics',
    description:
      'Sales, product performance, inventory valuation, P&L, customer, and staff analytics.',
    phaseLabel: 'Scheduled: Phase 3 — Business Management',
    plannedCapabilities: [
      'Date-filtered revenue and expense charts via Recharts',
      'Best and lowest-selling product margin breakdown',
      'Exportable module summaries backed by the unified store',
    ],
  },
  ai: {
    title: 'AI Business Assistant',
    description:
      'Conversational business analyst grounded exclusively in your NexaDesk operational data.',
    phaseLabel: 'Scheduled: Phase 4 — Advanced Features',
    plannedCapabilities: [
      'Demo mode business Q&A with zero fabricated figures',
      'Optional Gemini integration with summarized operational context',
      'Actionable restock, expense, and revenue trend summaries',
    ],
  },
};

export function ModuleFoundationPage({ moduleKey }: { moduleKey: ModuleKey }) {
  const navigate = useNavigate();
  const data = useAppStore((s) => s.data);
  const meta = MODULE_META[moduleKey];
  const currency = data?.settings.currency ?? 'USD';

  const activeProducts = selectActiveProducts(data);
  const lowStock = selectLowStockProducts(data);
  const completedTx = selectCompletedTransactions(data);
  const financial = selectFinancialSummary(data);

  const liveFacts: Array<{ label: string; value: string }> = (() => {
    switch (moduleKey) {
      case 'pos':
        return [
          { label: 'Sellable Active Products', value: String(activeProducts.length) },
          { label: 'Completed Transactions', value: String(completedTx.length) },
          { label: 'POS Revenue', value: formatCurrency(financial.posRevenue, currency) },
        ];
      case 'inventory':
        return [
          { label: 'Active Products', value: String(activeProducts.length) },
          { label: 'Low Stock Items', value: String(lowStock.length) },
          {
            label: 'Stock Movements Logged',
            value: String(data?.inventoryMovements.length ?? 0),
          },
        ];
      case 'finance':
        return [
          { label: 'Total Revenue', value: formatCurrency(financial.totalRevenue, currency) },
          {
            label: 'Operating Expenses',
            value: formatCurrency(financial.operatingExpenses, currency),
          },
          { label: 'Net Profit', value: formatCurrency(financial.netProfit, currency) },
        ];
      case 'employees':
        return [
          { label: 'Team Members', value: String(data?.employees.length ?? 0) },
          { label: 'Audit Entries', value: String(data?.auditLogs.length ?? 0) },
          { label: 'Business Currency', value: currency },
        ];
      case 'customers':
        return [
          { label: 'Registered Customers', value: String(data?.customers.length ?? 0) },
          {
            label: 'Customer-Linked Sales',
            value: String(completedTx.filter((t) => Boolean(t.customerId)).length),
          },
          { label: 'POS Revenue', value: formatCurrency(financial.posRevenue, currency) },
        ];
      case 'reports':
        return [
          { label: 'Completed Sales', value: String(completedTx.length) },
          { label: 'Gross Profit', value: formatCurrency(financial.grossProfit, currency) },
          { label: 'Net Cash Flow', value: formatCurrency(financial.netCashFlow, currency) },
        ];
      case 'ai':
        return [
          { label: 'Indexed Products', value: String(activeProducts.length) },
          { label: 'Indexed Transactions', value: String(completedTx.length) },
          { label: 'Indexed Expenses', value: String(data?.expenses.length ?? 0) },
        ];
    }
  })();

  return (
    <div className="space-y-6">
      <PageHeader
        title={meta.title}
        description={meta.description}
        actions={
          <Button
            variant="outline"
            onClick={() => navigate('/app/dashboard')}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Overview
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <div className="space-y-1.5">
            <Badge variant="info">{meta.phaseLabel}</Badge>
            <CardTitle className="pt-1">Foundation Store Ready</CardTitle>
            <CardDescription>
              This route is connected to the centralized Zustand store and Zod-validated Local Storage layer.
            </CardDescription>
          </div>
          <div className="h-10 w-10 rounded-lg bg-[#EAF2FA] text-[#234F80] flex items-center justify-center shrink-0">
            <Layers className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {liveFacts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4"
              >
                <p className="text-[12px] text-[#64748B]">{fact.label}</p>
                <p className="mt-1 text-[22px] font-semibold text-[#0F172A] tabular-nums">
                  {fact.value}
                </p>
              </div>
            ))}
          </div>

          <div>
            <h4 className="text-[14px] font-semibold text-[#1E293B] mb-2.5">
              Planned Module Capabilities
            </h4>
            <ul className="space-y-2 text-[13px] text-[#475569] list-disc pl-5">
              {meta.plannedCapabilities.map((cap) => (
                <li key={cap}>{cap}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
