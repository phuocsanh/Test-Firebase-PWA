import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

export const requireAdjustedCostEstimationText =
  requiredTextWithNamespace('adjustedCostEstimation');

export const adjustedCostEstimationDetailSummarySchema = z.object({
  id: z.number().optional(),
  projectId: z.number().nullable().optional(),
  costItemTypeId: z.number().nullable().optional(),
  costItemValue: z.number().nullable().optional(),
  costItemBefore: z.number().nullable().optional(),
  costItemValueBefore: z.number().nullable().optional(),
});

export const adjustedCostEstimationDetailSchema = z.object({
  id: z.number(),
  adjustedCostEstimationId: z.number().nullable(),
  costItemId: z.number().nullable(),
  symbol: z.string().nullable().optional(),
  percentageRate: z.string().nullable().optional(),
  calculationMethod: z.string().nullable().optional(),
  preTaxValue: z.number().nullable(),
  vatTax: z.number().nullable(),
  postTaxValue: z.number().nullable(),
  vat: z.number().nullable(),
});

export const adjustedCostEstimationSchema = z.object({
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  isActive: z.boolean().nullable(),
  id: z.number(),
  code: z.string().nullable(),
  projectId: z
    .number({
      invalid_type_error: requireAdjustedCostEstimationText('projectId', 'select'),
      required_error: requireAdjustedCostEstimationText('projectId', 'select'),
    })
    .min(1, { message: requireAdjustedCostEstimationText('projectId', 'select') }),

  userCreatedId: z
    .number({
      invalid_type_error: requireAdjustedCostEstimationText('userCreatedId', 'select'),
      required_error: requireAdjustedCostEstimationText('userCreatedId', 'select'),
    })
    .min(1, { message: requireAdjustedCostEstimationText('userCreatedId', 'select') }),

  adjustedCostEstimationTime: z.coerce.date().nullable(),
  ids: z.number().nullable(),
  sort: z.string().nullable(),
  note: z.string().nullable(),
  totalPostTaxValue: z.number().nullable(),
  documentCode: z
    .string({
      invalid_type_error: requireAdjustedCostEstimationText('documentCode'),
      required_error: requireAdjustedCostEstimationText('documentCode'),
    })
    .min(1, { message: requireAdjustedCostEstimationText('documentCode') }),

  signingDate: z.coerce.date().nullable().optional(),
  signerId: z
    .number({
      invalid_type_error: requireAdjustedCostEstimationText('signerId', 'select'),
      required_error: requireAdjustedCostEstimationText('signerId', 'select'),
    })
    .min(1, { message: requireAdjustedCostEstimationText('signerId', 'select') }),
  statusId: z
    .number({
      invalid_type_error: requireAdjustedCostEstimationText('statusId', 'select'),
      required_error: requireAdjustedCostEstimationText('statusId', 'select'),
    })
    .min(1, { message: requireAdjustedCostEstimationText('statusId', 'select') }),
  approvalProcessId: z.number().nullable(),

  adjustedCostEstimationDetails: z.array(adjustedCostEstimationDetailSchema),
});

export type AdjustedCostEstimation = z.infer<typeof adjustedCostEstimationSchema>;
export type AdjustedCostEstimationDetail = z.infer<typeof adjustedCostEstimationDetailSchema>;
export type AdjustedCostEstimationDetailSummary = z.infer<
  typeof adjustedCostEstimationDetailSummarySchema
>;

export const defaultValuesAdjustedCostEstimation: AdjustedCostEstimation = {
  storeId: null, //
  branchId: null, //
  isActive: true, // Hoạt động
  id: 0, // Khóa chính
  code: '', // Mã phiếu
  projectId: 0, // Dự án
  userCreatedId: 0, // Người lập
  adjustedCostEstimationTime: new Date(), // Ngày lập
  ids: null, // ids
  sort: '', // sort
  note: '', // Ghi chú
  totalPostTaxValue: 0, // Tổng dự toán điều chỉnh
  documentCode: '', // Số văn bản
  signingDate: new Date(), // Ngày ký
  signerId: 0, // Người ký
  statusId: 0, // Trạng thái
  approvalProcessId: null, // Quy trình duyệt,
  adjustedCostEstimationDetails: [
    {
      id: 0, // Khóa chính
      adjustedCostEstimationId: 0, // Tổng dự toán điều chỉnh
      costItemId: 0, // Nội dung chi phí
      symbol: '', // Giá trị
      percentageRate: '', // Tỉ lệ %
      calculationMethod: '', // Cách tính
      preTaxValue: 0, // Giá trị trước thuế
      vatTax: 0, // Thuế CTCT (8%)
      postTaxValue: 0, // Giá trị sau thuế
      vat: 0, // % Thuế CTCT
    },
  ],
};
