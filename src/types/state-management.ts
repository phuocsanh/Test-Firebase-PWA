import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireStateManagementText = requiredTextWithNamespace('stateManagement');

// QLNN
// storeId
// branchId
// id
// code
// name
// note
// is_active

export const stateManagementSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireStateManagementText('code'),
      invalid_type_error: requireStateManagementText('code'),
    })
    .min(1, { message: requireStateManagementText('code') }),
  name: z
    .string({
      required_error: requireStateManagementText('name'),
      invalid_type_error: requireStateManagementText('name'),
    })
    .min(1, { message: requireStateManagementText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type StateManagement = z.infer<typeof stateManagementSchema>;
