import { useQuery } from '@tanstack/react-query';
import { PlaylistCard } from '@/components/PlaylistCard';
import { SearchBar } from '@/components/SearchBar';
import type { Playlist, LikedSong } from '@shared/schema';
import { useLocation } from 'wouter';
import { Play, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [_, setLocation] = useLocation();
  const { data: playlists } = useQuery<Playlist[]>({
    queryKey: ['/api/playlists'],
  });

  const { data: likedSongs } = useQuery<LikedSong[]>({
    queryKey: ['/api/liked-songs'],
  });

  const handleSearch = (query: string) => {
    setLocation(`/search?q=${encodeURIComponent(query)}`);
  };

  const playLikedSong = (videoId: string) => {
    window.dispatchEvent(new CustomEvent('PLAY_VIDEO', {
      detail: { videoId }
    }));
  };

  return (
    <div className="p-4 md:p-6 pt-16 md:pt-6">
      {/* Search bar for mobile */}
      <div className="md:hidden mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        Your Music
      </h1>

      {likedSongs && likedSongs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Liked Songs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {likedSongs.slice(0, 6).map((song) => (
              <div key={song.id} 
                className="bg-card hover:bg-accent/50 p-4 rounded-lg flex items-center gap-4 group transition-colors">
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
          {likedSongs.length > 6 && (
            <Button
              variant="ghost"
              className="mt-4"
              onClick={() => setLocation('/liked-songs')}
            >
              View All Liked Songs
            </Button>
          )}
        </div>
      )}

      {playlists && playlists.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Your Playlists</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                onAddTrack={() => {}}
              />
            ))}
          </div>
        </>
      )}

      {(!playlists || playlists.length === 0) && (!likedSongs || likedSongs.length === 0) && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Start building your music collection by searching for songs or creating playlists
          </p>
          <Button onClick={() => setLocation('/search')}>
            Discover Music
          </Button>
        </div>
      )}
    </div>
  );
}