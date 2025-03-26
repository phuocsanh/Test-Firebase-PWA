import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

export const requireAdvancePaymentText = requiredTextWithNamespace('advancePayment');
const advancePaymentDetailSchema = z.object({
  id: z.number().optional(), //Khóa chính
  advancePaymentId: z.number().nullable().optional(), //Bảng cha
  content: z.string().nullable().optional(), //Nội dung
  projectCode: z.string().nullable().optional(), //Mã dự án
  cumulativeAdvanceBalance: z.number().nullable().optional(), //Luỹ kế số dư tạm ứng đến thời điểm báo cáo
  totalAdvance: z.number().nullable().optional(), // Tổng số tạm ứng đến thời điểm báo cáo
  dissolvedProjectManagementBoard: z.string().nullable().optional(), // Ban quản lý dự án/Chủ đầu tư giải thể
  suspendedProject: z.string().nullable().optional(), // Dự án đình hoãn, không thực hiện
  otherReasons: z.string().nullable().optional(), // Nguyên nhân khác (ghi cụ thể)
  proposedRecoverySolution: z.string().nullable().optional(), // Đề xuất hướng xử lý thu hồi tạm ứng
  description: z.string().nullable().optional(), // Ghi chú
  budgetFundName: z.string().nullable().optional(), // Nguồn vốn
});

export type AdvancePaymentDetail = z.infer<typeof advancePaymentDetailSchema>;

// const advancePaymentDetailDefault = {
//   id: 0,
//   advancePaymentId: 0,
//   content: '', //Nội dung
//   projectCode: '', //Mã dự án
//   cumulativeAdvanceBalance: 0, //Luỹ kế số dư tạm ứng đến thời điểm báo cáo
//   totalAdvance: 0, // Tổng số tạm ứng đến thời điểm báo cáo
//   dissolvedProjectManagementBoard: '', // Ban quản lý dự án/Chủ đầu tư giải thể
//   suspendedProject: '', // Dự án đình hoãn, không thực hiện
//   otherReasons: '', // Nguyên nhân khác (ghi cụ thể)
//   proposedRecoverySolution: '', // Đề xuất hướng xử lý thu hồi tạm ứng
//   description: '', // Ghi chú
//   budgetFundName: '', // Nguồn vốn
// };

export const advancePaymentSchema = z
  .object({
    storeId: z.number().nullable(),
    branchId: z.number().nullable(),
    ids: z.number().nullable(),
    sort: z.string().nullable().optional(),
    code: z.string().nullable().optional(),
    id: z.number(),
    advancePaymentTime: z.date().nullable().optional(),
    userCreatedId: z.number().nullable(),
    name: z
      .string({
        required_error: requireAdvancePaymentText('name'),
        invalid_type_error: requireAdvancePaymentText('name'),
      })
      .min(1, { message: requireAdvancePaymentText('name') }),
    note: z.string().nullable().optional(),
    fromDate: z.date({
      required_error: requireAdvancePaymentText('fromDate'),
      invalid_type_error: requireAdvancePaymentText('fromDate'),
    }),
    toDate: z.date({
      required_error: requireAdvancePaymentText('toDate'),
      invalid_type_error: requireAdvancePaymentText('toDate'),
    }),
    advancePaymentDetails: z.array(advancePaymentDetailSchema),
  })
  .refine(data => data.fromDate <= data.toDate, {
    message: requireAdvancePaymentText('errValidateFromDate'),
    path: ['fromDate'],
  });

export type AdvancePayment = z.infer<typeof advancePaymentSchema>;

export const defaultValuesAdvancePayment: AdvancePayment = {
  storeId: 0, //
  branchId: null, //
  ids: null, // ids
  sort: '', // sort
  code: '', // Mã phiếu
  id: 0, // Khóa chính
  advancePaymentTime: new Date(), // Ngày lập
  userCreatedId: null, // Người lập
  name: '', // Tên báo cáo
  note: '', // Ghi chú
  fromDate: new Date(), // Từ ngày
  toDate: new Date(), // Đến ngày,
  advancePaymentDetails: [],
};
