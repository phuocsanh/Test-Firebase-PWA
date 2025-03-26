import { IUserPermission, LocalAuthUser, Project, SignInCredentials } from '@/types';
import { Dispatch, SetStateAction, createContext } from 'react';

export type AuthContextProps = {
  user?: LocalAuthUser;
  setUser: Dispatch<SetStateAction<LocalAuthUser | undefined>>;
  permissionHash?: { [key: string]: IUserPermission };
  isAuthenticated: boolean;
  signIn: (credentials: SignInCredentials) => void;
  signOut: () => void;
  clearAuth: () => void;
  projects: Project[];
};

export const AuthContext = createContext({} as AuthContextProps);
