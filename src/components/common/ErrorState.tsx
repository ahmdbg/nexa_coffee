import { AlertOctagon } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
}: ErrorStateProps) {
  return (
    <div className="rounded-xl border border-[#F5C2C2] bg-white p-6 text-center max-w-lg mx-auto">
      <div className="h-11 w-11 rounded-xl bg-[#FDECEC] text-[#DC5555] flex items-center justify-center mx-auto mb-3">
        <AlertOctagon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="text-[16px] font-semibold text-[#1E293B]">{title}</h3>
      <p className="mt-1.5 text-[13px] text-[#64748B] leading-relaxed">{message}</p>
      {(primaryActionLabel || secondaryActionLabel) && (
        <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="outline" size="sm" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
          {primaryActionLabel && onPrimaryAction && (
            <Button variant="primary" size="sm" onClick={onPrimaryAction}>
              {primaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
