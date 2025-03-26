import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { defaultValuesRecordAttachment, recordAttachmentSchema } from './records-attachment';
import { defaultValuesRecordAttachmentDirectiveContent } from './work-management-directive-content';

export const requireWorkManagementTargetText = requiredTextWithNamespace('workManagementTarget');

export const workManagementTargetSchema = z.object({
  branchId: z.number().nullable(),
  id: z.number(),
  code: z
    .string({
      required_error: requireWorkManagementTargetText('code'),
      invalid_type_error: requireWorkManagementTargetText('code'),
    })
    .min(1, requireWorkManagementTargetText('code')),

  // Tên công việc
  name: z
    .string({
      required_error: requireWorkManagementTargetText('name'),
      invalid_type_error: requireWorkManagementTargetText('name'),
    })
    .min(1, requireWorkManagementTargetText('name')),

  // người tạo
  userCreatedId: z
    .number({
      required_error: requireWorkManagementTargetText('userCreatedId'),
      invalid_type_error: requireWorkManagementTargetText('userCreatedId'),
    })
    .min(1, requireWorkManagementTargetText('userCreatedId'))
    .nullable(),

  // Id chỉ tiêu
  targetId: z
    .number({
      required_error: requireWorkManagementTargetText('targetId'),
      invalid_type_error: requireWorkManagementTargetText('targetId'),
    })
    .min(1, requireWorkManagementTargetText('targetId')),
  // Id dự án
  projectId: z
    .number({
      required_error: requireWorkManagementTargetText('projectId'),
      invalid_type_error: requireWorkManagementTargetText('projectId'),
    })
    .min(1, requireWorkManagementTargetText('projectId'))
    .optional(),

  // Id người thực hiện
  executorId: z
    .number({
      required_error: requireWorkManagementTargetText('executorId'),
      invalid_type_error: requireWorkManagementTargetText('executorId'),
    })
    .min(1, requireWorkManagementTargetText('executorId'))
    .optional(),

  // Id phòng ban
  departmentId: z
    .number({
      required_error: requireWorkManagementTargetText('departmentId'),
      invalid_type_error: requireWorkManagementTargetText('departmentId'),
    })
    .min(1, requireWorkManagementTargetText('departmentId'))
    .optional(),

  // Id trạng thái
  statusId: z.number().nullable(),

  // Nội dung thực hiện
  executionContent: z
    .string({
      required_error: requireWorkManagementTargetText('executionContent'),
      invalid_type_error: requireWorkManagementTargetText('executionContent'),
    })
    .min(1, requireWorkManagementTargetText('executionContent')),

  // Số giao
  assignedQuantity: z
    .number({
      required_error: requireWorkManagementTargetText('assignedQuantity'),
      invalid_type_error: requireWorkManagementTargetText('assignedQuantity'),
    })
    .min(1, requireWorkManagementTargetText('assignedQuantity')),

  // Số thực hiện
  executedQuantity: z
    .number({
      required_error: requireWorkManagementTargetText('executedQuantity'),
      invalid_type_error: requireWorkManagementTargetText('executedQuantity'),
    })
    .min(1, requireWorkManagementTargetText('executedQuantity')),
  note: z.string(),

  // Ngày giao
  workManagementTargetTime: z.date({
    required_error: requireWorkManagementTargetText('workManagementTargetTime'),
    invalid_type_error: requireWorkManagementTargetText('workManagementTargetTime'),
  }),

  // Nội dung chỉ đạo của phòng
  departmentDirectiveContent: z
    .string({
      required_error: requireWorkManagementTargetText('departmentDirectiveContent'),
      invalid_type_error: requireWorkManagementTargetText('departmentDirectiveContent'),
    })
    .nullable(),

  // Ngày hạn hoàn thành
  completionDeadline: z
    .date({
      required_error: requireWorkManagementTargetText('completionDeadline'),
      invalid_type_error: requireWorkManagementTargetText('completionDeadline'),
    })
    .nullable(),

  // Người liên quan
  relatedUserIds: z.string().nullable().optional(),
  // xử lý multiple select
  relatedUserIdArray: z.array(z.number()).optional(),

  // Tiến độ
  progress: z.string().nullable().optional(),
  isSaveTmp: z.boolean().nullable().optional(),
  isClosed: z.boolean().nullable().optional(),
  isSentForProcessing: z.boolean().nullable().optional(),
  isReprocessed: z.boolean().nullable().optional(),

  ids: z.number().nullable(),
  sort: z.string().nullable(),

  itemsRecordManagement: z.array(recordAttachmentSchema), //file báo cáo
  itemsRecordManagementTarget: z.array(recordAttachmentSchema).nullable().optional(), //file chỉ tiêu
});

export type WorkManagementTarget = z.infer<typeof workManagementTargetSchema>;

export const defaultValuesWorkManagementTarget: WorkManagementTarget = {
  branchId: 0, //
  id: 0, // Khóa chính
  code: '', // Mã phiếu
  name: '', // Tên công việc
  userCreatedId: 0, // Người lập
  statusId: null, // Trạng thái
  targetId: 0, // Chỉ tiêu
  projectId: 0, // Dự án
  executorId: 0, // Người thực hiện
  progress: '', // Tiến độ
  departmentDirectiveContent: '', // Nội dung chỉ đạo của phòng
  executionContent: '', // Nội dung thực hiện
  assignedQuantity: 0, // Số giao
  executedQuantity: 0, // Số thực hiện
  completionDeadline: new Date(), // Hoàn thành trước ngày
  note: '', // Ghi chú
  relatedUserIds: '', // Người liên quan
  relatedUserIdArray: [], // Người liên quan
  workManagementTargetTime: new Date(), // Ngày giao
  ids: 0, // ids
  sort: '', // sort
  isSaveTmp: true, // Lưu tạm
  isClosed: true, // Xác nhận kết thúc
  isSentForProcessing: true, // Gửi xử lý
  isReprocessed: true, // Gửi xử lý lại
  itemsRecordManagement: [defaultValuesRecordAttachment], // File báo cáo
  itemsRecordManagementTarget: [defaultValuesRecordAttachmentDirectiveContent], // File chỉ tiêu
};
