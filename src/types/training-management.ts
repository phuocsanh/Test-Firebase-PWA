import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

const requireTrainingManagementText = requiredTextWithNamespace('trainingManagement');

export const trainingManagementSchema = z.object({
  id: z.number(), //id
  trainingInstitutionId: z
    .number({
      required_error: requireTrainingManagementText('trainingInstitutionId'),
      invalid_type_error: requireTrainingManagementText('trainingInstitutionId'),
    })
    .min(1, requireTrainingManagementText('trainingInstitutionId')),
  name: z
    .string({
      required_error: requireTrainingManagementText('name'),
      invalid_type_error: requireTrainingManagementText('name'),
    })
    .min(1, requireTrainingManagementText('name')),
  content: z
    .string({
      required_error: requireTrainingManagementText('content'),
      invalid_type_error: requireTrainingManagementText('content'),
    })
    .min(1, requireTrainingManagementText('content')),
  fromDate: z.date().nullable(),
  toDate: z.date().nullable(),
  funding: z.number().nullable(),
  employeeId: z
    .number({
      required_error: requireTrainingManagementText('employeeId'),
      invalid_type_error: requireTrainingManagementText('employeeId'),
    })
    .min(1, requireTrainingManagementText('employeeId')),
  result: z.string().nullable(),
  note: z.string().nullable(),
  trainingManagementTime: z.date().nullable(),
  userCreatedId: z
    .number({
      required_error: requireTrainingManagementText('userCreatedId'),
      invalid_type_error: requireTrainingManagementText('userCreatedId'),
    })
    .min(1, requireTrainingManagementText('userCreatedId')),
  //các trường mặc định
  branchId: z.number().nullable().optional(),
  storeId: z.number().nullable().optional(),
  statusId: z.number().nullable().optional(), //trạng thái
  departmentId: z.number().nullable().optional(),
});

export type TrainingManagement = z.infer<typeof trainingManagementSchema>;

export const defaultValuesTrainingManagement: TrainingManagement = {
  id: 0, //id
  trainingInstitutionId: 0,
  name: '',
  content: '',
  fromDate: new Date(),
  toDate: new Date(),
  funding: 0,
  employeeId: 0,
  result: '',
  note: '',
  trainingManagementTime: new Date(),
  userCreatedId: 0,
  departmentId: null,

  //các trường mặc định
  branchId: null,
  storeId: null,
};
