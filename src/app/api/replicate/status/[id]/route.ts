import { NextRequest, NextResponse } from 'next/server';
import { getReplicateStatus } from '@/lib/replicate-api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Check if ID is valid (Replicate IDs don't start with "gen_")
    if (!id || id.startsWith('gen_')) {
      return NextResponse.json(
        { error: 'Invalid prediction ID. Generation may have failed to start.' },
        { status: 400 }
      );
    }
    
    const result = await getReplicateStatus(id);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Replicate status check error for ID:', params.id, error);
    return NextResponse.json(
      { error: error.message || 'Failed to check video status' },
      { status: 500 }
    );
  }
}
