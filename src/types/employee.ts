import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { ArrayElement } from './common';
import { defaultValuesRecordAttachment, recordAttachmentSchema } from './records-attachment';
export const requireEmployeeText = requiredTextWithNamespace('employee');

export const employeeSchema = z.object({
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  id: z.number(),
  code: z
    .string({
      required_error: requireEmployeeText('code'),
      invalid_type_error: requireEmployeeText('code'),
    })
    .min(1, requireEmployeeText('code')),
  name: z
    .string({
      required_error: requireEmployeeText('name'),
      invalid_type_error: requireEmployeeText('name'),
    })
    .min(1, requireEmployeeText('name')),
  departmentId: z
    .number({
      required_error: requireEmployeeText('departmentId', 'select'),
      invalid_type_error: requireEmployeeText('departmentId', 'select'),
    })
    .nullable(),
  genderTypeId: z
    .number({
      required_error: requireEmployeeText('genderTypeId', 'select'),
      invalid_type_error: requireEmployeeText('genderTypeId', 'select'),
    })
    .nullable(),
  nationalIdCard: z
    .string({
      required_error: requireEmployeeText('nationalIdCard'),
      invalid_type_error: requireEmployeeText('nationalIdCard'),
    })
    .min(1, requireEmployeeText('nationalIdCard')),
  birthday: z.date().nullable(),
  dateOfIssue: z.date({
      required_error: requireEmployeeText('dateOfIssue', 'select'),
    }).nullable(),
  socialInsuranceNumber: z.string().nullable(),
  randCode: z.string().nullable(),
  nationality: z.string().nullable(),
  workPositionId: z.number().nullable(),
  employeeTypeId: z.number({
    required_error: requireEmployeeText('employeeTypeId', 'select'),
    invalid_type_error: requireEmployeeText('employeeTypeId', 'select'),
  })
  .nullable(),
  expertiseId: z.number().nullable(),
  majorId: z.number().nullable(),
  stateManagementId: z
    .number({
      required_error: requireEmployeeText('stateManagementId', 'select'),
      invalid_type_error: requireEmployeeText('stateManagementId', 'select'),
    })
    .nullable(),
  politicsId: z
    .number({
      required_error: requireEmployeeText('politicsId', 'select'),
      invalid_type_error: requireEmployeeText('politicsId', 'select'),
    })
    .nullable(),

  foreignLanguageId: z
    .number({
      required_error: requireEmployeeText('foreignLanguageId', 'select'),
      invalid_type_error: requireEmployeeText('foreignLanguageId', 'select'),
    })
    .nullable(),

  informationTechnologyId: z
    .number({
      required_error: requireEmployeeText('foreignLanguageId', 'select'),
      invalid_type_error: requireEmployeeText('foreignLanguageId', 'select'),
    })
    .nullable(),
  isPartyMember: z.boolean().nullable(),
  professionalTrainingId: z
    .string({
      required_error: requireEmployeeText('professionalTrainingId', 'select'),
      invalid_type_error: requireEmployeeText('professionalTrainingId', 'select'),
    })
    .nullable(),
  placeOfBirth: z.string(),
  placeOfOrigin: z.string(),
  currentAddress: z.string().nullable(),
  startDateEmployment: z.date().nullable(),
  partyAdmissionDate: z.date().nullable(),
  officialPartyAdmissionDate: z.date().nullable(),
  numberDaysOff: z.number().nullable(),
  totalEntitledLeaveDays: z.number().nullable(),
  governmentClassificationResultsId: z
    .number({
      required_error: requireEmployeeText('governmentClassificationResultsId', 'select'),
      invalid_type_error: requireEmployeeText('governmentClassificationResultsId', 'select'),
    })
    .nullable(),
  isAwardsRecognitionGovernment: z.boolean().default(false),
  isDisciplineGovernment: z.boolean().default(false),
  religion: z.string(),
  partyMemberClassificationResultsId: z
    .number({
      required_error: requireEmployeeText('partyMemberClassificationResultsId', 'select'),
      invalid_type_error: requireEmployeeText('partyMemberClassificationResultsId', 'select'),
    })
    .nullable(),
  isAwardsRecognitionPartyMembers: z.boolean().default(false),
  isDisciplinePartyMember: z.boolean().default(false),
  positionId: z
    .number({
      required_error: requireEmployeeText('positionId', 'select'),
      invalid_type_error: requireEmployeeText('positionId', 'select'),
    })
    .nullable(),
  phone: z.string().nullable(),
  bankCode: z.string().nullable(),
  bankName: z.string().nullable(),
  isActive: z.boolean().default(false),
  level: z.number(),
  positionAllowanceCoefficient: z.number(),
  seniorityBeyondCeilingAllowanceCoefficient: z.number(),
  seniorityAllowance: z.number(),
  chiefAccountantResponsibilityAllowance: z.number(),
  internshipMentorshipResponsibilityAllowance: z.number(),
  fixedTelephoneAllowance: z.number(),
  salaryCoefficient: z.number(),
  baseSalary: z.number(),
  nextSalaryIncreaseTimeline: z.date().nullable(),
  employeeAnnualEvaluationResultDetails: z.array(
    z.object({
      id: z.number(),
      employeeId: z.number().nullable(),
      year: z.date().nullable(),
      governmentClassificationResultsId: z.number().nullable(),
      isAwardsRecognitionGovernment: z.boolean().default(false),
      isDisciplineGovernment: z.boolean().default(false),
      partyMemberClassificationResultsId: z.number().nullable(),
      isAwardsRecognitionPartyMember: z.boolean().default(false),
      isDisciplinePartyMember: z.boolean().default(false),
      note: z.string(),
    })
  ),
  itemsRecordManagement: z.array(recordAttachmentSchema),
});

