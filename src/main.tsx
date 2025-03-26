import { Toaster } from '@/components/ui/toaster';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { TAB_KEY } from '@/constant';
import './i18n';

import 'react-toastify/dist/ReactToastify.css';
import './toast.css';
import './index.css';
import './firebase-init.ts';
import 'devexpress-gantt/dist/dx-gantt.css';
import './dx.material.custom-scheme.css';

// Đăng ký Service Worker
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker
//     .register('/firebase-messaging-sw.js')
//     .then(registration => {
//       const worker = registration.installing || registration.waiting || registration.active;

//       if (worker) {
//         worker.addEventListener('statechange', e => {
//           console.log('Service Worker state:', (e.target as ServiceWorker)?.state);
//         });
//       }

//       if (registration.active) {
//         console.log('Service Worker đang active');
//       }
//     })
//     .catch(error => {
//       console.error('Đăng ký thất bại:', error);
//     });
// }

if ('serviceWorker' in navigator) {
  await navigator.serviceWorker.getRegistrations().then(registrations => {
    const isRegistered = registrations.some(reg =>
      reg.active?.scriptURL.includes('firebase-messaging-sw.js')
    );
    if (!isRegistered) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js', { scope: '/' })
        .then(async registration => {
          console.log('Service Worker registered:', registration);
          const readyRegistration = await navigator.serviceWorker.ready;
          const worker = registration.installing || registration.waiting || registration.active;
          if (worker) {
            worker.addEventListener('statechange', e => {
              console.log('Service Worker state:', (e.target as ServiceWorker)?.state);
            });
          }

          if (readyRegistration.active) {
            console.log('Service Worker đang active');
            // readyRegistration.active.postMessage({
            //   type: 'INIT_FIREBASE',
            //   // config: {
            //   //   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
            //   //   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
            //   //   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
            //   //   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
            //   //   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
            //   //   appId: import.meta.env.VITE_FIREBASE_APP_ID,
            //   //   measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
            //   // },
            //   config: {
            //     apiKey: 'AIzaSyD3Ck4f7Q3PIJ_WRqIdsRagwbISjrrBAGM',
            //     authDomain: 'bqlda-hoc-mon.firebaseapp.com',
            //     projectId: 'bqlda-hoc-mon',
            //     storageBucket: 'bqlda-hoc-mon.firebasestorage.app',
            //     messagingSenderId: '568867220435',
            //     appId: '1:568867220435:web:973b81f944108377c6dd26',
            //     measurementId: 'G-334Q9F6EMG',
            //   },
            // });
          }
        })
        .catch(error => {
          console.error('Đăng ký thất bại:', error);
        });
    } else {
      console.log('Service Worker đã được đăng ký trước đó');
    }
  });
}

navigator.serviceWorker.addEventListener('message', event => {
  console.log('Client nhận được phản hồi từ SW:', event.data);
});

const updateTabCount = () => {
  const tabCount = parseInt(localStorage.getItem(TAB_KEY) || '0', 10);
  localStorage.setItem(TAB_KEY, (tabCount + 1).toString());
};

const removeTabCount = () => {
  const tabCount = parseInt(localStorage.getItem(TAB_KEY) || '0', 10);
  localStorage.setItem(TAB_KEY, Math.max(tabCount - 1, 0).toString());
};

// eslint-disable-next-line react-refresh/only-export-components
const TabTracker = () => {
  useEffect(() => {
    // Khi tab được mở
    updateTabCount();

    // Lắng nghe thay đổi trong `localStorage`
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === TAB_KEY) {
        const currentTabCount = parseInt(localStorage.getItem(TAB_KEY) || '0', 10);
        console.log(`Số lượng tab đang mở: ${currentTabCount}`);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Khi tab được đóng
    const handleBeforeUnload = () => {
      removeTabCount();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Cleanup
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      removeTabCount();
    };
  }, []);

  return null;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster />
    <TabTracker />
  </React.StrictMode>
);
