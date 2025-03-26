import { createContext } from 'react';

export type DomainContextProps = object;

export const DomainContext = createContext<DomainContextProps>({} as DomainContextProps);
