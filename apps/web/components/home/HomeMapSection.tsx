'use client';

import { useState } from 'react';
import { MapContainer } from '@/components/map/MapContainer';
import { cities, stops } from '@/lib/site-data';

// Curated selection of major metro hubs for quick-select homepage buttons
const POPULAR_HUBS = ['delhi', 'mumbai', 'bangalore', 'kolkata', 'chennai', 'hyderabad', 'ahmedabad', 'jaipur'];

export function HomeMapSection() {
  const [city, setCity] = useState<string>('delhi');
  
  const selectedCity = cities.find((c) => c.id === city) || cities.find((c) => c.id === 'delhi')!;
  const center: [number, number] = [selectedCity.location.lat, selectedCity.location.lng];

  const markers = stops
    .filter((s) => {
      return s.cityId?.toLowerCase() === city;
    })
    .map((s) => ({
      lat: s.location?.lat ?? center[0],
      lng: s.location?.lng ?? center[1],
      label: s.name,
      type: (s.type === 'METRO' ? 'metro' : s.type === 'BUS' ? 'bus' : 'train') as 'metro' | 'bus' | 'train',
    }));

  return (
    <div className="space-y-3">
      {/* City tabs */}
      <div className="flex flex-wrap gap-2">
        {POPULAR_HUBS.map((c) => {
          const name = cities.find((cityItem) => cityItem.id === c)?.name || c;
          return (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                city === c
                  ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/10'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>

      {/* Map */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/70">
        <MapContainer
          center={center}
          zoom={13}
          markers={markers}
          height="22rem"
          showSearch={true}
        />
      </div>
    </div>
  );
}
