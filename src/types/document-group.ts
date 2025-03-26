import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireDocumentGroupText = requiredTextWithNamespace('documentGroup');

// Nhóm văn bản
// storeId
// branchId
// id
// code
// name
// note
// is_active

export const documentGroupSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireDocumentGroupText('code'),
      invalid_type_error: requireDocumentGroupText('code'),
    })
    .min(1, { message: requireDocumentGroupText('code') }),
  name: z
    .string({
      required_error: requireDocumentGroupText('name'),
      invalid_type_error: requireDocumentGroupText('name'),
    })
    .min(1, { message: requireDocumentGroupText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type DocumentGroup = z.infer<typeof documentGroupSchema>;
