import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

const requiredUserField = requiredTextWithNamespace('user');

export const userSchema = z.object({
  isActive: z.boolean().default(false),
  id: z.number(),
  userName: z
    .string({
      required_error: requiredUserField('userName'),
      invalid_type_error: requiredUserField('userName'),
    })
    .min(1, requiredUserField('userName'))
    .nullable(),
  password: z
    .string({
      required_error: requiredUserField('password'),
      invalid_type_error: requiredUserField('password'),
    })
    .min(1, requiredUserField('password'))
    .nullable(),
  name: z
    .string({
      required_error: requiredUserField('name'),
      invalid_type_error: requiredUserField('name'),
    })
    .min(1, requiredUserField('name'))
    .nullable(),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  gender: z.number().default(0),
  birthday: z.date().nullable(),
  images: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  isSale: z.boolean().default(false),
  groupId: z
    .number({
      required_error: requiredUserField('groupId', 'select'),
      invalid_type_error: requiredUserField('groupId', 'select'),
    })
    .optional(),
  isAccess: z.boolean().default(true),
  uri: z.string().optional().nullable(),
  cardId: z.string().optional().nullable(),
  dateOfIssue: z.date().nullable(),
  placeOfIssue: z.string().optional().nullable(),
  population: z.string().optional().nullable(),
  domicileNow: z.string().optional().nullable(),
  nation: z.string().optional().nullable(),
  socialInsurance: z.string().optional().nullable(),
  healthInsurance: z.string().optional().nullable(),
  maritalStatus: z.string().optional().nullable(),
  yearJoinCompany: z.string().optional().nullable(),
  basicSalary: z.number(),
  allowance: z.number(),
  positionId: z.number().optional().nullable(),
  isOutputNegative: z.boolean().default(false),
  storeId: z.number(),
  // areaId: z
  //   .number({
  //     required_error: requiredUserField('areaId', 'select'),
  //     invalid_type_error: requiredUserField('areaId', 'select'),
  //   })
  //   .optional(),
  areaId: z.number().optional().nullable(),
  staffId: z.number().optional().nullable(),
  branchIds: z.string().optional().nullable(),
  defaultBranchId: z.number().optional().nullable(),
  departmentId: z.number().nullable().optional(),
  userPermissionGroup: z.array(
    z.object({
      userId: z.number(),
      permissionGroupId: z.number(),
      permissionGroupName: z.string().optional().nullable(),
    })
  ),
  userPermission: z.array(
    z.object({
      id: z.number(),
      userId: z.number(),
      permissionId: z.number(),
      isCreate: z.boolean(),
      isUpdate: z.boolean(),
      isDelete: z.boolean(),
      isPrint: z.boolean(),
      isImport: z.boolean(),
      isExport: z.boolean(),
      isShow: z.boolean(),
      storeId: z.number(),
    })
  ),
  userBranches: z.array(
    z.object({
      userId: z.number().nullable().optional(),
      branchId: z.number().nullable().optional(),
      branchName: z.string().nullable().optional(),
    })
  ),
});

export const defaultUserValues = {
  isActive: true,
  id: 0,
  userName: '',
  password: '',
  name: '',
  address: '',
  phone: '',
  email: '',
  gender: 0,
  birthday: null,
  images: '',
  note: '',
  isSale: true,
  groupId: undefined,
  isAccess: true,
  uri: '',
  cardId: '',
  dateOfIssue: null,
  placeOfIssue: '',
  population: '',
  domicileNow: '',
  nation: '',
  socialInsurance: '',
  healthInsurance: '',
  maritalStatus: '',
  yearJoinCompany: '',
  basicSalary: 0,
  allowance: 0,
  positionId: null,
  isOutputNegative: false,
  storeId: 0,
  areaId: undefined,
  branchIds: '',
  defaultBranchId: null,
  departmentId: null,
  userPermission: [],
  userPermissionGroup: [],
  userBranches: [],
};

export type User = z.infer<typeof userSchema>;

interface IActions {
  isCreate: boolean;
  isUpdate: boolean;
  isDelete: boolean;
  isPrint: boolean;
  isShow: boolean;
  isImport: boolean;
  isExport: boolean;
}

export interface IUserPermission extends IActions {
  permissionName?: string;
  userName?: string;
  id: number;
  userId: number;
  permissionId: number;
}

export interface IPermission extends IActions {
  id: number;
  isActive?: boolean;
  name: string;
  description?: string;
  sort?: number;
}
