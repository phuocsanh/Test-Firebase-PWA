import react from '@vitejs/plugin-react-swc';
import dotenv from 'dotenv';

import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';

dotenv.config();

//https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Không ghi đè SW cũ
      strategies: 'injectManifest', // Giữ nguyên service worker gốc
      srcDir: 'src',
      filename: 'firebase-messaging-sw.js',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'QLDA Hóc Môn',
        short_name: 'QLDA Hóc Môn',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*'],
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024, // ✅ Giới hạn tối đa 15MB
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/your-api.com\/.*$/, // Thay bằng API bạn cần cache nếu có
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
            },
          },
        ],
      },
      // devOptions: {
      //   enabled: true, // Bật PWA trong môi trường dev
      // },
    }),
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
