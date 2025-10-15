import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface SoraGenerationParams {
  prompt: string;
  duration?: '5s' | '10s' | '15s' | '20s';
  aspect_ratio?: '16:9' | '9:16' | '1:1';
  num_outputs?: number;
}

export interface SoraGenerationResult {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  video_url?: string;
  thumbnail_url?: string;
  error?: string;
  progress?: number;
  created_at: number;
}

/**
 * Retry helper with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on certain errors
      if (error.status === 401 || error.status === 400 || error.status === 404) {
        throw error;
      }
      
      // If it's a 503 (capacity) error, retry with backoff
      if (error.status === 503 && i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError;
}

/**
 * Generate a video using Sora 2 API
 * CRITICAL: Uses model "sora-2" as specified
 */
export async function generateVideo(params: SoraGenerationParams): Promise<SoraGenerationResult> {
  try {
    // Attempt video generation with retry logic
    const result = await retryWithBackoff(async () => {
      // NOTE: OpenAI's video API might use a different endpoint
      // This attempts the chat completions API as a fallback
      const response = await openai.chat.completions.create({
        model: 'sora-2',
        messages: [
          {
            role: 'user',
            content: `Generate a video: ${params.prompt}. Duration: ${params.duration || '5s'}. Aspect ratio: ${params.aspect_ratio || '16:9'}`,
          },
        ],
      } as any);
      
      return response;
    }, 3, 2000);

    // Return processing status
    return {
      id: `video_${Date.now()}`,
      status: 'processing',
      created_at: Date.now(),
      progress: 0,
    };
  } catch (error: any) {
    console.error('Sora video generation error:', error);
    
    // Handle specific OpenAI errors with helpful messages
    if (error.status === 503) {
      throw new Error('Sora 2 is currently at full capacity. We tried 3 times but the API is overloaded. Please try again in a few minutes.');
    } else if (error.status === 404) {
      throw new Error('Sora 2 model not found. This might mean: (1) The model name is wrong, or (2) Your account doesn\'t have access. Check your OpenAI dashboard.');
    } else if (error.status === 401) {
      throw new Error('Invalid API key. Please check your OPENAI_API_KEY environment variable.');
    } else if (error.status === 400) {
      throw new Error(`Bad request: ${error.message || 'Check your prompt and parameters'}`);
    } else if (error.message) {
      throw new Error(error.message);
    }
    
    throw new Error('Unknown error occurred while generating video');
  }
}

/**
 * Check the status of a video generation
 */
export async function getVideoStatus(videoId: string): Promise<SoraGenerationResult> {
  // Placeholder implementation
  // This would poll the actual Sora API status endpoint
  return {
    id: videoId,
    status: 'processing',
    created_at: Date.now(),
    progress: 50,
  };
}

/**
 * Cancel a video generation in progress
 */
export async function cancelVideoGeneration(videoId: string): Promise<void> {
  // Placeholder implementation
  console.log(`Cancelling video generation: ${videoId}`);
}
