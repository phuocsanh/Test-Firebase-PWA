import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { ArrayElement } from './common';

const requireDocumentFormEntryText = requiredTextWithNamespace('documentFormEntry');

export const documentFormEntrySchema = z.object({
  branchId: z.number().nullable(),
  id: z.number(),
  documentFormEntryTime: z.date().nullable(),
  userCreatedId: z
    .number({
      required_error: requireDocumentFormEntryText('userCreatedId', 'select'),
      invalid_type_error: requireDocumentFormEntryText('userCreatedId', 'select'),
    })
    .min(1, { message: requireDocumentFormEntryText('userCreatedId') })
    .nullable(),
  note: z.string().optional().nullable(),
  numberOfCode: z
    .string({
      required_error: requireDocumentFormEntryText('code'),
      invalid_type_error: requireDocumentFormEntryText('code'),
    })
    .min(1, { message: requireDocumentFormEntryText('code') }),
  name: z
    .string({
      required_error: requireDocumentFormEntryText('name'),
      invalid_type_error: requireDocumentFormEntryText('name'),
    })
    .min(1, { message: requireDocumentFormEntryText('name') }),
  ids: z.number().nullable(),
  sort: z.string().nullable(),
  content: z.string().nullable(),
  usageYear: z.date().nullable(),
  isReportTemplateBase: z.boolean().nullable(),
  reportTemplateId: z.number().nullable(),

  documentFormEntryProjects: z.array(
    z.object({
      id: z.number(),
      documentFormEntryId: z.number().nullable(),
      projectId: z.number().nullable(),
      capitalIncreasePlanDetailId: z.number().nullable(),
      documentFormEntryProjectDetails: z.array(
        z.object({
          id: z.number(),
          documentFormEntryProjectId: z.number().nullable(),
          reportTemplateDetailId: z.number().nullable(),
          reportTemplateDetailDisplayCaption: z.string().nullable().optional(),
          reportTemplateDetailNameField: z.string().nullable().optional(),
          reportTemplateDetailValueType: z.number().nullable().optional(),
          reportTemplateDetailParentId: z.number().nullable().optional(),
          reportTemplateDetailDepartmentType: z.number().nullable().optional(),
          reportTemplateDetailColumnType: z.number().nullable().optional(),
          value: z.string().nullable().or(z.date().or(z.number())),
        })
      ),
    })
  ),
});

export type DocumentFormEntry = z.infer<typeof documentFormEntrySchema>;
export type DocumentFormEntryDetail = ArrayElement<DocumentFormEntry['documentFormEntryProjects']>;
export type DocumentFormEntryDetailColumn = ArrayElement<
  DocumentFormEntryDetail['documentFormEntryProjectDetails']
>;

export const defaultValuesDocumentFormEntry: DocumentFormEntry = {
  branchId: null, //
  id: 0, // Khóa chính
  documentFormEntryTime: new Date(), // Ngày lập
  userCreatedId: null, // Người lập
  note: '', // Ghi chú
  numberOfCode: '', // Số biểu mẫu
  name: '', // Tên biểu mẫu
  ids: 0, // ids
  sort: '', // sort
  content: '', // Nội dung
  usageYear: null, // Năm sử dụng
  isReportTemplateBase: false, // Là mẫu chung
  reportTemplateId: null, // Biểu mẫu báo cáo
  documentFormEntryProjects: [
    // Nhập dữ liệu theo biểu mẫu chung - Dự án
    {
      id: 0, // Khóa chính
      documentFormEntryId: null, // Nhập dữ liệu theo biểu mẫu chung
      projectId: null, // Tên công trình, dự án
      capitalIncreasePlanDetailId: null,
      documentFormEntryProjectDetails: [
        // Nhập dữ liệu theo biểu mẫu chung - Dự án - Chi tiết
        {
          id: 0, // Khóa chính
          documentFormEntryProjectId: null, // Nhập dữ liệu theo biểu mẫu chung - Dự án
          reportTemplateDetailId: null, // Tên cột
          value: '', // Giá trị
        },
      ],
    },
  ],
};
