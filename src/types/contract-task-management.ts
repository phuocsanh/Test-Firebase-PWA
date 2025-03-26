import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { ArrayElement } from './common';
import {
  defaultValuesRecordAttachment,
  recordAttachmentWithOrderModuleSchema,
} from './records-attachment';

//Quản lý công việc hợp đồng
export const requireContractTaskManagementText =
  requiredTextWithNamespace('contractTaskManagement');

export const contractTaskManagementSchema = z.object({
  id: z.number(), //ID

  code: z.string({
    required_error: requireContractTaskManagementText('code'),
    invalid_type_error: requireContractTaskManagementText('code'),
  }), //mã phiếu

  contractTaskManagementTime: z.date({
    required_error: requireContractTaskManagementText('contractTaskManagementTime'),
    invalid_type_error: requireContractTaskManagementText('contractTaskManagementTime'),
  }), //Ngày gửi

  projectManagementDepartmentId: z.number({
    required_error: requireContractTaskManagementText('projectManagementDepartmentId', 'select'),
    invalid_type_error: requireContractTaskManagementText(
      'projectManagementDepartmentId',
      'select'
    ),
  }), //Phòng QLDA

  projectManagementDirectorId: z.number({
    required_error: requireContractTaskManagementText('projectManagementDirectorId', 'select'),
    invalid_type_error: requireContractTaskManagementText('projectManagementDirectorId', 'select'),
  }), //GĐ.QLDA

  // projectId: z.number({
  //   required_error: requireContractTaskManagementText('projectId', 'select'),
  //   invalid_type_error: requireContractTaskManagementText('projectId', 'select'),
  // }), //Dự án

  completionTime: z.date().nullable().optional(), //Ngày hoàn thành
  isDraftCompletion: z.boolean().default(false).optional(), //Dự thảo BB hoàn thiện/thương thảo HĐ
  isDraftContract: z.boolean().default(false).optional(), //Dự thảo hợp đồng
  isDraftSubContract: z.boolean().default(false).optional(), //Dự thảo phụ lục hợp đồng
  isEligibleForSigning: z.boolean().default(false).optional(), //HS đủ điều kiện ký kết
  isNotEligibleForSigning: z.boolean().default(false).optional(), //HS không đủ điều kiện ký kết

  //các trường mặc định
  ids: z.number().nullable().optional(),
  sort: z.string().nullable().optional(),
  branchId: z.number().nullable().optional(),
  storeId: z.number().nullable().optional(),
  note: z.string().nullable().optional(),

  //Phòng quản lý dự án
  contractTaskManagementProjectDepartments: z.array(
    z.object({
      id: z.number(), //phòng quảh lý dự án
      contractTaskManagementId: z.number().nullable().optional(), //phiếu cha
      revisedNumber: z.number().nullable().optional(), //thay đổi lần thứ
      submissionContent: z.string().nullable().optional(), //nội dung trình
      directorOpinion: z.string().nullable().optional(), //ý kiến GĐ.QLDA
      departmentHeadOpinion: z.string().nullable().optional(), //ý kiến TP.QLDA
      userApproveId: z.number().nullable().optional(), //người duyệt
      approveTime: z.date().nullable().optional(), //ngày duyệt
      isApprove: z.boolean().nullable().optional(), //đồng ý hoặc từ chối
      isSaveTmp: z.boolean().default(true).optional(), //lưu tạm
    })
  ),

  //phòng tài chính tổng hợp
  contractTaskManagementFinanceDepartments: z.array(
    z.object({
      id: z.number(), //phòng tài chính tổng hợp
      contractTaskManagementId: z.number().nullable().optional(), // phiếu cha
      revisedNumber: z.number().nullable().optional(), //thay đổi lần thứ
      receivedTime: z.date().nullable().optional(), //ngày nhận HS
      completionTime: z.date().nullable().optional(), //ngày hoàn thành
      assignedUserId: z.number().nullable().optional(), //giao CB.P.TC-TH
      opinion: z.string().nullable().optional(), //ý kiến
      departmentHeadOpinion: z.string().nullable().optional(), //ý kiến TP.TC-TH
      userApproveId: z.number().nullable().optional(), //người duyệt
      approveTime: z.date().nullable().optional(), //ngày duyệt
      isApprove: z.boolean().nullable().optional(), //đồng ý hoặc từ chối
      isSaveTmp: z.boolean().default(true).optional(), //lưu tạm
    })
  ),

  //phòng kế hoạch chất lượng
  contractTaskManagementPlanningDepartments: z.array(
    z.object({
      id: z.number(), //phòng kế hoạch chất lượng
      contractTaskManagementId: z.number().nullable().optional(), //phiếu cha
      revisedNumber: z.number().nullable().optional(), //thay đổi lần thứ
      receivedTime: z.date().nullable().optional(), //ngày nhận HS
      completionTime: z.date().nullable().optional(), //ngày hoàn thành
      assignedUserId: z.number().nullable().optional(), //giao CB.P.KH-CL
      opinion: z.string().nullable().optional(), //ý kiến
      departmentHeadOpinion: z.string().nullable().optional(), //ý kiến TP.KH-CL
      userApproveId: z.number().nullable().optional(), //người duyệt
      approveTime: z.date().nullable().optional(), //ngày duyệt
      isApprove: z.boolean().nullable().optional(), //đồng ý hoặc từ chối
      isSaveTmp: z.boolean().default(true).optional(), //lưu tạm
    })
  ),

  //phụ lục hồ sơ đính kèm
  contractTaskManagementDocuments: z.array(
    z.object({
      id: z.number(), //phụ lục hồ sơ đính kèm
      contractTaskManagementId: z.number().nullable().optional(), //phiếu cha
      components: z.string().nullable().optional(), //thành phần hồ sơ
      quantity: z.number().nullable().optional(), //số lượng
      isAvailable: z.boolean().nullable().optional(), //có
      isNotAvailable: z.boolean().nullable().optional(), //không
      isSaveTmp: z.boolean().default(true).optional(), //lưu tạm
    })
  ),
  ...recordAttachmentWithOrderModuleSchema.shape,
});

