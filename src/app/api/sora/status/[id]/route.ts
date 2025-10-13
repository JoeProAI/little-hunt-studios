import { NextRequest, NextResponse } from 'next/server';
import { getVideoStatus } from '@/lib/sora-api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    const status = await getVideoStatus(id);
    return NextResponse.json(status);
  } catch (error: any) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get video status' },
      { status: 500 }
    );
  }
}
