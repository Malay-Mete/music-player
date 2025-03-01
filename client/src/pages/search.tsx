import { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { searchVideos } from '@/lib/youtube';
import { Plus, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AddToPlaylistDialog } from '@/components/AddToPlaylistDialog';

interface SearchResult {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

export default function Search() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<SearchResult | null>(null);
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const searchResults = await searchVideos(query);
      setResults(searchResults);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search videos. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      <SearchBar onSearch={handleSearch} />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result) => (
          <Card key={result.id}>
            <CardContent className="p-4">
              <img
                src={result.thumbnail}
                alt={result.title}
                className="w-full rounded-md mb-2"
              />
              <h3 className="font-semibold line-clamp-2">{result.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {result.channelTitle}
              </p>
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => {
                    // This will be handled by the MainPlayer component through app state
                    window.dispatchEvent(new CustomEvent('PLAY_VIDEO', {
                      detail: { videoId: result.id }
                    }));
                  }}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Play
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setSelectedTrack(result)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isSearching && (
        <div className="text-center mt-8">
          <p className="text-muted-foreground">Searching...</p>
        </div>
      )}

      <AddToPlaylistDialog
        open={selectedTrack !== null}
        onOpenChange={(open) => !open && setSelectedTrack(null)}
        track={selectedTrack ? {
          videoId: selectedTrack.id,
          title: selectedTrack.title,
          thumbnail: selectedTrack.thumbnail
        } : null}
      />
    </div>
  );
}