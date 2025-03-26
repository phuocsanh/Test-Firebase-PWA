import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

export const requireRptSummaryTargetsTasksLast6MonthsText = requiredTextWithNamespace(
  'rptSummaryTargetsTasksLast6Months'
);

export const rptSummaryTargetsTasksLast6MonthsSchema = z.object({
  q3AssignedTargets: z.number().nullable(),
  q3CompletedTargets: z.number().nullable(),
  q3IncompleteTargets: z.number().nullable(),
  q3AssignedTasks: z.number().nullable(),
  q3CompletedTasksOnTime: z.number().nullable(),
  q3CompletedTasksLate: z.number().nullable(),
  q3IncompleteTasksWithinDeadline: z.number().nullable(),
  q3IncompleteTasksPastDeadline: z.number().nullable(),
  q4AssignedTargets: z.number().nullable(),
  q4CompletedTargets: z.number().nullable(),
  q4IncompleteTargets: z.number().nullable(),
  q4AssignedTasks: z.number().nullable(),
  q4CompletedTasksOnTime: z.number().nullable(),
  q4CompletedTasksLate: z.number().nullable(),
  q4IncompleteTasksWithinDeadline: z.number().nullable(),
  q4IncompleteTasksPastDeadline: z.number().nullable(),
  ordinalNumber: z.number().nullable(),
  id: z.number(),
});

export type RptSummaryTargetsTasksLast6Months = z.infer<
  typeof rptSummaryTargetsTasksLast6MonthsSchema
>;
