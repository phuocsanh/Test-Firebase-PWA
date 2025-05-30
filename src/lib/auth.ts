/**
 * Authentication utilities functions
 */

import { IUserPermission } from '@/types';
import { camelize } from './text';
import { parseJson } from './utils';

type DecodeRolesType = {
  exp: number;
  iat: number;
  nbf: number;
  role: string;
};

export const parseRoles = (token: string): IUserPermission[] => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const decodedRoles = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );

  const parsedDecodeRoles = parseJson<DecodeRolesType>(decodedRoles) as DecodeRolesType;

  return (parseJson<IUserPermission[]>(parsedDecodeRoles.role) as IUserPermission[]).map(role => {
    return Object.keys(role).reduce((result, property) => {
      return {
        ...result,
        [camelize(property)]: role[property as keyof IUserPermission],
      };
    }, {}) as IUserPermission;
  });
};
