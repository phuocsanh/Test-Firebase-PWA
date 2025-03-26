import { z } from 'zod';
export const employeePayrollReportSchema = z.object({
  id: z.number(),
  salarySheetId: z.number(),
  ordinalNumber: z.number(),
  employeeId: z.number(),
  employeeName: z.string(),
  positionId: z.number(),
  randCode: z.string(),
  salaryCoefficient: z.number(),
  salaryTotalAmount: z.number(),
  salaryDeductionsFromSalary: z.number(),
  salaryNetSalary: z.number(),
  positionAllowancTotalAmount: z.number(),
  positionAllowancDeductionsFromSalary: z.number(),
  positionAllowancNetSalary: z.number(),
  beyondTheSalaryScaleTotalAmount: z.number(),
  beyondTheSalaryScaledeductionsFromSalary: z.number(),
  beyondTheSalaryScaleNetSalary: z.number(),
  chiefAccountantResponsibilityAllowance: z.number(),
  hazardAllowance: z.number(),
  professionalSeniorityAllowance: z.number(),
  internshipMentorshipResponsibilityAllowance: z.number(),
  netSalary: z.number(),
});

export type EmployeePayrollReport = z.infer<typeof employeePayrollReportSchema>;
