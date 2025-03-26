import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireMajorText = requiredTextWithNamespace('major');

// chuyen nganh
// storeId
// branchId
// id
// code
// name
// note
// is_active
export const majorSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireMajorText('code'),
      invalid_type_error: requireMajorText('code'),
    })
    .min(1, { message: requireMajorText('code') }),
  name: z
    .string({
      required_error: requireMajorText('name'),
      invalid_type_error: requireMajorText('name'),
    })
    .min(1, { message: requireMajorText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type Major = z.infer<typeof majorSchema>;
