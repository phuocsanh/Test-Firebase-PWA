import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireFileTypeText = requiredTextWithNamespace('fileType');

// loại tập tin
// storeId
// branchId
// id
// code
// name
// note
// is_active

export const fileTypeSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireFileTypeText('code'),
      invalid_type_error: requireFileTypeText('code'),
    })
    .min(1, { message: requireFileTypeText('code') }),
  name: z
    .string({
      required_error: requireFileTypeText('name'),
      invalid_type_error: requireFileTypeText('name'),
    })
    .min(1, { message: requireFileTypeText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type FileType = z.infer<typeof fileTypeSchema>;
