import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import {
  defaultValuesRecordAttachment,
  recordAttachmentWithOrderModuleSchema,
} from './records-attachment';
export const requireTenderPackageText = requiredTextWithNamespace('tenderPackage');

export const tenderPackageSchema = z.object({
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  id: z.number(),
  code: z
    .string({
      required_error: requireTenderPackageText('code'),
      invalid_type_error: requireTenderPackageText('code'),
    })
    .min(1, requireTenderPackageText('code')),
  tenderPackageTime: z.date({
    required_error: requireTenderPackageText('tenderPackageTime', 'select'),
  }),
  userCreatedId: z
    .number({
      required_error: requireTenderPackageText('userCreatedId', 'select'),
      invalid_type_error: requireTenderPackageText('userCreatedId', 'select'),
    })
    .nullable(),

  costItemId: z
    .number({
      required_error: requireTenderPackageText('costItemId'),
      invalid_type_error: requireTenderPackageText('costItemId'),
    })
    .nullable(),
  contractorId: z
    .number({
      required_error: requireTenderPackageText('contractorId'),
      invalid_type_error: requireTenderPackageText('contractorId'),
    })
    .nullable(),
  contractTypeId: z
    .number({
      required_error: requireTenderPackageText('contractTypeId'),
      invalid_type_error: requireTenderPackageText('contractTypeId'),
    })
    .nullable(),
  tenderTypeId: z
    .number({
      required_error: requireTenderPackageText('tenderTypeId'),
      invalid_type_error: requireTenderPackageText('tenderTypeId'),
    })
    .nullable(),
  biddingMethodId: z
    .number({
      required_error: requireTenderPackageText('biddingMethodId'),
      invalid_type_error: requireTenderPackageText('biddingMethodId'),
    })
    .nullable(),
  tenderPackageName: z.string(),
  inPhase: z.string().nullable(),
  contractExecutionTime: z.string().nullable(),
  tenderPackagePrice: z.number().nullable(),
  winningBidPrice: z.number().nullable(),
  approvalNumber: z.string(),

  approvalDate: z.date().nullable(),
  statusId: z
    .number({
      required_error: requireTenderPackageText('statusId', 'select'),
      invalid_type_error: requireTenderPackageText('statusId', 'select'),
    })
    .nullable(),
  note: z.string(),
  ids: z.number().nullable(),
  sort: z.string().nullable(),
  approvalProcessId: z.number().nullable(),
  contractorSelectionPlanId: z.number().nullable(),
  contractorSelectionPlanDetailId: z.number().nullable(),
  isActive: z.boolean().default(true),
  ...recordAttachmentWithOrderModuleSchema.shape,
});

export const tenderPackageEditPriceSchema = z.object({
  id: z.number(),
  tenderPackageId: z.number().nullable(),
  tenderPackagePrice: z.number().nullable(),
  updaterId: z.number().nullable(),
});

export type TenderPackage = z.infer<typeof tenderPackageSchema>;
export type TenderPackageEditPrice = z.infer<typeof tenderPackageEditPriceSchema>;

export const defaultValuesTenderPackage = {
  storeId: 0,
  branchId: null,
  id: 0,
  code: '',
  tenderPackageTime: new Date(),
  userCreatedId: null,
  costItemId: null,
  contractorId: null,
  contractTypeId: null,
  tenderTypeId: null,
  biddingMethodId: null,
  tenderPackageName: '',
  inPhase: '',
  contractExecutionTime: '',
  tenderPackagePrice: 0,
  winningBidPrice: 0,
  planName: '',
  approvalNumber: '',
  projectId: null,
  approvalDate: null,
  statusId: null,
  note: '',
  ids: 0,
  sort: '',
  contractorSelectionPlanId: null,
  contractorSelectionPlanDetailId: null,
  approvalProcessId: null,
  isActive: true,
  itemsRecordManagement: [defaultValuesRecordAttachment],
};
