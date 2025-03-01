import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { createYouTubePlayer } from '@/lib/youtube';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, Video, VideoOff, 
  Heart, ChevronDown, ChevronUp, Settings 
} from 'lucide-react';
import { clsx } from 'clsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MainPlayerProps {
  videoId: string;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function MainPlayer({ videoId, onNext, onPrevious }: MainPlayerProps) {
  const playerRef = useRef<YT.Player>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([50]);
  const [currentVideoId, setCurrentVideoId] = useState(videoId);
  const [isVideoVisible, setIsVideoVisible] = useState(true);
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);
  const [quality, setQuality] = useState('auto');

  // Like functionality
  const { data: likedStatus } = useQuery<{ isLiked: boolean }>({
    queryKey: ['/api/liked-songs', currentVideoId],
    enabled: !!currentVideoId
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (likedStatus?.isLiked) {
        await apiRequest('DELETE', `/api/liked-songs/${currentVideoId}`);
      } else {
        const playerTitle = playerRef.current?.getVideoData()?.title || 'Unknown Song';
        await apiRequest('POST', '/api/liked-songs', {
          videoId: currentVideoId,
          title: playerTitle,
          thumbnail: `https://img.youtube.com/vi/${currentVideoId}/mqdefault.jpg`
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/liked-songs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/liked-songs', currentVideoId] });
    }
  });

  useEffect(() => {
    let player: YT.Player | undefined;

    if (currentVideoId) {
      createYouTubePlayer('youtube-player', currentVideoId).then((newPlayer) => {
        player = newPlayer;
        playerRef.current = newPlayer;

        player.addEventListener('onStateChange', (event: any) => {
          setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
        });

        player.setPlaybackQuality(quality === 'auto' ? 'default' : quality);
      });
    }

    const handlePlayVideo = (event: CustomEvent<{ videoId: string }>) => {
      setCurrentVideoId(event.detail.videoId);
      setIsPlayerMinimized(false);
    };

    window.addEventListener('PLAY_VIDEO', handlePlayVideo as EventListener);

    return () => {
      window.removeEventListener('PLAY_VIDEO', handlePlayVideo as EventListener);
      if (player) {
        player.destroy();
      }
    };
  }, [currentVideoId, quality]);

  const togglePlayPause = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    if (playerRef.current) {
      playerRef.current.setVolume(value[0]);
    }
  };

  const toggleVideo = () => {
    setIsVideoVisible(!isVideoVisible);
  };

  const handleQualityChange = (value: string) => {
    setQuality(value);
    if (playerRef.current) {
      playerRef.current.setPlaybackQuality(value === 'auto' ? 'default' : value);
    }
  };

  return (
    <Card className={clsx(
      "fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 z-50",
      isPlayerMinimized ? "h-16" : "h-auto"
    )}>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-0 right-4 md:right-8"
        onClick={() => setIsPlayerMinimized(!isPlayerMinimized)}
      >
        {isPlayerMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      <div className={clsx(
        "flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-4 p-4",
        isPlayerMinimized ? "h-16" : "h-auto"
      )}>
        {!isPlayerMinimized && (
          <div 
            ref={playerElementRef} 
            id="youtube-player" 
            className={clsx(
              "w-full md:w-64 aspect-video rounded-lg overflow-hidden",
              !isVideoVisible && "hidden"
            )} 
          />
        )}

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            disabled={!onPrevious}
          >
            <SkipBack className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            disabled={!onNext}
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        {!isPlayerMinimized && (
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleVideo}
            >
              {isVideoVisible ? (
                <Video className="h-5 w-5" />
              ) : (
                <VideoOff className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
            >
              <Heart className={clsx(
                "h-5 w-5",
                likedStatus?.isLiked && "fill-current text-red-500"
              )} />
            </Button>

            <Select value={quality} onValueChange={handleQualityChange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="small">Low (240p)</SelectItem>
                <SelectItem value="medium">Medium (360p)</SelectItem>
                <SelectItem value="large">High (480p)</SelectItem>
                <SelectItem value="hd720">HD (720p)</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 w-32 md:w-48">
              <Volume2 className="h-4 w-4" />
              <Slider
                value={volume}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}