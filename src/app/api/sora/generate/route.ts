import { NextRequest, NextResponse } from 'next/server';
import { generateVideo } from '@/lib/sora-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, duration = '5s', aspect_ratio = '16:9', num_outputs = 1 } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Validate duration
    const validDurations = ['5s', '10s', '15s', '20s'];
    if (!validDurations.includes(duration)) {
      return NextResponse.json(
        { error: 'Invalid duration. Must be 5s, 10s, 15s, or 20s' },
        { status: 400 }
      );
    }

    // Call Sora 2 API
    const result = await generateVideo({
      prompt,
      duration: duration as any,
      aspect_ratio: aspect_ratio as any,
      num_outputs,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Sora generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate video' },
      { status: 500 }
    );
  }
}
