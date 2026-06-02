'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import { geocodeAddress, reverseGeocode } from '@/lib/nominatim';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBoxProps {
  onLocationSelect?: (lat: number, lng: number) => void;
  onRequestLocation?: () => void;
}

interface Suggestion {
  lat: string;
  lon: string;
  displayName: string;
}

export function SearchBox({ onLocationSelect, onRequestLocation }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await geocodeAddress(searchQuery);
      setSuggestions(results);
      setIsOpen(true);
    } catch (error) {
      console.error('Geocoding error:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      handleSearch(newQuery);
    }, 300);
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);

    setQuery(suggestion.displayName);
    setSuggestions([]);
    setIsOpen(false);

    if (onLocationSelect) {
      onLocationSelect(lat, lng);
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Search location..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => suggestions.length > 0 && setIsOpen(true)}
            className="w-full"
          />

          {isOpen && suggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-64 overflow-y-auto z-50">
              {suggestions.map((suggestion, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                    type="button"
                  >
                    <div className="text-sm font-medium">{suggestion.displayName.split(',')[0]}</div>
                    <div className="text-xs text-gray-500">{suggestion.displayName.split(',').slice(1).join(',')}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onRequestLocation}
          title="Use my location"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}
