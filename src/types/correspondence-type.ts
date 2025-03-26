import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireCorrespondenceTypeText = requiredTextWithNamespace('correspondenceType');

export const correspondenceTypeSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireCorrespondenceTypeText('code'),
      invalid_type_error: requireCorrespondenceTypeText('code'),
    })
    .min(1, { message: requireCorrespondenceTypeText('code') }),
  name: z
    .string({
      required_error: requireCorrespondenceTypeText('name'),
      invalid_type_error: requireCorrespondenceTypeText('name'),
    })
    .min(1, { message: requireCorrespondenceTypeText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type CorrespondenceType = z.infer<typeof correspondenceTypeSchema>;
