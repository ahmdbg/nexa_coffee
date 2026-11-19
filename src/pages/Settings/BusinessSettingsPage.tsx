import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PageHeader } from '../../components/common';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Select,
  Textarea,
} from '../../components/ui';
import { CURRENCY_OPTIONS } from '../../constants';
import { useAppStore } from '../../store/appStore';
import { useToast } from '../../store/toastStore';
import { SettingsTabs } from './SettingsTabs';

const businessFormSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  category: z.string().min(2, 'Business category is required'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  currency: z.string().min(3),
});

type BusinessFormValues = z.infer<typeof businessFormSchema>;

export function BusinessSettingsPage() {
  const data = useAppStore((s) => s.data);
  const isSaving = useAppStore((s) => s.isSaving);
  const updateBusinessProfile = useAppStore((s) => s.updateBusinessProfile);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      name: data?.business.name ?? '',
      category: data?.business.category ?? '',
      email: data?.business.email ?? '',
      phone: data?.business.phone ?? '',
      address: data?.business.address ?? '',
      description: data?.business.description ?? '',
      currency: data?.business.currency ?? 'USD',
    },
  });

  useEffect(() => {
    if (data?.business) {
      reset({
        name: data.business.name,
        category: data.business.category,
        email: data.business.email ?? '',
        phone: data.business.phone ?? '',
        address: data.business.address ?? '',
        description: data.business.description ?? '',
        currency: data.business.currency,
      });
    }
  }, [data?.business, reset]);

  const onSubmit = (values: BusinessFormValues) => {
    const res = updateBusinessProfile(values);
    if (res.success) {
      toast.success('Business profile saved', 'Changes persisted to Local Storage.');
    } else {
      toast.error('Save failed', res.error ?? 'Unable to save business profile.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage business identity, regional defaults, and local data lifecycle."
      />
      <SettingsTabs />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card className="max-w-3xl">
          <CardHeader>
            <div>
              <CardTitle>Business Profile</CardTitle>
              <CardDescription>
                This identity appears across the sidebar, receipts, and exported reports.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Business Name"
                error={errors.name?.message}
                {...register('name')}
              />
              <Input
                label="Business Category"
                error={errors.category?.message}
                {...register('category')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Business Email"
                type="email"
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label="Phone Number"
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Street Address"
                error={errors.address?.message}
                {...register('address')}
              />
              <Select
                label="Primary Currency"
                options={CURRENCY_OPTIONS.map((c) => ({
                  value: c.code,
                  label: c.label,
                }))}
                error={errors.currency?.message}
                {...register('currency')}
              />
            </div>

            <Textarea
              label="Business Description"
              rows={3}
              error={errors.description?.message}
              {...register('description')}
            />
          </CardContent>
          <CardFooter>
            <span className="text-[12px] text-[#64748B]">
              Persisted automatically to <code className="font-mono">nexadesk_data</code>
            </span>
            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                disabled={!isDirty || isSaving}
                onClick={() => reset()}
              >
                Discard
              </Button>
              <Button type="submit" isLoading={isSaving} disabled={!isDirty}>
                Save Changes
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
