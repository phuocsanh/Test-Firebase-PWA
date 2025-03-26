import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { ArrayElement } from './common';
import {
  defaultValuesRecordAttachment,
  recordAttachmentWithOrderModuleSchema,
} from './records-attachment';
export const requireContractText = requiredTextWithNamespace('contract');
export const requireRecordAttachmentText = requiredTextWithNamespace('recordAttachment');

export const contractSchema = z.object({
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  id: z.number(),
  code: z
    .string({
      required_error: requireContractText('code'),
      invalid_type_error: requireContractText('code'),
    })
    .min(1, requireContractText('code')),
  contractTime: z.date({
    required_error: requireContractText('contractTime', 'select'),
  }),
  userCreatedId: z
    .number({
      required_error: requireContractText('userCreatedId', 'select'),
      invalid_type_error: requireContractText('userCreatedId', 'select'),
    })
    .nullable(),
  contractorId: z
    .number({
      required_error: requireContractText('contractorId', 'select'),
      invalid_type_error: requireContractText('contractorId', 'select'),
    })
    .nullable(),
  liquidationDate: z.date().nullable(),
  acceptanceDate: z.date().nullable(),
  signingDate: z.date().nullable(),
  implementationDate: z.date().nullable(),
  advancePaymentGuaranteeExpiryDate: z.date().nullable(),
  expectedCompletionDate: z.date().nullable(),
  contractGuaranteeExpiryDate: z.date().nullable(),
  contractExecutionTime: z.string(),
  contractTypeId: z
    .number({
      required_error: requireContractText('contractTypeId', 'select'),
      invalid_type_error: requireContractText('contractTypeId', 'select'),
    })
    .nullable(),

  tenderPackageId: z
    .number({
      required_error: requireContractText('tenderPackageId', 'select'),
      invalid_type_error: requireContractText('tenderPackageId', 'select'),
    })
    .nullable(),

  costItemId: z
    .number({
      required_error: requireContractText('costItemId', 'select'),
      invalid_type_error: requireContractText('costItemId', 'select'),
    })
    .nullable(),

  contractPenaltyRate: z.number().nullable(),
  contractName: z.string().nullable(),
  contractNumber: z
    .string({
      required_error: requireContractText('contractNumber'),
      invalid_type_error: requireContractText('contractNumber'),
    })
    .min(1, requireContractText('contractNumber')),
  contractAmount: z.number(),
  unexpectedCostPct: z.number(),
  unexpectedCost: z.number(),
  totalAmount: z.number(),
  statusId: z
    .number({
      required_error: requireContractText('statusId', 'select'),
      invalid_type_error: requireContractText('statusId', 'select'),
    })
    .nullable(),
  note: z.string(),
  ids: z.number().nullable(),
  sort: z.string().nullable(),
  approvalProcessId: z.number().nullable(),
  contractDetails: z.array(
    z.object({
      id: z.number(),
      contractId: z.number().nullable(),
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

export type Contract = z.infer<typeof contractSchema>;

export type ContractDetail = ArrayElement<Contract['contractDetails']>;

export const defaultValuesContract = {
  storeId: null,
  branchId: null,
  id: 0,
  code: '',
  contractTime: new Date(),
  userCreatedId: null,
  contractorId: undefined,
  liquidationDate: null,
  acceptanceDate: null,
  signingDate: null,
  implementationDate: null,
  advancePaymentGuaranteeExpiryDate: null,
  expectedCompletionDate: null,
  contractGuaranteeExpiryDate: null,
  contractExecutionTime: '',
  contractTypeId: null,
  tenderPackageId: null,
  costItemId: null,
  contractPenaltyRate: 0,
  contractName: '',
  contractNumber: '',
  contractAmount: 0,
  approvalNumber: '',
  approvalDate: null,
  statusId: undefined,
  note: '',
  ids: 0,
  sort: '',
  approvalProcessId: null,
  unexpectedCostPct: 0,
  unexpectedCost: 0,
  itemsRecordManagement: [defaultValuesRecordAttachment],
  contractDetails: [
    {
      id: 0,
      contractId: 0,
      constructionTaskId: 0,
      unitId: null,
      price: 0,
      quantity: 0,
      totalAmount: 0,
      note: '',
      contractorId: null,
    },
  ],
};
