import { z } from 'zod';

//thống kê: kết quả LCNT theo GDDA
export const contractorSelectionResultByManagingDirectorReportSchema = z.object({
  id: z.number(),
  tenderTypeId: z.number(),
  methodTenderType: z.number(),
  methodBiddingType: z.number(),
  nationalKeyTotalBidPackages: z.number(),
  nationalKeyTotalBidPackageValue: z.number(),
  nationalKeyTotalAwardedBidValue: z.number(),
  nationalKeyValueDifference: z.number(),
  groupATotalBidPackages: z.number(),
  groupATotalBidPackageValue: z.number(),
  groupATotalAwardedBidValue: z.number(),
  groupAValueDifference: z.number(),
  groupBTotalBidPackages: z.number(),
  groupBTotalBidPackageValue: z.number(),
  groupBTotalAwardedBidValue: z.number(),
  groupBValueDifference: z.number(),
  groupCTotalBidPackages: z.number(),
  groupCTotalBidPackageValue: z.number(),
  groupCTotalAwardedBidValue: z.number(),
  groupCValueDifference: z.number(),
  totalBidPackages: z.number(),
  totalBidPackageValue: z.number(),
  totalAwardedBidValue: z.number(),
  totalValueDifference: z.number(),
  tenderTypeName: z.string(),
  tenderTypeCode: z.string(),
  ordinalNumber: z.number(),
  methodTenderTypeName: z.string(),
  methodBiddingTypeName: z.string(),
});

export type ContractorSelectionResultByManagingDirectorReport = z.infer<
  typeof contractorSelectionResultByManagingDirectorReportSchema
>;

export const defaultValuesContractorSelectionResultByManagingDirectorReport: ContractorSelectionResultByManagingDirectorReport =
  {
    id: 0,
    tenderTypeId: 0, // Hình thức và lĩnh vực
    methodTenderType: 0, // 1.Trong nước 2.Ngoài nước
    methodBiddingType: 0, // 1.Qua mạng 2.Không qua mạng
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
    tenderTypeName: '', // Tên hình thức lựa chọn nhà thầu
    tenderTypeCode: '', // Mã hình thức lựa chọn nhà thầu
    ordinalNumber: 0, // Tổng hợp kết quả LCNT theo giám đốc dự án
    methodTenderTypeName: '', // Trong nước, ngoài nước
    methodBiddingTypeName: '', // Qua mạng, không qua mạng,
  };
