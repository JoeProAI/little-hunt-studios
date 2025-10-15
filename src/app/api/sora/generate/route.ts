import { NextRequest, NextResponse } from 'next/server';
import { generateVideo } from '@/lib/sora-api';

export async function POST(request: NextRequest) {
  try {
    // OpenAI Sora 2 API is not yet widely available
    // Return a helpful error message instead of trying to call the API
    return NextResponse.json(
      { 
        error: 'OpenAI Sora 2 API is not yet widely available. Please use Replicate instead (switch in the dropdown above).',
        hint: 'Replicate offers MiniMax Video-01 and Hunyuan Video which work great!'
      },
      { status: 503 }
    );

    // Keeping the original code commented out for when Sora becomes available
    /*
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
    */
  } catch (error: any) {
    console.error('Sora generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate video' },
      { status: 500 }
    );
  }
}
