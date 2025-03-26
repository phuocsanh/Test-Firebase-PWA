import { requiredTextWithNamespace, translationWithNamespace } from '@/lib/i18nUtils';
import type { TFunction } from 'i18next';
import { SyntheticEvent } from 'react';
import { z } from 'zod';
import {
  defaultValuesRecordAttachment,
  recordAttachmentWithOrderModuleSchema,
} from './records-attachment';
import { IUserPermission } from './user';

const requireProjectText = requiredTextWithNamespace('project');
const tCommon = translationWithNamespace('common');

const departmentMemberSchema = z.object({
  id: z.number(),
  projectId: z.number().nullable(),
  departmentType: z.number().optional().nullable(),
  memberId: z.number().optional().nullable(),
  positionId: z.number().optional().nullable(),
});

const projectDetailSummaries = z.object({
  id: z.number(),
  projectId: z.number().nullable(),
  costItemTypeId: z.number().nullable().optional(),
  costItemValue: z.number().nullable().optional(),
  costItemBefore: z.number().nullable().optional(),
  costItemValueBefore: z.number().nullable().optional(),
});

const projectDetailSchema = z.object({
  id: z.number(),
  projectId: z.number().nullable(),
  costItemId: z.number().nullable().optional(),

  // này để xử lý sum cho cái bảng summaries
  costItemCostItemTypeId: z.number().nullable().optional(),

  symbol: z.string().nullable().optional(),
  percentageRate: z.string().nullable().optional(),
  calculationMethod: z.string().nullable().optional(),
  preTaxValue: z.number().nullable().optional(),
  vatTax: z.number().nullable().optional(),
  postTaxValue: z.number().nullable().optional(),
  vat: z.number().nullable().optional(), // vat mặc định cho 8% ẩn
  preTaxValueBefore: z.number().nullable().optional(),
  vatTaxBefore: z.number().nullable().optional(),
  postTaxValueBefore: z.number().nullable().optional(),
  vatBefore: z.number().nullable().optional(),
});

export const progressScheduleSchema = z.object({
  id: z.number(),
  projectId: z.number().nullable(),
  fromDate: z.date().nullable().optional(),
  toDate: z.date().nullable().optional(),
  progressPercentage: z.number().nullable().optional(),
  assigneeId: z.number().nullable().optional(), // user
  taskName: z.string().nullable().optional(),
  taskNameDisplay: z.string().nullable().optional(), // for leveling display
  durDay: z.number().nullable().optional(),
  note: z.string().nullable().optional(),
  parentId: z.number().nullable(),
  columnIndex: z.number().nullable(),
  taskType: z.number().nullable().optional(),
  taskRelationId: z.number().nullable().optional(),
});

export const projectChangePmHistorySchema = z.object({
  id: z.number(),
  projectId: z.number(),
  projectManagementDirectorId: z
    .number({
      required_error: requireProjectText('projectManagementDirectorId', 'select'),
      invalid_type_error: requireProjectText('projectManagementDirectorId', 'select'),
    })
    .min(1, requireProjectText('projectManagementDirectorId', 'select')),
  updaterId: z.number().nullable().optional(),
  updatedTime: z.date().nullable(),
});

export const projectTimeAdjustmentHistorySchema = z.object({
  id: z.number(),
  projectId: z.number().nullable(),
  updaterId: z.number().nullable(),
  updatedTime: z.date().nullable(),
  fromDate: z.date().nullable(),
  toDate: z.date().nullable(),

  // xử lý ui
  range: z.array(z.date().nullable()).optional(),
});

