import React from 'react';
import { cn } from '../../utils/cn';

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-4',
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="text-[24px] sm:text-[28px] font-semibold text-[#0F172A] tracking-tight leading-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-[14px] text-[#64748B] max-w-2xl">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">{actions}</div>
      )}
    </div>
  );
}
