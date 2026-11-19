import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center px-6 py-12 rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC]',
        className
      )}
    >
      <div className="h-12 w-12 rounded-xl bg-white border border-[#E2E8F0] text-[#64748B] flex items-center justify-center mb-4">
        {icon ?? <Inbox className="h-6 w-6" aria-hidden="true" />}
      </div>
      <h4 className="text-[15px] font-semibold text-[#1E293B]">{title}</h4>
      <p className="mt-1.5 text-[13px] text-[#64748B] max-w-sm leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button className="mt-5" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
