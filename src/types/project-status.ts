import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireProjectStatusText = requiredTextWithNamespace('projectStatus'); 
export const projectStatusSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireProjectStatusText('code'),
      invalid_type_error: requireProjectStatusText('code'),
    })
    .min(1, { message: requireProjectStatusText('code') }),
  name: z
    .string({
      required_error: requireProjectStatusText('name'),
      invalid_type_error: requireProjectStatusText('name'),
    })
    .min(1, { message: requireProjectStatusText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type ProjectStatus = z.infer<typeof projectStatusSchema>;
