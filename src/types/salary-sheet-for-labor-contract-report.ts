import { z } from 'zod';
export const salarySheetForLaborContractReportSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  salarySheetId: z.number().nullable(),
  ordinalNumber: z.number().nullable(),
  employeeId: z.number().nullable(),
  employeeName: z.string(),
  randCode: z.string(),
  level: z.string(),
  salaryCoefficient: z.number(),
  jobAllowance: z.number(),
  hazardAllowance: z.number(),
  basicSalary: z.number(),
  personalSocialInsurance: z.number(),
  personalHealthInsurance: z.number(),
  personalAccidentInsurance: z.number(),
  totalAmount: z.number(),
});

export type SalarySheetForLaborContractReport = z.infer<typeof salarySheetForLaborContractReportSchema>;
