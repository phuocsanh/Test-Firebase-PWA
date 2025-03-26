import { useAuth } from './use-auth';

export const useAccess = (permissions?: number[]) => {
  const { permissionHash } = useAuth();

  // console.log('permission hash:', permissionHash);
  return () => {
    if (!permissions || permissions?.length === 0) {
      return true;
    }

    if (permissions?.length && permissionHash) {
      return permissions.some(permission => {
        return permissionHash[permission]?.isShow;
      });
    }

    return false;
  };
};
