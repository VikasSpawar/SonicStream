import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Play, Disc } from 'lucide-react';
import { searchMusic } from '../services/api';
import { usePlayer } from '../context/PlayerContext';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { playTrack } = usePlayer();

  // Debounce Logic: Only search when user stops typing
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsSearching(true);
        try {
          const { data } = await searchMusic(query);
          setResults(data.data);
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 300); // Wait 300ms

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="space-y-8 min-h-screen pb-32">
      
      {/* 1. The Search Input */}
      <div className="sticky top-0 bg-bg-base/95 backdrop-blur-md z-20 py-4 border-b border-border-subtle -mx-8 px-8">
        <div className="relative max-w-2xl">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
            <input 
                type="text" 
                placeholder="What do you want to play?" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="w-full bg-bg-card border border-border-subtle rounded-full py-3.5 pl-12 pr-6 text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            {isSearching && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
      </div>

      {/* 2. Empty State */}
      {!query && (
        <div className="flex flex-col items-center justify-center mt-20 text-text-muted space-y-4">
            <div className="w-20 h-20 bg-bg-card rounded-full flex items-center justify-center mb-4">
                <Disc size={40} className="text-border-highlight" />
            </div>
            <h3 className="text-lg font-medium text-white">Find your favorite tracks</h3>
            <p>Search for artists, songs, or podcasts.</p>
        </div>
      )}

      {/* 3. Results Grid */}
      {results.length > 0 && (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Top Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((track) => (
                    <div 
                        key={track.id} 
                        onClick={() => playTrack(track)}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-bg-card border border-transparent hover:border-border-subtle transition-all cursor-pointer group"
                    >
                        {/* Image */}
                        <div className="relative h-16 w-16 flex-shrink-0">
                            <img src={track.cover_url} alt={track.title} className="h-full w-full object-cover rounded-md" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                <Play size={20} fill="white" className="text-white" />
                            </div>
                        </div>

                        {/* Text */}
                        <div className="overflow-hidden">
                            <h4 className="font-semibold text-white truncate">{track.title}</h4>
                            <p className="text-sm text-text-muted truncate">{track.artist}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* No Results State */}
      {query && !isSearching && results.length === 0 && (
        <div className="text-center text-text-muted mt-20">
            No results found for "{query}"
        </div>
      )}

    </div>
  );
};

export default Search;