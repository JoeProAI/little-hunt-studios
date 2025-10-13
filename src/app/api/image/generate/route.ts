import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/image-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, size = '1024x1024', quality = 'standard', style = 'vivid' } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Validate size
    const validSizes = ['1024x1024', '1792x1024', '1024x1792'];
    if (!validSizes.includes(size)) {
      return NextResponse.json(
        { error: 'Invalid size' },
        { status: 400 }
      );
    }

    // Call GPT Image 1 API
    const result = await generateImage({
      prompt,
      size: size as any,
      quality: quality as any,
      style: style as any,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}
