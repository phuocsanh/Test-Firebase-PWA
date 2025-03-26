import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { defaultValuesRecordAttachment, recordAttachmentSchema } from './records-attachment';
export const requireWorkManagementDirectiveContentContentText = requiredTextWithNamespace(
  'workManagementDirectiveContent'
);
import { ArrayElement } from './common';

//start: đính kèm file nội dung chỉ đạo
const requireRecordAttachmentDirectiveContent = requiredTextWithNamespace('recordsAttachment');
export const recordAttachmentDirectiveContentSchema = z.object({
  agencyId: z.number().nullable().optional(),
  content: z.string().nullable().optional(),
  dateCreate: z.date().nullable().optional(),
  groupDocId: z.number().nullable().optional(),
  id: z.number(),
  typeUpload: z.number().nullable().optional(),
  itemFile: z.array(
    z.object({
      id: z.number(),
      recordManagementId: z.number().nullable().optional(),
      typeFileId: z.number().nullable().optional(),
      name: z.string().nullable().optional(),
      folder: z.string().nullable().optional(),
      fileName: z.string().nullable().optional(),
      note: z.string().nullable().optional(),
      host: z.string().nullable().optional(),
      refId: z.number().nullable().optional(),
      storeId: z.number().nullable().optional(),
      typeUpload: z.number().nullable().optional(),
    })
  ),
  noDoc: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  projectId: z.number().nullable().optional(),
  refId: z.number().nullable().optional(),
  storeId: z.number().nullable().optional(),
  typeUploadId: z.number().nullable().optional(),
});

export const recordAttachmentWithOrderDirectiveContentModuleSchema = z.object({
  projectId: z
    .number({
      required_error: requireRecordAttachmentDirectiveContent('projectId', 'select'),
      invalid_type_error: requireRecordAttachmentDirectiveContent('projectId', 'select'),
    })
    .nullable(),
  itemsRecordManagementDirectiveContent: z.array(recordAttachmentDirectiveContentSchema),
});

export type RecordAttachmentDirectiveContent = z.infer<
  typeof recordAttachmentDirectiveContentSchema
>;
export type RecordAttachmentFileDirectiveContent = ArrayElement<
  RecordAttachmentDirectiveContent['itemFile']
>;
export type RecordAttachmentWithOrderModuleDirectiveContent = z.infer<
  typeof recordAttachmentWithOrderDirectiveContentModuleSchema
>;

export const defaultValuesRecordAttachmentDirectiveContent = {
  storeId: null,
  id: 0,
  projectId: null,
  groupDocId: null,
  noDoc: '',
  dateCreate: new Date(),
  content: '',
  note: '',
  agencyId: null,
  typeUpload: 0,
  refId: 0,
  itemFile: [
    {
      id: 0,
      recordManagementId: 0,
      typeFileId: null,
      name: '',
      folder: '',
      fileName: '',
      note: '',
      host: '',
      refId: 0,
      storeId: null,
      typeUpload: 0,
    },
  ],
};
//end: đính kèm file nội dung chỉ đạo

