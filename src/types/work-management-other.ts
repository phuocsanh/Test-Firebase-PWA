import { requiredTextWithNamespace } from "@/lib/i18nUtils";
import { z } from "zod";

import {
  defaultValuesRecordAttachment,
  recordAttachmentSchema,
} from "./records-attachment";

export const requireWorkManagementOtherText = requiredTextWithNamespace(
  "workManagementOther"
);

export const workManagementOtherSchema = z.object({
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  id: z.number(),
  workManagementOtherTime: z.date().nullable().optional(),
  completionDeadline: z.date().nullable().optional(),
  userCreatedId: z.number().nullable(),
  code: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  departmentId: z
    .number({
      required_error: requireWorkManagementOtherText('departmentId', 'select'),
      invalid_type_error: requireWorkManagementOtherText('departmentId', 'select'),
    })
    .min(1, requireWorkManagementOtherText('departmentId', 'select')), // Phòng
  statusId: z.number().nullable(),
  ids: z.number().nullable(),
  sort: z.string().nullable().optional(),
  projectId: z
    .number({
      required_error: requireWorkManagementOtherText('projectId', 'select'),
      invalid_type_error: requireWorkManagementOtherText('projectId', 'select'),
    })
    .min(1, requireWorkManagementOtherText('projectId', 'select')), //dự án
  executorId: z
    .number({
      required_error: requireWorkManagementOtherText('executorId', 'select'),
      invalid_type_error: requireWorkManagementOtherText('executorId', 'select'),
    })
    .min(1, requireWorkManagementOtherText('executorId', 'select')), // cán bộ thực hiện
  relatedUserIds: z.string().nullable().optional(), // ngươi liên quan
  relatedUserIdsArray: z
    .array(z.number())
    .min(1, requireWorkManagementOtherText('relatedUserIds')), // xử lý multiple select Người liên quan
  departmentDirectiveContent: z.string().nullable().optional(),
  taskContent: z.string().nullable().optional(),
  evaluation: z.string().nullable().optional(),
  isSaveTmp: z.boolean().nullable().optional(),

  itemsRecordManagement: z.array(recordAttachmentSchema),
});

export type WorkManagementOther = z.infer<typeof workManagementOtherSchema>;

export const defaultValuesWorkManagementOther: WorkManagementOther = {
  storeId: null, //
  branchId: null, //
  id: 0, // Khóa chính
  workManagementOtherTime: new Date(), // Ngày lập
  completionDeadline: null, // Thời hạn hoàn thành trước ngày
  userCreatedId: null, // Người lập
  code: '', // Mã phiếu
  note: '', // Ghi chú
  name: '', // Tên công việc
  departmentId: 0, // Phòng
  statusId: null, // Trạng thái
  ids: null, // ids
  sort: '', // sort
  projectId: 0, // Dự án
  executorId: 0, // CB thực hiện
  relatedUserIds: '', // Người liên quan
  relatedUserIdsArray: [], // xử lý multiple select Người liên quan
  departmentDirectiveContent: '', // Nội dung chỉ đạo của phòng
  taskContent: '', // Nội dung công việc
  evaluation: '', // Đánh giá
  isSaveTmp: true, // Lưu tạm
  itemsRecordManagement: [defaultValuesRecordAttachment],
};
