import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
//   measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
// };
const firebaseConfig = {
  apiKey: 'AIzaSyD3Ck4f7Q3PIJ_WRqIdsRagwbISjrrBAGM',
  authDomain: 'bqlda-hoc-mon.firebaseapp.com',
  projectId: 'bqlda-hoc-mon',
  storageBucket: 'bqlda-hoc-mon.firebasestorage.app',
  messagingSenderId: '568867220435',
  appId: '1:568867220435:web:973b81f944108377c6dd26',
  measurementId: 'G-334Q9F6EMG',
};
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

console.log('🚀 ~ messaging:', messaging);

// Hàm yêu cầu quyền nhận thông báo
export const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    const token = await getToken(messaging, {
      // vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      vapidKey:
        'BIKKzVNamkqNsAKuLCO3Pf6yjL8_o720a87B-Q2W2PzZxX8hCH9xXpG5fouljS8BqdxfsmPVHNsXcRQScn4BDr4',
      serviceWorkerRegistration: await navigator.serviceWorker.getRegistration(),
    });
    console.log('FCM Token:', token);
    // localStorage.setItem('fcm_token', token);
    return token;
  } else {
    console.log('Người dùng từ chối nhận thông báo');
    return null;
  }
};

// Lắng nghe tin nhắn khi app đang mở

// if (Notification.permission === 'granted' && payload.data) {
//   console.log(
//     '🚀 ~ listenForNotifications ~ Notification.permission:',
//     Notification.permission
//   );
//   const { title, body, icon } = payload.data;
//   new Notification(title, { body, icon });
// }
