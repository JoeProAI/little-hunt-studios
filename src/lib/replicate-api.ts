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
    // Each model has been verified for correct parameter format and values
    
    if (model.includes('sora')) {
      // ===== OpenAI Sora-2 and Sora-2 Pro =====
      // Parameters: prompt (string), duration (string), aspect_ratio (landscape/portrait), openai_api_key
      input.duration = params.duration || '5s';
      const aspectRatio = params.aspect_ratio || '16:9';
      input.aspect_ratio = aspectRatio === '9:16' ? 'portrait' : 'landscape';
      
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY environment variable is required for Sora generation');
      }
      input.openai_api_key = process.env.OPENAI_API_KEY;
      console.log(`✓ ${model}: duration="${input.duration}", aspect_ratio="${input.aspect_ratio}"`);
      
    } else if (model.includes('veo')) {
      // ===== Google Veo-3, Veo-3 Fast, Veo-3.1, Veo-3.1 Fast =====
      // Parameters: prompt (string), duration (integer: 4, 6, 8), aspect_ratio (string), generate_audio (bool)
      let durationSeconds = 4;
      if (params.duration === '5s' || params.duration === '6s') {
        durationSeconds = 6;
      } else if (params.duration === '10s' || params.duration === '8s') {
        durationSeconds = 8;
      }
      input.duration = durationSeconds;
      input.aspect_ratio = params.aspect_ratio || '16:9';
      input.generate_audio = true;
      console.log(`✓ ${model}: duration=${input.duration}, aspect_ratio="${input.aspect_ratio}"`);
      
    } else if (model.includes('pixverse')) {
      // ===== Pixverse v4, v4.5, v5 =====
      // Parameters: prompt (string), duration (integer: 5 or 8), resolution (string), aspect_ratio (string)
      input.duration = params.duration === '5s' ? 5 : 8;
      input.resolution = '1080p';
      input.aspect_ratio = params.aspect_ratio || '16:9';
      console.log(`✓ ${model}: duration=${input.duration}, resolution="${input.resolution}", aspect_ratio="${input.aspect_ratio}"`);
      
    } else if (model.includes('hailuo')) {
      // ===== MiniMax Hailuo-02 and Hailuo-02-fast =====
      // Parameters: prompt (string), duration (integer: 6 or 10), quality (string), resolution (string), aspect_ratio (string)
      // Note: 10s duration requires 768p resolution
      const duration = params.duration === '5s' ? 6 : 10;
      input.duration = duration;
      input.quality = model.includes('fast') ? 'standard' : 'pro';
      
      // 10s requires 768p, 6s can use higher quality
      if (duration === 10) {
        input.resolution = '768p';
      }
      
      input.aspect_ratio = params.aspect_ratio || '16:9';
      console.log(`✓ ${model}: duration=${input.duration}, quality="${input.quality}", resolution="${input.resolution || 'auto'}", aspect_ratio="${input.aspect_ratio}"`);
      
    } else if (model.includes('seedance')) {
      // ===== ByteDance Seedance-1-Pro and Seedance-1-Lite =====
      // Parameters: prompt (string), duration (integer: 5 or 10), resolution (string), aspect_ratio (string)
      input.duration = params.duration === '5s' ? 5 : 10;
      input.resolution = model.includes('pro') ? '1080p' : '720p';
      input.aspect_ratio = params.aspect_ratio || '16:9';
      console.log(`✓ ${model}: duration=${input.duration}, resolution="${input.resolution}", aspect_ratio="${input.aspect_ratio}"`);
      
    } else if (model.includes('kling')) {
      // ===== Kling v1.5, v1.6, v2.0, v2.1, v2.5 (all variants) =====
      // Parameters: prompt (string), duration (integer: 5 or 10), aspect_ratio (string)
      // Resolution determined by model name (pro/master=1080p, standard=720p)
      input.duration = params.duration === '5s' ? 5 : 10;
      input.aspect_ratio = params.aspect_ratio || '16:9';
      console.log(`✓ ${model}: duration=${input.duration}, aspect_ratio="${input.aspect_ratio}"`);
      
    } else if (model.includes('minimax/video-01')) {
      // ===== MiniMax Video-01 and Video-01-Director =====
      // Parameters: prompt (string), num_frames (integer), aspect_ratio (string)
      input.num_frames = params.duration === '5s' ? 150 : 300;
      input.aspect_ratio = params.aspect_ratio || '16:9';
      console.log(`✓ ${model}: num_frames=${input.num_frames}, aspect_ratio="${input.aspect_ratio}"`);
      
    } else if (model.includes('wan')) {
      // ===== Alibaba Wan 2.1, 2.2, 2.5 =====
      // All Wan models use duration (integer: 5)
      input.duration = 5; // Wan only supports 5 seconds
      input.aspect_ratio = params.aspect_ratio || '16:9';
      console.log(`✓ ${model}: duration=${input.duration}, aspect_ratio="${input.aspect_ratio}"`);

      
    } else if (model.includes('luma')) {
      // ===== Luma Ray, Ray-2, Ray-Flash =====
      if (model.includes('flash')) {
        // Ray Flash 2: duration (integer: 5 or 9)
        input.duration = params.duration === '9s' ? 9 : 5;
        console.log(`✓ ${model}: duration=${input.duration}`);
      } else if (model.includes('ray-2')) {
        // Ray 2: duration (integer: 5 or 9)
        input.duration = params.duration === '9s' ? 9 : 5;
        console.log(`✓ ${model}: duration=${input.duration}`);
      } else {
        // Original Ray (Dream Machine): duration (string), aspect_ratio (string)
        input.duration = params.duration || '5s';
        input.aspect_ratio = params.aspect_ratio || '16:9';
        console.log(`✓ ${model}: duration="${input.duration}", aspect_ratio="${input.aspect_ratio}"`);
      }
      
    } else if (model.includes('mochi')) {
      // ===== Genmo Mochi-1 =====
      // Parameters: prompt (string), num_frames (integer), aspect_ratio (string)
      input.num_frames = params.duration === '5s' ? 84 : 163;
      input.aspect_ratio = params.aspect_ratio || '16:9';
      console.log(`✓ ${model}: num_frames=${input.num_frames}, aspect_ratio="${input.aspect_ratio}"`);
      
    } else {
      // ===== Fallback for any unlisted models =====
      input.duration = params.duration || '5s';
      if (params.aspect_ratio) {
        input.aspect_ratio = params.aspect_ratio;
      }
      console.log(`⚠ ${model}: Using default parameters`);
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
 * Model-specific duration options
 */
export const MODEL_DURATION_OPTIONS: Record<string, string[]> = {
  // Veo models: 4, 6, 8 seconds
  'google/veo-3.1': ['4s', '6s', '8s'],
  'google/veo-3.1-fast': ['4s', '6s', '8s'],
  'google/veo-3': ['4s', '6s', '8s'],
  'google/veo-3-fast': ['4s', '6s', '8s'],
  
  // Pixverse: 5, 8 seconds
  'pixverse/pixverse-v5': ['5s', '8s'],
  'pixverse/pixverse-v4.5': ['5s', '8s'],
  'pixverse/pixverse-v4': ['5s', '8s'],
  
  // Hailuo: 6, 10 seconds
  'minimax/hailuo-02': ['6s', '10s'],
  'minimax/hailuo-02-fast': ['6s', '10s'],
  
  // Seedance: 5, 10 seconds
  'bytedance/seedance-1-pro': ['5s', '10s'],
  'bytedance/seedance-1-lite': ['5s', '10s'],
  
  // Kling: 5, 10 seconds
  'kwaivgi/kling-v2.5-turbo-pro': ['5s', '10s'],
  'kwaivgi/kling-v2.1-master': ['5s', '10s'],
  'kwaivgi/kling-v2.1': ['5s', '10s'],
  'kwaivgi/kling-v1.6-pro': ['5s', '10s'],
  'kwaivgi/kling-v1.6-standard': ['5s', '10s'],
  
  // Luma Ray: 5, 9 seconds
  'luma/ray-flash-2-720p': ['5s', '9s'],
  'luma/ray-flash-2-540p': ['5s', '9s'],
  'luma/ray': ['5s'],
  
  // Sora: 5 seconds (currently)
  'openai/sora-2-pro': ['5s'],
  'openai/sora-2': ['5s'],
  
  // Wan 2.5: 5 seconds
  'wan-video/wan-2.5-t2v-fast': ['5s'],
  'wan-video/wan-2.5-t2v': ['5s'],
  
  // MiniMax Video-01: 5, 10 seconds (via num_frames)
  'minimax/video-01-director': ['5s', '10s'],
  'minimax/video-01': ['5s', '10s'],
};

/**
 * Get duration options for a specific model
 */
export function getModelDurations(modelId: string): string[] {
  return MODEL_DURATION_OPTIONS[modelId] || ['5s', '10s']; // Default fallback
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
} as const;

/**
 * Available image models on Replicate
 */
export const REPLICATE_IMAGE_MODELS = {
  'black-forest-labs/flux-schnell': 'FLUX Schnell (Fast)',
  'black-forest-labs/flux-dev': 'FLUX Dev (High Quality)',
  'black-forest-labs/flux-pro': 'FLUX Pro (Best Quality)',
} as const;
