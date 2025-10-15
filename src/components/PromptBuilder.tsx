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

  const parseSmartPaste = (text: string) => {
    const lower = text.toLowerCase();
    
    // Extract camera FIRST (most specific) - look for shot types and angles
    const cameraPatterns = [
      /(?:low|high|dutch|bird's eye|worm's eye)?\s*(?:angle)?\s*(?:dolly|pan|tilt|zoom|tracking|aerial|orbit|rotating|circling|crane|steadicam|handheld|drone|push\s+in|pull\s+out)\s*(?:shot|move|movement)?/gi,
      /(?:close-up|wide shot|medium shot|extreme close-up|establishing shot|over the shoulder|pov|point of view)/gi,
    ];
    
    for (const pattern of cameraPatterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        setValue('camera', matches[0].trim());
        // Remove from text so it doesn't interfere with other parsing
        text = text.replace(matches[0], '');
        break;
      }
    }
    
    // Extract scene (look for location/setting words) - broader patterns
    const scenePattern = /(?:inside|in|at|on|through|within|outside|outside of)\s+(?:a|an|the)?\s*([^,\.\n]+?)(?:\s+with|\s+and|$)/i;
    const sceneMatch = text.match(scenePattern);
    if (sceneMatch) {
      setValue('scene', sceneMatch[0].replace(/\s+with.*$/, '').trim());
    }
    
    // Extract look/style - check for lighting words
    const lightingPatterns = [
      /(?:candle|fire|torch|neon|natural|soft|hard|dramatic|rim|back|key)\s*(?:light|lighting|lit)/gi,
      /(?:cinematic|dramatic|moody|bright|dark|colorful|black and white|vintage|modern|film noir|neon|golden hour|blue hour)/gi,
    ];
    
    for (const pattern of lightingPatterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        setValue('look', matches.join(', '));
        break;
      }
    }
    
    // Extract subject (if not already set by scene)
    // Look for the first noun phrase that's not part of scene/camera
    const words = text.split(/\s+/);
    const commonSubjects = ['person', 'man', 'woman', 'child', 'character', 'figure', 'animal', 'car', 'robot', 'creature', 'object', 'product', 'bottle', 'phone', 'camera'];
    
    let subjectFound = false;
    for (let i = 0; i < words.length - 1; i++) {
      const word = words[i].toLowerCase();
      if (['a', 'an', 'the'].includes(word)) {
        // Take next 2-4 words as subject
        const potentialSubject = words.slice(i, Math.min(i + 5, words.length)).join(' ');
        const cleaned = potentialSubject.replace(/[,\.\n].*/,'').trim();
        if (cleaned.length > 5 && !cleaned.includes('shot') && !cleaned.includes('angle')) {
          setValue('subject', cleaned);
          subjectFound = true;
          break;
        }
      }
      
      // Check for common subject words
      for (const subj of commonSubjects) {
        if (word.includes(subj)) {
          const potentialSubject = words.slice(Math.max(0, i - 2), Math.min(i + 3, words.length)).join(' ');
          const cleaned = potentialSubject.replace(/[,\.\n].*/,'').trim();
          setValue('subject', cleaned);
          subjectFound = true;
          break;
        }
      }
      if (subjectFound) break;
    }
    
    // If still no subject, use first meaningful phrase
    if (!subjectFound) {
      const firstPhrase = text.split(/[,\.\n]/)[0];
      if (firstPhrase.length > 10 && firstPhrase.length < 100) {
        setValue('subject', firstPhrase.trim());
      }
    }
    
    // Extract action (look for verbs)
    const actionWords = ['walking', 'running', 'flying', 'standing', 'sitting', 'moving', 'dancing', 'jumping', 'driving', 'floating', 'spinning', 'rotating', 'turning', 'climbing', 'falling', 'rising'];
    for (const action of actionWords) {
      if (lower.includes(action)) {
        const match = text.match(new RegExp(`(${action}[\\w\\s,]+)`, 'i'));
        if (match) {
          setValue('action', match[1].split(/[,\.]/)[0].trim());
          break;
        }
      }
    }
    
    // Extract audio hints
    const audioKeywords = ['music', 'sound', 'ambient', 'quiet', 'loud', 'silent', 'soundtrack', 'audio', 'sfx'];
    for (const audio of audioKeywords) {
      if (lower.includes(audio)) {
        const match = text.match(new RegExp(`(${audio}[\\w\\s]+)`, 'i'));
        if (match) {
          setValue('audio', match[1].split(/[,\.]/)[0].trim());
          break;
        }
      }
    }
    
    setPasteText('');
    setShowPasteArea(false);
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
                  Parse & Fill Fields
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
