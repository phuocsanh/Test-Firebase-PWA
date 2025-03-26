import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireInventoryItemText = requiredTextWithNamespace('inventoryItem');

export const inventoryItemSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  unitId: z
    .number({
      required_error: requireInventoryItemText('unitId'),
      invalid_type_error: requireInventoryItemText('unitId'),
    })
    .min(1, { message: requireInventoryItemText('unitId') }),
  assetTypeId: z
    .number({
      required_error: requireInventoryItemText('assetTypeId'),
      invalid_type_error: requireInventoryItemText('assetTypeId'),
    })
    .min(1, { message: requireInventoryItemText('assetTypeId') }),
  code: z
    .string({
      required_error: requireInventoryItemText('code'),
      invalid_type_error: requireInventoryItemText('code'),
    })
    .min(1, { message: requireInventoryItemText('code') }),
  name: z
    .string({
      required_error: requireInventoryItemText('name'),
      invalid_type_error: requireInventoryItemText('name'),
    })
    .min(1, { message: requireInventoryItemText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type InventoryItem = z.infer<typeof inventoryItemSchema>;
