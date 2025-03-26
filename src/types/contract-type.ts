import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireContractTypeText = requiredTextWithNamespace('contractType');

// loại hợp đồng
// storeId
// branchId
// id
// code
// name
// note
// is_active

export const contractTypeSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireContractTypeText('code'),
      invalid_type_error: requireContractTypeText('code'),
    })
    .min(1, { message: requireContractTypeText('code') }),
  name: z
    .string({
      required_error: requireContractTypeText('name'),
      invalid_type_error: requireContractTypeText('name'),
    })
    .min(1, { message: requireContractTypeText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type ContractType = z.infer<typeof contractTypeSchema>;
