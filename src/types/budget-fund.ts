import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireBudgetFundText = requiredTextWithNamespace('budgetFund');

export const budgetFundSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  parentId: z.number().nullable(),
  code: z
    .string({
      required_error: requireBudgetFundText('code'),
      invalid_type_error: requireBudgetFundText('code'),
    })
    .min(1, { message: requireBudgetFundText('code') }),
  name: z
    .string({
      required_error: requireBudgetFundText('name'),
      invalid_type_error: requireBudgetFundText('name'),
    })
    .min(1, { message: requireBudgetFundText('name') }),
  budgetSourceCodeIds: z.string().nullable().optional(),
  budgetSourceCodeIdsArray: z.array(z.number()).optional(),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type BudgetFund = z.infer<typeof budgetFundSchema>;
