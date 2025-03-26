import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requirePositionText = requiredTextWithNamespace('position');

// chức vụ
// storeId
// branchId
// id
// code
// name
// note
// is_active

export const positionSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requirePositionText('code'),
      invalid_type_error: requirePositionText('code'),
    })
    .min(1, { message: requirePositionText('code') }),
  name: z
    .string({
      required_error: requirePositionText('name'),
      invalid_type_error: requirePositionText('name'),
    })
    .min(1, { message: requirePositionText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  isDepartmentHead: z.boolean().default(false),
});

export type Position = z.infer<typeof positionSchema>;
