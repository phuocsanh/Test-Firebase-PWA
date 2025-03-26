import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { ArrayElement } from './common';

const requireReportTemplateText = requiredTextWithNamespace('reportTemplate');

export const reportTemplateSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireReportTemplateText('code'),
      invalid_type_error: requireReportTemplateText('code'),
    })
    .min(1, { message: requireReportTemplateText('code') }),
  name: z
    .string({
      required_error: requireReportTemplateText('name'),
      invalid_type_error: requireReportTemplateText('name'),
    })
    .min(1, { message: requireReportTemplateText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  reportTemplateTime: z.date().nullable(),
  userCreatedId: z
    .number({
      required_error: requireReportTemplateText('userCreatedId', 'select'),
      invalid_type_error: requireReportTemplateText('userCreatedId', 'select'),
    })
    .min(1, { message: requireReportTemplateText('userCreatedId') })
    .nullable(),
  numberOfCode: z
    .string({
      required_error: requireReportTemplateText('numberOfCode'),
      invalid_type_error: requireReportTemplateText('numberOfCode'),
    })
    .min(1, { message: requireReportTemplateText('numberOfCode') }),
  ids: z.number().nullable(),
  sort: z.string().nullable(),
  content: z.string().nullable(),
  visibleColumns: z.string().nullable().optional(),
  usageYear: z.date({
    required_error: requireReportTemplateText('usageYear'),
    invalid_type_error: requireReportTemplateText('usageYear'),
  }),
  isReportTemplateBase: z.boolean().nullable(),
  reportTemplateBaseId: z.number().nullable(),
  reportTemplateDetails: z.array(
    z.object({
      id: z.number(),
      columnIndex: z.number().nullable().optional(),
      reportTemplateId: z.number().nullable(),
      caption: z.string().nullable(),
      displayCaption: z.string().nullable(),
      nameField: z.string().nullable(),
      note: z.string().nullable(),
      columnType: z.number().nullable(),
      refId: z.number().nullable(),
      columnFieldToTake: z.string().nullable(),
      fromDate: z.date().nullable(),
      toDate: z.date().nullable(),
      departmentId: z.number().nullable(),
      departmentType: z.number().nullable().optional(),
      parentId: z.number().nullable(),
      valueType: z.number().nullable(),
      formula: z.string().nullable(),
    })
  ),
});

export type ReportTemplate = z.infer<typeof reportTemplateSchema>;
export type ReportTemplateDetail = ArrayElement<ReportTemplate['reportTemplateDetails']>;

export const defaultValuesReportTemplate = {
  storeId: null,
  branchId: null,
  isActive: true,
  id: 0,
  reportTemplateTime: new Date(),
  userCreatedId: null,
  code: '',
  note: '',
  numberOfCode: '',
  name: '',
  ids: 0,
  sort: '',
  content: '',
  visibleColumns: '',
  usageYear: new Date(),
  isReportTemplateBase: true,
  reportTemplateBaseId: null,
  reportTemplateDetails: [
    {
      id: 0,
      reportTemplateId: 0,
      caption: '',
      displayCaption: '',
      nameField: '',
      note: '',
      columnType: 0,
      refId: null,
      columnFieldToTake: '',
      fromDate: new Date(),
      toDate: new Date(),
      departmentId: null,
      parentId: null,
      valueType: 0,
      formula: '',
    },
  ],
};
