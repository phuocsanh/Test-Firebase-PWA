import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireWardText = requiredTextWithNamespace('ward');

// phườn, xã, thị trấn
// storeId
// branchId
// id
// districtId
// code
// name
// note
// isActive

export const wardSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  districtId: z
    .number({
      required_error: requireWardText('districtId'),
      invalid_type_error: requireWardText('districtId'),
    })
    .min(1, { message: requireWardText('districtId') }),
  code: z
    .string({
      required_error: requireWardText('code'),
      invalid_type_error: requireWardText('code'),
    })
    .min(1, { message: requireWardText('code') }),

  name: z
    .string({
      required_error: requireWardText('name'),
      invalid_type_error: requireWardText('name'),
    })
    .min(1, { message: requireWardText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type Ward = z.infer<typeof wardSchema>;
