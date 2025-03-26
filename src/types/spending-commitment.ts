import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

export const requireSpendingCommitmentText = requiredTextWithNamespace('spendingCommitment');

export const spendingCommitmentSchema = z.object({
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  id: z.number(),
  spendingCommitmentTime: z.date().nullable().optional(),
  userCreatedId: z.number().nullable(),
  code: z.string().nullable().optional(),
  numberOfCode: z.string().nullable().optional(),
  budgetYear: z.date().nullable().optional(),
  projectId: z
    .number({
      required_error: requireSpendingCommitmentText('projectId', 'select'),
      invalid_type_error: requireSpendingCommitmentText('projectId', 'select'),
    })
    .min(1, requireSpendingCommitmentText('projectId', 'select')), //dự án
  contractId: z
    .number({
      required_error: requireSpendingCommitmentText('contractId', 'select'),
      invalid_type_error: requireSpendingCommitmentText('contractId', 'select'),
    })
    .min(1, requireSpendingCommitmentText('contractId', 'select')), //dự án
  contractorId: z
    .number({
      required_error: requireSpendingCommitmentText('contractorId', 'select'),
      invalid_type_error: requireSpendingCommitmentText('contractorId', 'select'),
    })
    .min(1, requireSpendingCommitmentText('contractorId', 'select')), //dự án
  capitalIncreasePlanDetailId: z
    .number({
      required_error: requireSpendingCommitmentText('capitalIncreasePlanDetailId', 'select'),
      invalid_type_error: requireSpendingCommitmentText('capitalIncreasePlanDetailId', 'select'),
    })
    .min(1, requireSpendingCommitmentText('capitalIncreasePlanDetailId', 'select')), //dự án
  programCode: z.string().nullable().optional(),
  budgetSourceCodeId: z.number().nullable(),
  sectorCode: z.string().nullable().optional(),
  totalAmount: z.number().nullable(),
  note: z.string().nullable().optional(),
  ids: z.number().nullable(),
  sort: z.string().nullable().optional(),
});

export type SpendingCommitment = z.infer<typeof spendingCommitmentSchema>;

export const defaultValuesSpendingCommitment: SpendingCommitment = {
  storeId: null, // mã cửa hàng
  branchId: null, // mã chi nhánh
  id: 0, // Khóa chính
  spendingCommitmentTime: new Date(), // Ngày lập
  userCreatedId: null, // Người lập
  code: '', // Mã phiếu
  numberOfCode: '', // Số phiếu
  budgetYear: new Date(), // Năm ngân sách
  projectId: 0, // Dự án
  contractId: 0, // Hợp đồng
  contractorId: 0, // Nhà cung cấp
  capitalIncreasePlanDetailId: 0, // Mã nguồn NS
  programCode: '', // Mã chương
  budgetSourceCodeId: null, // Id Mã nguồn NS
  sectorCode: '', // Mã NDKT
  totalAmount: 0, // Số tiền
  note: '', // Ghi chú
  ids: null, // ids
  sort: '', // sort,
};
