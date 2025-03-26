import { IUserPermission } from '@/types';
import { useAuth } from './use-auth';

export const usePermission = (permission: number): IUserPermission | undefined => {
  const { permissionHash } = useAuth();

  if (!permissionHash) {
    return undefined;
  }

  return permissionHash[permission];
};
