import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

const requireConstructionItemText = requiredTextWithNamespace('constructionItem');
export const constructionItemSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  parentId: z.number().nullable(),
  projectId: z
    .number({
      required_error: requireConstructionItemText('projectId'),
      invalid_type_error: requireConstructionItemText('projectId'),
    })
    .min(1, { message: requireConstructionItemText('projectId') }),
  // .nullable(),
  code: z
    .string({
      required_error: requireConstructionItemText('code'),
      invalid_type_error: requireConstructionItemText('code'),
    })
    .min(1, { message: requireConstructionItemText('code') }),
  name: z
    .string({
      required_error: requireConstructionItemText('name'),
      invalid_type_error: requireConstructionItemText('name'),
    })
    .min(1, { message: requireConstructionItemText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type ConstructionItem = z.infer<typeof constructionItemSchema>;
