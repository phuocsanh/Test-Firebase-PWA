import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { defaultValuesRecordAttachment, recordAttachmentSchema } from './records-attachment';

//thiết kế dự toán gói thầu
export const requireworkManagementDesignBidEstimationText = requiredTextWithNamespace(
  'workManagementDesignBidEstimation'
);

export const workManagementDesignBidEstimationSchema = z.object({
  branchId: z.number().nullable(),
  storeId: z.number().nullable(),
  ids: z.number().nullable(),
  sort: z.string().nullable(),
  code: z.string(),
  id: z.number(),

  workManagementDesignBidEstimationTime: z.date().nullable(), //ngày lập
  userCreatedId: z
    .number({
      required_error: requireworkManagementDesignBidEstimationText('userCreatedId'),
      invalid_type_error: requireworkManagementDesignBidEstimationText('userCreatedId'),
    })
    .min(1, requireworkManagementDesignBidEstimationText('userCreatedId')), //người lập
  projectId: z
    .number({
      required_error: requireworkManagementDesignBidEstimationText('projectId', 'select'),
      invalid_type_error: requireworkManagementDesignBidEstimationText('projectId', 'select'),
    })
    .min(1, requireworkManagementDesignBidEstimationText('projectId', 'select')), //dự án
  name: z
    .string({
      required_error: requireworkManagementDesignBidEstimationText('name'),
      invalid_type_error: requireworkManagementDesignBidEstimationText('name'),
    })
    .min(1, requireworkManagementDesignBidEstimationText('name')), //tên công việc
  departmentId: z.number().nullable().optional(), //phòng
  statusId: z.number().nullable().optional(), //trạng thái
  progress: z.string(), //tiến độ
  executorId: z
    .number({
      required_error: requireworkManagementDesignBidEstimationText('executorId', 'select'),
      invalid_type_error: requireworkManagementDesignBidEstimationText('executorId', 'select'),
    })
    .min(1, requireworkManagementDesignBidEstimationText('executorId', 'select')), //cán bộ thực hiện
  relatedUserIds: z.string().nullable().optional(), //người liên quan
  relatedUserIdsArray: z.array(z.number()).optional(), //người liên quan
  proposalNumber: z.string(), //số tờ trình
  appraisalDepartmentId: z.number().nullable().optional(), //phòng thẩm định
  qualityPlanningTaskAssignmentDate: z.date().nullable().optional(), //ngày giao nhiệm vụ của phòng kế hoạch chất lượng
  qualityPlanningCompletionDate: z.date().nullable().optional(), //ngày hoàn thành của phòng kế hoạch chất lượng
  appraisalCompletionDate: z.date().nullable().optional(), //ngày hoàn thành thẩm định
  completionDeadline: z.date().nullable().optional(), //thời hạn hoàn thành trước ngày
  appraisalReport: z.string().nullable().optional(), //báo cáo thẩm định
  approvalDecision: z.string().nullable().optional(), //quyết định phê duyệt
  note: z.string().nullable().optional(), //ghi chú
  isSaveTmp: z.boolean().nullable().optional(), //lưu tạm
  itemsRecordManagement: z.array(recordAttachmentSchema), //file báo cáo
});

export type WorkManagementDesignBidEstimation = z.infer<
  typeof workManagementDesignBidEstimationSchema
>;

//gán dữ liệu mặc định
export const defaultValuesWorkManagementDesignBidEstimation: WorkManagementDesignBidEstimation = {
  branchId: null,
  storeId: null,
  ids: null,
  sort: '',
  code: '',
  id: 0,

  workManagementDesignBidEstimationTime: new Date(), //ngày lập
  userCreatedId: 0, //người lập
  projectId: 0, //dự án
  name: '', //tên công việc
  departmentId: null, //phòng
  statusId: null, //trạng thái
  progress: '', //tiến độ
  executorId: 0, //cán bộ thực hiện
  relatedUserIds: '', //người liên quan
  relatedUserIdsArray: [], //người liên quan
  proposalNumber: '', //số tờ trình
  appraisalDepartmentId: null, //phòng thẩm định
  qualityPlanningTaskAssignmentDate: null, //ngày giao nhiệm vụ của phòng kế hoạch chất lượng
  qualityPlanningCompletionDate: null, //ngày hoàn thành của phòng kế hoạch chất lượng
  appraisalCompletionDate: null, //ngày hoàn thành thẩm định
  completionDeadline: null, //thời hạn hoàn thành trước ngày
  appraisalReport: '', //báo cáo thẩm định
  approvalDecision: '', //quyết định phê duyệt
  note: '', //ghi chú
  isSaveTmp: true, //lưu tạm
  itemsRecordManagement: [defaultValuesRecordAttachment], //file đính kèm
};
