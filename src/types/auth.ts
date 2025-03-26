import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

const requiredUserField = requiredTextWithNamespace('user');

export const authorizedSchema = z.object({
  userName: z.string().nonempty(requiredUserField('userName')),
  password: z.string().nonempty(requiredUserField('password')),
  host: z.string().optional(),
});

export type SignInCredentials = z.infer<typeof authorizedSchema>;

export type AuthenticatedUser = {
  // token?: string;
  // refreshToken?: string;
  // tokenExpirationTime?: number;
  // refreshTokenExpirationTime?: number;
  // userName: string;
  // name: string;
  // userId: number;
  // uri?: string | null;
  // images?: string | null;
  // role: string;
  // email: string | null;
  // branchIds: string;
  // staffId: number;
  // warehouseIds: string;
  // accountFundIds: string;
  // isSale: boolean;
  // optionId: number;
  token: string;
  tokenExpirationTime: number;
  userId: number;
  userName: string;
  name: string | undefined;
  host: string | null;
  uri: string;
  images: string;
  role: string;
  areaId: number | null;
  areaName: number | null;
  isSale: false;
  brachIds: string | null;
  defaultBrachId: number | null;
  projectIds: string | null;
  departmentType: number | null;
};

export type LocalAuthUser = Omit<AuthenticatedUser, 'token' | 'tokenExpirationTime'>;
