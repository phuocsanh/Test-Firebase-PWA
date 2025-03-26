import { z } from 'zod';

/* Total */
export const contractorParticipationTenderPackageListReportTotalSchema = z.object({
  id: z.number(),
  ordinalNumber: z.number().nullable(), // STT
  contractorTypeId: z.number().nullable(), // Id loại nhà thầu
  contractorTypeName: z.string().nullable(), // Loại nhà thầu
  totalPackageValue: z.number().nullable(), // Tổng giá gói thầu
  totalContractValue: z.number().nullable(), // Tổng giá trị HĐ
  priceDifference: z.number().nullable(), // Chênh lệch
  savingRatePercent: z.number().nullable(), // Tỷ lệ % tiết kiệm
});

export const contractorParticipationTenderPackageListReportTotalSummarySchema = z.object({
  sumTotalPackageValue: z.number().nullable(), // Tổng Tổng giá gói thầu
  sumTotalContractValue: z.number().nullable(), // Tổng Tổng giá trị HĐ
  sumPriceDifference: z.number().nullable(), // Tổng Chênh lệch
  sumSavingRatePercent: z.number().nullable(), // Tổng Tỷ lệ % tiết kiệm
});

export type ContractorParticipationTenderPackageListReportTotal = z.infer<
  typeof contractorParticipationTenderPackageListReportTotalSchema
>;
export type ContractorParticipationTenderPackageListReportTotalSummary = z.infer<
  typeof contractorParticipationTenderPackageListReportTotalSummarySchema
>;

/* Detail */
export const contractorParticipationTenderPackageListReportDetailSchema = z.object({
  ordinalNumber: z.number(), // STT
  budgetFundName: z.string(), // Ngân sách
  projectName: z.string(), // Công trình, dự án
  contractorName: z.string(), // Nhà thầu
  contractSigningDate: z.string(), // Thời gian ký kết hợp đồng
  tenderTypeName: z.string(), // Hình thức LCNT
  packageValueVnd: z.number(), // Giá gói thầu (đồng)
  contractValueVnd: z.number(), // Giá hợp đồng (đồng)
  priceDifference: z.number(), // Chênh lệch
});

export const contractorParticipationTenderPackageListReportDetailSummarySchema = z.object({
  sumPackageValueVnd: z.number(), // Tổng Giá gói thầu (đồng)
  sumContractValueVnd: z.number(), // Tổng Giá hợp đồng (đồng)
  sumPriceDifference: z.number(), // Tổng Chênh lệch
});

export type ContractorParticipationTenderPackageListReportDetail = z.infer<
  typeof contractorParticipationTenderPackageListReportDetailSchema
>;
export type ContractorParticipationTenderPackageListReportDetailSummary = z.infer<
  typeof contractorParticipationTenderPackageListReportDetailSummarySchema
>;
