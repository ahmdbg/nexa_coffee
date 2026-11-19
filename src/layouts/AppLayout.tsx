import { Outlet } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { storageService } from '../services/storageService';
import { ErrorState } from '../components/common/ErrorState';
import { Skeleton } from '../components/common/LoadingState';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';

export function AppLayout() {
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const isLoading = useAppStore((s) => s.isLoading);
  const error = useAppStore((s) => s.error);
  const data = useAppStore((s) => s.data);
  const resetToDemoData = useAppStore((s) => s.resetToDemoData);
  const restoreFromBackup = useAppStore((s) => s.restoreFromBackup);
  const corruptedRawData = useAppStore((s) => s.corruptedRawData);

  const handleDownloadCorrupted = () => {
    if (!corruptedRawData) return;
    const blob = new Blob([corruptedRawData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexadesk-corrupted-snapshot-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-[#1E293B]">
      <Sidebar />

      <div
        className="min-h-screen flex flex-col transition-[padding-left] duration-200 lg:pl-[var(--sidebar-offset)]"
        style={
          {
            '--sidebar-offset': sidebarCollapsed
              ? 'var(--sidebar-collapsed-width)'
              : 'var(--sidebar-width)',
          } as React.CSSProperties
        }
      >
        <Header />

        <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-10 w-64" />
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
              <Skeleton className="h-80" />
            </div>
          ) : error && !data ? (
            <div className="py-12">
              <ErrorState
                title="Local Storage Recovery Required"
                message={error}
                primaryActionLabel="Reset to Demo Data"
                onPrimaryAction={() => resetToDemoData()}
                secondaryActionLabel={
                  corruptedRawData
                    ? 'Download Raw Snapshot'
                    : storageService.restoreBackup().success
                    ? 'Restore Previous Backup'
                    : undefined
                }
                onSecondaryAction={
                  corruptedRawData ? handleDownloadCorrupted : () => restoreFromBackup()
                }
              />
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
