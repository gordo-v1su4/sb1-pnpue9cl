import { FadrError } from './error-handler';

export function validateAudioFile(file: File | null) {
  if (!file) {
    throw new FadrError('No file provided', 'INVALID_FILE', 400);
  }

  if (!file.type.startsWith('audio/')) {
    throw new FadrError(
      'Invalid file type. Please upload an audio file.',
      'INVALID_FILE_TYPE',
      400
    );
  }

  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    throw new FadrError(
      'File too large. Maximum size is 100MB.',
      'FILE_TOO_LARGE',
      400
    );
  }
}