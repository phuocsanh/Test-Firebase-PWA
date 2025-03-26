import i18next from '@/i18n';

import axiosInstance, { request } from '@/axios-instance';
import { generateRequiredValidationMessage } from '@/lib/i18nUtils';
import { AuthenticatedUser, SignInCredentials } from '@/types';
import { z } from 'zod';

export const changePasswordSchema = z.object({
  passwordOld: z
    .string({
      invalid_type_error: generateRequiredValidationMessage({
        fieldName: i18next.t('page.changePassDialog.fields.oldPassword', { ns: 'user' }),
      }),
    })
    .min(
      1,
      generateRequiredValidationMessage({
        fieldName: i18next.t('page.changePassDialog.fields.oldPassword', { ns: 'user' }),
      })
    ),
  passwordNews: z
    .string({
      invalid_type_error: generateRequiredValidationMessage({
        fieldName: i18next.t('page.changePassDialog.fields.newPassword', { ns: 'user' }),
      }),
    })
    .min(
      1,
      generateRequiredValidationMessage({
        fieldName: i18next.t('page.changePassDialog.fields.newPassword', { ns: 'user' }),
      })
    ),
  passwordConfirm: z
    .string({
      invalid_type_error: generateRequiredValidationMessage({
        fieldName: i18next.t('page.changePassDialog.fields.confirmPassword', { ns: 'user' }),
      }),
    })
    .min(
      1,
      generateRequiredValidationMessage({
        fieldName: i18next.t('page.changePassDialog.fields.confirmPassword', { ns: 'user' }),
      })
    ),
});

export type ChangePassword = z.infer<typeof changePasswordSchema>;

export const login = async (data: SignInCredentials): Promise<AuthenticatedUser> => {
  return request<AuthenticatedUser>(axiosInstance.post('/auth/login', data));
};

export const changePassword = async (data: ChangePassword): Promise<number> => {
  return request<number>(axiosInstance.post('/auth/change-password', data));
};
