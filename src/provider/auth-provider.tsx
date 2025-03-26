import notification from '@/lib/notifications';

import { LoadingOverlay } from '@/components/loading-overlay';
import { LOCAL_STORE_KEYS, MUTATE, QUERIES, TOKEN_KEY } from '@/constant/const';
import { AuthContext } from '@/context/auth-context';
import { useMutate } from '@/hooks/use-mutate';
import { parseRoles } from '@/lib/auth';
import { getCookie, removeCookie, setCookie } from '@/lib/cookie';
import { getLocalStorage, removeLocalStorage, setLocalStorage } from '@/lib/localStorage';
import { hash } from '@/lib/utils';
import { getRequest, login } from '@/services';
import {
  AuthenticatedUser,
  IUserPermission,
  LocalAuthUser,
  PaginationResponse,
  Project,
  SignInCredentials,
} from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type AuthProviderProps = {
  children?: ReactNode;
};

type PermissionHashType = {
  [key: string | number]: IUserPermission;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { t } = useTranslation('signIn');
  const navigate = useNavigate();
  const [loginLoading, setLoginLoading] = useState(false);

  const queryClient = useQueryClient();

  const [user, setUser] = useState<LocalAuthUser | undefined>(
    getLocalStorage(LOCAL_STORE_KEYS.USER) as LocalAuthUser
  );
  const [permissionHash, setPermissionHash] = useState<PermissionHashType | undefined>(() => {
    // init permission hash
    const roles = getLocalStorage(LOCAL_STORE_KEYS.ROLES) as string;
    if (roles) {
      const permissions = parseRoles(roles);
      const permissionHash = hash(permissions, 'permissionId');
      return permissionHash as PermissionHashType;
    }
    return undefined;
  });

  const token = getCookie<string>(TOKEN_KEY);
  const isAuthenticated = Boolean(token);

  const { mutate: signInMutation } = useMutate<AuthenticatedUser, SignInCredentials>({
    mutationKey: [MUTATE.LOGIN],
    mutationFn: login,
  });

  const clearAuth = useCallback(() => {
    setUser(undefined);
    removeCookie(TOKEN_KEY);
    removeLocalStorage(LOCAL_STORE_KEYS.ROLES);
    removeLocalStorage(LOCAL_STORE_KEYS.USER);
    queryClient.removeQueries();
  }, [queryClient]);

  const signIn = (signInCredentials: SignInCredentials) => {
    const params = {
      ...signInCredentials,
      host: LOCAL_STORE_KEYS.HOST,
    };

    setLoginLoading(true);
    signInMutation(params, {
      onSuccess: data => {
        setLoginLoading(false);

        if (data) {
          const user: Omit<AuthenticatedUser, 'token' | 'tokenExpirationTime'> = {
            role: data.role,
            areaId: data.areaId,
            areaName: data.areaName,
            images: data.images,
            isSale: data.isSale,
            name: data.name,
            uri: data.uri,
            userId: data.userId,
            userName: data.userName,
            host: data.host,
            brachIds: data.brachIds,
            defaultBrachId: data.defaultBrachId,
            projectIds: data.projectIds,
            departmentType: data.departmentType,
          };

          const permissions = parseRoles(data.role);
          const permissionHash = hash(
            permissions.map(item => ({
              ...item,
              isCreate: true,
              isDelete: true,
              isShow: true,
            })),
            'permissionId'
          );

          if (permissionHash) {
            setPermissionHash(permissionHash);
          }

          setUser(user);

          setLocalStorage(LOCAL_STORE_KEYS.USER, user);
          setLocalStorage(LOCAL_STORE_KEYS.ROLES, data.role);

          setCookie(TOKEN_KEY, data.token, data.tokenExpirationTime);

          notification.success(t('signInSuccess'));
          // const directUri = resultLogin.uri || '/';
          // window.location.href = data.uri || '/';
          navigate(data.uri || '/');
          // window.location.href = '/';
        }
      },
      onError: () => {
        setLoginLoading(false);
      },
    });
  };

  const signOut = () => {
    clearAuth();
    navigate('/sign-in');
    // window.location.href = '/sign-in';
  };

  useEffect(() => {
    if (!token) clearAuth();
  }, [clearAuth, token]);

  useEffect(() => {
    const localUser = getLocalStorage(LOCAL_STORE_KEYS.USER) as AuthenticatedUser;
    const localRoles = getLocalStorage<string>(LOCAL_STORE_KEYS.ROLES);

    if (token && localUser) {
      setUser(localUser);
    }

    if (localRoles) {
      const permissions = parseRoles(localRoles);
      const permissionHash = hash(permissions, 'permissionId');
      if (permissionHash) {
        setPermissionHash(permissionHash);
      }
    }
  }, [token]);

  const { data } = useQuery({
    queryKey: [QUERIES.PROJECT, 'BY_USER', user?.userId],
    queryFn: () => {
      return getRequest<PaginationResponse<Project>>('/common/get-project-by-user', {
        params: { userId: user?.userId },
      });
    },
    enabled: !!user?.userId,
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        signIn: (data: SignInCredentials) => void signIn(data),
        signOut,
        permissionHash,
        isAuthenticated,
        clearAuth,
        projects: data?.items || [],
      }}
    >
      <LoadingOverlay loading={loginLoading} text={t('authenticating')} />
      {children}
    </AuthContext.Provider>
  );
};
