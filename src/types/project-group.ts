import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

const requireProjectGroupText = requiredTextWithNamespace('projectGroup');

// nhóm dự án
// storeId
// branchId
// id
// code
// name
// note
// is_active
export const projectGroupSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireProjectGroupText('code'),
      invalid_type_error: requireProjectGroupText('code'),
    })
    .min(1, { message: requireProjectGroupText('code') }),
  name: z
    .string({
      required_error: requireProjectGroupText('name'),
      invalid_type_error: requireProjectGroupText('name'),
    })
    .min(1, { message: requireProjectGroupText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type ProjectGroup = z.infer<typeof projectGroupSchema>;
