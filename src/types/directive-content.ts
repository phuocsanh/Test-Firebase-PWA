import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { defaultValuesRecordAttachment, recordAttachmentSchema } from './records-attachment';

export const requireDirectiveContentText = requiredTextWithNamespace('directiveContent');

export const directiveContentSchema = z.object({
  branchId: z.number().nullable(),
  id: z.number(),
  code: z.string({
    // required_error: requireDirectiveContentText('code'),
    // invalid_type_error: requireDirectiveContentText('code'),
  }),
  // .min(1, requireDirectiveContentText('code')),
  note: z.string(),

  documentArrivalDate: z.date({
    required_error: requireDirectiveContentText('documentArrivalDate'),
    invalid_type_error: requireDirectiveContentText('documentArrivalDate'),
  }),
  documentCode: z
    .string({
      required_error: requireDirectiveContentText('documentCode'),
      invalid_type_error: requireDirectiveContentText('documentCode'),
    })
    .min(1, requireDirectiveContentText('documentCode'))
    .nullable(),
  documentGroupSymbol: z
    .string({
      required_error: requireDirectiveContentText('documentGroupSymbol'),
      invalid_type_error: requireDirectiveContentText('documentGroupSymbol'),
    })
    .min(1, requireDirectiveContentText('documentGroupSymbol'))
    .nullable(),
  documentGroupId: z.number().nullable().optional(),
  agencyId: z.number().nullable().optional(),
  summaryContent: z.string().nullable().optional(),
  directiveContent: z
    .string({
      required_error: requireDirectiveContentText('directiveContent'),
      invalid_type_error: requireDirectiveContentText('directiveContent'),
    })
    .min(1, requireDirectiveContentText('directiveContent'))
    .nullable(),
  deadline: z.date({
    required_error: requireDirectiveContentText('deadline'),
    invalid_type_error: requireDirectiveContentText('deadline'),
  }),
  opinionDepartmentIds: z.string().nullable().optional(),
  // xử lý multiple select
  opinionDepartmentIdArray: z
    .array(z.number())
    .min(1, requireDirectiveContentText('opinionDepartmentIds')),
  directiveContentTime: z.date().nullable(),
  userCreatedId: z
    .number({
      required_error: requireDirectiveContentText('userCreatedId'),
      invalid_type_error: requireDirectiveContentText('userCreatedId'),
    })
    .min(1, requireDirectiveContentText('userCreatedId'))
    .nullable(),
  completionType: z.number().nullable().optional(),

  statusId: z.number().nullable().optional(),

  isSaveTmp: z.boolean().nullable().optional(),
  isClosed: z.boolean().nullable().optional(),
  isSentForProcessing: z.boolean().nullable().optional(),
  isReprocessed: z.boolean().nullable().optional(),

  ids: z.number().nullable(),
  sort: z.string().nullable(),

  itemsRecordManagement: z.array(recordAttachmentSchema),
});

export type DirectiveContent = z.infer<typeof directiveContentSchema>;

export const defaultValuesDirectiveContent: DirectiveContent = {
  branchId: null, //
  id: 0, // Khóa chính
  code: '', // Mã phiếu
  note: '', // Ghi chú
  documentArrivalDate: new Date(), // Ngày VB đến
  documentCode: '', // Số VB đến
  documentGroupSymbol: '', // Ký hiệu VB
  documentGroupId: null, // Hình thức văn bản
  agencyId: null, // Cơ quan ban hành
  summaryContent: '', // Nội dung trích yếu
  directiveContent: '', // Nội dung chỉ đạo
  deadline: new Date(), // Thời hạn hoàn thành
  opinionDepartmentIds: '', // Ý kiến của giám đốc
  opinionDepartmentIdArray: [],
  directiveContentTime: new Date(), // Ngày lập
  userCreatedId: null, // Người lập
  completionType: null, // Hoàn thành
  statusId: null, // Trạng thái
  ids: 0, // ids
  sort: '', // sort
  isSaveTmp: true, // Lưu tạm
  isClosed: false, // Xác nhận kết thúc
  isSentForProcessing: false, // Gửi xử lý
  isReprocessed: false, // Gửi xử lý lại,
  itemsRecordManagement: [defaultValuesRecordAttachment],
};
