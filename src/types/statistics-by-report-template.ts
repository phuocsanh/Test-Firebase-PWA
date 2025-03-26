import { z } from 'zod';

// const requireStatisticsByReportTemplateText = requiredTextWithNamespace(
//   'statisticsByReportTemplate'
// );

export const statisticsByReportTemplateSchema = z.object({
  // code: z
  //   .string({
  //     required_error: requireStatisticsByReportTemplateText('code'),
  //     invalid_type_error: requireStatisticsByReportTemplateText('code'),
  //   })
  //   .min(1, { message: requireStatisticsByReportTemplateText('code') }),
  template: z.string().optional().nullable(),
  templateName: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  reportDate: z.string().optional().nullable(),
  reporterId: z.string().optional().nullable(),
});

export type StatisticsByReportTemplate = z.infer<typeof statisticsByReportTemplateSchema>;
