import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

export const requireRptReportOnImplementationOfDirectivesText = requiredTextWithNamespace(
  'rptReportOnImplementationOfDirectives'
);

export const rptReportOnImplementationOfDirectivesSchema = z.object({
  id: z.number(),
  ordinalNumber: z.number().nullable(),
  executorName: z.string().nullable().optional(),
  departmentName: z.string().nullable().optional(),
  taskTargetDirectiveType: z.string().nullable().optional(),
  assignedQuantity: z.number().nullable(),
  withinDeadlineQuantity: z.number().nullable(),
  onTimeQuantity: z.number().nullable(),
  lateQuantity: z.number().nullable(),
  aheadOfScheduleQuantity: z.number().nullable(),
});

export type RptReportOnImplementationOfDirectives = z.infer<
  typeof rptReportOnImplementationOfDirectivesSchema
>;
