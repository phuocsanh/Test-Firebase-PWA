import queryClient from './query-client';
import routes from './router/routes';

import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
//import vi from 'devextreme/localization/messages/vi.json';
import vi from '@/locales/vi.json';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { loadMessages, locale } from 'devextreme/localization';
import { useEffect } from 'react';

// import { useEffect } from 'react';

const App = () => {
  loadMessages(vi);
  locale('vi');

  //get permission notification show
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          // const token = await messaging.getToken();
          console.log('Notification permission granted.');
          // Handle the token (e.g., save it to your backend for sending notifications)
        } else {
          console.log('Unable to get permission to notify.');
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    };

    void requestPermission();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <RouterProvider router={routes} />
    </QueryClientProvider>
  );
};

export default App;
