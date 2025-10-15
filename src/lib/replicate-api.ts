import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export interface ReplicateVideoParams {
  prompt: string;
  duration?: string;
  aspect_ratio?: string;
  model?: string;
}

export interface ReplicateVideoResult {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed';
  video_url?: string;
  error?: string;
  progress?: number;
  created_at: number;
}

/**
 * Generate a video using Replicate
 * Supports multiple video generation models
 */
export async function generateVideoWithReplicate(params: ReplicateVideoParams): Promise<ReplicateVideoResult> {
  try {
    // Default to minimax video-01 model (good quality, fast)
    const model = params.model || 'minimax/video-01';
    
    console.log(`Starting Replicate video generation with model: ${model}`);
    
    // Start the prediction
    const prediction = await replicate.predictions.create({
      version: model,
      input: {
        prompt: params.prompt,
        ...(params.duration && { num_frames: params.duration === '5s' ? 150 : 300 }),
        ...(params.aspect_ratio && { aspect_ratio: params.aspect_ratio }),
      },
    });

    return {
      id: prediction.id,
      status: prediction.status as any,
      created_at: Date.now(),
      progress: 0,
    };
  } catch (error: any) {
    console.error('Replicate video generation error:', error);
    
    if (error.message?.includes('authentication')) {
      throw new Error('Invalid Replicate API token. Please check your REPLICATE_API_TOKEN.');
    }
    
    throw new Error(error.message || 'Failed to generate video with Replicate');
  }
}

/**
 * Check the status of a Replicate prediction
 */
export async function getReplicateStatus(predictionId: string): Promise<ReplicateVideoResult> {
  try {
    const prediction = await replicate.predictions.get(predictionId);
    
    return {
      id: prediction.id,
      status: prediction.status as any,
      video_url: prediction.output ? (Array.isArray(prediction.output) ? prediction.output[0] : prediction.output) : undefined,
      error: prediction.error?.toString(),
      created_at: Date.now(),
    };
  } catch (error: any) {
    console.error('Replicate status check error:', error);
    throw new Error('Failed to check video status');
  }
}

/**
 * Generate an image using Replicate
 * Supports FLUX and other image models
 */
export async function generateImageWithReplicate(prompt: string, model: string = 'black-forest-labs/flux-schnell'): Promise<any> {
  try {
    console.log(`Starting Replicate image generation with model: ${model}`);
    
    const prediction = await replicate.predictions.create({
      version: model,
      input: {
        prompt,
        num_outputs: 1,
      },
    });

    // Wait for completion (images are usually fast)
    const result = await replicate.wait(prediction);
    
    return {
      id: prediction.id,
      url: Array.isArray(result.output) ? result.output[0] : result.output,
      created_at: Date.now(),
    };
  } catch (error: any) {
    console.error('Replicate image generation error:', error);
    throw new Error(error.message || 'Failed to generate image with Replicate');
  }
}

/**
 * Available video models on Replicate
 */
export const REPLICATE_VIDEO_MODELS = {
  'minimax/video-01': 'MiniMax Video-01 (Fast, Good Quality)',
  'tencent/hunyuan-video': 'Hunyuan Video (High Quality)',
  'lucataco/mochi-1-preview': 'Mochi-1 (Experimental)',
} as const;

/**
 * Available image models on Replicate
 */
export const REPLICATE_IMAGE_MODELS = {
  'black-forest-labs/flux-schnell': 'FLUX Schnell (Fast)',
  'black-forest-labs/flux-dev': 'FLUX Dev (High Quality)',
  'black-forest-labs/flux-pro': 'FLUX Pro (Best Quality)',
} as const;
