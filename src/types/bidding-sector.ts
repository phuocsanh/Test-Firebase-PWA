import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireBiddingSectorText = requiredTextWithNamespace('biddingSector');

// Lĩnh vực đấu thầu
// storeId
// branchId
// id
// code
// name
// note
// is_active

export const biddingSectorSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireBiddingSectorText('code'),
      invalid_type_error: requireBiddingSectorText('code'),
    })
    .min(1, { message: requireBiddingSectorText('code') }),
  name: z
    .string({
      required_error: requireBiddingSectorText('name'),
      invalid_type_error: requireBiddingSectorText('name'),
    })
    .min(1, { message: requireBiddingSectorText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type BiddingSector = z.infer<typeof biddingSectorSchema>;
