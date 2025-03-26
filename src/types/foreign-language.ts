import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireForeignLanguageText = requiredTextWithNamespace('foreignLanguage');

// ngoại ngữ
// storeId
// branchId
// id
// code
// name
// note
// is_active

export const foreignLanguageSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireForeignLanguageText('code'),
      invalid_type_error: requireForeignLanguageText('code'),
    })
    .min(1, { message: requireForeignLanguageText('code') }),
  name: z
    .string({
      required_error: requireForeignLanguageText('name'),
      invalid_type_error: requireForeignLanguageText('name'),
    })
    .min(1, { message: requireForeignLanguageText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type ForeignLanguage = z.infer<typeof foreignLanguageSchema>;
