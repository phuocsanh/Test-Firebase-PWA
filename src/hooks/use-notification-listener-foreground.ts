import { onMessage } from 'firebase/messaging';
import { messaging } from '@/firebase-init';
import { useEffect } from 'react';
import queryClient from '@/query-client';
import { QUERIES } from '@/constant';
import { useNavigate } from 'react-router-dom';
import { useShowNotify } from '../components/toast-notification';
interface ServiceWorkerMessageEvent extends Event {
  data: {
    type: string;
    path?: string;
  };
}
export const useNotificationListenerForeground = () => {
  const navigate = useNavigate();

  // Hàm hiển thị toast thông báo
  const showNotify = useShowNotify();

  useEffect(() => {
    console.log('🚀 ~ useEffect ~ useNotificationListenerForeground:');
    const unsubscribe = onMessage(messaging, payload => {
      console.log('🚀 ~ useEffect ~ payload:', payload);

      if (payload.data) {
        void Promise.allSettled([
          queryClient.refetchQueries({ queryKey: [QUERIES.NOTIFICATION_UNREAD] }),
          queryClient.refetchQueries({ queryKey: [QUERIES.NOTIFICATION] }),
          queryClient.refetchQueries({ queryKey: [QUERIES.NOTIFICATION_UNREAD_TOTAL] }),
        ]);

        const { title, body, icon, typeNotification, refId } = payload.data;
        showNotify({
          title,
          body,
          icon,
          clickAction: typeNotification || '',
          refId: Number(refId),
        });
        // (async () => {
        //   const registration = await navigator.serviceWorker.getRegistration();
        //   if (registration) {
        //     await registration.showNotification(title, {
        //       body,
        //       icon,
        //       data: {
        //         click_action: payload.data?.click_action || '/', // Đảm bảo có click_action
        //         typeNotification: payload.data?.typeNotification || '/',
        //       },
        //     });
        //   } else {
        //     console.error('No service worker registration found.');
        //   }
        // })().catch(error => {
        //   console.error('Error showing notification:', error);
        // });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleServiceWorkerMessage = (event: ServiceWorkerMessageEvent) => {
      if (event.data && event.data.type === 'NAVIGATE' && event.data.path) {
        navigate(event.data.path);
      }
    };

    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
    };
  }, [navigate]);
};
