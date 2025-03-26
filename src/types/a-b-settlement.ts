import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { ArrayElement } from './common';

export const requireABSettlementText = requiredTextWithNamespace('aBSettlement');

export const aBSettlementSchema = z.object({
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  id: z.number(),
  abSettlementTime: z.date(),
  userCreatedId: z.number().nullable(),
  projectId: z
    .number({
      required_error: requireABSettlementText('projectId'),
      invalid_type_error: requireABSettlementText('projectId'),
    })
    .min(1, { message: requireABSettlementText('projectId') })
    .optional(),
  contractId: z.number().nullable(),
  contractCode: z.string().nullable().optional(),
  contractSignedDate: z.date().nullable().optional(),
  contractAppendix: z.string().nullable().optional(),
  contractAppendixSignedDate: z.date().nullable().optional(),
  projectOwnerId: z
    .number({
      required_error: requireABSettlementText('projectOwnerId'),
      invalid_type_error: requireABSettlementText('projectOwnerId'),
    })
    .min(1, { message: requireABSettlementText('projectOwnerId') })
    .optional(),
  contractorId: z
    .number({
      required_error: requireABSettlementText('contractorId'),
      invalid_type_error: requireABSettlementText('contractorId'),
    })
    .min(1, { message: requireABSettlementText('contractorId') })
    .optional(),
  paymentTimes: z.string().nullable().optional(),
  ids: z.number().nullable().optional(),
  sort: z.string().nullable().optional(),
  code: z.string().nullable().optional(),
  acceptedTotalAmount: z.number().nullable(),
  settlementTotalAmount: z.number().nullable(),
  abSettlementDetails: z.array(
    z.object({
      id: z.number(),
      abSettlementId: z.number().nullable(),
      constructionTaskId: z.number(),
      unitId: z.number(),
      acceptedQuantity: z.number(),
      acceptedUnitPrice: z.number(),
      acceptedAmount: z.number(),
      settlementQuantity: z.number(),
      settlementUnitPrice: z.number(),
      settlementAmount: z.number(),
      note: z.string(),
    })
  ),
});

export type ABSettlement = z.infer<typeof aBSettlementSchema>;
export type ABSettlementDetail = ArrayElement<ABSettlement['abSettlementDetails']>;

export const defaultValuesABSettlement: ABSettlement = {
  storeId: null, //
  branchId: null, //
  id: 0, // Khóa chính
  abSettlementTime: new Date(), // Ngày lập
  userCreatedId: null, // Người lập
  projectId: undefined, // Tên dự án:project:name
  contractId: null,
  contractCode: '', // Hợp đồng số
  contractSignedDate: new Date(), // Ngày ký HĐ
  contractAppendix: '', // Phụ lục HĐ
  contractAppendixSignedDate: new Date(), // Ngày ký PLHĐ
  projectOwnerId: undefined, // Chủ đầu tư
  contractorId: undefined, // Nhà thầu
  paymentTimes: '', // Thanh toán lần thứ
  ids: 0, // ids
  sort: '', // sort
  code: '', // Mã phiếu,
  acceptedTotalAmount: 0, //Tổng tiền quyết toán
  settlementTotalAmount: 0, //Tổng tiền sau điều chỉnh
  abSettlementDetails: [
    {
      id: 0, // Khóa chính
      abSettlementId: 0, // Quyết toán A - B
      constructionTaskId: 0, // Tên công việc
      unitId: 0, // Đơn vị tính
      acceptedQuantity: 0, // Khối lượng - theo nghiệp thu
      acceptedUnitPrice: 0, // Đơn giá - theo nghiệm thu
      acceptedAmount: 0, // Thành tiền - theo nghiệp thu
      settlementQuantity: 0, // Khối lượng - quyết toán
      settlementUnitPrice: 0, // Đơn giá - theo quyết toán
      settlementAmount: 0, // Thành tiền- quyết toán
      note: '',
    },
  ],
};
