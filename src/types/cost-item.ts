import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

const requireCostItemText = requiredTextWithNamespace('costItem');
export const costItemSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  parentId: z.number().nullable(),
  costItemTypeId: z
    .number({
      required_error: requireCostItemText('costItemTypeId'),
      invalid_type_error: requireCostItemText('costItemTypeId'),
    })
    .min(1, { message: requireCostItemText('costItemTypeId') }),
  // .nullable(),
  projectId: z
    .number({
      required_error: requireCostItemText('projectId'),
      invalid_type_error: requireCostItemText('projectId'),
    })
    .min(1, { message: requireCostItemText('projectId') }),
  // .nullable(),
  code: z
    .string({
      required_error: requireCostItemText('code'),
      invalid_type_error: requireCostItemText('code'),
    })
    .min(1, { message: requireCostItemText('code') }),
  name: z
    .string({
      required_error: requireCostItemText('name'),
      invalid_type_error: requireCostItemText('name'),
    })
    .min(1, { message: requireCostItemText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type CostItem = z.infer<typeof costItemSchema>;
