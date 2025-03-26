import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requiredCompanyField = requiredTextWithNamespace('company');

export const companySchema = z.object({
  isInactive: z.boolean().nullable(),
  id: z
    .number({
      required_error: requiredCompanyField('id'),
      invalid_type_error: requiredCompanyField('id'),
    })
    .default(1),
  code: z.string().nonempty(requiredCompanyField('code')),
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  phone: z
    .string({
      required_error: requiredCompanyField('phone'),
      invalid_type_error: requiredCompanyField('phone'),
    })
    .nonempty(requiredCompanyField('phone')),
  fax: z.string().optional().nullable(),
  taxCode: z.string().optional().nullable(),
  representative: z
    .string({
      required_error: requiredCompanyField('representative'),
      invalid_type_error: requiredCompanyField('representative'),
    })
    .nonempty(requiredCompanyField('representative')),
  position: z.string().optional().nullable(),
  bankAccount: z.string().optional().nullable(),
  bankAddress: z.string().optional().nullable(),
  accountNumber: z.string().optional().nullable(),
  isDelete: z.boolean().nullable(),
  storeId: z.number().optional().nullable(),
});

export type CompanyType = z.infer<typeof companySchema>;
