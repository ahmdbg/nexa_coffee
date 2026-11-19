import React from 'react';
import { cn } from '../../utils/cn';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  deltaLabel?: string;
  deltaTone?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  deltaLabel,
  deltaTone = 'neutral',
  icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)] flex flex-col justify-between gap-3',
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-medium text-[#64748B]">{title}</span>
        {icon && (
          <div className="h-9 w-9 rounded-lg bg-[#F4F7FB] border border-[#E2E8F0] text-[#234F80] flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
      </div>
      <div>
        <div className="text-[26px] font-semibold text-[#0F172A] tracking-tight tabular-nums leading-tight">
          {value}
        </div>
        {(subtitle || deltaLabel) && (
          <div className="mt-1.5 flex items-center gap-2 text-[12px]">
            {deltaLabel && (
              <span
                className={cn(
                  'font-medium tabular-nums',
                  deltaTone === 'positive' && 'text-[#16A36A]',
                  deltaTone === 'negative' && 'text-[#DC5555]',
                  deltaTone === 'neutral' && 'text-[#64748B]'
                )}
              >
                {deltaLabel}
              </span>
            )}
            {deltaLabel && subtitle && (
              <span className="text-[#CBD5E1]" aria-hidden="true">
                ·
              </span>
            )}
            {subtitle && <span className="text-[#64748B] truncate">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
