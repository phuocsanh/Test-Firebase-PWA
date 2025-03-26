import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireTrainingInstitutionText = requiredTextWithNamespace('trainingInstitution');
// cơ sở đào tạo
// storeId
// branchId
// id
// code
// name
// phone
// address
// note
// is_active

export const trainingInstitutionSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireTrainingInstitutionText('code'),
      invalid_type_error: requireTrainingInstitutionText('code'),
    })
    .min(1, { message: requireTrainingInstitutionText('code') }),
  name: z
    .string({
      required_error: requireTrainingInstitutionText('name'),
      invalid_type_error: requireTrainingInstitutionText('name'),
    })
    .min(1, { message: requireTrainingInstitutionText('name') }),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type TrainingInstitution = z.infer<typeof trainingInstitutionSchema>;
