'use client';

import { useState } from 'react';
import { Shot } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Video, Search, Clock, Target } from 'lucide-react';

interface ShotBrowserProps {
  shots: Shot[];
  onAddShot: (shot: Shot) => void;
}

export function ShotBrowser({ shots, onAddShot }: ShotBrowserProps) {
  const [search, setSearch] = useState('');
  const [selectedShot, setSelectedShot] = useState<Shot | null>(null);

  const filteredShots = shots.filter(shot => {
    const matchesSearch =
      shot.move.toLowerCase().includes(search.toLowerCase()) ||
      shot.framing.toLowerCase().includes(search.toLowerCase()) ||
      shot.purpose.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Shot Library</h2>
        <p className="text-muted-foreground">
          {shots.length} professional camera movements and shot types
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search shots by move, framing, or purpose..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredShots.length} of {shots.length} shots
      </div>

      {/* Shot Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredShots.map(shot => (
          <Card
            key={shot.id}
            className="cursor-pointer hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10"
            onClick={() => setSelectedShot(shot)}
          >
            <CardHeader>
              <CardTitle className="text-lg mb-2">{shot.move}</CardTitle>
              <CardDescription className="mt-3">
                {shot.framing}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <Video className="w-4 h-4 text-blue-400 mt-0.5" />
                  <div>
                    <p className="font-semibold">Move</p>
                    <p className="text-muted-foreground">{shot.move}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-purple-400 mt-0.5" />
                  <div>
                    <p className="font-semibold">Purpose</p>
                    <p className="text-muted-foreground">{shot.purpose}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-green-400 mt-0.5" />
                  <div>
                    <p className="font-semibold">Duration</p>
                    <p className="text-muted-foreground">{shot.duration}</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddShot(shot);
                }}
                className="w-full"
                size="sm"
              >
                Add to Project
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed View Modal */}
      {selectedShot && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedShot(null)}
        >
          <Card
            className="max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-3">{selectedShot.move}</CardTitle>
                  <Badge>{selectedShot.speed}</Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedShot(null)}>
                  ✕
                </Button>
              </div>
              <CardDescription className="text-base mt-3">
                {selectedShot.framing}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Video className="w-4 h-4 text-blue-400" />
                    Shot Details
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Move:</span> {selectedShot.move}</p>
                    <p><span className="text-muted-foreground">Framing:</span> {selectedShot.framing}</p>
                    <p><span className="text-muted-foreground">Speed:</span> {selectedShot.speed}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-400" />
                    Usage
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Purpose:</span> {selectedShot.purpose}</p>
                    <p><span className="text-muted-foreground">Duration:</span> {selectedShot.duration}</p>
                    <p><span className="text-muted-foreground">When to Use:</span> {selectedShot.when_to_use}</p>
                  </div>
                </div>
              </div>

              {/* Prompt Snippet */}
              <div className="space-y-2">
                <h3 className="font-semibold">Prompt Snippet</h3>
                <div className="bg-slate-900 p-4 rounded-lg text-sm font-mono">
                  {selectedShot.prompt_snippet}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <h3 className="font-semibold">Notes</h3>
                <p className="text-sm text-muted-foreground">{selectedShot.notes}</p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    onAddShot(selectedShot);
                    setSelectedShot(null);
                  }}
                  className="flex-1"
                >
                  Add to Project
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedShot.prompt_snippet);
                  }}
                >
                  Copy Snippet
                </Button>
                <Button variant="outline" onClick={() => setSelectedShot(null)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {filteredShots.length === 0 && (
        <div className="text-center py-12">
          <Video className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-muted-foreground">No shots found matching your filters</p>
        </div>
      )}
    </div>
  );
}
