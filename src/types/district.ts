import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireDistrictText = requiredTextWithNamespace('district');

// huyện
// storeId
// branchId
// id
// code
// name

// note
// is_active

export const districtSchema = z.object({
  id: z.number(),

  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireDistrictText('code'),
      invalid_type_error: requireDistrictText('code'),
    })
    .min(1, { message: requireDistrictText('code') }),
  name: z
    .string({
      required_error: requireDistrictText('name'),
      invalid_type_error: requireDistrictText('name'),
    })
    .min(1, { message: requireDistrictText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type District = z.infer<typeof districtSchema>;
