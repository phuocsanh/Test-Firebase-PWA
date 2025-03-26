import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

export const requireABAdjustmentSettlementText =
  requiredTextWithNamespace('aBAdjustmentSettlement');

const aBAdjustmentSettlementDetailSchema = z.object({
  id: z.number(),
  aBAdjustmentSettlementId: z.number().nullable(),
  constructionTaskId: z.number().nullable(),
  unitId: z.number().nullable(),
  acceptedQuantity: z.number().nullable(),
  acceptedUnitPrice: z.number().nullable(),
  acceptedAmount: z.number().nullable(),
  settlementQuantity: z.number().nullable(),
  settlementUnitPrice: z.number().nullable(),
  settlementAmount: z.number().nullable(),
  note: z.string().nullable().optional(),
});

export const aBAdjustmentSettlementSchema = z.object({
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  abAdjustmentSettlementTime: z.date().nullable().optional(),
  userCreatedId: z.number().nullable(),
  projectId: z.number().nullable(),
  contractCode: z.string().nullable().optional(),
  contractSignedDate: z.coerce.date().nullable().optional(),
  contractAppendix: z.string().nullable().optional(),
  contractAppendixSignedDate: z.coerce.date().nullable().optional(),
  projectOwnerId: z.number().nullable(),
  contractorId: z.number().nullable(),
  paymentTimes: z.string().nullable().optional(),
  ids: z.number().nullable(),
  sort: z.string().nullable().optional(),
  code: z.string().nullable().optional(),
  abSettlementId: z.number().nullable(),
  id: z.number(),
  acceptedTotalAmount: z.number().nullable(),
  settlementTotalAmount: z.number().nullable(),
  abAdjustmentSettlementDetails: z.array(aBAdjustmentSettlementDetailSchema).nullable(),
});

export type ABAdjustmentSettlement = z.infer<typeof aBAdjustmentSettlementSchema>;
export type ABAdjustmentSettlementDetail = z.infer<typeof aBAdjustmentSettlementDetailSchema>;

export const defaultValuesABAdjustmentSettlement: ABAdjustmentSettlement = {
  storeId: null, //
  branchId: null, //
  abAdjustmentSettlementTime: new Date(), // Ngày lập
  userCreatedId: null, // Người lập
  projectId: null, // Tên dự án
  contractCode: '', // Hợp đồng số
  contractSignedDate: new Date(), // Ngày ký HĐ
  contractAppendix: '', // Phụ lục HĐ
  contractAppendixSignedDate: new Date(), // Ngày ký PLHĐ
  projectOwnerId: null, // Chủ đầu tư
  contractorId: null, // Nhà thầu
  paymentTimes: '', // Thanh toán lần thứ
  ids: null, // ids
  sort: '', // sort
  code: '', // Mã phiếu
  abSettlementId: null, // Quyết Toán A-B
  id: 0, // Khóa chính
  acceptedTotalAmount: 0, // Tổng tiền quyết toán
  settlementTotalAmount: 0, // Tổng tiền sau điều chỉnh,
  abAdjustmentSettlementDetails: [],
};

export const defaultValuesABAdjustmentSettlementDetail: ABAdjustmentSettlementDetail = {
  id: 0, // Khóa chính
  aBAdjustmentSettlementId: 0, // Quyết toán A - B điều chỉnh
  constructionTaskId: null, // Tên công việc
  unitId: null, // Đơn vị tính
  acceptedQuantity: 0, // Khối lượng - theo nghiệp thu
  acceptedUnitPrice: 0, // Đơn giá - theo nghiệm thu
  acceptedAmount: 0, // Thành tiền - theo nghiệp thu
  settlementQuantity: 0, // Khối lượng - quyết toán
  settlementUnitPrice: 0, // Đơn giá - theo quyết toán
  settlementAmount: 0, // Thành tiền- quyết toán
  note: '', // Ghi chú
};
