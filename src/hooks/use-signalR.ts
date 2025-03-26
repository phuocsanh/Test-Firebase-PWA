import { SignalRContext } from '@/context';
import { useContext } from 'react';

export const useSignalR = () => {
  const context = useContext(SignalRContext);

  if (!context) {
    throw new Error('useSignalR mus be used within a SignalRProvider');
  }

  return context;
};