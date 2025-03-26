import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireWorkPositionText = requiredTextWithNamespace('workPosition');

// vị trí làm việc
// storeId
// branchId
// id
// code

// name
// note
// is_active

export const workPositionSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),

  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireWorkPositionText('code'),
      invalid_type_error: requireWorkPositionText('code'),
    })
    .min(1, { message: requireWorkPositionText('code') }),

  name: z
    .string({
      required_error: requireWorkPositionText('name'),
      invalid_type_error: requireWorkPositionText('name'),
    })
    .min(1, { message: requireWorkPositionText('name') }),

  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type WorkPosition = z.infer<typeof workPositionSchema>;
