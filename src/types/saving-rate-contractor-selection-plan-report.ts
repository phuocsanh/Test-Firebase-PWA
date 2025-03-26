import { z } from 'zod';

export const savingRateContractorSelectionPlanReportSchema = z.object({
  id: z.number(),
  ordinalNumber: z.number(),
  biddingSectorName: z.string().optional(),
  inPhase: z.string().optional(),
  singlePackageValueVnd: z.number(),
  singleContractValueVnd: z.number(),
  singleSavingRatePercent: z.number(),
  biddingPackageValueVnd: z.number(),
  biddingContractValueVnd: z.number(),
  biddingSavingRatePercent: z.number(),
  packageValueVnd: z.number(),
  contractValueVnd: z.number(),
});

export type SavingRateContractorSelectionPlanReport = z.infer<
  typeof savingRateContractorSelectionPlanReportSchema
>;
