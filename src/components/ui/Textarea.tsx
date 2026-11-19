import React, { useId } from 'react';
import { cn } from '../../utils/cn';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, className, id, disabled, rows = 3, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-[13px] font-medium text-[#334155]"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={cn(
            'w-full rounded-lg border bg-white px-3 py-2.5 text-[14px] text-[#1E293B] placeholder:text-[#94A3B8] transition-colors duration-150',
            'focus:outline-none focus:border-[#4C83C3] focus:ring-2 focus:ring-[#4C83C3]/15',
            'disabled:bg-[#F8FAFC] disabled:text-[#64748B] disabled:border-[#CBD5E1] disabled:cursor-not-allowed',
            error
              ? 'border-[#DC5555] focus:border-[#DC5555] focus:ring-[#DC5555]/15'
              : 'border-[#E2E8F0] hover:border-[#CBD5E1]',
            className
          )}
          {...props}
        />
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

Textarea.displayName = 'Textarea';
