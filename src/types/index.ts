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
  id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string(),
  cinematography: z.object({
    camera: z.string(),
    lens: z.string(),
    framing: z.string(),
    movement: z.string(),
  }),
  lighting: z.object({
    setup: z.string(),
    mood: z.string(),
    time_of_day: z.string(),
  }),
  color: z.object({
    palette: z.string(),
    grading: z.string(),
    saturation: z.string(),
  }),
  audio: z.object({
    style: z.string(),
    elements: z.array(z.string()),
  }),
  prompt_template: z.string(),
  example_prompt: z.string(),
});

export type StylePreset = z.infer<typeof StylePresetSchema>;

// Shot Library Types
export const ShotSchema = z.object({
  id: z.string(),
  name: z.string(),
  move: z.string(),
  category: z.string(),
  description: z.string(),
  framing: z.string(),
  movement_type: z.string(),
  speed: z.string(),
  purpose: z.string(),
  when_to_use: z.string(),
  duration_range: z.string(),
  prompt_snippet: z.string(),
  example: z.string(),
});

export type Shot = z.infer<typeof ShotSchema>;

// Prompt Builder Types
export const PromptBuilderSchema = z.object({
  scene: z.string().min(1, "Scene description is required"),
  subject: z.string().min(1, "Subject is required"),
  action: z.string().min(1, "Action is required"),
  camera: z.string().optional(),
  look: z.string().optional(),
  audio: z.string().optional(),
  negatives: z.string().optional(),
  duration: z.enum(["5s", "10s", "15s", "20s"]).default("5s"),
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
