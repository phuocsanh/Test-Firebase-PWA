import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { ArrayElement } from './common';

export const requireReportAnnex3aText = requiredTextWithNamespace('reportAnnex3A');

export const reportAnnex3aSchema = z.object({
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  ids: z.number().nullable(),
  sort: z.string().nullable().optional(),
  code: z.string().nullable().optional(),
  id: z.number(),
  projectId: z
    .number({
      required_error: requireReportAnnex3aText('projectId'),
      invalid_type_error: requireReportAnnex3aText('projectId'),
    })
    .min(1, { message: requireReportAnnex3aText('projectId') })
    .optional(),
  sumContractValue: z.number().nullable(),
  sumAdvancePaymentValueForThePeriod: z.number().nullable(),
  sumAdvancePaymentExecution: z.number().nullable(),
  sumCompletedVolumeThisPeriod: z.number().nullable(),
  sumAdvancePaymentRecovery: z.number().nullable(),
  sumDisbursementRequestValue: z.number().nullable(),
  sumCumulativeDisbursedValue: z.number().nullable(),
  completionAcceptanceId: z
    .number({
      required_error: requireReportAnnex3aText('completionAcceptanceId'),
      invalid_type_error: requireReportAnnex3aText('completionAcceptanceId'),
    })
    .min(1, { message: requireReportAnnex3aText('completionAcceptanceId') })
    .optional(),
  reservefund: z.number().nullable(),
  note: z.string().nullable().optional(),
  userCreatedId: z.number().nullable(),
  reportAnnex3aTime: z.date(),
  projectProjectOwner: z.string().nullable(),
  completionAcceptanceTenderPackage: z.string().nullable(),
  completionAcceptanceTime: z.date().optional().nullable(),
  completionAcceptanceContractSigningDate: z.date().optional().nullable(),
  completionAcceptanceContractAppendixSigningDate: z.date().optional().nullable(),
  completionAcceptanceCode: z.string().nullable(),
  completionAcceptanceContractAppendixNumber: z.string().nullable(),
  completionAcceptancePhase: z.string().nullable(),
  reportAnnex3aOverviews: z.array(
    z.object({
      id: z.number(),
      reportAnnex3aId: z.number().nullable(),
      contractorId: z.number().nullable(),
      contractValue: z.number().nullable(),
      advancePaymentValueForThePeriod: z.number().nullable(),
      advancePaymentExecution: z.number().nullable(),
      completedVolumeThisPeriod: z.number().nullable(),
      advancePaymentRecovery: z.number().nullable(),
      valuePaymentForCompletedVolume: z.number().nullable(),
      valueAdvancePayment: z.number().nullable(),
      cumulativePaymentForCompletedVolume: z.number().nullable(),
      cumulativeAdvancePayment: z.number().nullable(),
    })
  ),
  reportAnnex3aDetails: z.array(
    z.object({
      id: z.number(),
      reportAnnex3aId: z.number().nullable(),
      constructionTaskId: z.number().nullable(),
      constructionTaskCode: z.string().nullable(),
      constructionTaskName: z.string().nullable(),
      unitId: z.number().nullable(),
      unitName: z.string().nullable(),
      contractorId: z.number().nullable(),
      contractedOrEstimatedQuantity: z.number().nullable(),
      cumulativePreviousPeriod: z.number().nullable(),
      currentPeriodExecution: z.number().nullable(),
      contractedOrEstimatedPaymentPrice: z.number().nullable(),
      note: z.string().nullable().optional(),
    })
  ),
});

export const getReportAnnex3aSchema = z.object({
  ordinalNumber: z.number(),
  constructionTaskId: z.number(),
  constructionTaskCode: z.string().nullable(),
  constructionTaskName: z.string().nullable(),
  unitId: z.number(),
  unitName: z.string().nullable(),
  contractorId: z.number(),
  contractorName: z.string().nullable(),
  currentPeriodExecution: z.number().nullable(),
  contractedOrEstimatedPaymentPrice: z.number().nullable(),
  contractedOrEstimatedQuantity: z.number().nullable(),
  cumulativePreviousPeriod: z.number().nullable(),
});

export const getReportAnnex3aPaymentReceiptSchema = z.object({
  ordinalNumber: z.number(),
  contractorId: z.number(),
  payment: z.number().nullable(),
  advance: z.number().nullable(),
});
export const getReportAnnex3aContractorSchema = z.object({
  contractorId: z.number(),
  code: z.string().nullable(),
  name: z.string().nullable(),
});