//phiếu cha
export type ContractTaskManagement = z.infer<typeof contractTaskManagementSchema>;
//Phòng quản lý dự án
export type ContractTaskManagementProjectDepartments = ArrayElement<
  ContractTaskManagement['contractTaskManagementProjectDepartments']
>;
//phòng tài chính tổng hợp
export type ContractTaskManagementFinanceDepartments = ArrayElement<
  ContractTaskManagement['contractTaskManagementFinanceDepartments']
>;
//phòng kế hoạch chất lượng
export type ContractTaskManagementPlanningDepartments = ArrayElement<
  ContractTaskManagement['contractTaskManagementPlanningDepartments']
>;
//phụ lục hồ sơ đính kèm
export type ContractTaskManagementDocuments = ArrayElement<
  ContractTaskManagement['contractTaskManagementDocuments']
>;

//gán dữ liệu mặc định
export const defaultValuesContractTaskManagement = {
  id: 0, //ID
  code: '', //mã phiếu
  contractTaskManagementTime: new Date(), //Ngày gửi
  projectManagementDepartmentId: 0, //Phòng QLDA
  projectManagementDirectorId: 0, //GĐ.QLDA
  projectId: null, //Dự án
  completionTime: null, //Ngày hoàn thành
  isDraftCompletion: false, //Dự thảo BB hoàn thiện/thương thảo HĐ
  isDraftContract: false, //Dự thảo hợp đồng
  isEligibleForSigning: false, //HS đủ điều kiện ký kết
  isNotEligibleForSigning: false, //HS không đủ điều kiện ký kết

  //các trường mặc định
  ids: 0,
  sort: '',
  branchId: null,
  storeId: null,
  note: '',

  //Phòng quản lý dự án
  contractTaskManagementProjectDepartments: [
    {
      id: 0, //phòng quảh lý dự án
      contractTaskManagementId: 0, //phiếu cha
      revisedNumber: 0, //thay đổi lần thứ
      submissionContent: '', //nội dung trình
      directorOpinion: '', //ý kiến GĐ.QLDA
      departmentHeadOpinion: '', //ý kiến TP.QLDA
      userApproveId: null, //người duyệt
      approveTime: null, //ngày duyệt
      isApprove: null, //đồng ý hoặc từ chối
      isSaveTmp: true, //lưu tạm
    },
  ],

  //phòng tài chính tổng hợp
  contractTaskManagementFinanceDepartments: [
    {
      id: 0, //phòng tài chính tổng hợp
      contractTaskManagementId: 0, // phiếu cha
      revisedNumber: 0, //thay đổi lần thứ
      receivedTime: null, //ngày nhận HS
      completionTime: null, //ngày hoàn thành
      assignedUserId: null, //giao CB.P.TC-TH
      opinion: '', //ý kiến
      departmentHeadOpinion: '', //ý kiến TP.TC-TH
      userApproveId: null, //người duyệt
      approveTime: null, //ngày duyệt
      isApprove: null, //đồng ý hoặc từ chối
      isSaveTmp: true, //lưu tạm
    },
  ],

  //phòng kế hoạch chất lượng
  contractTaskManagementPlanningDepartments: [
    {
      id: 0, //phòng kế hoạch chất lượng
      contractTaskManagementId: 0, //phiếu cha
      revisedNumber: 0, //thay đổi lần thứ
      receivedTime: null, //ngày nhận HS
      completionTime: null, //ngày hoàn thành
      assignedUserId: null, //giao CB.P.KH-CL
      opinion: '', //ý kiến
      departmentHeadOpinion: '', //ý kiến TP.KH-CL
      userApproveId: null, //người duyệt
      approveTime: null, //ngày duyệt
      isApprove: null, //đồng ý hoặc từ chối
      isSaveTmp: true, //lưu tạm
    },
  ],

  //phụ lục hồ sơ đính kèm
  contractTaskManagementDocuments: [
    // {
    //   id: 0, //phụ lục hồ sơ đính kèm
    //   contractTaskManagementId:0, //phiếu cha
    //   components: '', //thành phần hồ sơ
    //   quantity: 0, //số lượng
    //   isAvailable: false, //có
    //   isNotAvailable: false, //không
    // },
    {
      id: 0, //phụ lục hồ sơ đính kèm
      contractTaskManagementId: 0, //phiếu cha
      components: 'Quyết định phê duyệt dự án đầu tư',
      quantity: 0,
      isAvailable: false,
      isNotAvailable: false,
    },
    {
      id: 0, //phụ lục hồ sơ đính kèm
      contractTaskManagementId: 0, //phiếu cha
      components:
        'Quyết định phê duyệt kế hoạch lưa chọn nhà thầu/Quyết định phê duyệt gói thầu (Nếu có)',
      quantity: 0,
      isAvailable: false,
      isNotAvailable: false,
    },
    {
      id: 0, //phụ lục hồ sơ đính kèm
      contractTaskManagementId: 0, //phiếu cha
      components: 'Quyết định giao kế hoạch vốn',
      quantity: 0,
      isAvailable: false,
      isNotAvailable: false,
    },
    {
      id: 0, //phụ lục hồ sơ đính kèm
      contractTaskManagementId: 0, //phiếu cha
      components: 'Biên bản hoàn thiện HĐ/BB TTHĐ',
      quantity: 0,
      isAvailable: false,
      isNotAvailable: false,
    },
    {
      id: 0, //phụ lục hồ sơ đính kèm
      contractTaskManagementId: 0, //phiếu cha
      components: 'Quyết định phê duyệt LQLCNT',
      quantity: 0,
      isAvailable: false,
      isNotAvailable: false,
    },
    {
      id: 0, //phụ lục hồ sơ đính kèm
      contractTaskManagementId: 0, //phiếu cha
      components: 'Dự thảo hợp đồng/PLHĐ',
      quantity: 0,
      isAvailable: false,
      isNotAvailable: false,
    },
    {
      id: 0, //phụ lục hồ sơ đính kèm
      contractTaskManagementId: 0, //phiếu cha
      components: 'Bảng giá theo hợp đồng',
      quantity: 0,
      isAvailable: false,
      isNotAvailable: false,
    },
    {
      id: 0, //phụ lục hồ sơ đính kèm
      contractTaskManagementId: 0, //phiếu cha
      components: 'Bảng giá chủng loại vật tư đính kèm',
      quantity: 0,
      isAvailable: false,
      isNotAvailable: false,
    },
    {
      id: 0, //phụ lục hồ sơ đính kèm
      contractTaskManagementId: 0, //phiếu cha
      components: 'Các pháp lý liên quan',
      quantity: 0,
      isAvailable: false,
      isNotAvailable: false,
    },
  ],

  itemsRecordManagement: [defaultValuesRecordAttachment],
};
