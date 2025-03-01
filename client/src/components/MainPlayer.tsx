import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { createYouTubePlayer, qualityLevels } from '@/lib/youtube';
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
  const [quality, setQuality] = useState('small'); // Default to low quality for data saving

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
    let container = document.getElementById('youtube-player');

    if (currentVideoId && container) {
      createYouTubePlayer('youtube-player', currentVideoId)
        .then((newPlayer) => {
          player = newPlayer;
          playerRef.current = newPlayer;
          player.setPlaybackQuality(quality);
          player.setVolume(volume[0]);
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
        playerRef.current = undefined;
      }
    };
  }, [currentVideoId]); // Removed quality dependency

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
    // If we're about to hide the video and there's a player, pause it first
    if (isVideoVisible && playerRef.current) {
      playerRef.current.pauseVideo();
    }
    setIsVideoVisible(!isVideoVisible);
  };

  const handleQualityChange = (value: string) => {
    setQuality(value);
    if (playerRef.current) {
      // Save current state
      const currentTime = playerRef.current.getCurrentTime();
      const wasPlaying = playerRef.current.getPlayerState() === 1;
      
      // Set quality
      playerRef.current.setPlaybackQuality(value);
      
      // If video was playing, ensure it continues
      if (wasPlaying) {
        // Small timeout to allow quality change to process
        setTimeout(() => {
          if (playerRef.current) {
            playerRef.current.seekTo(currentTime, true);
            playerRef.current.playVideo();
          }
        }, 100);
      }
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
        {!isPlayerMinimized && isVideoVisible && (
          <div 
            id="youtube-player" 
            className="w-full md:w-64 aspect-video rounded-lg overflow-hidden"
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
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {qualityLevels.map(level => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label} - {level.dataUsage}
                  </SelectItem>
                ))}
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