import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requirePoliticsText = requiredTextWithNamespace('politics');

// chính trị
// storeIds
// branchId
// id
// code
// name
// note
// is_active

export const politicsSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requirePoliticsText('code'),

      invalid_type_error: requirePoliticsText('code'),
    })
    .min(1, { message: requirePoliticsText('code') }),
  name: z
    .string({
      required_error: requirePoliticsText('name'),
      invalid_type_error: requirePoliticsText('name'),
    })
    .min(1, { message: requirePoliticsText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type Politics = z.infer<typeof politicsSchema>;
