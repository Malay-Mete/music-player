interface YT {
  Player: {
    new (elementId: string, options: YT.PlayerOptions): YT.Player;
  };
  PlayerState: {
    UNSTARTED: -1;
    ENDED: 0;
    PLAYING: 1;
    PAUSED: 2;
    BUFFERING: 3;
    CUED: 5;
  };
}

declare namespace YT {
  interface PlayerOptions {
    height?: string | number;
    width?: string | number;
    videoId?: string;
    playerVars?: {
      autoplay?: 0 | 1;
      controls?: 0 | 1;
      modestbranding?: 0 | 1;
    };
  }

  interface Player {
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    setVolume(volume: number): void;
    getVolume(): number;
    addEventListener(event: string, listener: (event: CustomEvent) => void): void;
  }
}

interface Window {
  YT: YT;
  onYouTubeIframeAPIReady: () => void;
}
