import { NavContext } from '@/context/nav-context';
import { useBoolean } from '@/hooks/use-boolean';
import { useMediaQuery } from '@/hooks/use-media-query';
import React, { useEffect, useState } from 'react';

export const NavProvider = ({ children }: { children: React.ReactNode }) => {
  const isSmall = useMediaQuery('(max-width: 640px)');
  const { state: isSheetOpen, toggle: toggleSheet } = useBoolean();
  const { state: isExpanded, setTrue: expand, setFalse: unExpand, toggle } = useBoolean(false);
  const [totalNotifyUnread, setTotalNotifyUnread] = useState<number>(0); //totalUnread

  useEffect(() => {
    // const onResize = () => {
    //   if (window.innerWidth < 1204) unExpand();
    //   else expand();
    // };
    // window.addEventListener('resize', onResize);
    // return () => window.removeEventListener('resize', onResize);
  }, [expand, isExpanded, toggle, unExpand]);

  return (
    <NavContext.Provider
      value={{
        setTotalNotifyUnread,
        totalNotifyUnread,
        isExpanded,
        toggle,
        isSheetOpen,
        toggleSheet,
        isSmall,
      }}
    >
      {children}
    </NavContext.Provider>
  );
};
