'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserMenu } from '@/components/UserMenu';
import { PromptBuilder } from '@/components/PromptBuilder';
import { PresetGallery } from '@/components/PresetGallery';
import { ShotBrowser } from '@/components/ShotBrowser';
import { VideoGenerationInterface } from '@/components/VideoGenerationInterface';
import { Button } from '@/components/ui/button';
import { StylePreset, Shot } from '@/types';
import { Video, Palette, Camera, Sparkles } from 'lucide-react';
import { REPLICATE_VIDEO_MODELS } from '@/lib/replicate-api';

// Import data
import promptRecipes from '@/data/prompt_recipes.json';
import stylePresets from '@/data/style_presets.json';
import shotLibrary from '@/data/shot_library.json';

type Tab = 'builder' | 'presets' | 'shots' | 'generate';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('builder');
  const [generationTrigger, setGenerationTrigger] = useState<{ prompt: string; duration: string } | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('openai/sora-2-pro');
  
  const { user, loading } = useAuth();
  const router = useRouter();

  // Load preferred model from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const preferred = localStorage.getItem('preferredModel');
      if (preferred) {
        setSelectedModel(preferred);
      }
    }
  }, []);

  // Redirect to login if not authenticated, or to model selection if first time
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (typeof window !== 'undefined') {
        const hasSeenModelSelection = localStorage.getItem('hasSeenModelSelection');
        if (!hasSeenModelSelection) {
          router.push('/select-model');
        }
      }
    }
  }, [user, loading, router]);

  // Save model preference when changed
  useEffect(() => {
    if (typeof window !== 'undefined' && selectedModel) {
      localStorage.setItem('preferredModel', selectedModel);
    }
  }, [selectedModel]);

  const handlePromptGenerate = (prompt: string, duration: string) => {
    console.log('Generating video:', { prompt, duration });
    // Trigger video generation
    setGenerationTrigger({ prompt, duration });
    setActiveTab('generate');
  };

  const handleApplyPreset = (preset: StylePreset) => {
    console.log('Applying preset:', preset);
    // TODO: Populate prompt builder with preset
    setActiveTab('builder');
  };

  const handleAddShot = (shot: Shot) => {
    console.log('Adding shot:', shot);
    // TODO: Add to project timeline
  };

  const tabs = [
    { id: 'builder' as Tab, label: 'Prompt Builder', icon: Sparkles },
    { id: 'presets' as Tab, label: 'Style Presets', icon: Palette },
    { id: 'shots' as Tab, label: 'Shot Library', icon: Camera },
    { id: 'generate' as Tab, label: 'Generate', icon: Video },
  ];

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/10 to-slate-950">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-2 rounded-lg">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Little Hunt Studios
                </h1>
                <p className="text-xs text-muted-foreground">
                  Hunt the Perfect Frame with AI
                </p>
              </div>
            </div>
            
            {/* Global Model Selector */}
            <div className="flex items-center gap-2 flex-1 max-w-md justify-end">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Model:</span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="px-3 py-1.5 rounded-md bg-slate-800 border border-slate-700 text-sm flex-1 min-w-0"
              >
                {Object.entries(REPLICATE_VIDEO_MODELS).map(([modelId, modelName]) => (
                  <option key={modelId} value={modelId}>
                    {modelName}
                  </option>
                ))}
              </select>
            </div>
            
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-purple-500/20 bg-slate-950/50 backdrop-blur-sm sticky top-[73px] z-30">
        <div className="container mx-auto px-4">
          <nav className="flex gap-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${
                    activeTab === tab.id
                      ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'builder' && (
          <PromptBuilder onPromptGenerate={handlePromptGenerate} />
        )}
        {activeTab === 'presets' && (
          <PresetGallery
            presets={stylePresets.presets as StylePreset[]}
            onApplyPreset={handleApplyPreset}
          />
        )}
        {activeTab === 'shots' && (
          <ShotBrowser
            shots={shotLibrary.shots as Shot[]}
            onAddShot={handleAddShot}
          />
        )}
        {activeTab === 'generate' && (
          <VideoGenerationInterface 
            triggerGeneration={generationTrigger}
            onGenerationStart={() => setGenerationTrigger(null)}
            selectedModel={selectedModel}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              <p>
                Built with Next.js 14, TypeScript, Tailwind CSS, Sora 2, and GPT Image 1
              </p>
              <p className="text-xs mt-1">
                Powered by OpenAI | {promptRecipes.recipes.length} Templates | {stylePresets.presets.length} Presets | {shotLibrary.shots.length} Shots
              </p>
            </div>
            <div className="flex gap-4 text-sm">
              <a href="#" className="text-muted-foreground hover:text-purple-400 transition-colors">
                Documentation
              </a>
              <a href="#" className="text-muted-foreground hover:text-purple-400 transition-colors">
                API Reference
              </a>
              <a href="#" className="text-muted-foreground hover:text-purple-400 transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
