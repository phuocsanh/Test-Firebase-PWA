import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireStatusText = requiredTextWithNamespace('status');

// phong chuyen mon
// storeId
// branchId
// id
// code
// name
// note
// is_active

export const statusSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireStatusText('code'),
      invalid_type_error: requireStatusText('code'),
    })
    .min(1, { message: requireStatusText('code') }),
  name: z
    .string({
      required_error: requireStatusText('name'),
      invalid_type_error: requireStatusText('name'),
    })
    .min(1, { message: requireStatusText('name') }),
  colorCode: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type Status = z.infer<typeof statusSchema>;
