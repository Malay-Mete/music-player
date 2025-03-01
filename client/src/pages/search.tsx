import { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { searchVideos } from '@/lib/youtube';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SearchResult {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

export default function Search() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
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
              <p className="text-sm text-muted-foreground mb-2">
                {result.channelTitle}
              </p>
              <Button className="w-full" variant="secondary">
                <Plus className="h-4 w-4 mr-2" />
                Add to Playlist
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {isSearching && (
        <div className="text-center mt-8">
          <p className="text-muted-foreground">Searching...</p>
        </div>
      )}
    </div>
  );
}
