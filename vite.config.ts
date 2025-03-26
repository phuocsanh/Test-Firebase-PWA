import react from '@vitejs/plugin-react-swc';
import dotenv from 'dotenv';

import path from 'path';
import { defineConfig } from 'vite';
// import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';

dotenv.config();

//https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'generate-firebase-sw',
      buildEnd() {
        const filePath = path.resolve('src/firebase-messaging-sw.js');
        if (!fs.existsSync(filePath)) {
          console.error(`❌ File ${filePath} không tồn tại. Hãy tạo file này trước khi build.`);
          return;
        }
        let content = fs.readFileSync(filePath, 'utf-8');

        // Thay thế biến môi trường
        content = content
          .replace('__VITE_FIREBASE_API_KEY__', process.env.VITE_FIREBASE_API_KEY)
          .replace('__VITE_FIREBASE_AUTH_DOMAIN__', process.env.VITE_FIREBASE_AUTH_DOMAIN)
          .replace('__VITE_FIREBASE_PROJECT_ID__', process.env.VITE_FIREBASE_PROJECT_ID)
          .replace('__VITE_FIREBASE_STORAGE_BUCKET__', process.env.VITE_FIREBASE_STORAGE_BUCKET)
          .replace(
            '__VITE_FIREBASE_MESSAGING_SENDER_ID__',
            process.env.VITE_FIREBASE_MESSAGING_SENDER_ID
          )
          .replace('__VITE_FIREBASE_APP_ID__', process.env.VITE_FIREBASE_APP_ID)
          .replace('__VITE_FIREBASE_MEASUREMENT_ID__', process.env.VITE_FIREBASE_MEASUREMENT_ID);

        // Ghi file vào thư mục public
        fs.writeFileSync(path.resolve('public/firebase-messaging-sw.js'), content);
        console.log('✅ Generated firebase-messaging-sw.js');
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  build: {
    target: 'esnext', // ✅ Hỗ trợ top-level await
  },
});
