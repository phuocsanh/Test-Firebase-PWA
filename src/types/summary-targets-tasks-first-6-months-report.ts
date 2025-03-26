import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

export const requireRptSummaryTargetsTasksFirst6MonthsText = requiredTextWithNamespace(
  'rptSummaryTargetsTasksFirst6Months'
);

export const rptSummaryTargetsTasksFirst6MonthsSchema = z.object({
  q1AssignedTargets: z.number().nullable(),
  q1CompletedTargets: z.number().nullable(),
  q1IncompleteTargets: z.number().nullable(),
  q1AssignedTasks: z.number().nullable(),
  q1CompletedTasksOnTime: z.number().nullable(),
  q1CompletedTasksLate: z.number().nullable(),
  q1IncompleteTasksWithinDeadline: z.number().nullable(),
  q1IncompleteTasksPastDeadline: z.number().nullable(),
  q2AssignedTargets: z.number().nullable(),
  q2CompletedTargets: z.number().nullable(),
  q2IncompleteTargets: z.number().nullable(),
  q2AssignedTasks: z.number().nullable(),
  q2CompletedTasksOnTime: z.number().nullable(),
  q2CompletedTasksLate: z.number().nullable(),
  q2IncompleteTasksWithinDeadline: z.number().nullable(),
  q2IncompleteTasksPastDeadline: z.number().nullable(),
  ordinalNumber: z.number().nullable(),
  id: z.number(),
});

export type RptSummaryTargetsTasksFirst6Months = z.infer<
  typeof rptSummaryTargetsTasksFirst6MonthsSchema
>;
