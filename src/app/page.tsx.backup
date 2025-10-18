'use client';

import { useState } from 'react';
import { PromptBuilder } from '@/components/PromptBuilder';
import { PresetGallery } from '@/components/PresetGallery';
import { ShotBrowser } from '@/components/ShotBrowser';
import { VideoGenerationInterface } from '@/components/VideoGenerationInterface';
import { Button } from '@/components/ui/button';
import { StylePreset, Shot } from '@/types';
import { Video, Palette, Camera, Sparkles } from 'lucide-react';

// Import data
import promptRecipes from '@/data/prompt_recipes.json';
import stylePresets from '@/data/style_presets.json';
import shotLibrary from '@/data/shot_library.json';

type Tab = 'builder' | 'presets' | 'shots' | 'generate';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('builder');
  const [generationTrigger, setGenerationTrigger] = useState<{ prompt: string; duration: string } | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/10 to-slate-950">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Docs
              </Button>
              <Button variant="outline" size="sm">
                GitHub
              </Button>
            </div>
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
