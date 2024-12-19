export const FADR_API_URL = process.env.NEXT_PUBLIC_FADR_API_URL || 'https://api.fadr.com';
export const POLLING_INTERVAL = 5000; // 5 seconds
export const POLLING_TIMEOUT = 300000; // 5 minutes

export const API_ENDPOINTS = {
  upload: '/assets/upload2',
  assets: '/assets',
  analyze: '/assets/analyze/stem',
  tasks: '/tasks',
  download: '/assets/download',
} as const;

export const DOWNLOAD_TYPES = {
  preview: 'preview',
  hqPreview: 'hqPreview',
  download: 'download',
} as const;

export type DownloadType = keyof typeof DOWNLOAD_TYPES;