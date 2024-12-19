export type ErrorCode = 
  | 'UPLOAD_URL_ERROR'
  | 'FILE_UPLOAD_ERROR'
  | 'ASSET_CREATION_ERROR'
  | 'ASSET_FETCH_ERROR'
  | 'TASK_CREATION_ERROR'
  | 'TASK_STATUS_ERROR'
  | 'DOWNLOAD_URL_ERROR'
  | 'FILE_DOWNLOAD_ERROR'
  | 'POLLING_TIMEOUT'
  | 'INVALID_FILE_TYPE'
  | 'API_ERROR'
  | 'UNKNOWN_ERROR';

export class FadrError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly status?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'FadrError';
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      details: this.details,
    };
  }
}

export function handleApiError(error: unknown): FadrError {
  if (error instanceof FadrError) {
    return error;
  }

  if (error instanceof Response) {
    return new FadrError(
      'API request failed',
      'API_ERROR',
      error.status
    );
  }

  if (axios.isAxiosError(error)) {
    return new FadrError(
      error.message,
      'API_ERROR',
      error.response?.status,
      error.response?.data
    );
  }

  if (error instanceof Error) {
    return new FadrError(error.message, 'UNKNOWN_ERROR');
  }

  return new FadrError('An unexpected error occurred', 'UNKNOWN_ERROR');
}