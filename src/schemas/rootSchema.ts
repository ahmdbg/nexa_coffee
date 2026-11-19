import { z } from 'zod';
import { CURRENT_SCHEMA_VERSION } from '../constants';
import {
  appSettingsSchema,
  auditLogSchema,
  businessSchema,
  categorySchema,
  customerSchema,
  employeeSchema,
  expenseSchema,
  incomeSchema,
  inventoryMovementSchema,
  notificationSchema,
  productSchema,
  supplierSchema,
  transactionSchema,
} from './entities';

export const nexadeskDataSchema = z
  .object({
    schemaVersion: z.number().int().min(1).max(CURRENT_SCHEMA_VERSION),
    business: businessSchema,
    settings: appSettingsSchema,
    products: z.array(productSchema),
    categories: z.array(categorySchema),
    suppliers: z.array(supplierSchema),
    inventoryMovements: z.array(inventoryMovementSchema),
    transactions: z.array(transactionSchema),
    customers: z.array(customerSchema),
    employees: z.array(employeeSchema),
    expenses: z.array(expenseSchema),
    income: z.array(incomeSchema),
    notifications: z.array(notificationSchema),
    auditLogs: z.array(auditLogSchema),
  })
  .superRefine((data, ctx) => {
    const hasDuplicates = (ids: string[]) => new Set(ids).size !== ids.length;

    if (hasDuplicates(data.products.map((p) => p.id))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Duplicate product IDs detected.',
        path: ['products'],
      });
    }
    if (hasDuplicates(data.categories.map((c) => c.id))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Duplicate category IDs detected.',
        path: ['categories'],
      });
    }
    if (hasDuplicates(data.transactions.map((t) => t.id))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Duplicate transaction IDs detected.',
        path: ['transactions'],
      });
    }

    const categoryIds = new Set(data.categories.map((c) => c.id));
    data.products.forEach((product, idx) => {
      if (!categoryIds.has(product.categoryId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Product "${product.name}" references unknown categoryId "${product.categoryId}".`,
          path: ['products', idx, 'categoryId'],
        });
      }
    });

    const productIds = new Set(data.products.map((p) => p.id));
    data.inventoryMovements.forEach((movement, idx) => {
      if (!productIds.has(movement.productId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Inventory movement "${movement.id}" references unknown productId "${movement.productId}".`,
          path: ['inventoryMovements', idx, 'productId'],
        });
      }
    });

    data.transactions.forEach((tx, tIdx) => {
      tx.items.forEach((item, iIdx) => {
        if (!productIds.has(item.productId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Transaction "${tx.transactionNumber}" item references unknown productId "${item.productId}".`,
            path: ['transactions', tIdx, 'items', iIdx, 'productId'],
          });
        }
      });
    });
  });

export type ValidatedNexaDeskData = z.infer<typeof nexadeskDataSchema>;
