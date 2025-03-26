import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

import { defaultValuesRecordAttachment, recordAttachmentSchema } from './records-attachment';

export const requireReportSerialManagementText =
  requiredTextWithNamespace('reportSerialManagement');

export const reportSerialManagementSchema = z.object({
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),

  id: z.number(),
  documentNumber: z
    .string({
      required_error: requireReportSerialManagementText('documentNumber'),
      invalid_type_error: requireReportSerialManagementText('documentNumber'),
    })
    .min(1, { message: requireReportSerialManagementText('documentNumber') }),
  documentContent: z.string().nullable().optional(),
  issueDate: z.date().nullable().optional(),
  receivingDepartmentId: z
    .number({
      required_error: requireReportSerialManagementText('receivingDepartmentId', 'select'),
      invalid_type_error: requireReportSerialManagementText('receivingDepartmentId', 'select'),
    })
    .min(1, { message: requireReportSerialManagementText('receivingDepartmentId', 'select') }),
  numberRequesterId: z
    .number({
      required_error: requireReportSerialManagementText('numberRequesterId', 'select'),
      invalid_type_error: requireReportSerialManagementText('numberRequesterId', 'select'),
    })
    .min(1, { message: requireReportSerialManagementText('numberRequesterId', 'select') }),
  requestingOfficerId: z
    .number({
      required_error: requireReportSerialManagementText('requestingOfficerId', 'select'),
      invalid_type_error: requireReportSerialManagementText('requestingOfficerId', 'select'),
    })
    .min(1, { message: requireReportSerialManagementText('requestingOfficerId', 'select') }),
  userCreatedId: z
    .number({
      required_error: requireReportSerialManagementText('userCreatedId', 'select'),
      invalid_type_error: requireReportSerialManagementText('userCreatedId', 'select'),
    })
    .min(1, { message: requireReportSerialManagementText('userCreatedId', 'select') }),
  reportSerialManagementTime: z.date().nullable(),
  note: z.string().nullable().optional(),

  itemsRecordManagement: z.array(recordAttachmentSchema),
});

export type ReportSerialManagement = z.infer<typeof reportSerialManagementSchema>;

export const defaultValuesReportSerialManagement: ReportSerialManagement = {
  storeId: null, //
  branchId: null, //
  id: 0, // Khóa chính
  documentNumber: '', // Số văn bản
  documentContent: '', // Nội dung văn bản
  issueDate: new Date(), // Ngày phát hành
  receivingDepartmentId: 0, // Phòng nhận
  numberRequesterId: 0, // Người lấy số
  requestingOfficerId: 0, // Cán bộ xin
  userCreatedId: 0, // Người lập
  reportSerialManagementTime: new Date(), // Ngày lập
  note: '', // Ghi chú,
  itemsRecordManagement: [defaultValuesRecordAttachment],
};
