'use client';

import axios from 'axios';
import { FadrError } from './error-handler';
import { FADR_API_URL, API_ENDPOINTS } from './config';

interface UploadUrlResponse {
  url: string;
  s3Path: string;
}

export async function getUploadUrl(filename: string, extension: string): Promise<UploadUrlResponse> {
  if (!process.env.NEXT_PUBLIC_FADR_API_KEY) {
    throw new FadrError('API key is missing', 'UPLOAD_URL_ERROR');
  }

  try {
    const response = await axios.post(`${FADR_API_URL}${API_ENDPOINTS.upload}`, {
      name: filename,
      extension,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_FADR_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.data?.url || !response.data?.s3Path) {
      throw new FadrError('Invalid upload URL response', 'UPLOAD_URL_ERROR');
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new FadrError(
        error.response?.data?.message || 'Failed to get upload URL',
        'UPLOAD_URL_ERROR',
        error.response?.status
      );
    }
    throw new FadrError('Failed to get upload URL', 'UPLOAD_URL_ERROR');
  }
}

export async function uploadFile(url: string, file: File): Promise<void> {
  try {
    await axios.put(url, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new FadrError(
        error.response?.data?.message || 'Failed to upload file',
        'FILE_UPLOAD_ERROR',
        error.response?.status
      );
    }
    throw new FadrError('Failed to upload file', 'FILE_UPLOAD_ERROR');
  }
}