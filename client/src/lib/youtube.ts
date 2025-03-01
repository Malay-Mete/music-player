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
          modestbranding: 1
        }
      });
      resolve(player);
    };
  });
}