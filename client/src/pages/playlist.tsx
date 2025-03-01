import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { PlaylistCard } from '@/components/PlaylistCard';
import type { Playlist, PlaylistTrack } from '@shared/schema';

export default function PlaylistPage() {
  const { id } = useParams<{ id: string }>();
  
  const { data: playlist } = useQuery<Playlist>({
    queryKey: ['/api/playlists', id],
  });

  const { data: tracks } = useQuery<PlaylistTrack[]>({
    queryKey: ['/api/playlists', id, 'tracks'],
  });

  if (!playlist) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{playlist.name}</h1>
      <PlaylistCard
        playlist={playlist}
        tracks={tracks}
        onPlay={(videoId) => {
          // Handle playing track
        }}
        onAddTrack={() => {
          // Handle adding track
        }}
      />
    </div>
  );
}
