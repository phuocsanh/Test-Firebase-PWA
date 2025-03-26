import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireAgencyText = requiredTextWithNamespace('agency');

// cơ quan ban hàng
// storeId
// branchId
// id
// code
// name
// note
// is_active

export const agencySchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireAgencyText('code'),
      invalid_type_error: requireAgencyText('code'),
    })
    .min(1, { message: requireAgencyText('code') }),
  name: z
    .string({
      required_error: requireAgencyText('name'),
      invalid_type_error: requireAgencyText('name'),
    })
    .min(1, { message: requireAgencyText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type Agency = z.infer<typeof agencySchema>;
