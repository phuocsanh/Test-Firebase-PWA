import { requiredTextWithNamespace, translationWithNamespace } from '@/lib/i18nUtils';

import { z } from 'zod';
import { approvalProcessWithOrderModuleSchema } from './approval-process';
const requireOvertimeRegistrationText = requiredTextWithNamespace('overtimeRegistration');

// Phiếu đăng ký làm thêm giờ
// storeId
// branchId
// id
// overtimeRegistrationTime
// userCreatedId
// registeringOfficerId
// overtimeRegistrationDate
// fromTime
// toTime
// overtimeHours
// content
// note
// statusId
// approvalProcessId
const t = translationWithNamespace('overtimeRegistration');

export const overtimeRegistrationSchema = z.object({
  id: z.number(), //id
  branchId: z.number().nullable(), //chi nhánh
  storeId: z.number().nullable(), //cửa hàng

  overtimeRegistrationTime: z.date({
    required_error: requireOvertimeRegistrationText('overtimeRegistrationTime'),
    invalid_type_error: requireOvertimeRegistrationText('overtimeRegistrationTime'),
  }), // ngày lập
  userCreatedId: z
    .number({
      required_error: requireOvertimeRegistrationText('userCreatedId', 'select'),
      invalid_type_error: requireOvertimeRegistrationText('userCreatedId', 'select'),
    })
    .min(1, requireOvertimeRegistrationText('userCreatedId', 'select')), //người lập
  registeringOfficerId: z
    .number({
      required_error: requireOvertimeRegistrationText('registeringOfficerId', 'select'),
      invalid_type_error: requireOvertimeRegistrationText('registeringOfficerId', 'select'),
    })
    .min(1, requireOvertimeRegistrationText('registeringOfficerId', 'select')), //cán bộ đăng ký
  overtimeRegistrationDate: z.date(), //ngày làm thêm giờ
  fromDate: z.date(), //thời gian từ
  toDate: z.date(), //thời gian đến
  overtimeHours: z
    .number({
      required_error: requireOvertimeRegistrationText('overtimeHours', 'select'),
      invalid_type_error: requireOvertimeRegistrationText('overtimeHours', 'select'),
    })
    .min(1, t('validate.overtimeHours')), //số giờ làm thêm
  content: z.string().nullable().optional(), //nội dung làm thêm
  note: z.string().nullable().optional(), //ghi chú
  isHoliday: z.boolean().default(false), //Là ngày nghỉ

  ...approvalProcessWithOrderModuleSchema.shape,
});

//phiếu cha
export type OvertimeRegistration = z.infer<typeof overtimeRegistrationSchema>;

//gán dữ liệu mặc định
export const defaultValuesOvertimeRegistration = {
  id: 0, //id
  branchId: null, //chi nhánh
  storeId: null, //cửa hàng
  overtimeRegistrationTime: new Date(), //ngày lập
  userCreatedId: null, //người lập
  registeringOfficerId: 0, //cán bộ đăng ký
  overtimeRegistrationDate: new Date(), //ngày làm thêm giờ
  fromDate: new Date(), //thời gian từ
  toDate: new Date(), //thời gian đến
  overtimeHours: 0, //số giờ làm thêm
  content: '', //nội dung làm thêm
  note: '', //ghi chú
  statusId: null, //trạng thái
  approvalProcessId: null, //quy trình duyệt
  isHoliday: false, //Là ngày nghỉ
};
