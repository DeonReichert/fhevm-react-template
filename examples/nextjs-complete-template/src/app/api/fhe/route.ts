import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'FHE API endpoint is active',
    endpoints: {
      encrypt: '/api/fhe/encrypt',
      decrypt: '/api/fhe/decrypt',
      compute: '/api/fhe/compute',
      keys: '/api/fhe/keys',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    return NextResponse.json({
      success: true,
      data: body,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
