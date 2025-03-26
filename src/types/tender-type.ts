import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireTenderTypeText = requiredTextWithNamespace('tenderType');

// Hình thức LCNT
// storeId
// branchId
// id
// code
// name
// note
// is_active

export const tenderTypeSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireTenderTypeText('code'),
      invalid_type_error: requireTenderTypeText('code'),
    })
    .min(1, { message: requireTenderTypeText('code') }),
  name: z
    .string({
      required_error: requireTenderTypeText('name'),
      invalid_type_error: requireTenderTypeText('name'),
    })
    .min(1, { message: requireTenderTypeText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type TenderType = z.infer<typeof tenderTypeSchema>;