export type Employee = z.infer<typeof employeeSchema>;

export type EmployeeAnnualEvaluationResultDetail = ArrayElement<
  Employee['employeeAnnualEvaluationResultDetails']
>;

export const defaultValuesEmployee = {
  storeId: null,
  branchId: null,
  id: 0,
  code: '',
  name: '',
  birthday: null,
  departmentId: undefined,
  genderTypeId: null,
  nationalIdCard: '',
  dateOfIssue: null,
  socialInsuranceNumber: '',
  randCode: '',
  nationality: '',
  workPositionId: null,
  employeeTypeId: undefined,
  expertiseId: null,
  majorId: null,
  stateManagementId: null,
  politicsId: null,
  foreignLanguageId: null,
  informationTechnologyId: null,
  isPartyMember: false,
  professionalTrainingId: null,
  placeOfBirth: '',
  placeOfOrigin: '',
  currentAddress: '',
  startDateEmployment: null,
  partyAdmissionDate: null,
  officialPartyAdmissionDate: null,
  numberDaysOff: 0,
  totalEntitledLeaveDays: 0,
  governmentClassificationResultsId: null,
  isAwardsRecognitionGovernment: false,
  isDisciplineGovernment: false,
  religion: '',
  partyMemberClassificationResultsId: null,
  isAwardsRecognitionPartyMembers: false,
  isDisciplinePartyMember: false,
  positionId: undefined,
  phone: '',
  bankCode: '',
  bankName: '',
  isActive: false,
  level: 0,
  positionAllowanceCoefficient: 0,
  seniorityBeyondCeilingAllowanceCoefficient: 0,
  seniorityAllowance: 0,
  chiefAccountantResponsibilityAllowance: 0,
  internshipMentorshipResponsibilityAllowance: 0,
  fixedTelephoneAllowance: 0,
  salaryCoefficient: 0,
  baseSalary: 0,
  nextSalaryIncreaseTimeline: null,
  itemsRecordManagement: [defaultValuesRecordAttachment],
  employeeAnnualEvaluationResultDetails: [
    {
      id: 0,
      employeeId: 0,
      year: null,
      governmentClassificationResultsId: null,
      isAwardsRecognitionGovernment: false,
      isDisciplineGovernment: false,
      partyMemberClassificationResultsId: null,
      isAwardsRecognitionPartyMember: false,
      isDisciplinePartyMember: false,
      note: '',
    },
  ],
};
