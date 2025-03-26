import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireDepartmentText = requiredTextWithNamespace('department');

// phong chuyen mon
// storeId
// branchId
// id
// code
// name
// note
// is_active

export const departmentSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireDepartmentText('code'),
      invalid_type_error: requireDepartmentText('code'),
    })
    .min(1, { message: requireDepartmentText('code') }),
  name: z
    .string({
      required_error: requireDepartmentText('name'),
      invalid_type_error: requireDepartmentText('name'),
    })
    .min(1, { message: requireDepartmentText('name') }),
  departmentHeadId: z
    .number({
      required_error: requireDepartmentText('departmentHeadId'),
      invalid_type_error: requireDepartmentText('departmentHeadId'),
    })
    .min(1, { message: requireDepartmentText('departmentHeadId') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type Department = z.infer<typeof departmentSchema>;
