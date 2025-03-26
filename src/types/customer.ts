import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

const requireCustomerText = requiredTextWithNamespace('customer');

export const customerCurrentDebtSchema = z.object({
  id: z.number(),
  customerId: z.number(),
  currentDebt: z.number(),
  storeId: z.number(),
  branchId: z.number(),
  branchName: z.string().optional().nullable(),
  branchCode: z.string().optional().nullable(),
  originalDept: z.number(),
});

export const contactCustomerSchema = z.object({
  id: z.number(),
  customerId: z.number(),
  name: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  position: z.string().nullable().optional(),
});

export const customerSchema = z.object({
  isInactive: z.boolean(),
  id: z.number(),
  groupName: z.string().nullable().optional(),
  groupId: z.number({
    required_error: requireCustomerText('groupId', 'select'),
    invalid_type_error: requireCustomerText('groupId', 'select'),
  }),
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
  nameVat: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  addressVat: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  fax: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  accountNumberBank: z.string().nullable().optional(),
  taxCode: z.string().nullable().optional(),
  type: z.number(),
  scheduleSales: z.string().nullable().optional(),
  carId: z.number().nullable(),
  printSort: z.number().nullable(),
  businessType: z.string().nullable().optional(),
  debtLimit: z.number().nullable(),
  debtDate: z.date().nullable().optional(),
  debtInitial: z.number().nullable(),
  note: z.string().nullable().optional(),
  isVat: z.boolean(),
  storeId: z.number(),
  priceType: z.number().nullable(),
  areaId: z.number().nullable(),
  customerTypeId: z.number().nullable(),
  customerResourceId: z.number().nullable(),
  longitude: z.number(),
  latitude: z.number(),
  totalOrderValue: z.number(),
  customerCurrentDebt: z.array(customerCurrentDebtSchema).nullable(),
  contactCustomer: z.array(contactCustomerSchema).nullable().optional(),
});

export type Customer = z.infer<typeof customerSchema>;
export type CustomerDebt = z.infer<typeof customerCurrentDebtSchema>;
