import { useQuery } from '@tanstack/react-query';
import { PlaylistCard } from '@/components/PlaylistCard';
import { SearchBar } from '@/components/SearchBar';
import type { Playlist, LikedSong } from '@shared/schema';
import { useLocation } from 'wouter';

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

  return (
    <div className="p-4 md:p-6 pt-16 md:pt-6">
      {/* Search bar for mobile */}
      <div className="md:hidden mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      <h1 className="text-3xl font-bold mb-6">Your Music</h1>

      {likedSongs && likedSongs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Liked Songs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {likedSongs.slice(0, 6).map((song) => (
              <div key={song.id} className="bg-card p-4 rounded-lg flex items-center gap-4">
                <img 
                  src={song.thumbnail} 
                  alt={song.title}
                  className="w-16 h-16 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{song.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists?.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            onAddTrack={() => {}}
          />
        ))}
      </div>
    </div>
  );
}