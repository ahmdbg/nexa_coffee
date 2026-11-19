import React, { useId } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightElement,
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[13px] font-medium text-[#334155]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 text-[#94A3B8] inline-flex">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            className={cn(
              'h-10 w-full rounded-lg border bg-white px-3 text-[14px] text-[#1E293B] placeholder:text-[#94A3B8] transition-colors duration-150',
              'focus:outline-none focus:border-[#4C83C3] focus:ring-2 focus:ring-[#4C83C3]/15',
              'disabled:bg-[#F8FAFC] disabled:text-[#64748B] disabled:border-[#CBD5E1] disabled:cursor-not-allowed',
              error
                ? 'border-[#DC5555] focus:border-[#DC5555] focus:ring-[#DC5555]/15'
                : 'border-[#E2E8F0] hover:border-[#CBD5E1]',
              leftIcon && 'pl-9',
              rightElement && 'pr-10',
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-2.5 flex items-center">{rightElement}</div>
          )}
        </div>
        {error ? (
          <p className="text-[12px] text-[#DC5555]" role="alert">
            {error}
          </p>
        ) : (
          helperText && <p className="text-[12px] text-[#64748B]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
