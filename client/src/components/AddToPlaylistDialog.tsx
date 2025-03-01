import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { queryClient, apiRequest } from '@/lib/queryClient';
import type { Playlist } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface AddToPlaylistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  track: {
    videoId: string;
    title: string;
    thumbnail: string;
  };
}

export function AddToPlaylistDialog({ open, onOpenChange, track }: AddToPlaylistDialogProps) {
  const { toast } = useToast();
  const { data: playlists } = useQuery<Playlist[]>({
    queryKey: ['/api/playlists'],
  });

  const addTrackMutation = useMutation({
    mutationFn: async (playlistId: number) => {
      const position = 0; // We'll implement proper positioning later
      await apiRequest('POST', `/api/playlists/${playlistId}/tracks`, {
        videoId: track.videoId,
        title: track.title,
        thumbnail: track.thumbnail,
        position
      });
    },
    onSuccess: (_, playlistId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/playlists', playlistId, 'tracks'] });
      toast({
        title: "Success",
        description: "Track added to playlist"
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add track to playlist",
        variant: "destructive"
      });
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Playlist</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {playlists?.map((playlist) => (
            <Button
              key={playlist.id}
              variant="outline"
              className="w-full justify-start"
              onClick={() => addTrackMutation.mutate(playlist.id)}
              disabled={addTrackMutation.isPending}
            >
              {playlist.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