export const projectSchema = z.object({
  storeId: z.number().nullable(),
  branchId: z.number().optional().nullable(),
  isActive: z.boolean().optional().nullable(),

  id: z.number(),
  code: z
    .string({
      required_error: requireProjectText('code'),
      invalid_type_error: requireProjectText('code'),
    })
    .min(1, requireProjectText('code')),
  name: z
    .string({
      required_error: requireProjectText('name'),
      invalid_type_error: requireProjectText('name'),
    })
    .min(1, requireProjectText('name')),
  note: z.string().optional().nullable(),
  budgetPreparationCode: z.string().nullable().optional(),
  budgetExecutionCode: z.string().nullable().optional(),
  projectStatusId: z.number().nullable().optional(),
  projectOwnerId: z.number().nullable().optional(),
  projectGroupId: z.number().nullable().optional(),
  pmoDirectorId: z
    .number({
      required_error: requireProjectText('pmoDirectorId', 'select'),
      invalid_type_error: requireProjectText('pmoDirectorId', 'select'),
    })
    .nullable(),
  projectManagementDirectorId: z.number().nullable().optional(), // user
  landUseArea: z.string().nullable().optional(),
  departmentInChargeId: z.number().nullable().optional(), // department
  contactPhone: z.string().nullable().optional(),
  projectManagementTypeId: z.number().nullable().optional(),
  landClearancePlanType: z.number().nullable().optional(),
  contactEmail: z.string().email(tCommon('validation.email')).nullable().optional(),
  objective: z.string().nullable().optional(),
  designCapacity: z.string().nullable().optional(),
  districtId: z.number().nullable().optional(),
  wardId: z.number().nullable().optional(),
  budgetFundId: z.number().nullable().optional(),
  accountOpeningLocation: z.string().nullable().optional(),
  investorAccountNumber: z.string().nullable().optional(),
  financeDepartmentProjectCode: z.string().nullable().optional(),
  // programCode: z.string().nullable().optional(),
  // sectorCode: z.string().nullable().optional(),
  userCreatedId: z.number().nullable(),
  projectTime: z
    .date({
      invalid_type_error: requireProjectText('projectTime'),
      required_error: requireProjectText('projectTime'),
    })
    .nullable(),

  projectHumanResources: z.array(departmentMemberSchema),

  // Chuẩn bị dự án
  preparationDocumentCode: z.string().nullable().optional(),
  preparationSigningDate: z.date().nullable().optional(),
  preparationSignerId: z.number().nullable().optional(), // user
  projectPreparationSummaries: z.array(projectDetailSummaries),
  projectPreparationDetails: z.array(projectDetailSchema),

  // Tổng mức đầu tư
  investmentDocumentCode: z.string().nullable().optional(),
  investmentSigningDate: z.date().nullable().optional(),
  investmentSignerId: z.number().nullable().optional(), // user
  projectInvestmentSummaries: z.array(projectDetailSummaries),
  projectInvestmentDetails: z.array(projectDetailSchema),

  // Tổng mức đầu tư điều chỉnh
  adjustedInvestmentDocumentCode: z.string().nullable().optional(),
  adjustedInvestmentSigningDate: z.date().nullable().optional(),
  adjustedInvestmentSignerId: z.number().nullable().optional(), // user
  projectAdjustedInvestmentSummaries: z.array(projectDetailSummaries),
  projectAdjustedInvestmentDetails: z.array(projectDetailSchema),

  // Dự toán
  costEstimationDocumentCode: z.string().nullable().optional(),
  costEstimationSigningDate: z.date().nullable().optional(),
  costEstimationSignerId: z.number().nullable().optional(),
  projectCostEstimationSummaries: z.array(projectDetailSummaries),
  projectCostEstimationDetails: z.array(projectDetailSchema),

  // Dự toán điều chỉnh
  adjustedCostEstimationDocumentCode: z.string().nullable().optional(),
  adjustedCostEstimationSigningDate: z.date().nullable().optional(),
  adjustedCostEstimationSignerId: z.number().nullable().optional(), // user
  projectAdjustedCostEstimationSummaries: z.array(projectDetailSummaries),
  projectAdjustedCostEstimationDetails: z.array(projectDetailSchema),

  // Quản lý tiến độ
  startDate: z.date().nullable().optional(),
  projectScheduleSetupId: z.number().nullable().optional(),
  projectProgressManagementProgressSchedules: z.array(progressScheduleSchema),
  dependencies: z
    .array(
      z.object({
        id: z.number(),
        predecessorId: z.number().nullable(),
        successorId: z.number().nullable(),
        type: z.number().nullable(),
      })
    )
    .optional()
    .nullable(),

  levelType: z.number().nullable().optional(),
  investmentFormId: z.number().nullable().optional(),
  investmentTypeId: z.number().nullable().optional(),
  agencyApprovalId: z.number().nullable().optional(),
  constructionTypeId: z.number().nullable().optional(),

  fromDate: z.date().nullable().optional(),
  toDate: z.date().nullable().optional(),

  // xử lý cho UI
  projectImplementTime: z.array(z.date().nullable()).optional(),

  approvalNumber: z.string().nullable().optional(),
  approvalDate: z.date().nullable().optional(),
  agencyId: z.number().nullable().optional(),

  //Lịch sử đổi người phụ trách
  projectDirectorChangeHistories: z.array(projectChangePmHistorySchema).optional().nullable(),

  // Lịch sử đổi thời gian thực hiện
  projectTimeAdjustmentHistories: z.array(projectTimeAdjustmentHistorySchema).optional().nullable(),

  ...recordAttachmentWithOrderModuleSchema.shape,
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectHumanResources = z.infer<typeof departmentMemberSchema>;
export type ProjectDetail = z.infer<typeof projectDetailSchema>;
export type ProjectDetailSummaries = z.infer<typeof projectDetailSummaries>;
export type ProjectProgress = z.infer<typeof progressScheduleSchema>;
export type ProjectChangePmHistory = z.infer<typeof projectChangePmHistorySchema>;
export type ProjectChangeImplementTimeHistory = z.infer<typeof projectTimeAdjustmentHistorySchema>;

export type ProjectTabChildrenProps = {
  role: IUserPermission | undefined;
  loading: boolean;
  onBackToList: () => void;
  onCreateNew: () => void;
  onSubmit: (e?: SyntheticEvent<HTMLElement>) => void;
  t: TFunction<[string, string], undefined>;
};

export const defaultValuesProject: Project = {
  storeId: 0,
  branchId: 0, //
  isActive: true, // Hoạt động

  id: 0, // Khóa chính
  projectId: 0, // cái này và id sẽ cùng giá trị, dùng để xử lý hồ sơ đính kèm
  code: '', // Mã dự án
  name: '', // Tên công trình dự án
  note: '', // Ghi chú
  budgetPreparationCode: '', // Mã quan hệ ngân sách chuẩn bị đầu tư
  budgetExecutionCode: '', // Mã quan hệ ngân sách thực hiện đầu tư
  projectStatusId: null, // Tình trạng dự án
  projectOwnerId: null, // Chủ đầu tư
  projectGroupId: null, // Nhóm dự án
  pmoDirectorId: null, // GĐ ban QLDA
  projectManagementDirectorId: null, // GĐ QLDA
  landUseArea: '', // Diện tích sử dụng đất
  departmentInChargeId: null, // Phòng phụ trách
  contactPhone: '', // Điện thoại liên hệ
  projectManagementTypeId: null, // HÌnh thức quản lý dự án
  landClearancePlanType: 0, // Phương án giải phóng mặt bằng (1 Không bồi thường 2 Có bồi thường)
  contactEmail: '', // Email
  objective: '', // Mục tiêu
  designCapacity: '', // Quy mô dự án/ Năng lực thiết kế
  districtId: null, // Địa điểm đầu tư ( huyện )
  wardId: null, // Địa điểm đầu tư (xã)
  budgetFundId: null, // Nguồn vốn
  accountOpeningLocation: '', // Địa điểm mở tài khoản dự án
  investorAccountNumber: '', // Số tài khoản chủ đầu tư
  financeDepartmentProjectCode: '', // Mã dự án do sở tài chính cấp
  // programCode: '', // Mã chương
  // sectorCode: '', // Mã ngành
  userCreatedId: null, // Người lập
  projectTime: new Date(),
  preparationDocumentCode: '', // Số văn bản (Chuẩn bị dự án)
  preparationSigningDate: new Date(), // Ngày ký (Chuẩn bị dự án)
  preparationSignerId: null, // Người ký (Chuẩn bị dự án)
  costEstimationDocumentCode: '', // Số văn bản (Dự toán)
  costEstimationSigningDate: new Date(), // Ngày ký (Dự toán)
  costEstimationSignerId: null, // Người ký (Dự toán)
  investmentDocumentCode: '', // Số văn bản (Tổng mức đầu tư)
  investmentSigningDate: new Date(), // Ngày ký (Tổng mức đầu tư)
  investmentSignerId: null, // Người ký (Tổng mức đầu tư)
  adjustedInvestmentDocumentCode: '', // Số văn bản (Tổng mức đầu tư điều chỉnh)
  adjustedInvestmentSigningDate: new Date(), // Ngày ký (Tổng mức đầu tư điều chỉnh)
  adjustedInvestmentSignerId: null, // Người ký (Tổng mức đầu tư điều chỉnh)
  adjustedCostEstimationDocumentCode: '', // Số văn bản (Dự toán điều chỉnh)
  adjustedCostEstimationSigningDate: new Date(), // Ngày ký (Dự toán điều chỉnh)
  adjustedCostEstimationSignerId: null, // Người ký (Dự toán điều chỉnh)

  levelType: 0,
  investmentFormId: null,
  investmentTypeId: null,
  agencyApprovalId: null,
  constructionTypeId: null,
  fromDate: null,
  toDate: null,
  approvalNumber: '',
  approvalDate: null,
  agencyId: null,
  projectImplementTime: [],

  projectHumanResources: [
    // Dự án - Nhân sự
    {
      id: 0, // Khóa chính
      projectId: 0, // Dự án
      departmentType: 0, //
      memberId: null, // Thành viên
      positionId: null, // Chức vụ
    },
  ],
  projectPreparationSummaries: [
    // Dự án - Tóm tắt Chuẩn bị dự án
    {
      id: 0, // Khóa chính
      projectId: 0, // Dự án
      costItemTypeId: null, // Nội dung chi phí
      costItemValue: 0, // Giá trị
    },
  ],
  projectPreparationDetails: [
    // Dự án - Chi tiết Chuẩn bị dự án
    {
      id: 0, // Khóa chính
      projectId: 0, // Dự án
      costItemId: null, // Nội dung chi phí
      symbol: '', // Giá trị
      percentageRate: '', // Tỉ lệ %
      calculationMethod: '', // Cách tính
      preTaxValue: 0, // Giá trị trước thuế
      vatTax: 0, // Thuế CTCT (8%)
      postTaxValue: 0, // Giá trị sau thuế
      vat: 8, // % Thuế CTCT
    },
  ],
  projectInvestmentSummaries: [
    // Dự án - Tóm tắt Tổng mức đầu tư
    {
      id: 0, // Khóa chính
      projectId: 0, // Dự án
      costItemTypeId: null, // Nội dung chi phí
      costItemValue: 0, // Giá trị
    },
  ],
  projectInvestmentDetails: [
    // Dự án - Chi tiết Tổng mức đầu tư
    {
      id: 0, // Khóa chính
      projectId: 0, // Dự án
      costItemId: null, // Nội dung chi phí
      symbol: '', // Giá trị
      percentageRate: '', // Tỉ lệ %
      calculationMethod: '', // Cách tính
      preTaxValue: 0, // Giá trị trước thuế
      vatTax: 0, // Thuế CTCT (8%)
      postTaxValue: 0, // Giá trị sau thuế
      vat: 8, // % Thuế CTCT
    },
  ],
  projectAdjustedInvestmentSummaries: [
    // Dự án - Tóm tắt Tổng mức đầu tư điều chỉnh
    {
      id: 0, // Khóa chính
      projectId: 0, // Dự án
      costItemTypeId: null, // Nội dung chi phí
      costItemValue: 0, // Giá trị cuối cùng
      costItemValueBefore: 0, // Giá trị cận kế cùng
    },
  ],
  projectAdjustedInvestmentDetails: [
    // Dự án - Chi tiết Tổng mức đầu tư điều chỉnh
    {
      id: 0, // Khóa chính
      projectId: 0, // Dự án
      costItemId: null, // Nội dung chi phí
      symbol: '', // Giá trị
      percentageRate: '', // Tỉ lệ %
      calculationMethod: '', // Cách tính
      preTaxValue: 0, // Giá trị trước thuế cuối cùng
      vatTax: 0, // Thuế CTCT (8%) cuối cùng
      postTaxValue: 0, // Giá trị sau thuế cuối cùng
      vat: 8, // % Thuế CTCT cuối cùng
      preTaxValueBefore: 0, // Giá trị trước thuế cận kế cùng
      vatTaxBefore: 0, // Thuế CTCT (8%) cận kế cùng
      postTaxValueBefore: 0, // Giá trị sau thuế cận kế cùng
      vatBefore: 0, // % Thuế CTCT cận kế cùng
    },
  ],
  projectCostEstimationSummaries: [
    // Dự án - Tóm tắt Dự toán
    {
      id: 0, // Khóa chính
      projectId: 0, // Dự án
      costItemTypeId: null, // Nội dung chi phí
      costItemValue: 0, // Giá trị
    },
  ],
  projectCostEstimationDetails: [
    // Dự án - Chi tiết dự toán
    {
      id: 0, // Khóa chính
      projectId: 0, // Dự án
      costItemId: null, // Nội dung chi phí
      symbol: '', // Giá trị
      percentageRate: '', // Tỉ lệ %
      calculationMethod: '', // Cách tính
      preTaxValue: 0, // Giá trị trước thuế
      vatTax: 0, // Thuế CTCT (8%)
      postTaxValue: 0, // Giá trị sau thuế
      vat: 8, // % Thuế CTCT
    },
  ],
  projectAdjustedCostEstimationSummaries: [
    // Dự án - Tóm tắt Dự toán điều chỉnh
    {
      id: 0, // Khóa chính
      projectId: 0, // Dự án
      costItemTypeId: null, // Nội dung chi phí
      costItemValue: 0, // Giá trị cuối cùng
      costItemValueBefore: 0, // Giá trị cận kế cùng
    },
  ],
  projectAdjustedCostEstimationDetails: [
    // Dự án - Chi tiết dự toán điều chỉnh
    {
      id: 0, // Khóa chính
      projectId: 0, // Dự án
      costItemId: null, // Nội dung chi phí
      symbol: '', // Giá trị
      percentageRate: '', // Tỉ lệ %
      calculationMethod: '', // Cách tính
      preTaxValue: 0, // Giá trị trước thuế cuối cùng
      vatTax: 0, // Thuế CTCT (8%) cuối cùng
      postTaxValue: 0, // Giá trị sau thuế cuối cùng
      vat: 8, // % Thuế CTCT cuối cùng
      preTaxValueBefore: 0, // Giá trị trước thuế cận kế cùng
      vatTaxBefore: 0, // Thuế CTCT (8%) cận kế cùng
      postTaxValueBefore: 0, // Giá trị sau thuế cận kế cùng
      vatBefore: 0, // % Thuế CTCT cận kế cùng
    },
  ],
  itemsRecordManagement: [defaultValuesRecordAttachment],
  dependencies: [],
  projectProgressManagementProgressSchedules: [
    {
      id: 0,
      projectId: null,
      fromDate: null,
      toDate: null,
      progressPercentage: 0,
      assigneeId: null,
      taskName: '',
      durDay: 0,
      note: '',
      parentId: -1,
      columnIndex: 0,
      taskType: null,
      taskRelationId: null,
    },
  ],
  projectDirectorChangeHistories: [],
};
