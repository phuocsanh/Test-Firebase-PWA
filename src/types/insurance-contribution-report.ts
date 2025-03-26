import { z } from 'zod'; 
export const insuranceContributionReportSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(), 
  salarySheetId: z.number().nullable(),
  ordinalNumber: z.string(),
  employeeName: z.string(),
  employeeId: z.number().nullable(),
  salaryCoefficient: z.number(),
  positionAllowanceCoefficient: z.number(),
  baseSalary: z.number(),
  agencySocialInsurance: z.number(),
  agencyHealthInsurance: z.number(),
  agencyAccidentInsurance: z.number(),
  personalSocialInsurance: z.number(),
  personalHealthInsurance: z.number(),
  personalAccidentInsurance: z.number(),
  totalSocialInsurance: z.number(),
  totalHealthInsurance: z.number(),
  totalAccidentInsurance: z.number(),
  totalInsurance: z.number(),
});

export type InsuranceContributionReport = z.infer<typeof insuranceContributionReportSchema>;
