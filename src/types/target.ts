import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { defaultValuesRecordAttachment, recordAttachmentSchema } from './records-attachment';

export const requireTargetText = requiredTextWithNamespace('target');

export const targetSchema = z.object({
  branchId: z.number().nullable(),
  id: z.number(),
  code: z
    .string({
      required_error: requireTargetText('code'),
      invalid_type_error: requireTargetText('code'),
    })
    .min(1, requireTargetText('code')),
  name: z
    .string({
      required_error: requireTargetText('name'),
      invalid_type_error: requireTargetText('name'),
    })
    .min(1, requireTargetText('name')),
  executionContent: z
    .string({
      required_error: requireTargetText('executionContent'),
      invalid_type_error: requireTargetText('executionContent'),
    })
    .min(1, requireTargetText('executionContent')),
  assignedQuantity: z
    .number({
      required_error: requireTargetText('assignedQuantity'),
      invalid_type_error: requireTargetText('assignedQuantity'),
    })
    .min(1, requireTargetText('assignedQuantity')),
  executedQuantity: z
    .number({
      required_error: requireTargetText('executedQuantity'),
      invalid_type_error: requireTargetText('executedQuantity'),
    })
    .min(1, requireTargetText('executedQuantity')),
  note: z.string(),

  departmentIds: z.string().nullable().optional(),
  // xử lý multiple select
  departmentIdArray: z.array(z.number()).optional(),
  targetTime: z
    .date({
      required_error: requireTargetText('targetTime'),
      invalid_type_error: requireTargetText('targetTime'),
    })
    .nullable()
    .refine(value => value !== null, {
      message: requireTargetText('targetTime'),
    }),
  completionDeadline: z
    .date({
      required_error: requireTargetText('completionDeadline'),
      invalid_type_error: requireTargetText('completionDeadline'),
    })
    .nullable(),
  userCreatedId: z
    .number({
      required_error: requireTargetText('userCreatedId'),
      invalid_type_error: requireTargetText('userCreatedId'),
    })
    .min(1, requireTargetText('userCreatedId'))
    .nullable(),
  responsibleUserId: z
    .number({
      required_error: requireTargetText('responsibleUserId'),
      invalid_type_error: requireTargetText('responsibleUserId'),
    })
    .min(1, requireTargetText('responsibleUserId'))
    .optional(),
  completionType: z
    .number({
      required_error: requireTargetText('completionType'),
      invalid_type_error: requireTargetText('completionType'),
    })
    .min(1, requireTargetText('statusId')),
  statusId: z.number().nullable(),
  isSaveTmp: z.boolean().nullable().optional(),
  isClosed: z.boolean().nullable().optional(),
  isSentForProcessing: z.boolean().nullable().optional(),
  isReprocessed: z.boolean().nullable().optional(),

  ids: z.number().nullable(),
  sort: z.string().nullable(),

  itemsRecordManagement: z.array(recordAttachmentSchema),
});

export type Target = z.infer<typeof targetSchema>;

export const defaultValuesTarget: Target = {
  branchId: 0, //
  id: 0, // Khóa chính
  code: '', // Mã phiếu
  name: '', // Tên chỉ tiêu
  executionContent: '', // Nội dung thực hiện
  assignedQuantity: 0, // Số giao
  executedQuantity: 0,
  completionDeadline: new Date(), // Hoàn thành trước ngày
  note: '', // Ghi chú
  departmentIds: '', // Phòng ban
  departmentIdArray: [],
  targetTime: new Date(), // Ngày giao
  userCreatedId: 0, // Người lập
  responsibleUserId: 0, // Người tiếp nhận
  completionType: 0, // Hoàn thành
  statusId: null, // Trạng thái
  ids: 0, // ids
  sort: '', // sort
  isSaveTmp: true, // Lưu tạm
  isClosed: true, // Xác nhận kết thúc
  isSentForProcessing: true, // Gửi xử lý
  isReprocessed: true, // Gửi xử lý lại,
  itemsRecordManagement: [defaultValuesRecordAttachment],
};
