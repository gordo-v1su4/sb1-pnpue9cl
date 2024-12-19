'use client';

import axios from 'axios';
import { FadrError } from './error-handler';

const FADR_API_URL = 'https://api.fadr.com';

interface DownloadUrlResponse {
  url: string;
}

export async function getDownloadUrl(assetId: string): Promise<string> {
  try {
    const response = await axios.get<DownloadUrlResponse>(
      `${FADR_API_URL}/assets/download/${assetId}/hq`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_FADR_API_KEY}`,
        },
      }
    );
    return response.data.url;
  } catch (error) {
    throw new FadrError('Failed to get download URL', 'DOWNLOAD_URL_ERROR');
  }
}

export async function downloadFile(url: string): Promise<ArrayBuffer> {
  try {
    const response = await axios.get<ArrayBuffer>(url, {
      responseType: 'arraybuffer',
    });
    return response.data;
  } catch (error) {
    throw new FadrError('Failed to download file', 'FILE_DOWNLOAD_ERROR');
  }
}