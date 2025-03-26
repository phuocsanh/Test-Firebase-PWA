import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

export const requireFormDocumentManagerText = requiredTextWithNamespace('formDocumentManager');

export const formDocumentManagerSchema = z.object({
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  isActive: z.boolean().nullable().optional(),
  id: z.number(),
  name: z
    .string({
      required_error: requireFormDocumentManagerText('name'),
      invalid_type_error: requireFormDocumentManagerText('name'),
    })
    .min(1, { message: requireFormDocumentManagerText('name') }),
  content: z.string(),
  documentGroupId: z.number().nullable(),
  note: z.string(),
  isNoEditPrint: z.boolean(),
  htmlBody: z.string(),
  professionType: z
    .number({
      required_error: requireFormDocumentManagerText('professionType', 'select'),
      invalid_type_error: requireFormDocumentManagerText('professionType', 'select'),
    })
    .min(1, { message: requireFormDocumentManagerText('professionType', 'select') }),
});

export type FormDocumentManager = z.infer<typeof formDocumentManagerSchema>;

export const defaultValuesFormDocumentManager: FormDocumentManager = {
  storeId: null, //
  branchId: null, //
  isActive: true, // Hoạt động
  id: 0, // Khóa chính
  name: '', // Tên biểu mẫu
  content: '', // Nội dung
  documentGroupId: null, // Nhóm văn bản
  note: '', // Ghi chú
  isNoEditPrint: true, // Không cho chỉnh khi in
  htmlBody: '', // Nội dung soạn thảo
  professionType: 0, // Nghiệp vụ,
};
