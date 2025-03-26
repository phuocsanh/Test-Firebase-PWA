import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireUnitText = requiredTextWithNamespace('unit');

// đơn vị tính
// storeId
// branchId
// id
// code
// name
// note
// is_active

export const unitSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  code: z
    .string({
      required_error: requireUnitText('code'),
      invalid_type_error: requireUnitText('code'),
    })
    .min(1, { message: requireUnitText('code') }),
  name: z
    .string({
      required_error: requireUnitText('name'),
      invalid_type_error: requireUnitText('name'),
    })
    .min(1, { message: requireUnitText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type Unit = z.infer<typeof unitSchema>;
