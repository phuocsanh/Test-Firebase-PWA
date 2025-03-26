import { z } from 'zod';

export const capitalPlanDisbursementProgressReportSchema = z.object({
  id: z.number(),
  ordinalNumber: z.number().nullable(),
  budgetFundId: z.number().nullable(),
  budgetFundName: z.string().nullable().optional(),
  parentId: z.number().nullable(),
  totalProject: z.number().nullable(),
  totalPlannedCapitalMillionVnd: z.number().nullable(),
  cumulativeDisbursedValueMillionVnd: z.number().nullable(),
  disbursementRatePercent: z.number().nullable(),
});

export type CapitalPlanDisbursementProgressReport = z.infer<
  typeof capitalPlanDisbursementProgressReportSchema
>;
