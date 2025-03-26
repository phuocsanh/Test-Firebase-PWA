import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireContractAppendixTypeText = requiredTextWithNamespace('contractAppendixType');

// Loại PLHĐ
// storeId
// branchId
// id
// code
// name
// note
// is_active

export const contractAppendixTypeSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireContractAppendixTypeText('code'),
      invalid_type_error: requireContractAppendixTypeText('code'),
    })
    .min(1, { message: requireContractAppendixTypeText('code') }),
  name: z
    .string({
      required_error: requireContractAppendixTypeText('name'),
      invalid_type_error: requireContractAppendixTypeText('name'),
    })
    .min(1, { message: requireContractAppendixTypeText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type ContractAppendixType = z.infer<typeof contractAppendixTypeSchema>;
