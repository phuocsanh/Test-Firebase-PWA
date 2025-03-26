import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

const requiredPrintFormText = requiredTextWithNamespace('printForm');

export const printFormSchema = z.object({
  id: z.number(),
  storeId: z.number().default(0),
  branchId: z.number().nullable(),
  typeId: z.number({
    invalid_type_error: requiredPrintFormText('type'),
    required_error: requiredPrintFormText('type'),
  }),
  type: z.string(),
  size: z.string(),
  htmlBody: z.string(),
  isDefault: z.boolean().default(false),
});

export type PrintForm = z.infer<typeof printFormSchema>;
