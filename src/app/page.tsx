'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserMenu } from '@/components/UserMenu';
import { PromptBuilder } from '@/components/PromptBuilder';
import { VideoGenerationInterface } from '@/components/VideoGenerationInterface';
import { UserGallery } from '@/components/UserGallery';
import { Button } from '@/components/ui/button';
import { Video, Image as ImageIcon, Sparkles } from 'lucide-react';
import { REPLICATE_VIDEO_MODELS } from '@/lib/replicate-api';

type Tab = 'builder' | 'gallery' | 'generate';

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

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
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

  const tabs = [
    { id: 'builder' as Tab, label: 'Prompt Builder', icon: Sparkles },
    { id: 'gallery' as Tab, label: 'My Gallery', icon: ImageIcon },
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
            
            {/* Model Selector & User Menu */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/select-model')}
                className="hidden md:flex items-center gap-2"
              >
                <Video className="w-4 h-4" />
                <span className="font-medium">
                  {REPLICATE_VIDEO_MODELS[selectedModel as keyof typeof REPLICATE_VIDEO_MODELS]?.split(' ')[0] || 'Select Model'}
                </span>
              </Button>
              
              {/* Quick Change Dropdown (secondary) */}
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs min-w-[200px]"
                title="Quick change model"
              >
                {Object.entries(REPLICATE_VIDEO_MODELS).map(([modelId, modelName]) => (
                  <option key={modelId} value={modelId}>
                    {modelName}
                  </option>
                ))}
              </select>
              
              <UserMenu />
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
          <PromptBuilder 
            onPromptGenerate={handlePromptGenerate}
            selectedModel={selectedModel}
          />
        )}
        {activeTab === 'gallery' && <UserGallery />}
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
                Powered by 26 AI video models and advanced prompt engineering
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
