import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

const requireText = requiredTextWithNamespace('contractSettlement');

export const contractSettlementSchema = z.object({
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  ids: z.number().nullable(),
  id: z.number(),
  contractId: z
    .number({
      invalid_type_error: requireText('contractId', 'select'),
      required_error: requireText('contractId', 'select'),
    })
    .min(1, { message: requireText('contractId', 'select') }),
  contractCode: z.string().nullable().optional(),
  contractValue: z.number().nullable(),
  finalSettlementValue: z.number().nullable(),
  amountPaidByAToB: z.number().nullable(),
  remainingAmountAToB: z.number().nullable(),
  projectId: z
    .number({
      invalid_type_error: requireText('projectId', 'select'),
      required_error: requireText('projectId', 'select'),
    })
    .min(1, { message: requireText('projectId', 'select') }),
  contractSettlementTime: z.date().nullable().optional(),
  userCreatedId: z.number().nullable(),
  sort: z.string().nullable().optional(),
  code: z.string().nullable().optional(),
});

export type ContractSettlement = z.infer<typeof contractSettlementSchema>;

export const defaultValuesContractSettlement: ContractSettlement = {
  storeId: null, //
  branchId: null, //
  ids: null, // ids
  id: 0, // Khóa chính
  contractId: 0, // Hợp đồng
  contractValue: 0, // Giá trị hợp đồng
  finalSettlementValue: 0, // Giá trị quyết toán
  amountPaidByAToB: 0, // Giá trị bên A thanh toán cho bên B
  remainingAmountAToB: 0, // Giá trị bên A còn phải thanh toán cho bên B
  projectId: 0, // Tên dự án
  contractSettlementTime: new Date(), // Ngày lập
  userCreatedId: null, // Người lập
  sort: '', // sort
  code: '', // Mã phiếu,
};
