import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { regexCode } from '@/lib/utils';
import { z } from 'zod';

export const requireDocumentDecisionText = requiredTextWithNamespace('documentDecision');

export const documentDecisionSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireDocumentDecisionText('code'),
      invalid_type_error: requireDocumentDecisionText('code'),
    })
    .min(1, { message: requireDocumentDecisionText('code') })
    .regex(regexCode, { message: requireDocumentDecisionText('error.code_invalid') }),
  name: z

    .string({
      required_error: requireDocumentDecisionText('name'),
      invalid_type_error: requireDocumentDecisionText('name'),
    })
    .min(1, { message: requireDocumentDecisionText('name') }),
  content: z
    .string({
      required_error: requireDocumentDecisionText('content'),
      invalid_type_error: requireDocumentDecisionText('content'),
    })
    .min(1, { message: requireDocumentDecisionText('content') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type DocumentDecision = z.infer<typeof documentDecisionSchema>;

export const defaultValuesDocumentDecision: DocumentDecision = {
  storeId: null,
  branchId: null,
  id: 0,
  code: '',
  name: '',
  content: '',
  isActive: false,
};
