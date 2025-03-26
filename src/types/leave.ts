import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

export const requireLeaveText = requiredTextWithNamespace('leave');

export const leaveSchema = z
  .object({
    //ID
    id: z.number(),
    //Ngày tạo
    leaveTime: z.date({
      required_error: requireLeaveText('leaveTime'),
      invalid_type_error: requireLeaveText('leaveTime'),
    }),
    //Người tạo
    userCreatedId: z
      .number({
        required_error: requireLeaveText('userCreatedId', 'select'),
        invalid_type_error: requireLeaveText('userCreatedId', 'select'),
      })
      .min(1, requireLeaveText('userCreatedId', 'select')),
    //Nhân viên
    employeeId: z
      .number({
        required_error: requireLeaveText('employeeId', 'select'),
        invalid_type_error: requireLeaveText('employeeId', 'select'),
      })
      .min(1, requireLeaveText('employeeId', 'select')),
    //Bộ phận
    departmentId: z.number().nullable().optional(),
    //Chức vụ
    positionId: z.number().nullable().optional(),
    //Ngày bắt đầu
    fromDate: z.date({
      required_error: requireLeaveText('fromDate'),
      invalid_type_error: requireLeaveText('fromDate'),
    }),
    //Ngày kết thúc
    toDate: z.date({
      required_error: requireLeaveText('toDate'),
      invalid_type_error: requireLeaveText('toDate'),
    }),
    //Trạng thái duyệt
    statusId: z.number().nullable().optional(),
    //Lý do nghỉ
    leaveReason: z.string({
      required_error: requireLeaveText('leaveReason'),
      invalid_type_error: requireLeaveText('leaveReason'),
    }),
    //Số ngày nghỉ
    leaveQuantity: z.number().nullable().optional(),
    employeeName: z.string().nullable().optional(),
    //các trường mặc định
    ids: z.number().nullable().optional(),
    sort: z.string().nullable().optional(),
    branchId: z.number().nullable().optional(),
    storeId: z.number().nullable().optional(),
    note: z.string().nullable().optional(),
  })
  .refine(data => data.fromDate <= data.toDate, {
    message: requireLeaveText('errValidateFromDate'),
    path: ['fromDate'],
  });

export type Leave = z.infer<typeof leaveSchema>;

//gán dữ liệu mặc định
export const defaultValuesLeave = {
  id: 0,
  leaveTime: new Date(),
  leaveReason: '',
  fromDate: new Date(),
  toDate: new Date(),
  leaveQuantity: 0,
  //các trường mặc định
  ids: 0,
  sort: '',
  branchId: null,
  storeId: null,
  note: '',
  departmentId: null,
  positionId: null,
};
