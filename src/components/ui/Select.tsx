import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, helperText, error, options, placeholder, className, id, disabled, ...props },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-[13px] font-medium text-[#334155]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            className={cn(
              'h-10 w-full appearance-none rounded-lg border bg-white pl-3 pr-9 text-[14px] text-[#1E293B] transition-colors duration-150',
              'focus:outline-none focus:border-[#4C83C3] focus:ring-2 focus:ring-[#4C83C3]/15',
              'disabled:bg-[#F8FAFC] disabled:text-[#64748B] disabled:border-[#CBD5E1] disabled:cursor-not-allowed',
              error
                ? 'border-[#DC5555] focus:border-[#DC5555] focus:ring-[#DC5555]/15'
                : 'border-[#E2E8F0] hover:border-[#CBD5E1]',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]"
            aria-hidden="true"
          />
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

Select.displayName = 'Select';
