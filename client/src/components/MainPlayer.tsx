import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { createYouTubePlayer } from '@/lib/youtube';
import { Play, Pause, SkipBack, SkipForward, Volume2, Video, VideoOff, Heart } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface MainPlayerProps {
  videoId: string;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function MainPlayer({ videoId, onNext, onPrevious }: MainPlayerProps) {
  const playerRef = useRef<YT.Player>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([50]);
  const playerElementRef = useRef<HTMLDivElement>(null);
  const [currentVideoId, setCurrentVideoId] = useState(videoId);
  const [isVideoVisible, setIsVideoVisible] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (playerElementRef.current && currentVideoId) {
      createYouTubePlayer('youtube-player', currentVideoId).then((player) => {
        playerRef.current = player;
        player.addEventListener('onStateChange', (event: CustomEvent) => {
          setIsPlaying(event.data === YT.PlayerState.PLAYING);
        });
      });
    }

    const handlePlayVideo = (event: CustomEvent<{ videoId: string }>) => {
      setCurrentVideoId(event.detail.videoId);
    };

    window.addEventListener('PLAY_VIDEO', handlePlayVideo as EventListener);
    return () => {
      window.removeEventListener('PLAY_VIDEO', handlePlayVideo as EventListener);
    };
  }, [currentVideoId]);

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
    if (playerElementRef.current) {
      playerElementRef.current.style.display = !isVideoVisible ? 'block' : 'none';
    }
  };

  return (
    <Card className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-4">
        <div 
          ref={playerElementRef} 
          id="youtube-player" 
          className={`w-full md:w-64 aspect-video ${isVideoVisible ? '' : 'hidden'}`} 
        />

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
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current text-red-500' : ''}`} />
          </Button>

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
      </div>
    </Card>
  );
}