import { z } from 'zod';

// Prompt Recipe Types
export const PromptRecipeSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string(),
  template: z.string(),
  variables: z.array(z.object({
    name: z.string(),
    description: z.string(),
    example: z.string(),
  })),
  example: z.string(),
  best_for: z.string(),
  duration_range: z.string(),
});

export type PromptRecipe = z.infer<typeof PromptRecipeSchema>;

// Style Preset Types
export const StylePresetSchema = z.object({
  name: z.string(),
  category: z.string(),
  description: z.string(),
  cinematography: z.object({
    lens: z.string(),
    focal_length: z.string(),
    aperture: z.string(),
    aspect_ratio: z.string(),
    movement: z.string(),
    framing: z.string(),
  }),
  lighting: z.object({
    key_light: z.string(),
    fill_light: z.string(),
    back_light: z.string(),
    color_temperature: z.string(),
    contrast_ratio: z.string(),
    quality: z.string(),
  }),
  color: z.object({
    palette: z.string(),
    saturation: z.string(),
    highlights: z.string(),
    shadows: z.string(),
    midtones: z.string(),
    grading_style: z.string(),
  }),
  atmosphere: z.object({
    haze: z.string(),
    particles: z.string(),
    depth: z.string(),
    mood: z.string(),
  }),
  grain: z.object({
    amount: z.string(),
    size: z.string(),
  }),
  audio_bed_hint: z.string(),
});

export type StylePreset = z.infer<typeof StylePresetSchema>;

// Shot Library Types
export const ShotSchema = z.object({
  id: z.number(),
  move: z.string(),
  framing: z.string(),
  purpose: z.string(),
  when_to_use: z.string(),
  prompt_snippet: z.string(),
  duration: z.string(),
  speed: z.string(),
  notes: z.string(),
});

export type Shot = z.infer<typeof ShotSchema>;

// Prompt Builder Types
export const PromptBuilderSchema = z.object({
  scene: z.string().min(10, 'Scene description must be at least 10 characters'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  action: z.string().min(3, 'Action must be at least 3 characters'),
  camera: z.string().optional(),
  look: z.string().optional(),
  audio: z.string().optional(),
  negatives: z.string().optional(),
  duration: z.string().default('5s'), // Allow any duration string for model flexibility
});

export type PromptBuilderData = z.infer<typeof PromptBuilderSchema>;

// Video Generation Types
export interface VideoGenerationRequest {
  prompt: string;
  duration?: string;
  aspect_ratio?: string;
  variations?: number;
}

export interface VideoGenerationResponse {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  video_url?: string;
  thumbnail_url?: string;
  error?: string;
  progress?: number;
}

// Image Generation Types
export interface ImageGenerationRequest {
  prompt: string;
  size?: '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
}

export interface ImageGenerationResponse {
  id: string;
  url: string;
  revised_prompt?: string;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description: string;
  shots: ProjectShot[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectShot {
  id: string;
  prompt: string;
  duration: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  order: number;
  status: 'draft' | 'generating' | 'completed' | 'failed';
}
