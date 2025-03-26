import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { ArrayElement } from './common';

export const requireProposedSettlementInvestmentCostText = requiredTextWithNamespace(
  'proposedSettlementInvestmentCost'
);

export const proposedSettlementInvestmentCostSchema = z.object({
  id: z.number(),
  projectId: z.number().nullable(),
  projectOwnerId: z.number().nullable(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  proposedSettlementInvestmentCostDetails: z.array(
    z.object({
      id: z.number(),
      proposedSettlementInvestmentCostId: z.number().nullable(),
      costItemId: z.number().nullable(),
      approvedFinalProjectBudget: z.number().nullable(),
      approvedFinalEstimate: z.number().nullable(),
      proposedSettlementValue: z.number().nullable(),
      increaseDecreaseReason: z.string().nullable().optional(),
    })
  ),
});

export type ProposedSettlementInvestmentCost = z.infer<
  typeof proposedSettlementInvestmentCostSchema
>;
export type ProposedSettlementInvestmentCostDetail = ArrayElement<
  ProposedSettlementInvestmentCost['proposedSettlementInvestmentCostDetails']
>;

export const defaultValuesProposedSettlementInvestmentCost: ProposedSettlementInvestmentCost = {
  id: 0, // Khóa chính
  projectId: null, // Tên dự án
  projectOwnerId: null, // Chủ đầu tư
  storeId: null, //
  branchId: null, // ,
  proposedSettlementInvestmentCostDetails: [
    {
      id: 0, // Khóa chính
      proposedSettlementInvestmentCostId: 0, //
      costItemId: null, // Nội dung chi phí
      approvedFinalProjectBudget: 0, // Tổng mức đầu tư của dự án (dự án thành phần, tiểu dự án độc lập) hoặc dự toán (công trình, hạng mục công trình) được phê duyệt hoặc điều chỉnh lần cuối
      approvedFinalEstimate: 0, // Dự toán (Tổng dự toán) được phê duyệt hoặc điều chỉnh lần cuối
      proposedSettlementValue: 0, // Giá trị đề nghị quyết toán
      increaseDecreaseReason: '', // Nguyên nhân tăng, giảm
    },
  ],
};
