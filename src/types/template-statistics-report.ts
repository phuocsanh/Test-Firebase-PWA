import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

const requiredTS = requiredTextWithNamespace('templateStatisticsReport');

export const templateStatisticReportFilterSchema = z.object({
  numberOfCode: z.string().optional().nullable(),
  reportTemplateId: z
    .number({
      invalid_type_error: requiredTS('reportTemplateId', 'select'),
      required_error: requiredTS('reportTemplateId', 'select'),
    })
    .min(1, requiredTS('reportTemplateId')),
  year: z.date({
    invalid_type_error: requiredTS('year', 'select'),
    required_error: requiredTS('year', 'select'),
  }),
  name: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  userCreatedId: z.number().optional().nullable(),
  reportTemplateTime: z.date().optional().nullable(),
});

export type TemplateStatisticsReportFilter = z.infer<typeof templateStatisticReportFilterSchema>;

export type TemplateStatisticReportResponse = {
  id: number;
  capitalIncreasePlanDetailId: number;
  ordinalNumber: number;
  projectId: number;
  templateStatisticsDetailReportDto: Array<{
    displayCaption: string;
    capitalIncreasePlanDetailId: number;
    nameField: string;
    parentId: number | null;
    projectId: number;
    reportTemplateDetailId: number;
    value: string;
    valueType: number;
  }>;
};
