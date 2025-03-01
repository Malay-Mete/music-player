import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="search"
        placeholder="Search for music..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-lg"
      />
      <Button type="submit" variant="secondary">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
}
