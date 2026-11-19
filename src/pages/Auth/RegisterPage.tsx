import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button, Input } from '../../components/ui';
import { useAppStore } from '../../store/appStore';
import { useToast } from '../../store/toastStore';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  businessName: z.string().min(2, 'Business name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const updateBusinessProfile = useAppStore((s) => s.updateBusinessProfile);
  const loginDemo = useAppStore((s) => s.loginDemo);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      businessName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    updateBusinessProfile({
      name: values.businessName,
      email: values.email,
    });
    loginDemo();
    toast.success('Workspace configured', `${values.businessName} is ready.`);
    navigate('/app/dashboard');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <h1 className="text-[22px] font-semibold text-[#0F172A]">
          Create Business Workspace
        </h1>
        <p className="mt-1 text-[13px] text-[#64748B]">
          Initialize your local NexaDesk profile in seconds.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Owner Full Name"
          placeholder="Elena Vance"
          error={errors.fullName?.message}
          {...register('fullName')}
        />
        <Input
          label="Business Name"
          placeholder="Nexa Coffee House"
          error={errors.businessName?.message}
          {...register('businessName')}
        />
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
          placeholder="Minimum 6 characters"
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Create Workspace
      </Button>

      <p className="text-center text-[13px] text-[#64748B]">
        Already have a workspace?{' '}
        <Link to="/login" className="font-medium text-[#234F80] hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
