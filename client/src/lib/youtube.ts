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

export function createYouTubePlayer(elementId: string, videoId: string): Promise<YT.Player> {
  return new Promise((resolve) => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
      const player = new window.YT.Player(elementId, {
        height: '360',
        width: '640',
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          playsinline: 1
        },
        events: {
          onReady: (event) => {
            resolve(event.target);
          }
        }
      });
    };
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