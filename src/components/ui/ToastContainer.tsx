import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { useToastStore, type ToastVariant } from '../../store/toastStore';
import { cn } from '../../utils/cn';

const ICON_MAP: Record<ToastVariant, typeof Info> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const STYLE_MAP: Record<ToastVariant, string> = {
  success: 'border-[#BCEAD2] bg-white text-[#1E293B]',
  error: 'border-[#F5C2C2] bg-white text-[#1E293B]',
  warning: 'border-[#F6D7A7] bg-white text-[#1E293B]',
  info: 'border-[#C9DDF2] bg-white text-[#1E293B]',
};

const ICON_COLOR_MAP: Record<ToastVariant, string> = {
  success: 'text-[#16A36A]',
  error: 'text-[#DC5555]',
  warning: 'text-[#E99A32]',
  info: 'text-[#4C83C3]',
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        const Icon = ICON_MAP[toast.variant];
        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-[0_8px_24px_-4px_rgba(15,23,42,0.1)] transition-all duration-150',
              STYLE_MAP[toast.variant]
            )}
          >
            <Icon
              className={cn('h-5 w-5 shrink-0 mt-0.5', ICON_COLOR_MAP[toast.variant])}
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-[#1E293B]">{toast.title}</p>
              {toast.description && (
                <p className="mt-0.5 text-[13px] text-[#64748B]">{toast.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
              className="h-6 w-6 inline-flex items-center justify-center rounded-md text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F1F5F9] shrink-0 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
