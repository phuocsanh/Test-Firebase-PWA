import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

const requireAccountFundText = requiredTextWithNamespace('accountFund'); 
export const accountFundSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  parentId:z.number().nullable(), 
  accountFundType: z.number().nullable(),
  initialFunds: z.number().nullable(),
  balanceType: z.number().nullable(),
  code: z
    .string({
      required_error: requireAccountFundText('code'),
      invalid_type_error: requireAccountFundText('code'),
    })
    .min(1, { message: requireAccountFundText('code') }),
  name: z
    .string({
      required_error: requireAccountFundText('name'),
      invalid_type_error: requireAccountFundText('name'),
    })
    .min(1, { message: requireAccountFundText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true), 
});

export type AccountFund = z.infer<typeof accountFundSchema>;
