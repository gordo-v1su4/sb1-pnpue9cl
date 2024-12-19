'use client';

import axios from 'axios';
import { FadrError } from './error-handler';

const FADR_API_URL = 'https://api.fadr.com';

interface Asset {
  _id: string;
  name: string;
  extension: string;
  s3Path: string;
  stems?: string[];
  midi?: string[];
  metaData?: {
    stemType?: string;
  };
}

interface CreateAssetResponse {
  asset: Asset;
}

export async function createAsset(
  name: string, 
  extension: string, 
  s3Path: string
): Promise<Asset> {
  try {
    const response = await axios.post<CreateAssetResponse>(
      `${FADR_API_URL}/assets`,
      {
        name,
        extension,
        group: `${name}-group`,
        s3Path,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_FADR_API_KEY}`,
        },
      }
    );
    return response.data.asset;
  } catch (error) {
    throw new FadrError('Failed to create asset', 'ASSET_CREATION_ERROR');
  }
}

export async function getAsset(assetId: string): Promise<Asset> {
  try {
    const response = await axios.get<{ asset: Asset }>(
      `${FADR_API_URL}/assets/${assetId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_FADR_API_KEY}`,
        },
      }
    );
    return response.data.asset;
  } catch (error) {
    throw new FadrError('Failed to get asset', 'ASSET_FETCH_ERROR');
  }
}