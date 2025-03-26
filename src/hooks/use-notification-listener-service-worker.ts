import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { QUERIES } from '@/constant';

export function useNotificationListenerServiceWorker() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = new BroadcastChannel('notifications');
    channel.onmessage = async (event: MessageEvent) => {
      if (event.data) {
        await Promise.allSettled([
          queryClient.refetchQueries({ queryKey: [QUERIES.NOTIFICATION_UNREAD] }),
          queryClient.refetchQueries({ queryKey: [QUERIES.NOTIFICATION] }),
          queryClient.refetchQueries({ queryKey: [QUERIES.NOTIFICATION_UNREAD_TOTAL] }),
        ]);
      }
    };

    return () => {
      channel.close();
    };
  }, [queryClient]);
}
