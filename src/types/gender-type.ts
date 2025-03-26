import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireGenderText = requiredTextWithNamespace('genderType');
// giới tính
// storeId
// branchId
// id
// code

// name
// note
// is_active

export const genderTypeSchema = z.object({
  id: z.number(),

  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireGenderText('code'),
      invalid_type_error: requireGenderText('code'),
    })
    .min(1, { message: requireGenderText('code') }),
  name: z
    .string({
      required_error: requireGenderText('name'),
      invalid_type_error: requireGenderText('name'),
    })
    .min(1, { message: requireGenderText('name') }),

  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type GenderType = z.infer<typeof genderTypeSchema>;
