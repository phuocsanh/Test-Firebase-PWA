import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { ArrayElement } from './common';

export const requireBacklogProjectManagementText = requiredTextWithNamespace(
  'backlogProjectManagement'
);

export const backlogProjectManagementSchema = z.object({
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  id: z.number(),
  backlogProjectManagementTime: z.date(),
  userCreatedId: z.number().nullable(),
  note: z.string().nullable().optional(),
  name: z
    .string({
      required_error: requireBacklogProjectManagementText('name'),
      invalid_type_error: requireBacklogProjectManagementText('name'),
    })
    .min(1, requireBacklogProjectManagementText('name'))
    .nullable(),
  projectQuantity: z.number().nullable(),
  backlogProjectManagementProjects: z.array(
    z.object({
      id: z.number(),
      backlogProjectManagementId: z.number().nullable(),
      projectId: z.number().nullable(),
      pendingSubmissionType: z.number().nullable(),
      completedTaskContent: z.string().nullable().optional(),
      difficulties: z.string().nullable().optional(),
      issuesAndSolution: z.string().nullable().optional(),
      responsiblePersonId: z.number().nullable(),
      projectManagerId: z.number().nullable(),
      specializedDepartmentId: z.number().nullable(),
      backlogProjectManagementProjectDetails: z.array(
        z.object({
          id: z.number(),
          backlogProjectManagementProjectId: z.number().nullable(),
          monthYear: z.date().nullable().optional(),
          implementationPlan: z.string().nullable().optional(),
        })
      ),
    })
  ),
});

export type BacklogProjectManagement = z.infer<typeof backlogProjectManagementSchema>;
export type BacklogProjectManagementProject = ArrayElement<
  BacklogProjectManagement['backlogProjectManagementProjects']
>;
export type BacklogProjectManagementProjectDetail = ArrayElement<
  BacklogProjectManagementProject['backlogProjectManagementProjectDetails']
>;

export const defaultValuesBacklogProjectManagement: BacklogProjectManagement = {
  storeId: null, //
  branchId: null, //
  id: 0, // Khóa chính
  backlogProjectManagementTime: new Date(), // Ngày lập
  userCreatedId: null, // Người lập
  note: '', // Ghi chú
  name: '', // Tên tồn đọng
  projectQuantity: null, // Số công trình,
  backlogProjectManagementProjects: [
    {
      id: 0, // Khóa chính
      backlogProjectManagementId: 0, // Quản lý dự án tồn đọng
      projectId: null, // Dự án
      pendingSubmissionType: null, // Đang trình
      completedTaskContent: '', // Nội dung công việc đã thực hiện
      difficulties: '', // Khó khăn
      issuesAndSolution: '', // Vướng mắc và đề xuất hướng giải quyết
      responsiblePersonId: null, // Người phụ trách
      projectManagerId: null, // Cán bộ QLDA
      specializedDepartmentId: null, // Phòng chuyên môn
      backlogProjectManagementProjectDetails: [
        {
          id: 0, // Khóa chính
          backlogProjectManagementProjectId: 0, // Quản lý dự án tồn đọng - Dự án
          monthYear: new Date(), // Tháng/Năm
        },
      ],
    },
  ],
};
