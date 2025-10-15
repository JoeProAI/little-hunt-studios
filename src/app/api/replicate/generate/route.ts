import { NextRequest, NextResponse } from 'next/server';
import { generateVideoWithReplicate } from '@/lib/replicate-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, duration = '5s', aspect_ratio = '16:9', model } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Check if Replicate API token is configured
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: 'Replicate API token not configured. Please add REPLICATE_API_TOKEN to your environment variables.' },
        { status: 500 }
      );
    }

    // Call Replicate API
    const result = await generateVideoWithReplicate({
      prompt,
      duration,
      aspect_ratio,
      model,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Replicate generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate video with Replicate' },
      { status: 500 }
    );
  }
}
