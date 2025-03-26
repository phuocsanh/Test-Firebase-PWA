import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireEvaluationResultText = requiredTextWithNamespace('evaluationResult');

// kết quả, đánh giá, xếp loại
// storeId
// branchId
// id
// code
// name
// note
// is_active

export const evaluationResultSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireEvaluationResultText('code'),
      invalid_type_error: requireEvaluationResultText('code'),
    })
    .min(1, { message: requireEvaluationResultText('code') }),
  name: z
    .string({
      required_error: requireEvaluationResultText('name'),
      invalid_type_error: requireEvaluationResultText('name'),
    })
    .min(1, { message: requireEvaluationResultText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type EvaluationResult = z.infer<typeof evaluationResultSchema>;
