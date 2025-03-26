import { AuthContext, AuthContextProps } from '@/context/auth-context';
import { useContext } from 'react';

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
};
