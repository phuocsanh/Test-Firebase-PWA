import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

export const requireRptYearlySummaryText = requiredTextWithNamespace('rptYearlySummary');

export const rptYearlySummarySchema = z.object({
  totalAssignedTargetsTasks: z.number().nullable(),
  onTimeCompletion: z.number().nullable(),
  lateCompletion: z.number().nullable(),
  incompleteTasks: z.number().nullable(),
  onTimeCompletionRate: z.number().nullable(),
  lateCompletionRate: z.number().nullable(),
  incompletionRate: z.number().nullable(),
  id: z.number(),
  ordinalNumber: z.number(),
});

export type RptYearlySummary = z.infer<typeof rptYearlySummarySchema>;
