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
            key={preset.name}
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
                    <p className="font-semibold">Lens</p>
                    <p className="text-muted-foreground">{preset.cinematography.lens}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="font-semibold">Mood</p>
                    <p className="text-muted-foreground">{preset.atmosphere.mood}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Palette className="w-4 h-4 text-blue-400 mt-0.5" />
                  <div>
                    <p className="font-semibold">Grading</p>
                    <p className="text-muted-foreground">{preset.color.grading_style}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Music className="w-4 h-4 text-green-400 mt-0.5" />
                  <div>
                    <p className="font-semibold">Audio</p>
                    <p className="text-muted-foreground truncate">{preset.audio_bed_hint.split(',')[0]}</p>
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
                    <p><span className="text-muted-foreground">Lens:</span> {selectedPreset.cinematography.lens}</p>
                    <p><span className="text-muted-foreground">Focal Length:</span> {selectedPreset.cinematography.focal_length}</p>
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
                    <p><span className="text-muted-foreground">Quality:</span> {selectedPreset.lighting.quality}</p>
                    <p><span className="text-muted-foreground">Color Temp:</span> {selectedPreset.lighting.color_temperature}</p>
                    <p><span className="text-muted-foreground">Contrast:</span> {selectedPreset.lighting.contrast_ratio}</p>
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
                    <p><span className="text-muted-foreground">Grading:</span> {selectedPreset.color.grading_style}</p>
                    <p><span className="text-muted-foreground">Saturation:</span> {selectedPreset.color.saturation}</p>
                  </div>
                </div>

                {/* Atmosphere */}
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-purple-400" />
                    Atmosphere
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Mood:</span> {selectedPreset.atmosphere.mood}</p>
                    <p><span className="text-muted-foreground">Haze:</span> {selectedPreset.atmosphere.haze}</p>
                    <p><span className="text-muted-foreground">Depth:</span> {selectedPreset.atmosphere.depth}</p>
                  </div>
                </div>

                {/* Audio */}
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Music className="w-4 h-4 text-green-400" />
                    Audio Suggestions
                  </h3>
                  <div className="text-sm">
                    <p className="text-muted-foreground">{selectedPreset.audio_bed_hint}</p>
                  </div>
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
