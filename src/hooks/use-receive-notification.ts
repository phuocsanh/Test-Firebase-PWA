import { SignalREventHandlers } from '@/types';
import { useEffect } from 'react';
import { useSignalR } from './use-signalR';

export const useReceiveNotification = (
  onReceiveNotification: SignalREventHandlers['ReceiveNotification']
) => {
  const { on, off } = useSignalR();

  useEffect(() => {
    on('ReceiveNotification', onReceiveNotification);

    return () => {
      off('ReceiveNotification', onReceiveNotification);
    };
  }, [off, on, onReceiveNotification]);
};
