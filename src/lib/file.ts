/**
 * File utilities
 */
import { ImageFile, UploadImageRef } from '@/components/upload-images';

import { v4 } from 'uuid';

export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const getPreviewURL = (path: string) =>
  `${import.meta.env.VITE_API_URL}${path.replace('static', 'data')}`.replace('/api', '');
// `${import.meta.env.VITE_API_URL}${path}`;

const createImageFile = async (url: string) => {
  const blob = await fetch(url || '').then(r => r.blob());
  const file = new File([blob], url || v4(), { type: blob.type });

  return Object.assign(file, {
    url: url || '',
    preview: url || '',
  });
};

export const getFileNameWithoutExtension = (fileName: string): string => {
  if (!fileName) return ''; // Trả về chuỗi rỗng nếu tên file là rỗng

  const lastDotIndex = fileName.lastIndexOf('.');

  // Nếu không có dấu chấm trong tên file, trả về nguyên tên file.
  // Hoặc nếu phần mở rộng bắt đầu sau dấu chấm đầu tiên (tên file ẩn), cũng trả về nguyên tên file
  if (lastDotIndex === -1 || lastDotIndex === 0) return fileName;

  return fileName.substring(0, lastDotIndex);
};
export const setImagesToUploadControl = async <TImages extends { link?: string }[] | undefined>(
  uploadControl: UploadImageRef | null,
  images: TImages
) => {
  if (uploadControl && images) {
    const imageFiles: ImageFile[] = await Promise.all(
      images.map(async image => await createImageFile(image.link || ''))
    );
    uploadControl.setImageFiles(imageFiles);
  }
};
