import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { ArrayElement } from './common';
import {
  defaultValuesRecordAttachment,
  recordAttachmentWithOrderModuleSchema,
} from './records-attachment';
export const requireCompletionAcceptanceText = requiredTextWithNamespace('completionAcceptance');

export const completionAcceptanceSchema = z.object({
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  id: z.number(),
  code: z
    .string({
      required_error: requireCompletionAcceptanceText('code'),
      invalid_type_error: requireCompletionAcceptanceText('code'),
    })
    .min(1, requireCompletionAcceptanceText('code')),
  statusId: z
    .number({
      required_error: requireCompletionAcceptanceText('statusId', 'select'),
      invalid_type_error: requireCompletionAcceptanceText('statusId', 'select'),
    })
    .nullable(),
  completionAcceptanceTime: z.date({
    required_error: requireCompletionAcceptanceText('completionAcceptanceTime', 'select'),
  }),
  userCreatedId: z
    .number({
      required_error: requireCompletionAcceptanceText('userCreatedId', 'select'),
      invalid_type_error: requireCompletionAcceptanceText('userCreatedId', 'select'),
    })
    .nullable(),
  contractId: z
    .number({
      required_error: requireCompletionAcceptanceText('contractId', 'select'),
      invalid_type_error: requireCompletionAcceptanceText('contractId', 'select'),
    })
    .nullable(),
  costItemId: z
    .number({
      required_error: requireCompletionAcceptanceText('costItemId', 'select'),
      invalid_type_error: requireCompletionAcceptanceText('costItemId', 'select'),
    })
    .nullable(),
  contractAppendixId: z
    .number({
      required_error: requireCompletionAcceptanceText('contractAppendixId', 'select'),
      invalid_type_error: requireCompletionAcceptanceText('contractAppendixId', 'select'),
    })
    .nullable(),
  approvalProcessId: z.number().nullable(),
  numberOfCode: z.string().nullable(),
  phase: z.string().nullable(),
  acceptanceLocation: z.string().nullable(),
  implementationContent: z.string().nullable(),
  tenderPackageId: z
    .number({
      required_error: requireCompletionAcceptanceText('tenderPackageId', 'select'),
      invalid_type_error: requireCompletionAcceptanceText('tenderPackageId', 'select'),
    })
    .nullable(),
  contractorId: z
    .number({
      required_error: requireCompletionAcceptanceText('tenderPackageId', 'select'),
      invalid_type_error: requireCompletionAcceptanceText('tenderPackageId', 'select'),
    })
    .nullable(),
  totalAmount: z.number(),
  note: z.string().nullable(),
  ids: z.number().nullable(),
  sort: z.string().nullable(),
  startTime: z.date().nullable(),
  endTime: z.date().nullable(),
  isActive: z.boolean().default(true),
  completionAcceptanceDetails: z.array(
    z.object({
      id: z.number(),
      completionAcceptanceId: z.number().nullable(),
      constructionTaskId: z.number(),
      unitId: z.number().nullable(),
      price: z.number(),
      contractQuantity: z.number(),
      previousPeriodCumulative: z.number(),
      executionInThisPeriod: z.number(),
      cumulativeForThisPeriod: z.number(),
      startTime: z.date().nullable(),
      endTime: z.date().nullable(),
      contractorId: z.number().nullable(),
      isOutSide: z.boolean(),
      contractAppendixDetailId: z.number().nullable(),
      contractDetailId: z.number().nullable(),
      totalAmount: z.number(),
      note: z.string(),
    })
  ),
  ...recordAttachmentWithOrderModuleSchema.shape,
});

export type CompletionAcceptance = z.infer<typeof completionAcceptanceSchema>;

export type CompletionAcceptanceDetail = ArrayElement<
  CompletionAcceptance['completionAcceptanceDetails']
>;

export const defaultValuesCompletionAcceptance = {
  storeId: 0,
  branchId: null,
  id: 0,
  code: '',
  completionAcceptanceTime: new Date(),
  userCreatedId: 0,
  contractId: undefined,
  costItemId: undefined,
  contractAppendixId: null,
  approvalProcessId: null,
  numberOfCode: '',
  phase: '',
  acceptanceLocation: '',
  implementationContent: '',
  tenderPackageId: undefined,
  contractorId: undefined,
  totalAmount: 0,
  note: '',
  ids: 0,
  sort: '',
  itemsRecordManagement: [defaultValuesRecordAttachment],
  isActive: true,
  completionAcceptanceDetails: [
    {
      id: 0,
      completionAcceptanceId: 0,
      constructionTaskId: 0,
      unitId: null,
      price: 0,
      contractQuantity: 0,
      previousPeriodCumulative: 0,
      executionInThisPeriod: 0,
      cumulativeForThisPeriod: 0,
      startTime: null,
      endTime: null,
      contractorId: null,
      isOutSide: false,
      contractAppendixDetailId: 2,
      contractDetailId: null,
      totalAmount: 0,
      note: '',
    },
  ],
};
