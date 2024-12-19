import { NextResponse } from 'next/server';
import { makeApiRequest } from '@/lib/api/fadr/request';
import { validateAudioFile } from '@/lib/api/fadr/validation';
import { FadrError } from '@/lib/api/fadr/error-handler';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as 'analyze' | 'separate';

    validateAudioFile(file);

    const data = await makeApiRequest(
      `/${type}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof FadrError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', code: 'UNKNOWN_ERROR' },
      { status: 500 }
    );
  }
}