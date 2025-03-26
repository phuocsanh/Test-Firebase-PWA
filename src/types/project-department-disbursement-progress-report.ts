import { z } from 'zod';

export const projectDepartmentDisbursementProgressReportSchema = z.object({
  id: z.number(),
  ordinal_number: z.number(),
  noi_dung: z.string().nullable().optional(),
});

export type ProjectDepartmentDisbursementProgressReport = z.infer<
  typeof projectDepartmentDisbursementProgressReportSchema
>;
