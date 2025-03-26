import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

const requireConstructionTaskText = requiredTextWithNamespace('constructionTask');
export const constructionTaskSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  constructionItemId: z
    .number({
      required_error: requireConstructionTaskText('constructionItemId'),
      invalid_type_error: requireConstructionTaskText('constructionItemId'),
    })
    .min(1, { message: requireConstructionTaskText('constructionItemId') }),
  projectId: z
    .number({
      required_error: requireConstructionTaskText('projectId'),
      invalid_type_error: requireConstructionTaskText('projectId'),
    })
    .min(1, { message: requireConstructionTaskText('projectId') }),
  unitId: z
    .number({
      required_error: requireConstructionTaskText('unitId'),
      invalid_type_error: requireConstructionTaskText('unitId'),
    })
    .min(1, { message: requireConstructionTaskText('unitId') }),
  code: z
    .string({
      required_error: requireConstructionTaskText('code'),
      invalid_type_error: requireConstructionTaskText('code'),
    })
    .min(1, { message: requireConstructionTaskText('code') }),
  name: z
    .string({
      required_error: requireConstructionTaskText('name'),
      invalid_type_error: requireConstructionTaskText('name'),
    })
    .min(1, { message: requireConstructionTaskText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type ConstructionTask = z.infer<typeof constructionTaskSchema>;
