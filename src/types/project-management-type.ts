import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireProjectManagementTypeText = requiredTextWithNamespace('projectManagementType'); 
export const projectManagementTypeSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireProjectManagementTypeText('code'),
      invalid_type_error: requireProjectManagementTypeText('code'),
    })
    .min(1, { message: requireProjectManagementTypeText('code') }),
  name: z
    .string({
      required_error: requireProjectManagementTypeText('name'),
      invalid_type_error: requireProjectManagementTypeText('name'),
    })
    .min(1, { message: requireProjectManagementTypeText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type ProjectManagementType = z.infer<typeof projectManagementTypeSchema>;
