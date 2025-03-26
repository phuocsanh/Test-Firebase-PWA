import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { ArrayElement } from './common';

export const requireDataReconciliationTableText =
  requiredTextWithNamespace('dataReconciliationTable');

//Bảng đối chiều số liệu
export const dataReconciliationTableSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  projectId: z.number().nullable(),
  projectOwnerId: z.number().nullable(),
  dataReconciliationTableTime: z.date().nullable().optional(),
  ids: z.number().nullable(),
  sort: z.string().nullable().optional(),
  code: z.string().nullable().optional(),
  dataReconciliationTableDetails: z.array(
    z.object({
      id: z.number(),
      dataReconciliationTableId: z.number().nullable().optional(),
      budgetFundId: z.number().nullable(),
      budgetYear: z.number().nullable().optional(),
      poPlannedCapital: z.number().nullable().optional(),
      poDisbursedTotal: z.number().nullable().optional(),
      poDisbursedCompletedWorkload: z.number().nullable().optional(),
      poDisbursedAdvance: z.number().nullable().optional(),
      amountPlannedCapital: z.number().nullable().optional(),
      amountAllocatedTotal: z.number().nullable().optional(),
      amountAllocatedCompletedWorkload: z.number().nullable().optional(),
      amountAllocatedAdvance: z.number().nullable().optional(),
      difference: z.number().nullable().optional(),
      notes: z.string().nullable().optional(),
    })
  ),
});

export type DataReconciliationTable = z.infer<typeof dataReconciliationTableSchema>;
export type DataReconciliationTableDetail = ArrayElement<
  DataReconciliationTable['dataReconciliationTableDetails']
>;

export const defaultValuesDataReconciliationTable: DataReconciliationTable = {
  id: 0, // Khóa chính
  storeId: null, //
  branchId: null, //
  projectId: null, // Dự án
  projectOwnerId: null, // Chủ đầu tư
  dataReconciliationTableTime: new Date(), // Ngày lập
  ids: null, // ids
  sort: '', // sort
  code: '', // Mã phiếu,
  dataReconciliationTableDetails: [
    {
      id: 0, // Khóa chính
      dataReconciliationTableId: 0, //
      budgetFundId: null, // Nội dung
      budgetYear: 0, // Năm ngân sách
      poPlannedCapital: 0, // Số liệu của chủ đầu tư - vốn kế hoạch
      poDisbursedTotal: 0, // Số liệu của chủ đầu tư - Số vốn đã giải ngân - Tổng số
      poDisbursedCompletedWorkload: 0, // Số liệu của chủ đầu tư - Số vốn đã giải ngân - Thanh toán khối lượng hoàn thành
      poDisbursedAdvance: 0, // Số liệu của chủ đầu tư - Số vốn đã giải ngân - Tạm ứng
      amountPlannedCapital: 0, // Thành tiền - Kế hoạch vốn
      amountAllocatedTotal: 0, // Thành tiền - Số vốn đã cấp, cho vay, thanh toán - Tổng số
      amountAllocatedCompletedWorkload: 0, // Thành tiền - Số vốn đã cấp, cho vay, thanh toán - Thanh toán KLHT
      amountAllocatedAdvance: 0, // Thành tiền - Số vốn đã cấp, cho vay, thanh toán - Tạm ứng
      difference: 0, // Chênh lệch
      notes: '', // Ghi chú
    },
  ],
};
