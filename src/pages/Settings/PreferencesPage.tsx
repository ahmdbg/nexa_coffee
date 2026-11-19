import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
} from '../../components/ui';
import { useAppStore } from '../../store/appStore';
import { useToast } from '../../store/toastStore';
import { SettingsTabs } from './SettingsTabs';

const preferencesSchema = z.object({
  dateFormat: z.enum(['dd/MM/yyyy', 'MM/dd/yyyy', 'yyyy-MM-dd']),
  taxEnabled: z.boolean(),
  taxRate: z.number().min(0, 'Tax rate cannot be negative').max(100, 'Max 100%'),
  lowStockAlertEnabled: z.boolean(),
  notificationsEnabled: z.boolean(),
});

type PreferencesValues = z.infer<typeof preferencesSchema>;

export function PreferencesPage() {
  const data = useAppStore((s) => s.data);
  const isSaving = useAppStore((s) => s.isSaving);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const toast = useToast();

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<PreferencesValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      dateFormat: data?.settings.dateFormat ?? 'dd/MM/yyyy',
      taxEnabled: data?.settings.taxEnabled ?? true,
      taxRate: data?.settings.taxRate ?? 10,
      lowStockAlertEnabled: data?.settings.lowStockAlertEnabled ?? true,
      notificationsEnabled: data?.settings.notificationsEnabled ?? true,
    },
  });

  useEffect(() => {
    if (data?.settings) {
      reset({
        dateFormat: data.settings.dateFormat,
        taxEnabled: data.settings.taxEnabled,
        taxRate: data.settings.taxRate,
        lowStockAlertEnabled: data.settings.lowStockAlertEnabled,
        notificationsEnabled: data.settings.notificationsEnabled,
      });
    }
  }, [data?.settings, reset]);

  const taxEnabled = watch('taxEnabled');

  const onSubmit = (values: PreferencesValues) => {
    const res = updateSettings(values);
    if (res.success) {
      toast.success('Preferences updated', 'Tax and alert preferences saved.');
    } else {
      toast.error('Update failed', res.error ?? 'Unable to save preferences.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure regional formatting, tax behavior, and notification rules."
      />
      <SettingsTabs />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card className="max-w-3xl">
          <CardHeader>
            <div>
              <CardTitle>Application Preferences</CardTitle>
              <CardDescription>
                Defaults applied across POS checkout, reports, and inventory monitoring.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Date Display Format"
                options={[
                  { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY (19/11/2026)' },
                  { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY (11/19/2026)' },
                  { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD (2026-11-19)' },
                ]}
                {...register('dateFormat')}
              />

              <Input
                label="Default Sales Tax Rate (%)"
                type="number"
                step="0.5"
                disabled={!taxEnabled}
                error={errors.taxRate?.message}
                {...register('taxRate', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-3 pt-2 border-t border-[#E2E8F0]">
              <Controller
                control={control}
                name="taxEnabled"
                render={({ field }) => (
                  <label className="flex items-center justify-between gap-4 py-2 cursor-pointer">
                    <div>
                      <p className="text-[14px] font-medium text-[#1E293B]">
                        Enable POS Tax Calculation
                      </p>
                      <p className="text-[12px] text-[#64748B]">
                        Automatically apply default tax percentage during checkout.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-[#CBD5E1] text-[#234F80]"
                    />
                  </label>
                )}
              />

              <Controller
                control={control}
                name="lowStockAlertEnabled"
                render={({ field }) => (
                  <label className="flex items-center justify-between gap-4 py-2 cursor-pointer">
                    <div>
                      <p className="text-[14px] font-medium text-[#1E293B]">
                        Low Stock Monitoring
                      </p>
                      <p className="text-[12px] text-[#64748B]">
                        Flag products on Dashboard when stock reaches minimum threshold.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-[#CBD5E1] text-[#234F80]"
                    />
                  </label>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <span className="text-[12px] text-[#64748B]">Local workspace preferences</span>
            <Button type="submit" isLoading={isSaving} disabled={!isDirty}>
              Save Preferences
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
