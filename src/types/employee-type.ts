import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireEmployeeTypeText = requiredTextWithNamespace('employeeType');

export const employeeTypeSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireEmployeeTypeText('code'),
      invalid_type_error: requireEmployeeTypeText('code'),
    })
    .min(1, { message: requireEmployeeTypeText('code') }),
  name: z
    .string({
      required_error: requireEmployeeTypeText('name'),
      invalid_type_error: requireEmployeeTypeText('name'),
    })
    .min(1, { message: requireEmployeeTypeText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type EmployeeType = z.infer<typeof employeeTypeSchema>;
