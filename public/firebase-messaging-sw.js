/* eslint-disable @typescript-eslint/no-unsafe-call */
/* global importScripts, firebase ,clients */
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');
const CACHE_VERSION = 'v1.0.0'; // Thay đổi version khi cập nhật SW

self.addEventListener('install', event => {
  console.log(`Installing Service Worker ${CACHE_VERSION}`);
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  console.log(`Activating Service Worker ${CACHE_VERSION}`);
  event.waitUntil(
    self.clients.claim().then(() => {
      // Xóa cache cũ nếu có
      void caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.filter(name => name !== CACHE_VERSION).map(name => caches.delete(name))
        );
      });
    })
  );
});

const firebaseConfig = {
  apiKey: 'AIzaSyD3Ck4f7Q3PIJ_WRqIdsRagwbISjrrBAGM',
  authDomain: 'bqlda-hoc-mon.firebaseapp.com',
  projectId: 'bqlda-hoc-mon',
  storageBucket: 'bqlda-hoc-mon.firebasestorage.app',
  messagingSenderId: '568867220435',
  appId: '1:568867220435:web:973b81f944108377c6dd26',
  measurementId: 'G-334Q9F6EMG',
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  console.log('Background message:', payload);
  if (payload.data) {
    const { title, body, icon, typeNotification, refId } = payload.data;
    self.registration.showNotification(title, {
      body,
      icon,
      data: { typeNotification: typeNotification || '/', refId },
    });

    const channel = new BroadcastChannel('notifications');
    channel.postMessage({ title: 'NEW_NOTIFICATION' });
  }
});

self.addEventListener('notificationclick', event => {
  console.log('Notification click received:', event.notification);
  event.notification.close();

  const urlToOpen = event.notification.data.typeNotification || '/';
  const id = event.notification.data.refId || null;
  console.log('URL to open:', urlToOpen);

  function navigateToPath(type, id) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return id == null || id < 0 ? type : `${type}/${id}`;
  }
  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        console.log('Available clients:', clientList);

        if (clientList.length > 0) {
          // Ưu tiên client đang hiển thị (visible) hoặc client đầu tiên
          const activeClient =
            clientList.find(client => client.visibilityState === 'visible') || clientList[0];

          if (activeClient) {
            // console.log('Active client found:', activeClient);
            // Gửi thông điệp đến client để tự xử lý chuyển hướng
            activeClient.postMessage({ type: 'NAVIGATE', path: navigateToPath(urlToOpen, id) });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return activeClient.focus();
          }
          // console.log('No suitable client found, opening new window');
        } else {
          // console.log('No clients found, opening new window');
        }
        // Fallback: mở tab mới nếu không có client
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return clients.openWindow(urlToOpen);
      })
      .catch(err => console.error('Error handling notification click:', err))
  );
});
