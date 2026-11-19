import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZE_CLASSES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="nexa-modal-title"
    >
      <div
        className="fixed inset-0 bg-[#14243A]/40 backdrop-blur-[1px] transition-opacity duration-150"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          'relative z-10 w-full rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_20px_40px_-12px_rgba(15,23,42,0.14)] flex flex-col max-h-[90vh]',
          SIZE_CLASSES[size]
        )}
      >
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-[#E2E8F0]">
          <div>
            <h2
              id="nexa-modal-title"
              className="text-[18px] font-semibold text-[#1E293B]"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-[13px] text-[#64748B]">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto nexa-scrollbar">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] rounded-b-2xl flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
