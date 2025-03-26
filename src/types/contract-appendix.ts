import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { ArrayElement } from './common';
import {
  defaultValuesRecordAttachment,
  recordAttachmentWithOrderModuleSchema,
} from './records-attachment';
export const requireContractAppendixText = requiredTextWithNamespace('contractAppendix');

export const contractAppendixSchema = z.object({
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  id: z.number(),
  code: z
    .string({
      required_error: requireContractAppendixText('code'),
      invalid_type_error: requireContractAppendixText('code'),
    })
    .min(1, requireContractAppendixText('code')),
  contractAppendixTime: z.date({
    required_error: requireContractAppendixText('contractAppendixTime', 'select'),
  }),
  userCreatedId: z
    .number({
      required_error: requireContractAppendixText('userCreatedId', 'select'),
      invalid_type_error: requireContractAppendixText('userCreatedId', 'select'),
    })
    .nullable(),
  contractContractorId: z
    .number({
      required_error: requireContractAppendixText('contractContractorId', 'select'),
      invalid_type_error: requireContractAppendixText('contractContractorId', 'select'),
    })
    .nullable(),
  contractAppendixTypeId: z
    .number({
      required_error: requireContractAppendixText('contractAppendixTypeId', 'select'),
      invalid_type_error: requireContractAppendixText('contractAppendixTypeId', 'select'),
    })
    .nullable(),
  contractSigningDate: z.date().nullable(),
  contractAppendixSigningDate: z.date().nullable(),

  contractContractNumber: z.string().nullable(),
  contractAppendixExecutionTime: z.string(),

  contractCostItemId: z
    .number({
      required_error: requireContractAppendixText('contractCostItemId', 'select'),
      invalid_type_error: requireContractAppendixText('contractCostItemId', 'select'),
    })
    .nullable(),
  contractAppendixNumber: z
    .string({
      required_error: requireContractAppendixText('contractAppendixNumber'),
      invalid_type_error: requireContractAppendixText('contractAppendixNumber'),
    })
    .min(1, requireContractAppendixText('contractAppendixNumber')),
  appendixAmount: z.number(),
  contractContractAmount: z.number(),
  unexpectedCostPct: z.number(),
  unexpectedCost: z.number(),
  totalAmount: z.number(),
  statusId: z
    .number({
      required_error: requireContractAppendixText('statusId', 'select'),
      invalid_type_error: requireContractAppendixText('statusId', 'select'),
    })
    .nullable(),
  note: z.string().nullable(),
  contractId: z.number().nullable(),
  ids: z.number().nullable(),
  sort: z.string().nullable(),
  approvalProcessId: z.number().nullable(),
  contractAppendixDetails: z.array(
    z.object({
      id: z.number(),
      contractAppendixId: z.number().nullable(),
      constructionTaskId: z.number(),
      unitId: z.number().nullable(),
      price: z.number().nullable(),
      quantity: z.number(),
      totalAmount: z.number(),
      note: z.string(),
      contractorId: z.number().nullable(),
    })
  ),
  ...recordAttachmentWithOrderModuleSchema.shape,
});

export type ContractAppendix = z.infer<typeof contractAppendixSchema>;

export type ContractAppendixDetail = ArrayElement<ContractAppendix['contractAppendixDetails']>;

export const defaultValuesContractAppendix = {
  storeId: 0,
  branchId: 0,
  id: 0,
  code: '',
  contractAppendixTime: new Date(),
  userCreatedId: undefined,
  contractContractorId: undefined,
  contractAppendixTypeId: undefined,
  contractSigningDate: null,
  contractAppendixSigningDate: null,

  contractContractNumber: '',
  contractAppendixExecutionTime: '',
  contractCostItemId: undefined,
  contractAppendixNumber: '',
  appendixAmount: 0,
  contractAmount: 0,
  unexpectedCostPct: 0,
  unexpectedCost: 0,
  totalAmount: 0,
  statusId: undefined,
  note: '',
  contractId: undefined,
  ids: 0,
  sort: '',
  approvalProcessId: null,

  itemsRecordManagement: [defaultValuesRecordAttachment],
  contractAppendixDetails: [
    {
      id: 0,
      contractAppendixId: 0,
      constructionTaskId: 0,
      unitId: 0,
      price: 0,
      quantity: 0,
      totalAmount: 0,
      note: '',
      contractorId: null,
    },
  ],
};
