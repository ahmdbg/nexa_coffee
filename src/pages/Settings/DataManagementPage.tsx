import { useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import { PageHeader } from '../../components/common';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ConfirmDialog,
} from '../../components/ui';
import { storageService } from '../../services/storageService';
import { useAppStore } from '../../store/appStore';
import { useToast } from '../../store/toastStore';
import { formatBytes } from '../../utils/formatters';
import { SettingsTabs } from './SettingsTabs';

export function DataManagementPage() {
  const data = useAppStore((s) => s.data);
  const resetToDemoData = useAppStore((s) => s.resetToDemoData);
  const toast = useToast();

  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const storageBytes = storageService.getStorageUsageBytes();

  const handleExportJson = () => {
    const res = storageService.exportData();
    if (!res.success || !res.data) {
      toast.error('Export failed', res.error ?? 'Could not serialize local data.');
      return;
    }
    const blob = new Blob([res.data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NexaDesk_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('JSON backup exported', 'Downloaded complete NexaDesk dataset.');
  };

  const handleConfirmReset = () => {
    const res = resetToDemoData();
    setResetDialogOpen(false);
    if (res.success) {
      toast.success(
        'Workspace reset to demo data',
        'A backup snapshot was stored before resetting.'
      );
    } else {
      toast.error('Reset failed', res.error ?? 'Unable to reset local storage.');
    }
  };

  const entityCounts = [
    { label: 'Products', count: data?.products.length ?? 0 },
    { label: 'Categories', count: data?.categories.length ?? 0 },
    { label: 'Suppliers', count: data?.suppliers.length ?? 0 },
    { label: 'Inventory Movements', count: data?.inventoryMovements.length ?? 0 },
    { label: 'Transactions', count: data?.transactions.length ?? 0 },
    { label: 'Customers', count: data?.customers.length ?? 0 },
    { label: 'Employees', count: data?.employees.length ?? 0 },
    { label: 'Expenses', count: data?.expenses.length ?? 0 },
    { label: 'Other Income', count: data?.income.length ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Management"
        description="Inspect local persistence health, export JSON backups, or reset demo state."
      />
      <SettingsTabs />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Local Storage Snapshot</CardTitle>
              <CardDescription>
                Single source of truth stored under <code className="font-mono">nexadesk_data</code>.
              </CardDescription>
            </div>
            <span className="font-mono text-[13px] font-semibold text-[#234F80] tabular-nums">
              {formatBytes(storageBytes)}
            </span>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {entityCounts.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5"
                >
                  <p className="text-[12px] text-[#64748B]">{item.label}</p>
                  <p className="mt-0.5 text-[18px] font-semibold text-[#0F172A] tabular-nums">
                    {item.count}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Backup & Recovery Actions</CardTitle>
              <CardDescription>
                Full JSON import preview and multi-sheet Excel export arrive in Phase 4.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-[#E2E8F0] p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-[14px] font-medium text-[#1E293B]">
                  Export JSON Backup
                </p>
                <p className="text-[12px] text-[#64748B] mt-0.5">
                  Download the complete validated dataset as a portable JSON file.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportJson}
                leftIcon={<Download className="h-4 w-4" />}
              >
                Export
              </Button>
            </div>

            <div className="rounded-xl border border-[#F5C2C2] bg-[#FDECEC]/40 p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-[14px] font-medium text-[#1E293B]">
                  Reset Demo Data
                </p>
                <p className="text-[12px] text-[#64748B] mt-0.5">
                  Re-seed Nexa Coffee House defaults after creating a local backup snapshot.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setResetDialogOpen(true)}
                leftIcon={<RotateCcw className="h-4 w-4" />}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset to Nexa Coffee House Demo Data?"
        description="This will replace your current workspace records with the clean initial demo dataset. A local backup snapshot will be saved automatically before resetting."
        confirmLabel="Reset Workspace"
        variant="danger"
      />
    </div>
  );
}
