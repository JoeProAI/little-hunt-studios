import { NextRequest, NextResponse } from 'next/server';
import { generateVideoWithReplicate } from '@/lib/replicate-api';
import { deductCredits, hasEnoughCredits } from '@/lib/credits';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, duration = '5s', aspect_ratio = '16:9', model, userId } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in to generate videos.' },
        { status: 401 }
      );
    }

    // Check if Replicate API token is configured
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: 'Replicate API token not configured. Please add REPLICATE_API_TOKEN to your environment variables.' },
        { status: 500 }
      );
    }

    // Check if user has enough credits
    const hasCredits = await hasEnoughCredits(userId, 1);
    if (!hasCredits) {
      return NextResponse.json(
        { error: 'Insufficient credits. You need 1 credit to generate a video. Please purchase more credits to continue.' },
        { status: 402 }
      );
    }

    // Deduct credits BEFORE generation
    await deductCredits(userId, 1);

    // Call Replicate API
    const result = await generateVideoWithReplicate({
      prompt,
      duration,
      aspect_ratio,
      model,
    });

    // Save video to Firestore
    await addDoc(collection(db, 'videos'), {
      userId,
      prompt,
      videoUrl: result.video_url || null,
      status: result.status,
      duration,
      aspectRatio: aspect_ratio,
      model: model || 'openai/sora-2',
      creditsCost: 1,
      createdAt: new Date(),
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
