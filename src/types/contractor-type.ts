import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireContractorTypeText = requiredTextWithNamespace('contractorType');

// loại nhà thầu
// storeId
// branchId
// id
// code
// name
// note
// is_active

export const contractorTypeSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireContractorTypeText('code'),
      invalid_type_error: requireContractorTypeText('code'),
    })
    .min(1, { message: requireContractorTypeText('code') }),
  name: z
    .string({
      required_error: requireContractorTypeText('name'),
      invalid_type_error: requireContractorTypeText('name'),
    })
    .min(1, { message: requireContractorTypeText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type ContractorType = z.infer<typeof contractorTypeSchema>;
