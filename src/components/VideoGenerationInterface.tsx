'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, Download, Play, CheckCircle2, XCircle } from 'lucide-react';

interface GenerationStatus {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  videoUrl?: string;
  thumbnailUrl?: string;
  error?: string;
  prompt: string;
  createdAt: number;
}

interface VideoGenerationInterfaceProps {
  triggerGeneration?: { prompt: string; duration: string } | null;
  onGenerationStart?: () => void;
}

export function VideoGenerationInterface({ triggerGeneration, onGenerationStart }: VideoGenerationInterfaceProps) {
  const [generations, setGenerations] = useState<GenerationStatus[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiProvider, setApiProvider] = useState<'openai' | 'replicate'>('replicate');
  const [model, setModel] = useState<'sora' | 'minimax'>('sora');
  const { user, refreshUserData } = useAuth();

  const generateVideo = useCallback(async (prompt: string, duration: string = '5s', retryWithMinimax: boolean = false) => {
    onGenerationStart?.();
    setIsGenerating(true);
    
    const newGeneration: GenerationStatus = {
      id: `gen_${Date.now()}`,
      status: 'queued',
      progress: 0,
      prompt,
      createdAt: Date.now(),
    };

    setGenerations(prev => [newGeneration, ...prev]);

    try {
      // Choose API endpoint based on provider
      const endpoint = apiProvider === 'replicate' ? '/api/replicate/generate' : '/api/sora/generate';
      
      // Use MiniMax if retrying or if manually selected
      const selectedModel = retryWithMinimax ? 'minimax/video-01' : (model === 'minimax' ? 'minimax/video-01' : 'openai/sora-2');
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          duration,
          userId: user?.uid,
          model: apiProvider === 'replicate' ? selectedModel : undefined
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Generation failed';
        
        // Check if it's a content moderation error from Sora-2
        if ((errorMessage.includes('sensitive') || errorMessage.includes('flagged') || errorMessage.includes('E005')) && !retryWithMinimax && model === 'sora') {
          // Auto-retry with MiniMax
          console.log('Sora-2 blocked by content filter. Automatically retrying with MiniMax...');
          
          // Update generation status
          setGenerations(prev =>
            prev.map(gen =>
              gen.id === newGeneration.id
                ? { ...gen, status: 'processing' as const, progress: 5 }
                : gen
            )
          );
          
          // Show user what's happening
          setGenerations(prev =>
            prev.map(gen =>
              gen.id === newGeneration.id
                ? { ...gen, prompt: `${prompt}\n\n⚠️ Sora-2 blocked - retrying with MiniMax...` }
                : gen
            )
          );
          
          // Wait a moment then retry
          await new Promise(resolve => setTimeout(resolve, 1000));
          return await generateVideo(prompt, duration, true);
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Refresh user data to update credits display
      await refreshUserData();
      
      // If using Replicate, poll for actual video completion
      if (apiProvider === 'replicate' && data.id && !data.id.startsWith('gen_')) {
        const generationId = newGeneration.id;
        const predictionId = data.id;
        
        // Poll for status every 3 seconds
        const pollInterval = setInterval(async () => {
          try {
            const statusResponse = await fetch(`/api/replicate/status/${predictionId}`);
            
            if (!statusResponse.ok) {
              console.error('Status check failed:', statusResponse.status);
              clearInterval(pollInterval);
              setIsGenerating(false);
              return;
            }
            
            const statusData = await statusResponse.json();
            
            // Update progress based on status
            let progress = 0;
            if (statusData.status === 'starting') progress = 20;
            if (statusData.status === 'processing') progress = 60;
            if (statusData.status === 'succeeded') progress = 100;
            
            setGenerations(prev =>
              prev.map(gen =>
                gen.id === generationId
                  ? { 
                      ...gen, 
                      status: statusData.status === 'succeeded' ? 'completed' : 'processing',
                      progress,
                      videoUrl: statusData.video_url,
                      error: statusData.error,
                    }
                  : gen
              )
            );
            
            // Stop polling when done
            if (statusData.status === 'succeeded' || statusData.status === 'failed') {
              clearInterval(pollInterval);
              setIsGenerating(false);
            }
          } catch (error) {
            console.error('Polling error:', error);
            clearInterval(pollInterval);
            setIsGenerating(false);
          }
        }, 3000);
        
        // Set initial processing state
        setGenerations(prev =>
          prev.map(gen =>
            gen.id === generationId
              ? { ...gen, status: 'processing', progress: 10 }
              : gen
          )
        );
      } else {
        // For OpenAI, simulate progress (since we don't have real polling yet)
        const generationId = newGeneration.id;
        let progress = 0;
        
        const progressInterval = setInterval(() => {
          progress += 10;
          
          setGenerations(prev =>
            prev.map(gen =>
              gen.id === generationId
                ? { ...gen, status: 'processing', progress: Math.min(progress, 90) }
                : gen
            )
          );

          if (progress >= 100) {
            clearInterval(progressInterval);
            
            setTimeout(() => {
              setGenerations(prev =>
                prev.map(gen =>
                  gen.id === generationId
                    ? {
                        ...gen,
                        status: 'completed',
                        progress: 100,
                        videoUrl: data.video_url || '#',
                        thumbnailUrl: data.thumbnail_url,
                      }
                    : gen
                )
              );
              setIsGenerating(false);
            }, 2000);
          }
        }, 1000);
      }
    } catch (error: any) {
      setGenerations(prev =>
        prev.map(gen =>
          gen.id === newGeneration.id
            ? { ...gen, status: 'failed', error: error.message || 'Generation failed' }
            : gen
        )
      );
      setIsGenerating(false);
    }
  }, [apiProvider, user?.uid, refreshUserData, onGenerationStart]);

  const getStatusIcon = (status: GenerationStatus['status']) => {
    switch (status) {
      case 'queued':
      case 'processing':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-400" />;
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getStatusText = (status: GenerationStatus['status']) => {
    switch (status) {
      case 'queued':
        return 'Queued';
      case 'processing':
        return 'Generating';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
    }
  };

  // Auto-trigger when triggerGeneration prop changes
  useEffect(() => {
    if (triggerGeneration) {
      generateVideo(triggerGeneration.prompt, triggerGeneration.duration);
    }
  }, [triggerGeneration, generateVideo]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold">Video Generation</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Model:</span>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value as 'sora' | 'minimax')}
                className="px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-sm"
              >
                <option value="sora">Sora-2 (Highest Quality)</option>
                <option value="minimax">MiniMax (Less Strict)</option>
              </select>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground">
          {model === 'sora'
            ? '✅ Using Sora-2 - Best quality, but strict content filters. Use MiniMax if you get "sensitive" errors.'
            : '✅ Using MiniMax - Great quality with more relaxed content filters.'}
        </p>
      </div>

      {generations.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Play className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-muted-foreground text-center">
              No generations yet. Use the Prompt Builder to create your first video!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {generations.map(gen => (
            <Card key={gen.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(gen.status)}
                      <CardTitle className="text-lg">{getStatusText(gen.status)}</CardTitle>
                      <Badge variant={gen.status === 'completed' ? 'default' : 'secondary'}>
                        {gen.status}
                      </Badge>
                    </div>
                    <CardDescription className="font-mono text-xs">
                      {gen.prompt.substring(0, 150)}
                      {gen.prompt.length > 150 && '...'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                {(gen.status === 'processing' || gen.status === 'queued') && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{gen.progress}%</span>
                    </div>
                    <Progress value={gen.progress} />
                  </div>
                )}

                {/* Error Message */}
                {gen.status === 'failed' && gen.error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-sm text-red-400">{gen.error}</p>
                  </div>
                )}

                {/* Video Player */}
                {gen.status === 'completed' && gen.videoUrl && (
                  <div className="space-y-3">
                    <div className="bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                      <video
                        src={gen.videoUrl}
                        controls
                        className="w-full h-full"
                        poster={gen.thumbnailUrl}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Play className="w-4 h-4 mr-2" />
                        Play
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span>ID: {gen.id}</span>
                  <span>{new Date(gen.createdAt).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
