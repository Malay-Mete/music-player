
import { useQuery } from '@tanstack/react-query';
import { PlaylistCard } from '@/components/PlaylistCard';
import { SearchBar } from '@/components/SearchBar';
import type { Playlist, LikedSong } from '@shared/schema';
import { useLocation } from 'wouter';
import { Play, Heart, Library, Home as HomeIcon, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [_, setLocation] = useLocation();
  const { data: playlists } = useQuery<Playlist[]>({
    queryKey: ['/api/playlists'],
  });

  const { data: likedSongs } = useQuery<LikedSong[]>({
    queryKey: ['/api/liked-songs'],
    refetchOnWindowFocus: true,
    refetchOnMount: true,
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
    <div className="bg-gradient-to-b from-primary/10 to-background transition-all duration-1000 min-h-screen">
      <div className="p-4 md:p-6 pt-16 md:pt-6">
        {/* Search bar for mobile */}
        <div className="md:hidden mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Greeting based on time of day */}
        <h1 className="text-3xl font-bold mb-8 text-white">
          {new Date().getHours() < 12 
            ? "Good morning" 
            : new Date().getHours() < 18 
              ? "Good afternoon" 
              : "Good evening"}
        </h1>

        {/* Recently played or featured section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Recently played</h2>
            <button className="text-sm font-semibold text-white/60 hover:text-white transition-colors">
              Show all
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {likedSongs && likedSongs.slice(0, 5).map((song) => (
              <div 
                key={song.videoId}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-all rounded-md overflow-hidden cursor-pointer group"
                onClick={() => playLikedSong(song.videoId)}
              >
                <div className="w-12 h-12 flex-shrink-0 bg-primary/20 flex items-center justify-center">
                  <Music className="text-white/70" size={18} />
                </div>
                <span className="font-medium text-sm text-white truncate pr-2">{song.title}</span>
                <div className="ml-auto opacity-0 group-hover:opacity-100 p-2 bg-primary rounded-full mr-2 shadow-lg transition-all">
                  <Play fill="white" className="text-white" size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Playlists section */}
        {playlists && playlists.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Your Playlists</h2>
              <button onClick={() => setLocation('/search')} className="text-sm font-semibold text-white/60 hover:text-white transition-colors">
                Browse more
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
              {playlists.map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  onAddTrack={() => {}}
                />
              ))}
            </div>
          </div>
        )}

        {/* Suggested/Featured section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Made For You</h2>
            <button className="text-sm font-semibold text-white/60 hover:text-white transition-colors">
              Show all
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white/5 hover:bg-white/10 transition-all p-4 rounded-md cursor-pointer group">
                <div className="aspect-square mb-4 bg-black/20 rounded-md overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Music className="text-white/50" size={48} />
                  </div>
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 p-3 bg-primary rounded-full shadow-lg transition-all">
                    <Play fill="white" className="text-white" size={16} />
                  </div>
                </div>
                <h3 className="font-semibold text-white mb-1">Daily Mix {i + 1}</h3>
                <p className="text-sm text-white/60">Based on your recent listening</p>
              </div>
            ))}
          </div>
        </div>

        {(!playlists || playlists.length === 0) && (!likedSongs || likedSongs.length === 0) && (
          <div className="text-center py-12 bg-white/5 rounded-lg">
            <Music size={48} className="mx-auto mb-4 text-white/50" />
            <h3 className="text-xl font-bold text-white mb-2">It's a bit empty here</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start building your music collection by searching for songs or creating playlists
            </p>
            <Button onClick={() => setLocation('/search')} className="bg-white text-black hover:bg-white/90 font-semibold px-8 py-2">
              Discover Music
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
