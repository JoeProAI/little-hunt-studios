import { NextRequest, NextResponse } from 'next/server';
import { generateVideoWithReplicate } from '@/lib/replicate-api';
import { deductCredits, hasEnoughCredits, refundCredits } from '@/lib/credits-admin';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

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

    // Get model credit cost
    const { getModelCredits } = await import('@/lib/model-pricing');
    const creditCost = getModelCredits(model || 'openai/sora-2-pro');

    // Check if user has enough credits
    const hasCredits = await hasEnoughCredits(userId, creditCost);
    if (!hasCredits) {
      return NextResponse.json(
        { error: `Insufficient credits. This model requires ${creditCost} credits. Please purchase more credits to continue.` },
        { status: 402 }
      );
    }

    // Deduct credits BEFORE generation
    await deductCredits(userId, creditCost);

    let result;
    try {
      // Call Replicate API
      result = await generateVideoWithReplicate({
        prompt,
        duration,
        aspect_ratio,
        model,
      });
    } catch (generationError: any) {
      // Refund credits if generation fails
      await refundCredits(userId, creditCost, `Generation failed: ${generationError.message}`);
      throw generationError;
    }

    // Save video to Firestore using Admin SDK (lazy-loaded)
    const db = getAdminDb();
    const { REPLICATE_VIDEO_MODELS } = await import('@/lib/replicate-api');
    const modelName = REPLICATE_VIDEO_MODELS[model as keyof typeof REPLICATE_VIDEO_MODELS] || model;
    
    await db.collection('videos').add({
      userId,
      type: 'video',
      url: result.video_url || '',
      thumbnailUrl: result.video_url || '', // Can be extracted later
      prompt,
      model: model || 'openai/sora-2-pro',
      modelName,
      duration,
      aspectRatio: aspect_ratio,
      status: result.status === 'succeeded' ? 'completed' : result.status === 'failed' ? 'failed' : 'processing',
      error: result.error,
      replicateId: result.id,
      creditsCost: creditCost,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ...result, saved: true });
  } catch (error: any) {
    console.error('Replicate generation error:', error);
    
    // Handle Replicate payment errors
    if (error.message && (error.message.includes('402') || error.message.includes('Insufficient credit'))) {
      return NextResponse.json(
        { 
          error: 'Insufficient Replicate credits. If you just purchased credits, please wait 2-5 minutes for them to be processed, then try again. Visit https://replicate.com/account/billing to check your balance.' 
        },
        { status: 402 }
      );
    }
    
    // Handle content moderation errors
    if (error.message && (error.message.includes('sensitive') || error.message.includes('flagged') || error.message.includes('E005'))) {
      return NextResponse.json(
        { 
          error: 'Content flagged by AI safety filters. Try rephrasing your prompt with different words. Your credit has been automatically refunded.' 
        },
        { status: 422 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to generate video with Replicate' },
      { status: 500 }
    );
  }
}
