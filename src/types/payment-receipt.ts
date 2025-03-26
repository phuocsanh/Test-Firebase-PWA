import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

export const requirePaymentReceiptText = requiredTextWithNamespace('paymentReceipt');

export const paymentReceiptSchema = z.object({
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  id: z.number(),
  paymentReceiptTime: z.date().nullable().optional(),
  userCreatedId: z.number().nullable(),
  code: z.string().nullable().optional(),
  numberOfCode: z.string().nullable().optional(),
  budgetYear: z.date().nullable().optional(),
  projectId: z
    .number({
      required_error: requirePaymentReceiptText('projectId', 'select'),
      invalid_type_error: requirePaymentReceiptText('projectId', 'select'),
    })
    .min(1, requirePaymentReceiptText('projectId', 'select')),
  contractId: z
    .number({
      required_error: requirePaymentReceiptText('contractId', 'select'),
      invalid_type_error: requirePaymentReceiptText('contractId', 'select'),
    })
    .min(1, requirePaymentReceiptText('contractId', 'select')),
  contractorId: z
    .number({
      required_error: requirePaymentReceiptText('contractorId', 'select'),
      invalid_type_error: requirePaymentReceiptText('contractorId', 'select'),
    })
    .min(1, requirePaymentReceiptText('contractorId', 'select')),
  capitalIncreasePlanDetailId: z
    .number({
      required_error: requirePaymentReceiptText('capitalIncreasePlanDetailIdTooltip', 'select'),
      invalid_type_error: requirePaymentReceiptText('capitalIncreasePlanDetailIdTooltip', 'select'),
    })
    .min(1, requirePaymentReceiptText('capitalIncreasePlanDetailIdTooltip', 'select')),
  programCode: z.string().nullable().optional(),
  budgetSourceCodeId: z.number().nullable(),
  sectorCode: z.string().nullable().optional(),
  totalAmount: z.number().nullable(),
  note: z.string().nullable().optional(),
  ids: z.number().nullable(),
  sort: z.string().nullable().optional(),
  paymentType: z.number().nullable(),
});

export type PaymentReceipt = z.infer<typeof paymentReceiptSchema>;


export const defaultValuesPaymentReceipt: PaymentReceipt = {
  storeId: null,  // 
  branchId: null,  // 
  id: 0,  // Khóa chính
  paymentReceiptTime: new Date(),  // Ngày lập
  userCreatedId: null,  // Người lập
  code: "",  // Mã phiếu
  numberOfCode: "",  // Số phiếu
  budgetYear: new Date(),  // Năm ngân sách
  projectId: 0,  // Dự án
  contractId: 0,  // Hợp đồng
  contractorId: 0,  // Nhà cung cấp
  capitalIncreasePlanDetailId: 0,  // Mã nguồn NS
  programCode: "",  // Mã chương
  budgetSourceCodeId: null,  // Id Mã nguồn NS
  sectorCode: "",  // Mã NDKT
  totalAmount: 0,  // Số tiền
  note: "",  // Ghi chú
  ids: null,  // ids
  sort: "",  // sort
  paymentType: null,  // Loại thanh toán (1 Thanh toán, 2 Tạm ứng, 3 Thu hồi tạm ứng),
};