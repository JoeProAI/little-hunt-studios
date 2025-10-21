/**
 * Model Pricing & Credit System
 * 
 * Premium (3 credits): Highest quality, most expensive API costs
 * Mid-range (2 credits): Production quality, balanced cost
 * Budget (1 credit): Fast/draft quality, lowest cost
 */

export interface ModelTier {
  credits: number;
  tier: 'premium' | 'mid-range' | 'budget';
  description: string;
}

export const MODEL_PRICING: Record<string, ModelTier> = {
  // ===== PREMIUM TIER (3 Credits) =====
  'openai/sora-2-pro': {
    credits: 3,
    tier: 'premium',
    description: 'Highest quality with synced audio'
  },
  'openai/sora-2': {
    credits: 3,
    tier: 'premium',
    description: 'Professional cinematic quality'
  },
  'google/veo-3.1': {
    credits: 3,
    tier: 'premium',
    description: 'Latest Google model with audio'
  },
  'google/veo-3.1-fast': {
    credits: 2,
    tier: 'mid-range',
    description: 'Fast Veo with good quality'
  },
  
  // ===== MID-RANGE TIER (2 Credits) =====
  'google/veo-3': {
    credits: 2,
    tier: 'mid-range',
    description: 'Production quality'
  },
  'google/veo-3-fast': {
    credits: 2,
    tier: 'mid-range',
    description: 'Fast production quality'
  },
  'pixverse/pixverse-v5': {
    credits: 2,
    tier: 'mid-range',
    description: '1080p with enhanced motion'
  },
  'pixverse/pixverse-v4.5': {
    credits: 2,
    tier: 'mid-range',
    description: 'Complex actions in 1080p'
  },
  'pixverse/pixverse-v4': {
    credits: 2,
    tier: 'mid-range',
    description: 'Reliable 1080p quality'
  },
  'minimax/hailuo-02': {
    credits: 2,
    tier: 'mid-range',
    description: 'Realistic physics in 1080p'
  },
  'bytedance/seedance-1-pro': {
    credits: 2,
    tier: 'mid-range',
    description: '1080p pro quality'
  },
  'kwaivgi/kling-v2.5-turbo-pro': {
    credits: 2,
    tier: 'mid-range',
    description: 'Cinematic depth and motion'
  },
  'kwaivgi/kling-v2.1-master': {
    credits: 2,
    tier: 'mid-range',
    description: '1080p master quality'
  },
  'kwaivgi/kling-v2.1': {
    credits: 2,
    tier: 'mid-range',
    description: 'Balanced quality'
  },
  'minimax/video-01-director': {
    credits: 2,
    tier: 'mid-range',
    description: 'Director-level control'
  },
  'minimax/video-01': {
    credits: 2,
    tier: 'mid-range',
    description: 'Frame-based control'
  },
  'wan-video/wan-2.5-t2v': {
    credits: 2,
    tier: 'mid-range',
    description: 'With audio generation'
  },
  
  // ===== BUDGET TIER (1 Credit) =====
  'luma/ray-flash-2-720p': {
    credits: 1,
    tier: 'budget',
    description: 'Fast 720p generation'
  },
  'luma/ray-flash-2-540p': {
    credits: 1,
    tier: 'budget',
    description: 'Fastest 540p draft quality'
  },
  'luma/ray': {
    credits: 1,
    tier: 'budget',
    description: 'Dream Machine classic'
  },
  'minimax/hailuo-02-fast': {
    credits: 1,
    tier: 'budget',
    description: 'Fast 512p quality'
  },
  'bytedance/seedance-1-lite': {
    credits: 1,
    tier: 'budget',
    description: '720p lite quality'
  },
  'kwaivgi/kling-v1.6-pro': {
    credits: 1,
    tier: 'budget',
    description: 'Proven 1080p quality'
  },
  'kwaivgi/kling-v1.6-standard': {
    credits: 1,
    tier: 'budget',
    description: 'Standard quality'
  },
  'wan-video/wan-2.5-t2v-fast': {
    credits: 1,
    tier: 'budget',
    description: 'Fast generation'
  },
  'genmo/mochi-1-preview': {
    credits: 1,
    tier: 'budget',
    description: 'Preview quality'
  },
};

/**
 * Get credit cost for a model (default to 2 if unknown)
 */
export function getModelCredits(modelId: string): number {
  return MODEL_PRICING[modelId]?.credits || 2;
}

/**
 * Get model tier information
 */
export function getModelTier(modelId: string): ModelTier {
  return MODEL_PRICING[modelId] || {
    credits: 2,
    tier: 'mid-range',
    description: 'Standard quality'
  };
}

/**
 * Get all models by tier
 */
export function getModelsByTier(tier: 'premium' | 'mid-range' | 'budget'): string[] {
  return Object.entries(MODEL_PRICING)
    .filter(([_, info]) => info.tier === tier)
    .map(([modelId]) => modelId);
}

/**
 * Subscription Tiers with Credits
 * 
 * Pricing Strategy:
 * - Free: Try the platform (10 budget videos or 3 premium)
 * - Pro: $29/mo for 60 credits (20 premium, 30 mid, or 60 budget)
 * - Studio: $99/mo for 250 credits (83 premium, 125 mid, or 250 budget)
 * 
 * Cost Analysis (assuming $0.50/credit cost):
 * - Pro: $29 for $30 worth = break-even, profit on usage patterns
 * - Studio: $99 for $125 worth = $26 profit if all premium, more if mixed
 */
export interface SubscriptionTier {
  id: 'free' | 'pro' | 'studio';
  name: string;
  monthlyCredits: number;
  price: number; // USD
  features: string[];
  recommended?: boolean;
}

export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  free: {
    id: 'free',
    name: 'Free',
    monthlyCredits: 10,
    price: 0,
    features: [
      '10 credits/month',
      'Access to all models',
      'Basic support',
      '3-4 premium videos OR',
      '5 mid-range videos OR',
      '10 budget videos',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    monthlyCredits: 60,
    price: 29,
    recommended: true,
    features: [
      '60 credits/month',
      'Priority processing',
      'Email support',
      '20 premium videos OR',
      '30 mid-range videos OR',
      '60 budget videos',
      'Mix & match as needed',
    ],
  },
  studio: {
    id: 'studio',
    name: 'Studio',
    monthlyCredits: 250,
    price: 99,
    features: [
      '250 credits/month',
      'Fastest processing',
      'Priority support',
      '83 premium videos OR',
      '125 mid-range videos OR',
      '250 budget videos',
      'Mix & match as needed',
      'API access (coming soon)',
    ],
  },
};

/**
 * Calculate value proposition for each tier
 */
export function calculateTierValue(tier: SubscriptionTier) {
  return {
    premiumVideos: Math.floor(tier.monthlyCredits / 3),
    midRangeVideos: Math.floor(tier.monthlyCredits / 2),
    budgetVideos: tier.monthlyCredits,
    pricePerCredit: tier.price > 0 ? tier.price / tier.monthlyCredits : 0,
  };
}
