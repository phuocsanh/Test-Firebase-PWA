import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

import { defaultValuesRecordAttachment, recordAttachmentSchema } from './records-attachment';

export const requireHistoryActionText = requiredTextWithNamespace('historyAction');

export const historyActionSchema = z.object({
  id: z.number(),
  userActionId: z.number().nullable(),
  dateCreate: z.date().nullable().optional(),
  professionType: z.number().nullable(),
  actionType: z.string().nullable().optional(),
  refId: z.number().nullable(),
  refCode: z.string().nullable().optional(),
  content: z.string().nullable().optional(),

  itemsRecordManagement: z.array(recordAttachmentSchema),
});

export type HistoryAction = z.infer<typeof historyActionSchema>;

export const defaultValuesHistoryAction: HistoryAction = {
  id: 0, // Khóa chính
  userActionId: null, // Người tạo
  dateCreate: new Date(), // Thời gian ghi log
  professionType: null, // Loại nghiệp vụ
  actionType: '', // Loại lịch sử
  refId: null, // Id liên kết với nghiệp vụ
  refCode: '', // Code liên kết với nghiệp vụ
  content: '', // Nội dung lịch sử,
  itemsRecordManagement: [defaultValuesRecordAttachment],
};
