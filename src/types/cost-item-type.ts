import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireCostItemTypeText = requiredTextWithNamespace('costItemType');

// loại chi phí
// storeId
// branchId
// id
// code
// name
// note
// is_active

export const costItemTypeSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireCostItemTypeText('code'),
      invalid_type_error: requireCostItemTypeText('code'),
    })
    .min(1, { message: requireCostItemTypeText('code') }),
  name: z
    .string({
      required_error: requireCostItemTypeText('name'),
      invalid_type_error: requireCostItemTypeText('name'),
    })
    .min(1, { message: requireCostItemTypeText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type CostItemType = z.infer<typeof costItemTypeSchema>;