export type GetReportAnnex3a = z.infer<typeof getReportAnnex3aSchema>;
export type GetReportAnnex3aPaymentReceipt = z.infer<typeof getReportAnnex3aPaymentReceiptSchema>;
export type GetReportAnnex3aContractor = z.infer<typeof getReportAnnex3aContractorSchema>;
export type ReportAnnex3a = z.infer<typeof reportAnnex3aSchema> & {
  reportAnnex3aDetailsLocal?: Record<string, string | number | null | undefined>[]; // Chi ho tro cho UI
};
export type ReportAnnex3aOverview = ArrayElement<ReportAnnex3a['reportAnnex3aOverviews']>;
export type ReportAnnex3aDetail = ArrayElement<ReportAnnex3a['reportAnnex3aDetails']>;

export const defaultValuesReportAnnex3a: ReportAnnex3a = {
  storeId: null, //
  branchId: null, //
  ids: null, // ids
  sort: '', // sort
  code: '', // Mã phiếu
  id: 0, // Khóa chính
  projectId: undefined, // Dự án
  sumContractValue: 0, // 1. Giá trị hợp đồng
  sumAdvancePaymentValueForThePeriod: 0, // 2. Giá trị tạm ứng trong kỳ
  sumAdvancePaymentExecution: 0, // 3.Thanh toán thực hiện tạm ứng
  sumCompletedVolumeThisPeriod: 0, // 4. KLTH kỳ này
  sumAdvancePaymentRecovery: 0, // 5. Thanh toán THTU
  sumDisbursementRequestValue: 0, // 6. Giá trị đề nghị giải ngân
  sumCumulativeDisbursedValue: 0, // 7.Lũy kế giá trị giải ngân
  completionAcceptanceId: undefined, // Nghiệm thu
  reservefund: 0, // Dự phòng phí
  note: '', // Ghi chú
  userCreatedId: null, // Người lập
  reportAnnex3aTime: new Date(), // Ngày lập,
  projectProjectOwner: null, // Chủ đầu tư
  completionAcceptanceTenderPackage: null, // Gói thầu
  completionAcceptanceTime: new Date(), // Thời gian nghiệm thu
  completionAcceptanceContractSigningDate: new Date(), // Ngày ký hợp đồng
  completionAcceptanceContractAppendixSigningDate: null, // Ngày ký phụ lục hợp đồng
  completionAcceptanceCode: '', // Mã nghiệm thu
  completionAcceptanceContractAppendixNumber: '', // Sô phụ lục hợp đồng
  completionAcceptancePhase: '', // Giai đoạn nghiệm thu
  reportAnnex3aOverviews: [
    {
      id: 0, // Khóa chính
      reportAnnex3aId: 0, // Báo cáo phụ lục 3A
      contractorId: null, // Nhà thầu
      contractValue: 0, // 1. Giá trị hợp đồng (giá trị dự toán được duyệt trong trường hợp thực hiện không thông qua hợp đồng)
      advancePaymentValueForThePeriod: 0, // 2. Giá trị tạm ứng còn lại chưa thu hồi đến cuối kỳ trước
      advancePaymentExecution: 0, // 3. Số tiền đã thanh toán khối lượng hoàn thành kỳ trước
      completedVolumeThisPeriod: 0, // 4. Lũy kế giá trị khối lượng thực hiện đến cuối kỳ này
      advancePaymentRecovery: 0, // 5. Thanh toán để thu hồi tạm ứng
      valuePaymentForCompletedVolume: 0, // 6. Giá trị đề nghị giải ngân kỳ này - Thanh toán khối lượng hoàn thành
      valueAdvancePayment: 0, // 6. Giá trị đề nghị giải ngân kỳ này - tạm ứng
      cumulativePaymentForCompletedVolume: 0, // 7. Luỹ kế giá trị giải ngân, trong đó - Thanh toán khối lượng hoàn thành
      cumulativeAdvancePayment: 0, // 7. Luỹ kế giá trị giải ngân, trong đó - tạm ứng
    },
  ],
  reportAnnex3aDetails: [
    {
      id: 0, // Khóa chính
      reportAnnex3aId: 0, // Báo cáo phụ lục 3A
      constructionTaskId: null, // Tên công việc
      constructionTaskCode: '',
      constructionTaskName: '',
      unitId: null, // Đơn vị tính
      unitName: '',
      contractorId: 0, // Nhà thầu
      contractedOrEstimatedQuantity: 0, // Khối lượng theo hợp đồng hoặc dự toán
      cumulativePreviousPeriod: 0, // Lũy kế đến hết kỳ trước
      currentPeriodExecution: 0, // Thực hiện kỳ này
      contractedOrEstimatedPaymentPrice: 0, // Đơn giá thanh toán theo hợp đồng hoặc dự án
      note: '', // Ghi chú
    },
  ],
};
