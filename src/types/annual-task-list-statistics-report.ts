import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
export const requireRptAnnualTaskListStatisticsText = requiredTextWithNamespace(
  'rptAnnualTaskListStatistics'
);

export const rptAnnualTaskListStatisticsSchema = z.object({
  id: z.number(),
  ordinalNumber: z.number(),
  annualDirectiveContent: z.string().nullable().optional(),
  approvedConfirmed: z.number().nullable(),
  pendingApprovalConfirmation: z.number().nullable(),
});

export type RptAnnualTaskListStatistics = z.infer<typeof rptAnnualTaskListStatisticsSchema>;
