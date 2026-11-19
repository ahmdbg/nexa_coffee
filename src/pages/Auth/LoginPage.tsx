import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button, Input } from '../../components/ui';
import { useAppStore } from '../../store/appStore';
import { useToast } from '../../store/toastStore';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const loginDemo = useAppStore((s) => s.loginDemo);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'elena@nexacoffee.example',
      password: 'demo-password',
    },
  });

  const onSubmit = () => {
    loginDemo();
    toast.success('Signed in to NexaDesk', 'Loaded Nexa Coffee House workspace.');
    navigate('/app/dashboard');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <h1 className="text-[22px] font-semibold text-[#0F172A]">Sign in to NexaDesk</h1>
        <p className="mt-1 text-[13px] text-[#64748B]">
          Access your local-first business operations workspace.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="owner@business.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      <div className="flex items-center justify-between text-[13px]">
        <Link
          to="/forgot-password"
          className="font-medium text-[#234F80] hover:underline"
        >
          Forgot password?
        </Link>
        <Link to="/register" className="text-[#64748B] hover:text-[#1E293B]">
          Create workspace
        </Link>
      </div>

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Sign In to Workspace
      </Button>
    </form>
  );
}
