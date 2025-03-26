import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireProjectOwnerText = requiredTextWithNamespace('projectOwner');
// chủ đầu tư
// storeId
// branchId
// id
// code
// name
// note
// is_active

export const projectOwnerSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireProjectOwnerText('code'),
      invalid_type_error: requireProjectOwnerText('code'),
    })
    .min(1, { message: requireProjectOwnerText('code') }),
  name: z
    .string({
      required_error: requireProjectOwnerText('name'),
      invalid_type_error: requireProjectOwnerText('name'),
    })
    .min(1, { message: requireProjectOwnerText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type ProjectOwner = z.infer<typeof projectOwnerSchema>;
