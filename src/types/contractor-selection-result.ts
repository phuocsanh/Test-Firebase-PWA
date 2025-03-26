import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { ArrayElement } from './common';

export const requireContractorSelectionResultText = requiredTextWithNamespace(
  'contractorSelectionResult'
);
//tổng hợp kết quản LCNT
export const contractorSelectionResultSchema = z.object({
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  id: z.number(),
  ids: z.number().nullable(),
  sort: z.string().nullable().optional(),

  contractorSelectionResultTime: z.date().nullable(),
  userCreatedId: z.number().nullable(),
  managingDirectorId: z.number().nullable(),
  projectId: z.number({
    required_error: requireContractorSelectionResultText('projectId', 'select'),
    invalid_type_error: requireContractorSelectionResultText('projectId', 'select'),
  }),
  content: z.string(),
  isApprove: z.boolean().nullable().optional(),
  approveOrRejectTime: z.date().nullable().optional(),
  approverId: z.number().nullable().optional(),
  isSaveTmp: z.boolean().nullable().optional(),
  contractorSelectionResultDetails: z.array(
    z.object({
      id: z.number(),
      contractorSelectionResultId: z.number(),
      tenderTypeId: z.number().nullable(),
      methodTenderType: z.number().nullable(),
      methodBiddingType: z.number().nullable(),
      nationalKeyTotalBidPackages: z.number().nullable(),
      nationalKeyTotalBidPackageValue: z.number().nullable(),
      nationalKeyTotalAwardedBidValue: z.number().nullable(),
      nationalKeyValueDifference: z.number().nullable(),
      groupATotalBidPackages: z.number().nullable(),
      groupATotalBidPackageValue: z.number().nullable(),
      groupATotalAwardedBidValue: z.number().nullable(),
      groupAValueDifference: z.number().nullable(),
      groupBTotalBidPackages: z.number().nullable(),
      groupBTotalBidPackageValue: z.number().nullable(),
      groupBTotalAwardedBidValue: z.number().nullable(),
      groupBValueDifference: z.number().nullable(),
      groupCTotalBidPackages: z.number().nullable(),
      groupCTotalBidPackageValue: z.number().nullable(),
      groupCTotalAwardedBidValue: z.number().nullable(),
      groupCValueDifference: z.number().nullable(),
      totalBidPackages: z.number().nullable(),
      totalBidPackageValue: z.number().nullable(),
      totalAwardedBidValue: z.number().nullable(),
      totalValueDifference: z.number().nullable(),
      tenderTypeCode: z.string().nullable().optional(),
      tenderTypeName: z.string().nullable().optional(),
      methodTenderTypeName: z.string().nullable().optional(),
      methodBiddingTypeName: z.string().nullable().optional(),
      type: z.number().nullable(),
    })
  ),
});

export type ContractorSelectionResult = z.infer<typeof contractorSelectionResultSchema>;
export type ContractorSelectionResultDetail = ArrayElement<
  ContractorSelectionResult['contractorSelectionResultDetails']
>;

export const defaultValuesContractorSelectionResult: ContractorSelectionResult = {
  storeId: null, //
  branchId: null, //
  id: 0, // Khóa chính
  contractorSelectionResultTime: new Date(), // Ngày lập
  userCreatedId: null, // Người lập
  managingDirectorId: null, // Giám đốc quản lý dự án
  projectId: 0, // Dự án
  content: '', // Nội dung
  ids: null, // ids
  sort: '', // sort,
  isApprove: false, // Đồng ý/Từ chối
  approveOrRejectTime: new Date(), // Thời gian duyệt
  approverId: null, // Người duyệt
  isSaveTmp: true, // Lưu tạm,
  contractorSelectionResultDetails: [
    {
      id: 0, // Khóa chính
      contractorSelectionResultId: 0, // Tổng hợp kết quả lựa chọn nhà thầu
      tenderTypeId: null, // Lĩnh vực và hình thức LCNT
      methodTenderType: null, // 1.Trong nước 2.Ngoài nước
      methodBiddingType: null, // 1.Qua mạng 2.Không qua mạng
      nationalKeyTotalBidPackages: 0, // Tổng số gói thầu
      nationalKeyTotalBidPackageValue: 0, // Tổng giá gói thầu
      nationalKeyTotalAwardedBidValue: 0, // Tổng giá trúng thầu
      nationalKeyValueDifference: 0, // Chênh lệch
      groupATotalBidPackages: 0, // Tổng số gói thầu nhóm a
      groupATotalBidPackageValue: 0, // Tổng giá gói thầu nhóm a
      groupATotalAwardedBidValue: 0, // Tổng giá trúng thầu nhóm a
      groupAValueDifference: 0, // Chênh lệch nhóm a
      groupBTotalBidPackages: 0, // Tổng số gói thầu nhóm b
      groupBTotalBidPackageValue: 0, // Tổng giá gói thầu nhóm b
      groupBTotalAwardedBidValue: 0, // Tổng giá trúng thầu nhóm b
      groupBValueDifference: 0, // Chênh lệch nhóm b
      groupCTotalBidPackages: 0, // Tổng số gói thầu nhóm c
      groupCTotalBidPackageValue: 0, // Tổng giá gói thầu nhóm c
      groupCTotalAwardedBidValue: 0, // Tổng giá trúng thầu nhóm c
      groupCValueDifference: 0, // Chênh lệch nhóm c
      totalBidPackages: 0, // Cộng Tổng số gói thầu
      totalBidPackageValue: 0, // Cộng Tổng giá gói thầu
      totalAwardedBidValue: 0, // Cộng Tổng giá trúng thầu
      totalValueDifference: 0, // Cộng Chênh lệch
      tenderTypeCode: '', // Mã lĩnh vực và hình thức LCNT
      tenderTypeName: '', // Tên hình thức và lĩnh vực LCNT
      methodTenderTypeName: '', // Trong nước, ngoài nước
      methodBiddingTypeName: '', // Qua mạng, không qua mạng
      type: null, // 1.Lĩnh vực đấu thầu 2.Hình thức LCNT
    },
  ],
};
