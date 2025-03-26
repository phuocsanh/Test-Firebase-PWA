import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { ArrayElement } from './common';

export const requireProjectScheduleSetupText = requiredTextWithNamespace('projectScheduleSetup');

export const projectScheduleSetupSchema = z.object({
  id: z.number(),
  projectWorkflowName: z.string().nullable().optional(),
  projectScheduleSetupTime: z.date().nullable().optional(),
  userCreatedId: z.number().nullable(),
  note: z.string().nullable().optional(),
  isActive: z.boolean().nullable().optional(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  projectScheduleSetupDetails: z.array(
    z.object({
      id: z.number(),
      projectScheduleSetupId: z.number().nullable(),
      taskName: z.string().nullable().optional(),
      durDay: z.number().nullable(),
      note: z.string().nullable().optional(),
      parentId: z.number().nullable(),
      columnIndex: z.number().nullable(),
      taskType: z.number().nullable(),
      taskRelationId: z.number().nullable(),
    })
  ),
});

export type ProjectScheduleSetup = z.infer<typeof projectScheduleSetupSchema>;
export type ProjectScheduleSetupDetail = ArrayElement<
  ProjectScheduleSetup['projectScheduleSetupDetails']
>;

export const defaultValuesProjectScheduleSetup: ProjectScheduleSetup = {
  id: 0, // Khóa chính
  projectWorkflowName: '', // Tên quy trình
  projectScheduleSetupTime: new Date(), // Ngày lập
  userCreatedId: null, // Người lập
  note: '', // Ghi chú
  isActive: true, // Hoạt động
  storeId: null, //
  branchId: null, // ,
  projectScheduleSetupDetails: [
    {
      id: 0, // Khóa chính
      projectScheduleSetupId: 0, // Bảng cha
      taskName: '', // Tên công việc
      durDay: 0, // Ngày
      note: '', // Ghi chú
      parentId: -1, // Thuộc công việc
      columnIndex: 0, // Thứ tự
      taskType: null, // Loại task quan hệ
      taskRelationId: null, /// Task quan hệ
    },
  ],
};
