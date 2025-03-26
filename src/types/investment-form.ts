import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { regexCode } from '@/lib/utils';
import { z } from 'zod';

export const requireInvestmentFormText = requiredTextWithNamespace('investmentForm');

export const investmentFormSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireInvestmentFormText('code'),
      invalid_type_error: requireInvestmentFormText('code'),
    })
    .min(1, { message: requireInvestmentFormText('code') })
    .regex(regexCode, { message: requireInvestmentFormText('error.code_invalid') }),
  name: z
    .string({
      required_error: requireInvestmentFormText('name'),
      invalid_type_error: requireInvestmentFormText('name'),
    })
    .min(1, { message: requireInvestmentFormText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type InvestmentForm = z.infer<typeof investmentFormSchema>;

export const defaultValuesInvestmentForm: InvestmentForm = {
  //gán dữ liệu mặc định
  id: 0,
  branchId: null,
  storeId: null,
  code: '',
  name: '',
  note: '',
  isActive: true,
};
