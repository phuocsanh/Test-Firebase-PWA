import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

export const requireAdjustedInvestmentText = requiredTextWithNamespace('adjustedInvestment');

export const adjustedInvestmentDetailSummarySchema = z.object({
  id: z.number().optional(),
  projectId: z.number().nullable().optional(),
  costItemTypeId: z.number().nullable().optional(),
  costItemValue: z.number().nullable().optional(),
  costItemBefore: z.number().nullable().optional(),
  costItemValueBefore: z.number().nullable().optional(),
});

export const adjustedInvestmentDetailSchema = z.object({
  id: z.number(),
  adjustedInvestmentId: z.number().nullable(),
  costItemId: z.number().nullable(),
  symbol: z.string().nullable().optional(),
  percentageRate: z.string().nullable().optional(),
  calculationMethod: z.string().nullable().optional(),
  preTaxValue: z.number().nullable(),
  vatTax: z.number().nullable(),
  postTaxValue: z.number().nullable(),
  vat: z.number().nullable(),
});

export const adjustedInvestmentSchema = z.object({
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  isActive: z.boolean().nullable(),
  id: z.number(),
  code: z.string().nullable(),
  projectId: z
    .number({
      invalid_type_error: requireAdjustedInvestmentText('projectId', 'select'),
      required_error: requireAdjustedInvestmentText('projectId', 'select'),
    })
    .min(1, { message: requireAdjustedInvestmentText('projectId', 'select') }),
  userCreatedId: z
    .number({
      invalid_type_error: requireAdjustedInvestmentText('userCreatedId', 'select'),
      required_error: requireAdjustedInvestmentText('userCreatedId', 'select'),
    })
    .min(1, { message: requireAdjustedInvestmentText('userCreatedId', 'select') }),
  adjustedInvestmentTime: z.date().nullable(),
  ids: z.number().nullable(),
  sort: z.string().nullable(),
  note: z.string().nullable(),
  totalPostTaxValue: z.number().nullable(),
  documentCode: z
    .string({
      invalid_type_error: requireAdjustedInvestmentText('documentCode'),
      required_error: requireAdjustedInvestmentText('documentCode'),
    })
    .min(1, { message: requireAdjustedInvestmentText('documentCode') }),
  signingDate: z.coerce.date().nullable().optional(),
  signerId: z
    .number({
      invalid_type_error: requireAdjustedInvestmentText('signerId', 'select'),
      required_error: requireAdjustedInvestmentText('signerId', 'select'),
    })
    .min(1, { message: requireAdjustedInvestmentText('signerId', 'select') }),
  statusId: z
    .number({
      invalid_type_error: requireAdjustedInvestmentText('statusId', 'select'),
      required_error: requireAdjustedInvestmentText('statusId', 'select'),
    })
    .min(1, { message: requireAdjustedInvestmentText('statusId', 'select') }),
  approvalProcessId: z.number().nullable(),
  adjustedInvestmentDetails: z.array(adjustedInvestmentDetailSchema),
});

export type AdjustedInvestment = z.infer<typeof adjustedInvestmentSchema>;
export type AdjustedInvestmentDetail = z.infer<typeof adjustedInvestmentDetailSchema>;
export type AdjustedInvestmentDetailSummary = z.infer<typeof adjustedInvestmentDetailSummarySchema>;

export const defaultValuesAdjustedInvestment: AdjustedInvestment = {
  storeId: null, //
  branchId: null, //
  isActive: true, // Hoạt động
  id: 0, // Khóa chính
  code: '', // Mã phiếu
  projectId: 0, // Dự án
  userCreatedId: 0, // Người lập
  adjustedInvestmentTime: new Date(), // Ngày lập
  ids: null, // ids
  sort: '', // sort
  note: '', // Ghi chú
  totalPostTaxValue: 0, // Tổng mức đầu tư điều chỉnh
  documentCode: '', // Số văn bản
  signingDate: new Date(), // Ngày ký
  signerId: 0, // Người ký
  statusId: 0, // Trạng thái
  approvalProcessId: null, // Quy trình duyệt,
  adjustedInvestmentDetails: [
    {
      id: 0, // Khóa chính
      adjustedInvestmentId: 0, // Tổng mức đầu tư điều chỉnh
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
