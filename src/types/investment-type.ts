import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { regexCode } from '@/lib/utils';
import { z } from 'zod';

export const requireInvestmentTypeText = requiredTextWithNamespace('investmentType');

export const investmentTypeSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireInvestmentTypeText('code'),
      invalid_type_error: requireInvestmentTypeText('code'),
    })
    .min(1, { message: requireInvestmentTypeText('code') })
    .regex(regexCode, { message: requireInvestmentTypeText('error.code_invalid') }),
  name: z
    .string({
      required_error: requireInvestmentTypeText('name'),
      invalid_type_error: requireInvestmentTypeText('name'),
    })
    .min(1, { message: requireInvestmentTypeText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type InvestmentType = z.infer<typeof investmentTypeSchema>;

export const defaultValuesInvestmentType: InvestmentType = {
  id: 0,
  branchId: null,
  storeId: null,
  code: '',
  name: '',
  note: '',
  isActive: true,
};
