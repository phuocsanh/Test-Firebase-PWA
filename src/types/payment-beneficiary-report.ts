import { z } from 'zod';
export const paymentBeneficiaryReportSchema = z.object({
  id: z.number(), 
  storeId: z.number().nullable(),
  branchId: z.number().nullable(), 
  salarySheetId: z.number(),
  ordinalNumber: z.number(),
  employeeName: z.string(),
  employeeId: z.number(),
  employeeTypeId: z.number(),
  employeeTypeName: z.string(),
  bankNumber: z.string(),
  bankName: z.string(),
  totalSalary: z.number(),
  permanentStaffSalary: z.number(),
  positionAllowance: z.number(),
  overtimeAllowance: z.number(),
  hazardAllowance: z.number(),
  responsibilityAllowance: z.number(),
  seniorityExceedingAllowance: z.number(),
  contractualLaborWage: z.number(),
  bonus: z.number(),
  otherAllowances: z.number(),
  phoneExpense: z.number(),
  travelAllowance: z.number(),
  scholarshipFund: z.number(),
});

export type PaymentBeneficiaryReport = z.infer<typeof paymentBeneficiaryReportSchema>;
