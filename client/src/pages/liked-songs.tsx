
import { useQuery } from '@tanstack/react-query';
import { Play, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { LikedSong } from '@shared/schema';

export default function LikedSongs() {
  const { data: likedSongs, isLoading } = useQuery<LikedSong[]>({
    queryKey: ['/api/liked-songs'],
    refetchOnWindowFocus: true
  });

  const playLikedSong = (videoId: string) => {
    window.dispatchEvent(new CustomEvent('PLAY_VIDEO', {
      detail: { videoId }
    }));
  };

  if (isLoading) {
    return <div className="p-4 md:p-6 pt-16 md:pt-6">Loading...</div>;
  }

  return (
    <div className="p-4 md:p-6 pt-16 md:pt-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Heart className="h-6 w-6 text-red-500" />
        Liked Songs
      </h1>

      {likedSongs && likedSongs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {likedSongs.map((song) => (
            <div 
              key={song.id} 
              className="bg-card hover:bg-accent/50 p-4 rounded-lg flex items-center gap-4 group transition-colors"
            >
              <img 
                src={song.thumbnail} 
                alt={song.title}
                className="w-16 h-16 rounded-md object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{song.title}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => playLikedSong(song.videoId)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Play
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            You haven't liked any songs yet. Start by liking songs while listening!
          </p>
        </div>
      )}
    </div>
  );
}
