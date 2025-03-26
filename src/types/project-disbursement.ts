import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { ArrayElement } from './common';

export const requireProjectDisbursementText = requiredTextWithNamespace('projectDisbursement');

export const projectDisbursementSchema = z.object({
  id: z.number(),
  storeId: z.number(),
  branchId: z.number().nullable(),
  projectId: z.number().nullable(),
  year: z.date(),
  ids: z.number().nullable(),
  sort: z.string(),
  projectDisbursementDetails: z.array(
    z.object({
      id: z.number(),
      projectDisbursementId: z.number().nullable(),
      task: z.string().nullable().optional(),
      contractValue: z.number().nullable(),
      executedValue: z.number().nullable(),
      year1: z.number().nullable(),
      year2: z.number().nullable(),
      year3: z.number().nullable(),
      year4: z.number().nullable(),
      cumulativeExecutedVolume: z.number().nullable(),
      finalSettlementAB: z.number().nullable(),
      cumulativePaidValue: z.number().nullable(),
      remainingValue: z.number().nullable(),
      executingAgency: z.string(),
      capitalProposal: z.number().nullable(),
      note: z.string(),
    })
  ),
});

export type ProjectDisbursement = z.infer<typeof projectDisbursementSchema>;
export type ProjectDisbursementDetail = ArrayElement<
  ProjectDisbursement['projectDisbursementDetails']
>;

export const defaultValuesProjectDisbursement: ProjectDisbursement = {
  id: 0, // Khóa chính
  storeId: 0, //
  branchId: null, //
  projectId: null, // Dự án
  year: new Date(), // Năm
  ids: null, // ids
  sort: '', // sort,
  projectDisbursementDetails: [
    {
      id: 0, // Khóa chính
      projectDisbursementId: 0, // Giải ngân theo dự án
      task: '', // Công việc
      contractValue: 0, // Giá trị hợp đồng
      executedValue: 0, // Giá trị thực hiện
      year1: 0, // Năm 1
      year2: 0, // Năm 2
      year3: 0, // Năm 3
      year4: 0, // Năm 4
      cumulativeExecutedVolume: 0, // Lũy kế khối lượng thực hiện
      finalSettlementAB: 0, // Quyết toán A-B
      cumulativePaidValue: 0, // Lũy kế giá trị thanh toán
      remainingValue: 0, // Giá trị còn lại
      executingAgency: '', // Cơ quan đơn vị thực hiện
      capitalProposal: 0, // Đề xuất vốn
      note: '', // Ghi chú
    },
  ],
};
