import { cn } from '../../utils/cn';

export interface NexaDeskLogoProps {
  collapsed?: boolean;
  className?: string;
}

export function NexaDeskLogo({ collapsed = false, className }: NexaDeskLogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5 select-none', className)}>
      <div className="h-9 w-9 rounded-lg bg-[#14243A] flex items-center justify-center shrink-0">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M4 17V7L11 14V7"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 7H16.5C18.9853 7 21 9.01472 21 11.5V12.5C21 14.9853 18.9853 17 16.5 17H14V7Z"
            stroke="#4C83C3"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {!collapsed && (
        <span className="font-display text-[18px] font-bold tracking-tight text-[#14243A] whitespace-nowrap shrink-0">
          NexaDesk
        </span>
      )}
    </div>
  );
}
