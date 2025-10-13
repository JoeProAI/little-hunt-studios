import { NextRequest, NextResponse } from 'next/server';
import { generateStoryboard } from '@/lib/image-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompts } = body;

    if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
      return NextResponse.json(
        { error: 'Prompts array is required' },
        { status: 400 }
      );
    }

    if (prompts.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 prompts allowed' },
        { status: 400 }
      );
    }

    // Generate storyboard images
    const results = await generateStoryboard(prompts);

    return NextResponse.json({ images: results });
  } catch (error: any) {
    console.error('Storyboard generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate storyboard' },
      { status: 500 }
    );
  }
}
