'use client';

export async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  if (!file.type.startsWith('audio/')) {
    throw new Error('Invalid file type. Please upload an audio file.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}