//quản lý công việc nội dung chỉ đạo
export const workManagementDirectiveContentSchema = z.object({
  branchId: z.number().nullable(),
  storeId: z.number().nullable(),
  ids: z.number().nullable(),
  sort: z.string().nullable(),
  code: z.string(),
  id: z.number(),

  workManagementDirectiveContentTime: z.date().nullable(), //ngày lập

  userCreatedId: z
    .number({
      required_error: requireWorkManagementDirectiveContentContentText('userCreatedId'),
      invalid_type_error: requireWorkManagementDirectiveContentContentText('userCreatedId'),
    })
    .min(1, requireWorkManagementDirectiveContentContentText('userCreatedId')), //người lập

  directiveContentId: z
    .number({
      required_error: requireWorkManagementDirectiveContentContentText('directiveContentId'),
      invalid_type_error: requireWorkManagementDirectiveContentContentText('directiveContentId'),
    })
    .min(1, requireWorkManagementDirectiveContentContentText('directiveContentId')), //theo chỉ đạo

    directiveContentDocumentGroupSymbol: z.string(), //theo chỉ đạo: ký hiệu văn bản

  name: z.string({
    required_error: requireWorkManagementDirectiveContentContentText('name'),
    invalid_type_error: requireWorkManagementDirectiveContentContentText('name'),
  }), //tên công việc

  projectId: z
    .number({
      required_error: requireWorkManagementDirectiveContentContentText('projectId'),
      invalid_type_error: requireWorkManagementDirectiveContentContentText('projectId'),
    })
    .min(1, requireWorkManagementDirectiveContentContentText('projectId')), //dự án

  departmentId: z
    .number({
      required_error: requireWorkManagementDirectiveContentContentText('departmentId'),
      invalid_type_error: requireWorkManagementDirectiveContentContentText('departmentId'),
    })
    .min(1, requireWorkManagementDirectiveContentContentText('departmentId')), //phòng

  statusId: z
    .number({
      required_error: requireWorkManagementDirectiveContentContentText('statusId'),
      invalid_type_error: requireWorkManagementDirectiveContentContentText('statusId'),
    })
    .min(1, requireWorkManagementDirectiveContentContentText('statusId')), //trạng thái

  summaryContent: z.string(), //nội dung trích yêu

  directiveContent: z.string(), //nội dung chỉ đạo

  reportContent: z.string(), //nội dung báo cáo

  departmentDirectiveContent: z.string(), //nội dung chỉ đạo phòng

  note: z.string(), //ghi chú

  executorId: z.number().nullable().optional(), //cán bộ thực hiện

  relatedUserIds: z.string().nullable().optional(), //người liên quan
  relatedUserIdsArray: z.array(z.number()).optional(), //người liên quan

  departmentCompletionDeadline: z.date().nullable().optional(), //Thời hạn của phòng

  finalDeadline: z.date().nullable().optional(), //Thời hạn hoàn thành

  actualCompletionDate: z.date().nullable().optional(), // Ngày hoàn thành thực tế

  progress: z.string(), //tiến độ

  itemsRecordManagement: z.array(recordAttachmentSchema), //file báo cáo

  itemsRecordManagementDirectiveContent: z.array(recordAttachmentSchema),
});

export type WorkManagementDirectiveContent = z.infer<typeof workManagementDirectiveContentSchema>;

//gán dữ liệu mặc định
export const defaultValuesWorkManagementDirectiveContent: WorkManagementDirectiveContent = {
  branchId: null,
  storeId: null,
  ids: null,
  sort: '',
  code: '',
  id: 0,

  workManagementDirectiveContentTime: new Date(), //ngày lập

  userCreatedId: 0, //người lập

  directiveContentId: 0, //theo chỉ đạo

  directiveContentDocumentGroupSymbol: '', //theo chỉ đạo: ký hiệu văn bản

  name: '', //tên công việc

  projectId: 0, //dự án

  departmentId: 0, //phòng

  statusId: 0, //trạng thái

  summaryContent: '', //nội dung trích yêu

  directiveContent: '', //nội dung chỉ đạo

  reportContent: '', //nội dung báo cáo

  departmentDirectiveContent: '', //nội dung chỉ đạo phòng

  note: '', //ghi chú

  executorId: 0, //cán bộ thực hiện

  relatedUserIds: '', //người liên quan

  relatedUserIdsArray: [], //người liên quan

  departmentCompletionDeadline: undefined, //Thời hạn của phòng

  finalDeadline: null, //Thời hạn hoàn thành

  actualCompletionDate: null, // Ngày hoàn thành thực tế

  progress: '', //tiến độ

  itemsRecordManagement: [defaultValuesRecordAttachment], //file báo cáo

  itemsRecordManagementDirectiveContent: [defaultValuesRecordAttachmentDirectiveContent], //file chỉ đạo
};
