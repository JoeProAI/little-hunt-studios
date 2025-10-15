'use client';

import { useState, useEffect } from 'react';
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

  const generateVideo = async (prompt: string, duration: string = '5s') => {
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
      const response = await fetch('/api/sora/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, duration }),
      });

      if (!response.ok) throw new Error('Generation failed');

      const data = await response.json();
      
      // Simulate progress updates
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
          
          // Simulate completion
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
    } catch (error) {
      setGenerations(prev =>
        prev.map(gen =>
          gen.id === newGeneration.id
            ? { ...gen, status: 'failed', error: 'Generation failed' }
            : gen
        )
      );
      setIsGenerating(false);
    }
  };

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
  }, [triggerGeneration]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Video Generation</h2>
        <p className="text-muted-foreground">
          Monitor your Sora 2 video generations in real-time
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
