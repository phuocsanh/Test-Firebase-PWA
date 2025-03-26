import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

const requireCustomerText = requiredTextWithNamespace('contractor');

// nhà thầu
// id
// contractor_type_id
// code
// name
// note
// is_active

// representative_name
// address
// phone
// email
// fax
// tax_code

export const contractorSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  contractorTypeId: z
    .number({
      required_error: requireCustomerText('contractorTypeId'),
      invalid_type_error: requireCustomerText('contractorTypeId'),
    })
    .min(1, { message: requireCustomerText('contractorTypeId') })
    .nullable(),
  code: z
    .string({
      required_error: requireCustomerText('code'),
      invalid_type_error: requireCustomerText('code'),
    })
    .min(1, { message: requireCustomerText('code') }),
  name: z
    .string({
      required_error: requireCustomerText('name'),
      invalid_type_error: requireCustomerText('name'),
    })
    .min(1, { message: requireCustomerText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  representative_name: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  fax: z.string().optional().nullable(),
  tax_code: z.string().optional().nullable(),
});

export type Contractor = z.infer<typeof contractorSchema>;
