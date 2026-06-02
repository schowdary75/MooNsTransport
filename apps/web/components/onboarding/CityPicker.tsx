'use client';

import { cities } from '../../lib/site-data';
import { Badge } from '@moon/ui';
import { ShieldCheck, MapPin } from 'lucide-react';

interface CityPickerProps {
  value: string;
  onChange: (cityId: string) => void;
}

export function CityPicker({ value, onChange }: CityPickerProps) {
  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 max-h-72 overflow-y-auto p-1">
      {cities.map((city) => {
        const isSelected = city.id === value;
        return (
          <button
            key={city.id}
            onClick={() => onChange(city.id)}
            className={`flex items-start justify-between rounded-2xl border p-4 text-left transition-all ${
              isSelected
                ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20'
                : 'border-slate-200/80 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50'
            }`}
          >
            <div className="flex gap-3 min-w-0">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                isSelected ? 'bg-brand-500/10 text-brand-700' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
              }`}>
                <MapPin className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-slate-950 dark:text-white leading-tight">{city.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{city.state}</p>
              </div>
            </div>
            <Badge variant="success" className="text-[10px] py-0.5 px-1.5 h-auto">
              Live Data
            </Badge>
          </button>
        );
      })}
    </div>
  );
}
