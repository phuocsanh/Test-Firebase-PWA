import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { ArrayElement } from './common';

const requireRecordAttachment = requiredTextWithNamespace('recordsAttachment');

export const recordAttachmentSchema = z.object({
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

export const recordAttachmentWithOrderModuleSchema = z.object({
  projectId: z
    .number({
      required_error: requireRecordAttachment('projectId', 'select'),
      invalid_type_error: requireRecordAttachment('projectId', 'select'),
    })
    .nullable(),
  itemsRecordManagement: z.array(recordAttachmentSchema),
});

export type RecordAttachment = z.infer<typeof recordAttachmentSchema>;
export type RecordAttachmentFile = ArrayElement<RecordAttachment['itemFile']>;
export type RecordAttachmentWithOrderModule = z.infer<typeof recordAttachmentWithOrderModuleSchema>;

export const defaultValuesRecordAttachment = {
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
