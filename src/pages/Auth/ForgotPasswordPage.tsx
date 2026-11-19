import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { Button, Input } from '../../components/ui';
import { useToast } from '../../store/toastStore';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotValues = z.infer<typeof forgotSchema>;

export function ForgotPasswordPage() {
  const toast = useToast();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = (values: ForgotValues) => {
    setSubmittedEmail(values.email);
    toast.info('Demo recovery notice', 'Local-first mode does not send external emails.');
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-semibold text-[#0F172A]">Reset Password</h1>
        <p className="mt-1 text-[13px] text-[#64748B]">
          Simulated password recovery for local-first workspaces.
        </p>
      </div>

      {submittedEmail ? (
        <div className="rounded-xl border border-[#C9DDF2] bg-[#EAF2FA] p-4 text-[13px] text-[#234F80] space-y-2">
          <p className="font-medium">Recovery request recorded (demo simulation)</p>
          <p>
            In a production backend setup, reset instructions would be sent to{' '}
            <span className="font-semibold">{submittedEmail}</span>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            label="Registered Email"
            type="email"
            placeholder="owner@business.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Button type="submit" className="w-full">
            Simulate Recovery Email
          </Button>
        </form>
      )}

      <p className="text-center text-[13px]">
        <Link to="/login" className="font-medium text-[#234F80] hover:underline">
          Back to Sign In
        </Link>
      </p>
    </div>
  );
}
