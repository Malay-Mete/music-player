import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Plus } from 'lucide-react';
import type { Playlist, PlaylistTrack } from '@shared/schema';

interface PlaylistCardProps {
  playlist: Playlist;
  tracks?: PlaylistTrack[];
  onPlay?: (trackId: string) => void;
  onAddTrack?: () => void;
}

export function PlaylistCard({ playlist, tracks, onPlay, onAddTrack }: PlaylistCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">{playlist.name}</CardTitle>
        {onAddTrack && (
          <Button variant="ghost" size="icon" onClick={onAddTrack}>
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {tracks && tracks.length > 0 ? (
          <ul className="space-y-2">
            {tracks.map((track) => (
              <li
                key={track.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-accent"
              >
                <span className="truncate">{track.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onPlay?.(track.videoId)}
                >
                  <Play className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-center py-4">
            No tracks in this playlist
          </p>
        )}
      </CardContent>
    </Card>
  );
}
