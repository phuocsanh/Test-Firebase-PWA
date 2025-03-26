import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { defaultValuesRecordAttachment, recordAttachmentSchema } from './records-attachment';

const requireText = requiredTextWithNamespace('workManagementTask');

//quản lý công việc nhiệm vụ
export const workManagementTaskSchema = z.object({
  branchId: z.number().nullable(),
  storeId: z.number().nullable(),
  ids: z.number().nullable(),
  sort: z.string().nullable(),
  code: z.string(),
  id: z.number(),

  taskId: z
    .number({
      required_error: requireText('taskId'),
      invalid_type_error: requireText('taskId'),
    })
    .min(1, requireText('taskId')), //theo nhiệm vụ

  name: z.string({
    required_error: requireText('name'),
    invalid_type_error: requireText('name'),
  }), //tên công việc

  workManagementTaskTime: z.date(), //ngày lập

  userCreatedId: z
    .number({
      required_error: requireText('userCreatedId'),
      invalid_type_error: requireText('userCreatedId'),
    })
    .min(1, requireText('userCreatedId')), //người lập

  projectId: z
    .number({
      required_error: requireText('projectId'),
      invalid_type_error: requireText('projectId'),
    })
    .min(1, requireText('projectId')), //dự án

  departmentId: z
    .number({
      required_error: requireText('departmentId'),
      invalid_type_error: requireText('departmentId'),
    })
    .min(1, requireText('departmentId')), //phòng

  statusId: z
    .number({
      required_error: requireText('statusId'),
      invalid_type_error: requireText('statusId'),
    })
    .nullable(), //trạng thái

  executorId: z.number().nullable().optional(), //cán bộ thực hiện

  relatedUserIds: z.string().nullable().optional(), //người liên quan

  relatedUserIdsArray: z.array(z.number()).optional(), //người liên quan

  completionDeadline: z.date().nullable().optional(), //Thời hạn hoàn thành trước ngày

  progressUpdateDate: z.string({
    required_error: requireText('progressUpdateDate'),
    invalid_type_error: requireText('progressUpdateDate'),
  }), //Tiến độ thực hiện đến ngày

  progress: z.string({
    required_error: requireText('progress'),
    invalid_type_error: requireText('progress'),
  }), //tiến độ

  departmentDirectiveContent: z.string({
    required_error: requireText('departmentDirectiveContent'),
    invalid_type_error: requireText('departmentDirectiveContent'),
  }), //nội dung chỉ đạo của phòng

  note: z.string({
    required_error: requireText('note'),
    invalid_type_error: requireText('note'),
  }), //ghi chú

  itemsRecordManagement: z.array(recordAttachmentSchema),
});

//phiếu cha
export type WorkManagementTask = z.infer<typeof workManagementTaskSchema>;

//gán dữ liệu mặc định
export const defaultValuesWorkManagementTask: WorkManagementTask = {
  branchId: null,
  storeId: null,
  ids: null,
  sort: '',
  code: '',
  id: 0,

  workManagementTaskTime: new Date(), //ngày lập

  userCreatedId: 0, //người lập

  taskId: 0, //theo nhiệm vụ

  name: '', //tên công việc

  projectId: 0, //dự án

  departmentId: 0, //phòng

  statusId: 0, //trạng thái

  note: '', //ghi chú

  executorId: 0, //cán bộ thực hiện

  relatedUserIds: '', //người liên quan

  relatedUserIdsArray: [], //người liên quan

  progressUpdateDate: '', //Tiến độ thực hiện đến ngày

  completionDeadline: null, //Thời hạn hoàn thành trước ngày

  progress: '', //tiến độ

  departmentDirectiveContent: '', //nội dung chỉ đạo của phòng

  itemsRecordManagement: [defaultValuesRecordAttachment], //file báo cáo
};
