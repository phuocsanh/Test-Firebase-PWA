import { createContext } from 'react';

export type NavContextProps = {
  isExpanded: boolean;
  toggle: () => void;
  isSheetOpen: boolean;
  toggleSheet: () => void;
  isSmall: boolean;
  setTotalNotifyUnread: (total: number) => void;
  totalNotifyUnread: number;
};

export const NavContext = createContext<NavContextProps>({
  isExpanded: true,
  isSmall: false,
  totalNotifyUnread: 0,
} as NavContextProps);
