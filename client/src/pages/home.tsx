import { useQuery } from '@tanstack/react-query';
import { PlaylistCard } from '@/components/PlaylistCard';
import type { Playlist } from '@shared/schema';

export default function Home() {
  const { data: playlists } = useQuery<Playlist[]>({
    queryKey: ['/api/playlists'],
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Your Music</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
