import { NavContext, NavContextProps } from '@/context/nav-context';
import { useContext } from 'react';

export const useNav = (): NavContextProps => {
  const context = useContext(NavContext);
  if (!context) {
    throw new Error('useNav must be used within a NavProvider');
  }

  return context;
};
