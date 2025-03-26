import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { regexCode } from '@/lib/utils';
import { z } from 'zod';

export const requireConstructionTypeText = requiredTextWithNamespace('constructionType');

export const constructionTypeSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireConstructionTypeText('code'),
      invalid_type_error: requireConstructionTypeText('code'),
    })
    .min(1, { message: requireConstructionTypeText('code') })
    .regex(regexCode, { message: requireConstructionTypeText('error.code_invalid') }),
  name: z
    .string({
      required_error: requireConstructionTypeText('name'),
      invalid_type_error: requireConstructionTypeText('name'),
    })
    .min(1, { message: requireConstructionTypeText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type ConstructionType = z.infer<typeof constructionTypeSchema>;

export const defaultValuesConstructionType: ConstructionType = {
  id: 0,
  branchId: null,
  storeId: null,
  code: '',
  name: '',
  note: '',
  isActive: true,
};
