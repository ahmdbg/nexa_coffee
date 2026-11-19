import React from 'react';
import { cn } from '../../utils/cn';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const BADGE_CLASSES: Record<BadgeVariant, string> = {
  success: 'bg-[#E9F8F0] text-[#117A50] border-[#BCEAD2]',
  warning: 'bg-[#FFF5E6] text-[#B36E14] border-[#F6D7A7]',
  danger: 'bg-[#FDECEC] text-[#B83B3B] border-[#F5C2C2]',
  info: 'bg-[#EAF2FA] text-[#234F80] border-[#C9DDF2]',
  neutral: 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]',
};

export function Badge({
  variant = 'neutral',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[12px] font-medium whitespace-nowrap shrink-0',
        BADGE_CLASSES[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
