import { DomainContext } from '@/context/domain-context';
import { useDomain } from '@/hooks/use-domain';
import React, { PropsWithChildren } from 'react';

export const DomainProvider = ({ children }: PropsWithChildren) => {
  const checkDomain = useDomain(true);

  React.useEffect(() => {
    const intervalId = setInterval(checkDomain, 2 * 60 * 60 * 1000);
    // Cleanup function to clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [checkDomain]);

  return <DomainContext.Provider value={{}}>{children}</DomainContext.Provider>;
};
