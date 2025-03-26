import { z } from 'zod';

export const projectDepartmentDisbursementProgressDetailReportSchema = z.object({
  id: z.number(),
  ordinal_number: z.number(),
  noi_dung: z.string().nullable().optional(),
  budget_fund_id: z.number().nullable(),
  budget_fund_code: z.string().nullable().optional(),
  parent_id: z.number().nullable(),
});

export type ProjectDepartmentDisbursementProgressDetailReport = z.infer<
  typeof projectDepartmentDisbursementProgressDetailReportSchema
>;
