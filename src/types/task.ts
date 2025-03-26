import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { defaultValuesRecordAttachment, recordAttachmentSchema } from './records-attachment';

export const requireText = requiredTextWithNamespace('directiveTask');

export const taskSchema = z.object({
  id: z.number(),
  name: z
    .string({
      required_error: requireText('name'),
      invalid_type_error: requireText('name'),
    })
    .min(1, requireText('name')),
  taskTime: z.date().nullable(),
  taskDeadline: z.date().nullable(),
  statusId: z.number({
    required_error: requireText('statusId', 'select'),
    invalid_type_error: requireText('statusId', 'select'),
  }),
  userCreatedId: z
    .number({
      required_error: requireText('userCreatedId'),
      invalid_type_error: requireText('userCreatedId'),
    })
    .min(1, requireText('userCreatedId')),
  responsibleUserId: z
    .number({
      required_error: requireText('responsibleUserId'),
      invalid_type_error: requireText('responsibleUserId'),
    })
    .min(1, requireText('responsibleUserId')),
  departmentId: z
    .number({
      required_error: requireText('departmentId'),
      invalid_type_error: requireText('departmentId'),
    })
    .min(1, requireText('departmentId')),
  completionType: z.number().nullable().optional(),
  progress: z.string().nullable(),
  note: z.string().nullable(),
  ids: z.number().nullable(),
  sort: z.string().nullable(),
  code: z
    .string({
      required_error: requireText('code'),
      invalid_type_error: requireText('code'),
    })
    .min(1, requireText('code')),
  isSaveTmp: z.boolean().nullable().optional(),
  is: z.boolean().nullable().optional(),

  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  itemsRecordManagement: z.array(recordAttachmentSchema),
});

export type Task = z.infer<typeof taskSchema>;

export const defaultValuesTask = {
  id: 0,
  name: '',
  taskTime: new Date(),
  taskDeadline: new Date(),
  statusId: 0,
  userCreatedId: 0,
  responsibleUserId: 0,
  departmentId: 0,
  completionType: null,
  progress: null,
  note: '',
  ids: 0,
  sort: null,
  code: '',
  isSaveTmp: false,
  is: false,
  storeId: null,
  branchId: null,
  itemsRecordManagement: [defaultValuesRecordAttachment],
};
