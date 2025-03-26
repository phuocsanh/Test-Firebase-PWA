import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { ArrayElement } from './common';
import { defaultValuesRecordAttachment, recordAttachmentSchema } from './records-attachment';

export const requireReportPublicInvestmentSettlementText = requiredTextWithNamespace(
  'reportPublicInvestmentSettlement'
);

export const reportPublicInvestmentSettlementSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  ids: z.number().nullable(),
  sort: z.string().nullable().optional(),
  code: z.string().nullable().optional(),
  reportPublicInvestmentSettlementTime: z.date().nullable().optional(),
  budgetYear: z.date().nullable().optional(),
  budgetFundId: z.number().nullable(),
  note: z.string().nullable().optional(),
  reportPublicInvestmentSettlementDetails: z.array(
    z.object({
      id: z.number(),
      reportPublicInvestmentSettlementId: z.number().nullable(),
      projectId: z.number().nullable(),
      accountOpeningLocation: z.string().nullable().optional(),
      investmentProjectCode: z.string().nullable().optional(),
      totalInvestment: z.number().nullable(),
      totalFunding: z.number().nullable(),
      advanceFundsUnrecovered: z.number().nullable(),
      adjustedRecoveredAdvance: z.number().nullable(),
      settledWorkloadPayment: z.number().nullable(),
      extendedFundingPlanBeforeTheSettlement: z.number().nullable(),
      totalExtendedFundsDisbursementBeforeTheSettlement: z.number().nullable(),
      extendedFundingPaymentDisbursementBeforeTheSettlement: z.number().nullable(),
      extendedAdvanceFundsDisbursementBeforeTheSettlement: z.number().nullable(),
      furtherExtendedFundingPlanBeforeTheSettlement: z.number().nullable(),
      unusedFundsCancellation: z.number().nullable(),
      fundingPlan: z.number().nullable(),
      totalExtendedFundsDisbursementCurrentYear: z.number().nullable(),
      extendedFundingPaymentDisbursementCurrentYear: z.number().nullable(),
      extendedAdvanceFundsDisburementCurrentYear: z.number().nullable(),
      furtherExtendedFundingPlanCurrentYear: z.number().nullable(),
      currentYearUnusedFundsCancellation: z.number().nullable(),
      totalSettledFunding: z.number().nullable(),
      cumulativeUnrecoveredAdvance: z.number().nullable(),
      cumulativeDisbursedFunding: z.number().nullable(),
    })
  ),
  itemsRecordManagement: z.array(recordAttachmentSchema),
});

export type ReportPublicInvestmentSettlement = z.infer<
  typeof reportPublicInvestmentSettlementSchema
>;
export type ReportPublicInvestmentSettlementDetail = ArrayElement<
  ReportPublicInvestmentSettlement['reportPublicInvestmentSettlementDetails']
>;

export const defaultValuesReportPublicInvestmentSettlement: ReportPublicInvestmentSettlement = {
  id: 0, // Khóa chính
  storeId: null, //
  branchId: null, //
  ids: null, // ids
  sort: '', // sort
  code: '', // Mã phiếu
  reportPublicInvestmentSettlementTime: new Date(), // Ngày lập
  budgetYear: new Date(), // Năm ngân sách
  budgetFundId: null, // Nguồn ngân sách
  note: '', // Ghi chú,
  itemsRecordManagement: [defaultValuesRecordAttachment],
  reportPublicInvestmentSettlementDetails: [
    {
      id: 0, // Khóa chính
      reportPublicInvestmentSettlementId: 0, //
      projectId: null, // Dự án
      accountOpeningLocation: '', // Địa điểm mở tài khoản
      investmentProjectCode: '', // Mã dự án đầu tư
      totalInvestment: 0, // Tổng mức đầu tư
      totalFunding: 0, // Tổng số
      advanceFundsUnrecovered: 0, // Vốn tạm ứng theo chế độ chưa thu hồi
      adjustedRecoveredAdvance: 0, // Sô vốn tạm ứng theo chế độ chưa thu hồi của các năm trước nộp điều chỉnh giảm trong năm QT
      settledWorkloadPayment: 0, // Thanh toán KLHT trong năm QT phần vốn tạm ứng theo chế độ chưa thu hồi tư K/C đến hết năm SN trước năm QT
      extendedFundingPlanBeforeTheSettlement: 0, // Kế hoạch vốn được kéo dài
      totalExtendedFundsDisbursementBeforeTheSettlement: 0, // Tổng số - Giải ngân- trước năm quyết toán
      extendedFundingPaymentDisbursementBeforeTheSettlement: 0, // Thanh toán - Giải ngân - trước năm quyết toán
      extendedAdvanceFundsDisbursementBeforeTheSettlement: 0, // Vốn tạm ứng - Giải ngân - trước năm quyết toán
      furtherExtendedFundingPlanBeforeTheSettlement: 0, // Vốn KH tiếp tục được phép kéo dài sang thời gian thực hiện và giải ngân sang năm sau năm QT (nếu có)
      unusedFundsCancellation: 0, // Số vốn còn lại chưa giải ngân hủy bỏ
      fundingPlan: 0, // Vốn KH của năm
      totalExtendedFundsDisbursementCurrentYear: 0, // Tổng số - Giải ngân - Trong năm quyết toán
      extendedFundingPaymentDisbursementCurrentYear: 0, // Thanh toán KLTH - Giải ngân - Trong năm quyết toán
      extendedAdvanceFundsDisburementCurrentYear: 0, // Vốn tạm ứng - Giải ngân - Trong năm quyết toán
      furtherExtendedFundingPlanCurrentYear: 0, //  Vốn KH được phép kéo dài thời gian thực hiện và giải ngân sang năm sau năm QT (nếu có)
      currentYearUnusedFundsCancellation: 0, // Số vốn còn lại chưa giải ngân hủy bỏ (nếu có)
      totalSettledFunding: 0, // Tổng cộng vốn đã thanh toán KLHT được QT trong năm QT
      cumulativeUnrecoveredAdvance: 0, // Lũy kế vốn tạm ứng theo chế độ chưa thu hồi đến hết năm QT chuyển sang các năm sau
      cumulativeDisbursedFunding: 0, // Lũy kế số vốn đã giải ngân từ KC đến hết năm QT
    },
  ],
};
