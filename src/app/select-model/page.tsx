'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Play, Sparkles } from 'lucide-react';
import { REPLICATE_VIDEO_MODELS } from '@/lib/replicate-api';

interface ModelOption {
  id: string;
  name: string;
  demoVideoUrl?: string;
  thumbnail?: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

// Featured models with descriptions
const FEATURED_MODELS: ModelOption[] = [
  {
    id: 'openai/sora-2-pro',
    name: 'Sora-2 Pro',
    description: 'Most advanced video generation with synced audio. Best for professional, high-quality content.',
    features: ['Highest Quality', 'Synced Audio', 'Professional Results', 'Strict Filters'],
    recommended: true,
  },
  {
    id: 'google/veo-3.1',
    name: 'Google Veo-3.1',
    description: 'Latest from Google with higher fidelity and context-aware audio generation.',
    features: ['High Fidelity', 'Context Audio', 'New Release', 'Premium Quality'],
  },
  {
    id: 'pixverse/pixverse-v5',
    name: 'Pixverse v5',
    description: 'Enhanced motion and character animation. Great for creative content with relaxed filters.',
    features: ['Enhanced Motion', '1080p', 'Relaxed Filters', 'Character Animation'],
    recommended: true,
  },
  {
    id: 'minimax/hailuo-02',
    name: 'Hailuo 2',
    description: 'Excels at realistic physics and natural motion. Perfect for real-world scenarios.',
    features: ['Real World Physics', '1080p', 'Natural Motion', 'High Quality'],
  },
  {
    id: 'bytedance/seedance-1-pro',
    name: 'Seedance Pro',
    description: 'High-quality 5-10 second videos with excellent detail and motion quality.',
    features: ['5-10s Duration', '1080p', 'Detailed', 'Smooth Motion'],
  },
  {
    id: 'wan-video/wan-2.5-t2v',
    name: 'Wan 2.5 T2V',
    description: 'Text-to-video with audio generation. Balanced quality and speed.',
    features: ['Audio Generation', 'Fast', 'Good Quality', 'Versatile'],
  },
  {
    id: 'minimax/video-01',
    name: 'MiniMax Video-01',
    description: 'Flexible frame-based generation for precise control over video length.',
    features: ['Frame Control', '5-10s', 'Customizable', 'Consistent'],
  },
  {
    id: 'kwaivgi/kling-v2.5-turbo-pro',
    name: 'Kling 2.5 Turbo Pro',
    description: 'Cinematic depth and smooth motion with excellent prompt adherence.',
    features: ['Cinematic Depth', 'Smooth Motion', 'Pro-Level', 'Prompt Adherence'],
  },
  {
    id: 'kwaivgi/kling-v2.1-master',
    name: 'Kling 2.1 Master',
    description: 'Master quality with 1080p output. Balanced speed and quality.',
    features: ['1080p', 'Master Quality', 'Balanced', 'Reliable'],
  },
  {
    id: 'kwaivgi/kling-v1.6-pro',
    name: 'Kling 1.6 Pro',
    description: 'Professional-grade 1080p video with proven stability.',
    features: ['1080p', 'Professional', 'Stable', 'Proven'],
  },
  {
    id: 'luma/ray-flash-2-720p',
    name: 'Luma Ray Flash 720p',
    description: 'Fast generation at 720p. Great for quick iterations and prototyping.',
    features: ['Fast Generation', '720p', 'Cost Effective', 'Quick Turnaround'],
  },
  {
    id: 'luma/ray-flash-2-540p',
    name: 'Luma Ray Flash 540p',
    description: 'Fastest option at 540p. Perfect for rapid testing and drafts.',
    features: ['Fastest', '540p', 'Very Affordable', 'Instant Preview'],
  },
  {
    id: 'luma/ray',
    name: 'Luma Ray (Dream Machine)',
    description: 'Original Luma Ray model with consistent, reliable results.',
    features: ['Consistent', 'Reliable', 'Well-Tested', 'Community Favorite'],
  },
];

export default function SelectModelPage() {
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Load saved preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('preferredModel');
      if (saved) {
        setSelectedModel(saved);
      } else {
        setSelectedModel('openai/sora-2-pro'); // Default
      }
    }
  }, []);

  const handleSelectModel = (modelId: string) => {
    setSelectedModel(modelId);
  };

  const handleContinue = () => {
    if (selectedModel) {
      setIsLoading(true);
      localStorage.setItem('preferredModel', selectedModel);
      router.push('/');
    }
  };

  const handleSkip = () => {
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/10 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Choose Your Video Model
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Each model has unique strengths - pick the one that matches your needs
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Watch demo clips to see each model&apos;s style and capabilities
          </p>
        </div>

        {/* Model Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {FEATURED_MODELS.map((model) => (
            <Card
              key={model.id}
              className={`cursor-pointer transition-all hover:scale-105 ${
                selectedModel === model.id
                  ? 'ring-2 ring-purple-400 bg-purple-500/10'
                  : 'hover:bg-slate-800/50'
              }`}
              onClick={() => handleSelectModel(model.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {model.name}
                      {model.recommended && (
                        <Badge variant="default" className="bg-purple-500">
                          Recommended
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {model.description}
                    </CardDescription>
                  </div>
                  {selectedModel === model.id && (
                    <CheckCircle2 className="w-6 h-6 text-purple-400 flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Demo Video Placeholder */}
                <div className="bg-slate-900 rounded-lg aspect-video mb-4 flex items-center justify-center relative overflow-hidden group">
                  {model.demoVideoUrl ? (
                    <video
                      src={model.demoVideoUrl}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => e.currentTarget.pause()}
                    />
                  ) : (
                    <div className="text-center">
                      <Play className="w-12 h-12 text-muted-foreground/30 mb-2 mx-auto" />
                      <p className="text-xs text-muted-foreground">
                        Demo video coming soon
                      </p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                    <span className="text-sm text-white font-medium">Preview Style</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {model.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            onClick={handleSkip}
            size="lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedModel || isLoading}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 min-w-[200px]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Applying...
              </div>
            ) : (
              `Use ${FEATURED_MODELS.find(m => m.id === selectedModel)?.name || 'This Model'}`
            )}
          </Button>
        </div>

        {/* Info */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Tip:</strong> Add demo videos to <code className="bg-slate-800 px-2 py-1 rounded">/public/demos/</code> to preview each model&apos;s style
          </p>
          <p className="text-xs text-muted-foreground">
            Featured: 14 top models • All 26 models available via quick-change dropdown
          </p>
        </div>
      </div>
    </div>
  );
}
