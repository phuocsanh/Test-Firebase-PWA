import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { ArrayElement } from './common';
import {
  defaultValuesRecordAttachment,
  recordAttachmentWithOrderModuleSchema,
} from './records-attachment';
export const requireContractorSelectionPlanText =
  requiredTextWithNamespace('contractorSelectionPlan');

export const contractorSelectionPlanSchema = z.object({
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  id: z.number(),
  code: z
    .string({
      required_error: requireContractorSelectionPlanText('code'),
      invalid_type_error: requireContractorSelectionPlanText('code'),
    })
    .min(1, requireContractorSelectionPlanText('code')),
  contractorSelectionPlanTime: z.date({
    required_error: requireContractorSelectionPlanText('contractorSelectionPlanTime', 'select'),
  }),
  userCreatedId: z
    .number({
      required_error: requireContractorSelectionPlanText('userCreatedId', 'select'),
      invalid_type_error: requireContractorSelectionPlanText('userCreatedId', 'select'),
    })
    .nullable(),
  planNumber: z
    .string({
      required_error: requireContractorSelectionPlanText('planNumber'),
      invalid_type_error: requireContractorSelectionPlanText('planNumber'),
    })
    .min(1, requireContractorSelectionPlanText('planNumber')),
  evaluationDocumentNumber: z.string(),
  planName: z
    .string({
      required_error: requireContractorSelectionPlanText('planName'),
      invalid_type_error: requireContractorSelectionPlanText('planName'),
    })
    .min(1, requireContractorSelectionPlanText('planName')),
  approvalNumber: z.string(),
  // projectId: z
  //   .number({
  //     required_error: requireContractorSelectionPlanText('projectId', 'select'),
  //     invalid_type_error: requireContractorSelectionPlanText('projectId', 'select'),
  //   })
  //   .nullable(),
  approvalDate: z.date().nullable(),
  statusId: z
    .number({
      required_error: requireContractorSelectionPlanText('statusId', 'select'),
      invalid_type_error: requireContractorSelectionPlanText('statusId', 'select'),
    })
    .nullable(),
  note: z.string(),
  ids: z.number().nullable(),
  sort: z.string().nullable(),
  approvalProcessId: z.number().nullable(),
  contractorSelectionPlanDetails: z.array(
    z.object({
      id: z.number(),
      contractorSelectionPlanId: z.number().nullable(),
      costItemId: z.number(),
      tenderPackageName: z.string().nullable(),
      price: z.number().nullable(),
      tenderTypeId: z.number(),
      biddingMethodId: z.number(),
      biddingSectorId: z.number(),
      timeContractorSelectionProcess: z.string(),
      startTimeContractorSelectionProcess: z.string(),
      contractTypeId: z.number(),
      contractExecutionTime: z.string(),
      methodTenderType: z
        .number({
          invalid_type_error: requireContractorSelectionPlanText('methodTenderType', 'select'),
          required_error: requireContractorSelectionPlanText('methodTenderType', 'select'),
        })
        .min(1, requireContractorSelectionPlanText('methodTenderType', 'select')),
      methodBiddingType: z
        .number({
          invalid_type_error: requireContractorSelectionPlanText('methodBiddingType', 'select'),
          required_error: requireContractorSelectionPlanText('methodBiddingType', 'select'),
        })
        .min(1, requireContractorSelectionPlanText('methodBiddingType', 'select')),
    })
  ),
  ...recordAttachmentWithOrderModuleSchema.shape,
});

export type ContractorSelectionPlan = z.infer<typeof contractorSelectionPlanSchema>;

export type ContractorSelectionPlanDetail = ArrayElement<
  ContractorSelectionPlan['contractorSelectionPlanDetails']
>;

export const defaultValuesContractorSelectionPlan = {
  storeId: 0,
  branchId: null,
  id: 0,
  code: '',
  contractorSelectionPlanTime: new Date(),
  userCreatedId: null,
  planNumber: '',
  evaluationDocumentNumber: '',
  planName: '',
  approvalNumber: '',
  projectId: null,
  approvalDate: null,
  statusId: null,
  note: '',
  ids: 0,
  sort: '',
  approvalProcessId: null,
  itemsRecordManagement: [defaultValuesRecordAttachment],
  contractorSelectionPlanDetails: [
    {
      id: 0,
      contractorSelectionPlanId: 0,
      costItemId: 0,
      tenderPackageName: '',
      price: null,
      tenderTypeId: 0,
      biddingMethodId: 0,
      biddingSectorId: 0,
      timeContractorSelectionProcess: '',
      startTimeContractorSelectionProcess: '',
      contractTypeId: 0,
      contractExecutionTime: '',
      note: '',
      methodTenderType: 0,
      methodBiddingType: 0,
    },
  ],
};
