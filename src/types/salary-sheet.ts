import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { ArrayElement } from './common';
export const requireSalarySheetText = requiredTextWithNamespace('salarySheet');

export const salarySheetSchema = z.object({
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  id: z.number(),
  salarySheetTime: z.date({
    required_error: requireSalarySheetText('salarySheetTime', 'select'),
  }),
  userCreatedId: z
    .number({
      required_error: requireSalarySheetText('userCreatedId', 'select'),
      invalid_type_error: requireSalarySheetText('userCreatedId', 'select'),
    })
    .nullable(),
  name: z.string(),
  applicableMonth: z.date({
    required_error: requireSalarySheetText('applicableMonth', 'select'),
  }),
  toDate: z.date({
    required_error: requireSalarySheetText('toDate', 'select'),
  }),
  fromDate: z.date({
    required_error: requireSalarySheetText('fromDate', 'select'),
  }),
  applicableYear: z.date({
    required_error: requireSalarySheetText('applicableYear', 'select'),
  }),
  basicSalary: z.number(),
  isActive: z.boolean(),
  note: z.string(),
  salarySheetDetails: z.array(
    z.object({
      id: z.number(),
      salarySheetId: z.number(),
      employeeId: z.number(),
      salaryCoefficient: z.number(),
      seniorityAllowanceCoefficient: z.number(),
      positionAllowanceCoefficient: z.number(),
      hazardAllowance: z.number(),
      professionalSeniorityAllowance: z.number(),
      chiefAccountantResponsibilityAllowance: z.number(),
      internshipMentorshipResponsibilityAllowance: z.number(),
      bonus: z.number(),
      phoneExpense: z.number(),
      travelAllowance: z.number(),
      scholarshipFund: z.number(),
      otherAllowance1: z.number(),
      otherAllowance2: z.number(),
      otherAllowance3: z.number(),
      note: z.string(),
    })
  ),
});

export type SalarySheet = z.infer<typeof salarySheetSchema>;

export type SalarySheetDetail = ArrayElement<SalarySheet['salarySheetDetails']>;

export const defaultValuesSalarySheet = {
  storeId: null,
  branchId: null,
  id: 0,
  salarySheetTime: new Date(),
  userCreatedId: null,
  name: '',
  applicableMonth: new Date(),
  toDate: new Date(),
  fromDate: new Date(),
  applicableYear: new Date(),
  isActive: false,
  note: '',
  basicSalary: 0,
  salarySheetDetails: [
    {
      id: 0,
      salarySheetId: 0,
      employeeId: 0,
      salaryCoefficient: 0,
      seniorityAllowanceCoefficient: 0,
      positionAllowanceCoefficient: 0,
      hazardAllowance: 0,
      professionalSeniorityAllowance: 0,
      chiefAccountantResponsibilityAllowance: 0,
      internshipMentorshipResponsibilityAllowance: 0,
      bonus: 0,
      phoneExpense: 0,
      travelAllowance: 0,
      scholarshipFund: 0,
      otherAllowance1: 0,
      otherAllowance2: 0,
      otherAllowance3: 0,
      note: '',
    },
  ],
};
