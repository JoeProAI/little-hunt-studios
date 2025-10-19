'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Video, Image as ImageIcon, Download, Trash2, ExternalLink } from 'lucide-react';

// Simple date formatter
const formatTimeAgo = (timestamp: number) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
};

interface GalleryItem {
  id: string;
  type: 'video' | 'image';
  url: string;
  thumbnailUrl?: string;
  prompt: string;
  model: string;
  createdAt: number;
  status: 'completed' | 'failed';
}

export function UserGallery() {
  const { user } = useAuth();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'video' | 'image'>('all');

  useEffect(() => {
    if (!user) return;

    // TODO: Fetch user's generated content from Firebase
    // For now, show placeholder
    setLoading(false);
  }, [user]);

  const filteredItems = items.filter(item => 
    filter === 'all' ? true : item.type === filter
  );

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    // TODO: Delete from Firebase
    setItems(prev => prev.filter(item => item.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">My Gallery</h2>
          <p className="text-muted-foreground">
            All your generated videos and images in one place
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={filter === 'video' ? 'default' : 'outline'}
            onClick={() => setFilter('video')}
            size="sm"
          >
            <Video className="w-4 h-4 mr-2" />
            Videos
          </Button>
          <Button
            variant={filter === 'image' ? 'default' : 'outline'}
            onClick={() => setFilter('image')}
            size="sm"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Images
          </Button>
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            {filter === 'video' ? (
              <Video className="w-16 h-16 mb-4 text-muted-foreground opacity-50" />
            ) : filter === 'image' ? (
              <ImageIcon className="w-16 h-16 mb-4 text-muted-foreground opacity-50" />
            ) : (
              <div className="flex gap-4 mb-4">
                <Video className="w-16 h-16 text-muted-foreground opacity-50" />
                <ImageIcon className="w-16 h-16 text-muted-foreground opacity-50" />
              </div>
            )}
            <p className="text-muted-foreground text-center mb-4">
              {filter === 'all' 
                ? 'No generated content yet. Start creating!'
                : `No ${filter}s yet. Generate your first one!`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden group hover:ring-2 hover:ring-purple-400 transition-all">
              <div className="relative aspect-video bg-slate-900">
                {item.type === 'video' ? (
                  <video
                    src={item.url}
                    poster={item.thumbnailUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={item.url}
                    alt={item.prompt}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 left-2">
                  <Badge variant={item.type === 'video' ? 'default' : 'secondary'}>
                    {item.type === 'video' ? <Video className="w-3 h-3 mr-1" /> : <ImageIcon className="w-3 h-3 mr-1" />}
                    {item.type}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-sm line-clamp-2 mb-2">{item.prompt}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>{item.model.split('/')[1]}</span>
                  <span>{formatTimeAgo(item.createdAt)}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(item.url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(item.url, `${item.type}-${item.id}.mp4`)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
