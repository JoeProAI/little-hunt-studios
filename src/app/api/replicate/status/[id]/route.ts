import { NextRequest, NextResponse } from 'next/server';
import { getReplicateStatus } from '@/lib/replicate-api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Prediction ID is required' },
        { status: 400 }
      );
    }

    const result = await getReplicateStatus(id);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Replicate status check error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check video status' },
      { status: 500 }
    );
  }
}
