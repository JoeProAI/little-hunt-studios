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
    // Use Sora 2 via Replicate as default
    const model = params.model || 'openai/sora-2';
    
    console.log(`Starting Replicate video generation with model: ${model}`);
    
    // Prepare input based on the model
    let input: any = {
      prompt: params.prompt,
    };

    // Add model-specific parameters based on Replicate API requirements
    if (model.includes('sora')) {
      // OpenAI Sora-2 and Sora-2 Pro
      input.duration = params.duration || '5s';
      const aspectRatio = params.aspect_ratio || '16:9';
      input.aspect_ratio = aspectRatio === '9:16' ? 'portrait' : 'landscape';
      
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY environment variable is required for Sora generation');
      }
      input.openai_api_key = process.env.OPENAI_API_KEY;
      console.log(`Using ${model} with OpenAI key`);
      
    } else if (model.includes('veo')) {
      // Google Veo-3, Veo-3 Fast, Veo-3.1, Veo-3.1 Fast
      input.duration = params.duration || '5s';
      input.aspect_ratio = params.aspect_ratio || '16:9';
      input.generate_audio = true; // Veo generates audio by default
      
    } else if (model.includes('pixverse')) {
      // Pixverse v4, v4.5, v5
      input.duration = params.duration === '5s' ? '5s' : '8s'; // Pixverse supports 5s or 8s
      input.resolution = '1080p'; // Default to 1080p
      input.aspect_ratio = params.aspect_ratio || '16:9';
      
    } else if (model.includes('hailuo')) {
      // MiniMax Hailuo-02 and Hailuo-02-fast
      input.duration = params.duration === '5s' ? '6s' : '10s'; // Hailuo uses 6s or 10s
      input.quality = model.includes('fast') ? 'standard' : 'pro'; // 512p vs 768p/1080p
      input.aspect_ratio = params.aspect_ratio || '16:9';
      
    } else if (model.includes('seedance')) {
      // ByteDance Seedance-1-Pro and Seedance-1-Lite
      input.duration = params.duration === '5s' ? '5s' : '10s';
      input.resolution = model.includes('pro') ? '1080p' : '720p';
      input.aspect_ratio = params.aspect_ratio || '16:9';
      
    } else if (model.includes('kling')) {
      // Kling v1.5, v1.6, v2.0, v2.1, v2.5
      input.duration = params.duration === '5s' ? '5s' : '10s';
      
      // Set resolution based on version
      if (model.includes('pro') || model.includes('master')) {
        input.aspect_ratio = '1080p';
      } else if (model.includes('standard')) {
        input.aspect_ratio = '720p';
      } else {
        input.aspect_ratio = params.aspect_ratio || '16:9';
      }
      
    } else if (model.includes('minimax/video-01')) {
      // MiniMax Video-01 (different from Hailuo)
      input.num_frames = params.duration === '5s' ? 150 : 300;
      input.aspect_ratio = params.aspect_ratio || '16:9';
      
    } else if (model.includes('wan')) {
      // Alibaba Wan 2.1, 2.2, 2.5
      if (model.includes('2.5')) {
        // Wan 2.5 format
        input.duration = params.duration || '5s';
        input.aspect_ratio = params.aspect_ratio || '16:9';
      } else {
        // Wan 2.1/2.2 format
        input.video_length = params.duration === '5s' ? 5 : 10;
        input.aspect_ratio = params.aspect_ratio || '16:9';
      }
      
    } else if (model.includes('luma')) {
      // Luma Ray, Ray-2, Ray-Flash
      if (model.includes('flash')) {
        // Ray Flash 2
        input.duration = params.duration === '5s' ? '5s' : '9s';
        // Resolution is in the model name (540p, 720p)
      } else if (model.includes('ray-2')) {
        // Ray 2
        input.duration = params.duration === '5s' ? '5s' : '9s';
      } else {
        // Original Ray (Dream Machine)
        input.aspect_ratio = params.aspect_ratio || '16:9';
      }
      
    } else if (model.includes('hunyuan')) {
      // Tencent Hunyuan Video
      input.video_length = params.duration === '5s' ? '5s' : '10s';
      input.resolution = params.aspect_ratio === '9:16' ? '720x1280' : '1280x720';
      
    } else if (model.includes('gen4')) {
      // Runway Gen-4
      input.duration = params.duration === '5s' ? '5s' : '10s';
      input.aspect_ratio = params.aspect_ratio || '16:9';
      
    } else if (model.includes('ovi')) {
      // Character.AI Ovi I2V (requires image input)
      input.duration = params.duration || '5s';
      // Note: This model requires an image parameter which should be added in UI
      
    } else if (model.includes('mochi')) {
      // Genmo Mochi-1
      input.num_frames = params.duration === '5s' ? 84 : 163;
      input.aspect_ratio = params.aspect_ratio || '16:9';
      
    } else {
      // Default parameters for any other model
      input.duration = params.duration || '5s';
      if (params.aspect_ratio) {
        input.aspect_ratio = params.aspect_ratio;
      }
    }
    
    console.log('Replicate input:', input);
    
    // Start the prediction using run() method
    const output = await replicate.run(
      model as any,
      { input }
    );

    // For now, return the output directly since run() waits for completion
    return {
      id: `gen_${Date.now()}`,
      status: 'succeeded',
      video_url: Array.isArray(output) ? output[0] : output,
      created_at: Date.now(),
      progress: 100,
    };
  } catch (error: any) {
    console.error('Replicate video generation error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    // Extract error message from various possible formats
    const errorMessage = error.message || error.detail || error.toString();
    console.error('Extracted error message:', errorMessage);
    
    if (errorMessage?.includes('authentication')) {
      throw new Error('Invalid Replicate API token. Please check your REPLICATE_API_TOKEN.');
    }
    
    if (errorMessage?.includes('not found')) {
      throw new Error(`Model not found on Replicate. The model might not be available yet or the name might be wrong. Error: ${errorMessage}`);
    }
    
    // Detect content moderation errors (preserve original error for retry logic)
    if (errorMessage?.toLowerCase().includes('sensitive') || 
        errorMessage?.toLowerCase().includes('flagged') || 
        errorMessage?.includes('E005') ||
        errorMessage?.includes('NSFW')) {
      throw new Error(`Content flagged: ${errorMessage}`);
    }
    
    throw new Error(errorMessage || 'Failed to generate video with Replicate');
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
  // Premium - Latest & Best
  'openai/sora-2-pro': 'Sora-2 Pro ⭐ (Most Advanced, Synced Audio)',
  'openai/sora-2': 'Sora-2 (Flagship, Synced Audio)',
  'google/veo-3.1': 'Google Veo-3.1 (NEW! Higher Fidelity, Audio)',
  'google/veo-3.1-fast': 'Google Veo-3.1 Fast (NEW! Faster & Cheaper)',
  'google/veo-3': 'Google Veo-3 (Flagship, with Audio)',
  'google/veo-3-fast': 'Google Veo-3 Fast',
  
  // High Quality - Recommended
  'pixverse/pixverse-v5': 'Pixverse v5 (Enhanced Motion, 1080p)',
  'pixverse/pixverse-v4.5': 'Pixverse v4.5 (Complex Actions)',
  'minimax/hailuo-02': 'Hailuo 2 (Real World Physics, 1080p)',
  'minimax/hailuo-02-fast': 'Hailuo 2 Fast (Low Cost, 512p)',
  'bytedance/seedance-1-pro': 'Seedance Pro (5s-10s, 1080p)',
  'bytedance/seedance-1-lite': 'Seedance Lite (480p-720p)',
  
  // Fast & Efficient
  'luma/ray-flash-2-720p': 'Luma Ray Flash 720p',
  'luma/ray-flash-2-540p': 'Luma Ray Flash 540p (Fastest)',
  'luma/ray': 'Luma Ray (Dream Machine)',
  'wan-video/wan-2.5-t2v-fast': 'Wan 2.5 T2V Fast',
  'wan-video/wan-2.5-t2v': 'Wan 2.5 T2V (with Audio)',
  
  // Premium Alternatives
  'kwaivgi/kling-v2.5-turbo-pro': 'Kling 2.5 Turbo Pro (Cinematic)',
  'kwaivgi/kling-v2.1-master': 'Kling 2.1 Master (1080p)',
  'kwaivgi/kling-v2.1': 'Kling 2.1 (720p-1080p)',
  'kwaivgi/kling-v1.6-pro': 'Kling 1.6 Pro (1080p)',
  'kwaivgi/kling-v1.6-standard': 'Kling 1.6 Standard (720p)',
  
  // Creative & Specialized
  'minimax/video-01-director': 'MiniMax Director (Camera Control)',
  'minimax/video-01': 'MiniMax Video-01 (6s)',
  'character-ai/ovi-i2v': 'Ovi I2V (Audio from Image+Text)',
  'runwayml/gen4-aleph': 'Runway Gen-4 Aleph (Edit & Transform)',
  
  // Open Source
  'tencent/hunyuan-video': 'Hunyuan Video (Open Source)',
} as const;

/**
 * Available image models on Replicate
 */
export const REPLICATE_IMAGE_MODELS = {
  'black-forest-labs/flux-schnell': 'FLUX Schnell (Fast)',
  'black-forest-labs/flux-dev': 'FLUX Dev (High Quality)',
  'black-forest-labs/flux-pro': 'FLUX Pro (Best Quality)',
} as const;
