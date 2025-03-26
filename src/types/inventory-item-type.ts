import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireInventoryItemTypeText = requiredTextWithNamespace('inventoryItemType');
export const inventoryItemTypeSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireInventoryItemTypeText('code'),
      invalid_type_error: requireInventoryItemTypeText('code'),
    })
    .min(1, { message: requireInventoryItemTypeText('code') }),
  name: z
    .string({
      required_error: requireInventoryItemTypeText('name'),
      invalid_type_error: requireInventoryItemTypeText('name'),
    })
    .min(1, { message: requireInventoryItemTypeText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type InventoryItemType = z.infer<typeof inventoryItemTypeSchema>;
