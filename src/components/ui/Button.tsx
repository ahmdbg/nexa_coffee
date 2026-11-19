import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-[#234F80] text-white border border-[#234F80] hover:bg-[#14243A] hover:border-[#14243A] active:bg-[#101E30] disabled:bg-[#94A3B8] disabled:border-[#94A3B8]',
  secondary:
    'bg-[#EAF2FA] text-[#234F80] border border-[#D4E4F4] hover:bg-[#DCEAF7] active:bg-[#CFE1F3] disabled:bg-[#F1F5F9] disabled:text-[#94A3B8] disabled:border-[#E2E8F0]',
  outline:
    'bg-white text-[#1E293B] border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] active:bg-[#F1F5F9] disabled:text-[#94A3B8] disabled:bg-[#F8FAFC]',
  ghost:
    'bg-transparent text-[#475569] border border-transparent hover:bg-[#F1F5F9] hover:text-[#1E293B] active:bg-[#E2E8F0] disabled:text-[#94A3B8]',
  destructive:
    'bg-[#DC5555] text-white border border-[#DC5555] hover:bg-[#C44545] hover:border-[#C44545] active:bg-[#AE3B3B] disabled:bg-[#F1B5B5] disabled:border-[#F1B5B5]',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[13px] gap-1.5',
  md: 'h-10 px-4 text-[14px] gap-2',
  lg: 'h-12 px-5 text-[15px] gap-2.5',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      className,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4C83C3]',
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
        ) : (
          leftIcon && <span className="shrink-0 inline-flex">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="shrink-0 inline-flex">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
