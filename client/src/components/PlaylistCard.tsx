
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Plus, Music } from 'lucide-react';
import type { Playlist, PlaylistTrack } from '@shared/schema';
import { useLocation } from 'wouter';

type PlaylistCardProps = {
  playlist: Playlist;
  onAddTrack: () => void;
};

export function PlaylistCard({ playlist, onAddTrack }: PlaylistCardProps) {
  const [_, setLocation] = useLocation();
  
  return (
    <div 
      className="spotify-card group cursor-pointer" 
      onClick={() => setLocation(`/playlist/${playlist.id}`)}
    >
      <div className="aspect-square mb-4 bg-black/30 rounded-md overflow-hidden relative flex items-center justify-center">
        {playlist.coverUrl ? (
          <img 
            src={playlist.coverUrl} 
            alt={playlist.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <Music size={48} className="text-white/50" />
        )}
        <div className="hover-play-button">
          <Play fill="white" className="text-white" size={16} />
        </div>
      </div>
      <h3 className="font-bold text-white truncate">{playlist.name}</h3>
      <p className="text-sm text-white/70 mt-1 truncate">
        {playlist.description || `Created by you`}
      </p>
      
      <div className="mt-3 flex items-center gap-2">
        <Button 
          size="sm" 
          variant="ghost" 
          className="p-0 hover:bg-transparent"
          onClick={(e) => {
            e.stopPropagation();
            onAddTrack();
          }}
        >
          <Plus size={16} className="text-white/70 hover:text-white" />
        </Button>
      </div>
    </div>
  );
}
