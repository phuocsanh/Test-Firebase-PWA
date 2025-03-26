import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { ArrayElement } from './common';

export const requireCapitalIncreasePlanText = requiredTextWithNamespace('capitalIncreasePlan');

export const capitalIncreasePlanSchema = z.object({
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  id: z.number(),
  code: z.string().nullable().optional(),
  capitalIncreasePlanTime: z.date().nullable().optional(),
  userCreatedId: z.number().nullable(),
  budgetFundId: z
    .number({
      required_error: requireCapitalIncreasePlanText('budgetFundId', 'select'),
      invalid_type_error: requireCapitalIncreasePlanText('budgetFundId', 'select'),
    })
    .min(1, requireCapitalIncreasePlanText('budgetFundId', 'select')),
  approvalDate: z.date().nullable().optional(),
  approvalNumber: z.string().nullable().optional(),
  budgetYear: z.date().nullable().optional(),
  totalAmount: z.number().nullable(),
  note: z.string().nullable().optional(),
  capitalIncreasePlanDetails: z.array(
    z.object({
      id: z.number(),
      capitalIncreasePlanId: z.number().nullable(),
      projectId: z.number().nullable(),
      budgetSourceCodeId: z.number().nullable(),
      programCode: z.string().nullable().optional(),
      sectorCode: z.string().nullable().optional(),
      typeCode: z.string().nullable().optional(),
      itemCode: z.string().nullable().optional(),
      totalAmount: z.number().nullable(),
    })
  ),
});

export type CapitalIncreasePlan = z.infer<typeof capitalIncreasePlanSchema>;
export type CapitalIncreasePlanDetail = ArrayElement<
  CapitalIncreasePlan['capitalIncreasePlanDetails']
>;

export const defaultValuesCapitalIncreasePlan: CapitalIncreasePlan = {
  storeId: null, //
  branchId: null, //
  id: 0, // Khóa chính
  code: '', // Mã phiếu
  capitalIncreasePlanTime: new Date(), // Ngày lập
  userCreatedId: null, // Người lập
  budgetFundId: 0, // Nguồn ngân sách
  approvalDate: new Date(), // Ngày quyết định
  approvalNumber: '', // Số quyết định
  budgetYear: new Date(), // Năm ngân sách
  totalAmount: 0, // Tổng tiền
  note: '', // Ghi chú,
  capitalIncreasePlanDetails: [
    {
      id: 0, // Khóa chính
      capitalIncreasePlanId: 0, // Kế hoạch giao vốn
      projectId: null, // Dự án
      budgetSourceCodeId: null, // Mã nguồn NS
      programCode: '', // Mã chương
      sectorCode: '', // Mã ngành KT
      typeCode: '', // Loại
      itemCode: '', // Khoản
      totalAmount: 0, // Số tiền
    },
  ],
};
