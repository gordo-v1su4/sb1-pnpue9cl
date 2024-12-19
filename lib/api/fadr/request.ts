'use client';

import { FadrError } from './error-handler';

export async function makeApiRequest<T>(
  endpoint: string,
  options: RequestInit
): Promise<T> {
  if (!process.env.NEXT_PUBLIC_FADR_API_KEY) {
    throw new FadrError('API key is missing', 'CONFIG_ERROR', 500);
  }

  const baseUrl = process.env.NEXT_PUBLIC_FADR_API_URL || 'https://api.fadr.com/v1';
  const url = `${baseUrl}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_FADR_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new FadrError(
        errorText || `API request failed with status ${response.status}`,
        'API_ERROR',
        response.status
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof FadrError) {
      throw error;
    }
    throw new FadrError(
      'Failed to connect to API',
      'CONNECTION_ERROR',
      500
    );
  }
}