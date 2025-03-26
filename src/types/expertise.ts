import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireExpertiseText = requiredTextWithNamespace('expertise');

// Chuyên môn
// storeId
// branchId
// id
// code
// name
// note
// is_active

export const expertiseSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireExpertiseText('code'),

      invalid_type_error: requireExpertiseText('code'),
    })
    .min(1, { message: requireExpertiseText('code') }),
  name: z

    .string({
      required_error: requireExpertiseText('name'),
      invalid_type_error: requireExpertiseText('name'),
    })
    .min(1, { message: requireExpertiseText('name') }),

  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type Expertise = z.infer<typeof expertiseSchema>;
