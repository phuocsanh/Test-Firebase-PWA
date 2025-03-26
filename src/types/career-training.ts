import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireCareerTrainingText = requiredTextWithNamespace('careerTraining');

// bồi dưỡng nghiệp vụ
// storeId
// branchId
// id
// code

// name
// note
// is_active
export const careerTrainingSchema = z.object({
  id: z.number(),

  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireCareerTrainingText('code'),
      invalid_type_error: requireCareerTrainingText('code'),
    })
    .min(1, { message: requireCareerTrainingText('code') }),
  name: z

    .string({
      required_error: requireCareerTrainingText('name'),
      invalid_type_error: requireCareerTrainingText('name'),
    })
    .min(1, { message: requireCareerTrainingText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type CareerTraining = z.infer<typeof careerTrainingSchema>;
