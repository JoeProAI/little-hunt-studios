import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ImageGenerationParams {
  prompt: string;
  size?: '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
}

export interface ImageGenerationResult {
  id: string;
  url: string;
  revised_prompt?: string;
  created_at: number;
}

/**
 * Generate an image using GPT Image 1 API
 * CRITICAL: Uses model "gpt-image-1" NOT "dall-e-3"
 */
export async function generateImage(params: ImageGenerationParams): Promise<ImageGenerationResult> {
  try {
    const response = await openai.images.generate({
      model: 'gpt-image-1',  // CRITICAL: Using gpt-image-1 model as required
      prompt: params.prompt,
      n: 1,
      size: params.size || '1024x1024',
      quality: params.quality || 'standard',
      style: params.style || 'vivid',
    } as any);

    if (!response.data || response.data.length === 0) {
      throw new Error('No image data received from API');
    }

    const image = response.data[0];
    
    return {
      id: `image_${Date.now()}`,
      url: image.url || '',
      revised_prompt: image.revised_prompt,
      created_at: Date.now(),
    };
  } catch (error: any) {
    console.error('Image generation error:', error);
    
    // Handle specific OpenAI errors
    if (error.status === 503) {
      throw new Error('Image generation is currently at capacity. Please try again in a few moments.');
    } else if (error.status === 404) {
      throw new Error('GPT Image 1 model not found. The API might not be available yet.');
    } else if (error.status === 401) {
      throw new Error('Invalid API key. Please check your OpenAI API key.');
    } else if (error.message) {
      throw new Error(error.message);
    }
    
    throw error;
  }
}

/**
 * Generate multiple storyboard images for pre-visualization
 */
export async function generateStoryboard(prompts: string[]): Promise<ImageGenerationResult[]> {
  try {
    const results = await Promise.all(
      prompts.map(prompt => generateImage({ prompt, size: '1024x1024' }))
    );
    return results;
  } catch (error) {
    console.error('Storyboard generation error:', error);
    throw error;
  }
}
