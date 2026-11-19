import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Database,
  DollarSign,
  Package,
  Receipt,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { PageHeader, StatCard } from '../../components/common';
import { DataTable, type DataTableColumn } from '../../components/tables/DataTable';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Select,
} from '../../components/ui';
import { storageService } from '../../services/storageService';
import { useAppStore } from '../../store/appStore';
import {
  selectActiveProducts,
  selectCompletedTransactions,
  selectFinancialSummary,
  selectInventoryValuation,
  selectLowStockProducts,
  selectOutOfStockProducts,
  selectTopSellingProducts,
} from '../../store/selectors';
import type { DateRangePreset, Transaction } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { DATE_RANGE_LABELS, formatDateTime } from '../../utils/date';
import { formatBytes, formatPaymentMethod } from '../../utils/formatters';

export function DashboardPage() {
  const navigate = useNavigate();
  const data = useAppStore((s) => s.data);
  const [preset, setPreset] = useState<DateRangePreset>('this_month');

  const currency = data?.settings.currency ?? 'USD';
  const dateRange = useMemo(() => ({ preset }), [preset]);

  const financial = useMemo(
    () => selectFinancialSummary(data, dateRange),
    [data, dateRange]
  );
  const completedTx = useMemo(
    () => selectCompletedTransactions(data, dateRange),
    [data, dateRange]
  );
  const activeProducts = useMemo(() => selectActiveProducts(data), [data]);
  const lowStockProducts = useMemo(() => selectLowStockProducts(data), [data]);
  const outOfStockProducts = useMemo(() => selectOutOfStockProducts(data), [data]);
  const topProducts = useMemo(
    () => selectTopSellingProducts(data, dateRange, 5),
    [data, dateRange]
  );
  const valuation = useMemo(() => selectInventoryValuation(data), [data]);

  const customerMap = useMemo(
    () => new Map((data?.customers ?? []).map((c) => [c.id, c.name])),
    [data?.customers]
  );

  const recentTransactions = useMemo(() => {
    return [...(data?.transactions ?? [])]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 8);
  }, [data?.transactions]);

  const storageBytes = storageService.getStorageUsageBytes();

  const txColumns: DataTableColumn<Transaction>[] = [
    {
      key: 'number',
      header: 'Transaction',
      render: (tx) => (
        <span className="font-mono text-[12px] font-medium text-[#14243A]">
          {tx.transactionNumber}
        </span>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (tx) => (
        <span className="text-[#334155]">
          {tx.customerId ? customerMap.get(tx.customerId) ?? 'Walk-in' : 'Walk-in'}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (tx) => (
        <span className="text-[#64748B] tabular-nums">{formatDateTime(tx.createdAt)}</span>
      ),
    },
    {
      key: 'method',
      header: 'Payment',
      render: (tx) => (
        <span className="text-[#475569]">{formatPaymentMethod(tx.paymentMethod)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (tx) => (
        <Badge variant={tx.status === 'completed' ? 'success' : 'danger'}>
          {tx.status === 'completed' ? 'Completed' : 'Cancelled'}
        </Badge>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      align: 'right',
      render: (tx) => (
        <span className="font-medium text-[#0F172A] tabular-nums">
          {formatCurrency(tx.total, currency)}
        </span>
      ),
    },
  ];

  const stockAlerts = [...outOfStockProducts, ...lowStockProducts];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${data?.business.name ?? 'Nexa Coffee House'}`}
        description="Live operational overview derived directly from your centralized local-first dataset."
        actions={
          <>
            <div className="w-40">
              <Select
                aria-label="Date range filter"
                value={preset}
                onChange={(e) => setPreset(e.target.value as DateRangePreset)}
                options={(
                  ['today', 'this_week', 'this_month', 'this_year', 'all_time'] as DateRangePreset[]
                ).map((p) => ({
                  value: p,
                  label: DATE_RANGE_LABELS[p],
                }))}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/app/settings/data-management')}
              leftIcon={<Database className="h-4 w-4" />}
            >
              Data Store
            </Button>
          </>
        }
      />

      {/* Four Live KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(financial.totalRevenue, currency)}
          deltaLabel={`POS ${formatCurrency(financial.posRevenue, currency)}`}
          subtitle={`+ ${formatCurrency(financial.otherIncome, currency)} other`}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          title="Net Profit"
          value={formatCurrency(financial.netProfit, currency)}
          deltaLabel={`COGS ${formatCurrency(financial.cogs, currency)}`}
          deltaTone={financial.netProfit >= 0 ? 'positive' : 'negative'}
          subtitle="After expenses & COGS"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(financial.operatingExpenses, currency)}
          subtitle={`${data?.expenses.length ?? 0} recorded entries`}
          icon={<Wallet className="h-4 w-4" />}
        />
        <StatCard
          title="Completed Transactions"
          value={completedTx.length}
          subtitle={`${activeProducts.length} active SKUs in catalog`}
          icon={<Receipt className="h-4 w-4" />}
        />
      </div>

      {/* Main Split Grid: Recent Transactions + Stock & Storage Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Seeded operational ledger including completed sales and stock-restored cancellations.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/app/pos')}
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              >
                POS Module
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                data={recentTransactions}
                columns={txColumns}
                keyExtractor={(tx) => tx.id}
                pageSize={8}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Top-Selling Products ({DATE_RANGE_LABELS[preset]})</CardTitle>
                <CardDescription>
                  Calculated dynamically from completed transaction line items.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {topProducts.length === 0 ? (
                <p className="text-[13px] text-[#64748B] py-4">
                  No completed product sales in the selected period.
                </p>
              ) : (
                <div className="divide-y divide-[#E2E8F0]">
                  {topProducts.map((item) => (
                    <div
                      key={item.productId}
                      className="py-3 flex items-center justify-between gap-4 text-[13px]"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-[#1E293B] truncate">
                          {item.productName}
                        </p>
                        <p className="text-[12px] text-[#64748B] tabular-nums">
                          {item.sku} · {item.quantitySold} sold
                        </p>
                      </div>
                      <div className="text-right shrink-0 tabular-nums">
                        <p className="font-semibold text-[#0F172A]">
                          {formatCurrency(item.revenue, currency)}
                        </p>
                        <p className="text-[12px] text-[#64748B]">
                          {item.contributionPercent}% share
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Low Stock Alerts & Foundation Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Stock Alerts</CardTitle>
                <CardDescription>
                  Products at or below minimum stock thresholds.
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/app/inventory')}
              >
                View
              </Button>
            </CardHeader>
            <CardContent>
              {stockAlerts.length === 0 ? (
                <p className="text-[13px] text-[#64748B]">
                  All active products are above minimum stock levels.
                </p>
              ) : (
                <div className="divide-y divide-[#E2E8F0]">
                  {stockAlerts.map((product) => {
                    const isOut = product.stock <= 0;
                    return (
                      <div
                        key={product.id}
                        className="py-3 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-[#1E293B] truncate">
                            {product.name}
                          </p>
                          <p className="text-[12px] text-[#64748B] tabular-nums">
                            {product.sku} · Min {product.minimumStock} {product.unit}
                          </p>
                        </div>
                        <Badge variant={isOut ? 'danger' : 'warning'}>
                          <AlertTriangle className="h-3 w-3" />
                          {isOut ? 'Out of stock' : `${product.stock} ${product.unit}`}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Foundation Architecture</CardTitle>
                <CardDescription>
                  Phase 1 Local-First Storage & Schema Verification
                </CardDescription>
              </div>
              <Package className="h-4 w-4 text-[#64748B]" />
            </CardHeader>
            <CardContent className="space-y-3 text-[13px]">
              <div className="flex items-center justify-between py-1.5 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">Schema Version</span>
                <span className="font-mono font-medium text-[#1E293B]">
                  v{data?.schemaVersion ?? 1}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">Local Storage Footprint</span>
                <span className="font-mono font-medium text-[#1E293B] tabular-nums">
                  {formatBytes(storageBytes)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">Inventory Cost Valuation</span>
                <span className="font-medium text-[#1E293B] tabular-nums">
                  {formatCurrency(valuation.costValue, currency)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#64748B]">Inventory Movements</span>
                <span className="font-medium text-[#1E293B] tabular-nums">
                  {data?.inventoryMovements.length ?? 0} logged
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
