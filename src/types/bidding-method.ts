import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireBiddingMethodText = requiredTextWithNamespace('biddingMethod');

// Phương thức LCNT
// storeId
// branchId
// id
// code
// name
// note
// is_active

export const biddingMethodSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireBiddingMethodText('code'),
      invalid_type_error: requireBiddingMethodText('code'),
    })
    .min(1, { message: requireBiddingMethodText('code') }),
  name: z
    .string({
      required_error: requireBiddingMethodText('name'),
      invalid_type_error: requireBiddingMethodText('name'),
    })
    .min(1, { message: requireBiddingMethodText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type BiddingMethod = z.infer<typeof biddingMethodSchema>;
