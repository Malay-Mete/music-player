import axios from 'axios';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

interface SearchResult {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

export async function searchVideos(query: string): Promise<SearchResult[]> {
  const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
    params: {
      part: 'snippet',
      maxResults: 25,
      q: query,
      type: 'video',
      videoCategoryId: '10', // Music category
      key: API_KEY
    }
  });

  return response.data.items.map((item: any) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.medium.url,
    channelTitle: item.snippet.channelTitle
  }));
}

export function createYouTubePlayer(
  elementId: string, 
  videoId: string, 
  onStateChange?: (state: number) => void
): Promise<YT.Player> {
  return new Promise((resolve, reject) => {
    try {
      // Check if element exists
      if (!document.getElementById(elementId)) {
        return reject(new Error(`Element with id ${elementId} not found`));
      }

      // Load YouTube API if not already loaded
      if (!window.YT || !window.YT.Player) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';

        // Create callback that will be called when API is loaded
        const previousOnYouTubeIframeAPIReady = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          if (previousOnYouTubeIframeAPIReady) {
            previousOnYouTubeIframeAPIReady();
          }
          createPlayer();
        };

        document.body.appendChild(tag);
      } else {
        // API already loaded, create player directly
        createPlayer();
      }

      function createPlayer() {
        try {
          const player = new window.YT.Player(elementId, {
            height: '100%',
            width: '100%',
            videoId,
            playerVars: {
              autoplay: 0,
              controls: 1,
              modestbranding: 1,
              playsinline: 1,
              iv_load_policy: 3, // Disable annotations
              rel: 0 // Disable related videos
            },
            events: {
              onReady: (event) => {
                // Set initial quality to lowest
                event.target.setPlaybackQuality('tiny');
                resolve(event.target);
              },
              onStateChange: (event) => {
                if (onStateChange) {
                  onStateChange(event.data);
                }
              },
              onError: (event) => {
                reject(new Error(`YouTube player error: ${event.data}`));
              }
            }
          });
        } catch (error) {
          reject(error);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
}

// Quality levels from lowest to highest data usage
export const qualityLevels = [
  { value: 'tiny', label: 'Lowest (144p)', dataUsage: '~50MB/hour' },
  { value: 'small', label: 'Low (240p)', dataUsage: '~100MB/hour' },
  { value: 'medium', label: 'Medium (360p)', dataUsage: '~250MB/hour' },
  { value: 'large', label: 'High (480p)', dataUsage: '~500MB/hour' },
  { value: 'hd720', label: 'HD (720p)', dataUsage: '~1GB/hour' },
  { value: 'auto', label: 'Auto', dataUsage: 'Variable' },
];