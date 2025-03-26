import { SignalREventHandlers } from '@/types';
import { createContext } from 'react';

interface SignalRContextType {
  on: <K extends keyof SignalREventHandlers>(event: K, callback: SignalREventHandlers[K]) => void;
  off: <K extends keyof SignalREventHandlers>(event: K, callback: SignalREventHandlers[K]) => void;
}

export const SignalRContext = createContext<SignalRContextType | null>(null);
