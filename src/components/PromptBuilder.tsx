'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PromptBuilderData, PromptBuilderSchema } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Copy, Check, Wand2 } from 'lucide-react';

interface PromptBuilderProps {
  onPromptGenerate: (prompt: string, duration: string) => void;
}

export function PromptBuilder({ onPromptGenerate }: PromptBuilderProps) {
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [showPasteArea, setShowPasteArea] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PromptBuilderData>({
    resolver: zodResolver(PromptBuilderSchema),
    defaultValues: {
      duration: '5s',
    },
  });

  const formValues = watch();

  const parseSmartPaste = async (text: string) => {
    try {
      // Call AI-powered parsing API
      const response = await fetch('/api/parse-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to parse');
      }

      const data = await response.json();
      const fields = data.fields;

      // Fill in all the fields from AI response
      if (fields.scene) setValue('scene', fields.scene);
      if (fields.subject) setValue('subject', fields.subject);
      if (fields.action) setValue('action', fields.action);
      if (fields.camera) setValue('camera', fields.camera);
      if (fields.look) setValue('look', fields.look);
      if (fields.audio) setValue('audio', fields.audio);

      setPasteText('');
      setShowPasteArea(false);
    } catch (error) {
      console.error('Smart paste error:', error);
      alert('Failed to parse text. Please try again or fill fields manually.');
    }
  };

  const generatePrompt = (data: PromptBuilderData) => {
    const parts = [];
    
    // [SCENE] - Setting and environment
    if (data.scene) parts.push(`[SCENE] ${data.scene}`);
    
    // [SUBJECT] - Main subject
    if (data.subject) parts.push(`[SUBJECT] ${data.subject}`);
    
    // [ACTION] - What's happening
    if (data.action) parts.push(`[ACTION] ${data.action}`);
    
    // [CAMERA] - Camera work
    if (data.camera) parts.push(`[CAMERA] ${data.camera}`);
    
    // [LOOK] - Visual style
    if (data.look) parts.push(`[LOOK] ${data.look}`);
    
    // [AUDIO] - Sound design
    if (data.audio) parts.push(`[AUDIO] ${data.audio}`);
    
    // [NEGATIVES] - What to avoid
    if (data.negatives) parts.push(`[NEGATIVES] ${data.negatives}`);
    
    // [DURATION]
    parts.push(`[DURATION] ${data.duration}`);
    
    const prompt = parts.join('\n\n');
    setGeneratedPrompt(prompt);
    return prompt;
  };

  const onSubmit = (data: PromptBuilderData) => {
    const prompt = generatePrompt(data);
    onPromptGenerate(prompt, data.duration);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            C-D-S-A Prompt Builder
          </CardTitle>
          <CardDescription>
            Build structured prompts using the Context-Detail-Style-Audio framework
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Smart Paste Area */}
          {!showPasteArea ? (
            <Button
              type="button"
              variant="outline"
              className="w-full mb-4 border-dashed border-2 border-purple-500/30 hover:border-purple-500/60"
              onClick={() => setShowPasteArea(true)}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Smart Paste - Paste a paragraph to auto-fill fields
            </Button>
          ) : (
            <div className="mb-4 space-y-2">
              <Label>Paste Your Description</Label>
              <Textarea
                placeholder="Paste a paragraph describing your video here, and I'll automatically fill in the fields below...\n\nExample: A cinematic aerial shot of a lone figure walking through a misty forest at dawn, with golden sunlight filtering through the trees and dramatic atmospheric fog."
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                className="min-h-[120px] border-purple-500/30"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => parseSmartPaste(pasteText)}
                  disabled={!pasteText.trim()}
                  className="flex-1"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  AI Parse & Fill Fields
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setPasteText(''); setShowPasteArea(false); }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Scene */}
            <div className="space-y-2">
              <Label htmlFor="scene">
                Scene <Badge variant="destructive">Required</Badge>
              </Label>
              <Textarea
                id="scene"
                placeholder="e.g., A futuristic cyberpunk city at night with neon lights reflecting off wet streets"
                {...register('scene')}
                className="min-h-[80px]"
              />
              {errors.scene && (
                <p className="text-sm text-red-400">{errors.scene.message}</p>
              )}
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">
                Subject <Badge variant="destructive">Required</Badge>
              </Label>
              <Input
                id="subject"
                placeholder="e.g., A lone figure in a hooded jacket"
                {...register('subject')}
              />
              {errors.subject && (
                <p className="text-sm text-red-400">{errors.subject.message}</p>
              )}
            </div>

            {/* Action */}
            <div className="space-y-2">
              <Label htmlFor="action">
                Action <Badge variant="destructive">Required</Badge>
              </Label>
              <Textarea
                id="action"
                placeholder="e.g., Walking slowly through the rain, looking up at towering skyscrapers"
                {...register('action')}
                className="min-h-[80px]"
              />
              {errors.action && (
                <p className="text-sm text-red-400">{errors.action.message}</p>
              )}
            </div>

            {/* Camera */}
            <div className="space-y-2">
              <Label htmlFor="camera">Camera Work</Label>
              <Input
                id="camera"
                placeholder="e.g., Cinematic tracking shot, low angle, 24mm lens"
                {...register('camera')}
              />
            </div>

            {/* Look */}
            <div className="space-y-2">
              <Label htmlFor="look">Visual Look</Label>
              <Input
                id="look"
                placeholder="e.g., Cinematic color grading, high contrast, blue and pink neon tones"
                {...register('look')}
              />
            </div>

            {/* Audio */}
            <div className="space-y-2">
              <Label htmlFor="audio">Audio Design</Label>
              <Input
                id="audio"
                placeholder="e.g., Ambient electronic music, rain sounds, distant traffic"
                {...register('audio')}
              />
            </div>

            {/* Negatives */}
            <div className="space-y-2">
              <Label htmlFor="negatives">Negatives (What to Avoid)</Label>
              <Input
                id="negatives"
                placeholder="e.g., No blur, no shaky camera, no overexposure"
                {...register('negatives')}
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select id="duration" {...register('duration')}>
                <option value="5s">5 seconds</option>
                <option value="10s">10 seconds</option>
                <option value="15s">15 seconds</option>
                <option value="20s">20 seconds</option>
              </Select>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Generate Video with Sora 2
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Preview Panel */}
      <Card className="border-blue-500/20 sticky top-6">
        <CardHeader>
          <CardTitle>Prompt Preview</CardTitle>
          <CardDescription>
            Real-time preview of your structured prompt
          </CardDescription>
        </CardHeader>
        <CardContent>
          {generatedPrompt ? (
            <div className="space-y-4">
              <div className="bg-slate-900 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                {generatedPrompt}
              </div>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="w-full"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Prompt
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Fill out the form to preview your prompt</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
