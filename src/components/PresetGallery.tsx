'use client';

import { useState } from 'react';
import { StylePreset } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, Palette, Lightbulb, Music, Search } from 'lucide-react';

interface PresetGalleryProps {
  presets: StylePreset[];
  onApplyPreset: (preset: StylePreset) => void;
}

export function PresetGallery({ presets, onApplyPreset }: PresetGalleryProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPreset, setSelectedPreset] = useState<StylePreset | null>(null);

  const categories = ['all', ...Array.from(new Set(presets.map(p => p.category)))];

  const filteredPresets = presets.filter(preset => {
    const matchesSearch = preset.name.toLowerCase().includes(search.toLowerCase()) ||
                         preset.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || preset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Style Presets</h2>
          <p className="text-muted-foreground">
            {presets.length} professional cinematic presets to enhance your videos
          </p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search presets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'All Styles' : category}
          </Button>
        ))}
      </div>

      {/* Preset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPresets.map(preset => (
          <Card
            key={preset.id}
            className="cursor-pointer hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10"
            onClick={() => setSelectedPreset(preset)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{preset.name}</CardTitle>
                  <Badge variant="secondary">{preset.category}</Badge>
                </div>
              </div>
              <CardDescription className="mt-3">
                {preset.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <Camera className="w-4 h-4 text-purple-400 mt-0.5" />
                  <div>
                    <p className="font-semibold">Camera</p>
                    <p className="text-muted-foreground">{preset.cinematography.camera}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="font-semibold">Lighting</p>
                    <p className="text-muted-foreground">{preset.lighting.mood}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Palette className="w-4 h-4 text-blue-400 mt-0.5" />
                  <div>
                    <p className="font-semibold">Color</p>
                    <p className="text-muted-foreground">{preset.color.grading}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Music className="w-4 h-4 text-green-400 mt-0.5" />
                  <div>
                    <p className="font-semibold">Audio</p>
                    <p className="text-muted-foreground">{preset.audio.style}</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onApplyPreset(preset);
                }}
                className="w-full"
                size="sm"
              >
                Apply Preset
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed View Modal */}
      {selectedPreset && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPreset(null)}
        >
          <Card
            className="max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{selectedPreset.name}</CardTitle>
                  <Badge variant="secondary">{selectedPreset.category}</Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedPreset(null)}>
                  ✕
                </Button>
              </div>
              <CardDescription className="text-base mt-3">
                {selectedPreset.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Detailed Specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cinematography */}
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Camera className="w-4 h-4 text-purple-400" />
                    Cinematography
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Camera:</span> {selectedPreset.cinematography.camera}</p>
                    <p><span className="text-muted-foreground">Lens:</span> {selectedPreset.cinematography.lens}</p>
                    <p><span className="text-muted-foreground">Framing:</span> {selectedPreset.cinematography.framing}</p>
                    <p><span className="text-muted-foreground">Movement:</span> {selectedPreset.cinematography.movement}</p>
                  </div>
                </div>

                {/* Lighting */}
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    Lighting
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Setup:</span> {selectedPreset.lighting.setup}</p>
                    <p><span className="text-muted-foreground">Mood:</span> {selectedPreset.lighting.mood}</p>
                    <p><span className="text-muted-foreground">Time:</span> {selectedPreset.lighting.time_of_day}</p>
                  </div>
                </div>

                {/* Color */}
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Palette className="w-4 h-4 text-blue-400" />
                    Color
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Palette:</span> {selectedPreset.color.palette}</p>
                    <p><span className="text-muted-foreground">Grading:</span> {selectedPreset.color.grading}</p>
                    <p><span className="text-muted-foreground">Saturation:</span> {selectedPreset.color.saturation}</p>
                  </div>
                </div>

                {/* Audio */}
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Music className="w-4 h-4 text-green-400" />
                    Audio
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Style:</span> {selectedPreset.audio.style}</p>
                    <p className="text-muted-foreground">Elements:</p>
                    <ul className="list-disc list-inside ml-2">
                      {selectedPreset.audio.elements.map((el, i) => (
                        <li key={i}>{el}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Example Prompt */}
              <div className="space-y-2">
                <h3 className="font-semibold">Example Prompt</h3>
                <div className="bg-slate-900 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap">
                  {selectedPreset.example_prompt}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    onApplyPreset(selectedPreset);
                    setSelectedPreset(null);
                  }}
                  className="flex-1"
                >
                  Apply This Preset
                </Button>
                <Button variant="outline" onClick={() => setSelectedPreset(null)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
