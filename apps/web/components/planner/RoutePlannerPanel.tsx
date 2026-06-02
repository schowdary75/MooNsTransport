'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { geocodeAddress } from '@/lib/nominatim';
import type { RouteSummary } from '@moon/api';
import { Search, MapPin, ArrowLeftRight, Navigation, Loader2 } from 'lucide-react';
import { decodePolyline } from '@/lib/navigation-utils';

const MODES = ['walk', 'cycle', 'bus', 'metro', 'train', 'flight'];

interface Suggestion {
  lat: string;
  lon: string;
  displayName: string;
}

interface RoutePlannerPanelProps {
  onResultsChange?: (results: RouteSummary[]) => void;
  onSelectRoute?: (route: RouteSummary | null) => void;
  selectedRoute?: RouteSummary | null;
}

export function RoutePlannerPanel({
  onResultsChange,
  onSelectRoute,
  selectedRoute,
}: RoutePlannerPanelProps) {
  const { toast } = useToast();
  const searchParams = useSearchParams();

  // Search parameters from URL (e.g. from homepage query)
  const urlFromLat = searchParams.get('fromLat');
  const urlFromLng = searchParams.get('fromLng');
  const urlFromName = searchParams.get('fromName');
  const urlToLat = searchParams.get('toLat');
  const urlToLng = searchParams.get('toLng');
  const urlToName = searchParams.get('toName');

  const [from, setFrom] = useState('Connaught Place');
  const [fromCoords, setFromCoords] = useState({ lat: 28.6315, lng: 77.2167 });
  const [fromSuggestions, setFromSuggestions] = useState<Suggestion[]>([]);
  const [isFromOpen, setIsFromOpen] = useState(false);

  const [to, setTo] = useState('New Delhi Railway Station');
  const [toCoords, setToCoords] = useState({ lat: 28.6429, lng: 77.2195 });
  const [toSuggestions, setToSuggestions] = useState<Suggestion[]>([]);
  const [isToOpen, setIsToOpen] = useState(false);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]!);
  const [time, setTime] = useState('09:00');
  const [selectedModes, setSelectedModes] = useState<string[]>(['bus', 'metro', 'train']);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<RouteSummary[]>([]);

  const fromTimer = useRef<NodeJS.Timeout | null>(null);
  const toTimer = useRef<NodeJS.Timeout | null>(null);

  // Set state from URL params if present
  useEffect(() => {
    if (urlFromName) setFrom(urlFromName);
    if (urlFromLat && urlFromLng) {
      setFromCoords({ lat: parseFloat(urlFromLat), lng: parseFloat(urlFromLng) });
    }
    if (urlToName) setTo(urlToName);
    if (urlToLat && urlToLng) {
      setToCoords({ lat: parseFloat(urlToLat), lng: parseFloat(urlToLng) });
    }
  }, [urlFromName, urlFromLat, urlFromLng, urlToName, urlToLat, urlToLng]);

  const handleFromSearch = async (val: string) => {
    if (val.length < 3) {
      setFromSuggestions([]);
      return;
    }
    try {
      const res = await geocodeAddress(val);
      setFromSuggestions(res);
      setIsFromOpen(true);
    } catch (e) {
      console.error('From geocoding error:', e);
    }
  };

  const handleToSearch = async (val: string) => {
    if (val.length < 3) {
      setToSuggestions([]);
      return;
    }
    try {
      const res = await geocodeAddress(val);
      setToSuggestions(res);
      setIsToOpen(true);
    } catch (e) {
      console.error('To geocoding error:', e);
    }
  };

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFrom(val);
    if (fromTimer.current) clearTimeout(fromTimer.current);
    fromTimer.current = setTimeout(() => handleFromSearch(val), 300);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTo(val);
    if (toTimer.current) clearTimeout(toTimer.current);
    toTimer.current = setTimeout(() => handleToSearch(val), 300);
  };

  const selectFrom = (s: Suggestion) => {
    setFrom(s.displayName.split(',')[0]!);
    setFromCoords({ lat: parseFloat(s.lat), lng: parseFloat(s.lon) });
    setFromSuggestions([]);
    setIsFromOpen(false);
  };

  const selectTo = (s: Suggestion) => {
    setTo(s.displayName.split(',')[0]!);
    setToCoords({ lat: parseFloat(s.lat), lng: parseFloat(s.lon) });
    setToSuggestions([]);
    setIsToOpen(false);
  };

  const handleSearch = useCallback(async () => {
    if (!from || !to || !fromCoords || !toCoords) {
      toast({ title: 'Missing route locations', description: 'Enter both origin and destination.' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/routes/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromLat: fromCoords.lat,
          fromLng: fromCoords.lng,
          toLat: toCoords.lat,
          toLng: toCoords.lng,
          date,
          time,
          modes: selectedModes.join(',').toUpperCase(),
          numItineraries: 3,
        }),
      });

      if (!response.ok) throw new Error('Failed to plan route');
      const json = await response.json();
      const itineraries = json.data || json.itineraries || [];
      const routeSource = json.source || 'demo';
      const generatedAt = json.generatedAt || new Date().toISOString();
      const warnings = json.warnings || [];
      
      const normalizeMode = (m: string) => m === 'BICYCLE' ? 'CYCLE' : m;
      
      const buildTitle = (legs: any[]): string => {
        if (!legs || legs.length === 0) return 'Planned Route';
        const modeLabels: Record<string, string> = {
          WALK: 'Walk', CYCLE: 'Cycle', BICYCLE: 'Cycle',
          BUS: 'Bus', METRO: 'Metro', SUBWAY: 'Metro',
          TRAIN: 'Train', RAIL: 'Train', FLIGHT: 'Flight',
          CAB: 'Cab', TRAM: 'Tram',
        };
        const allModes = legs.map((l: any) => normalizeMode(l.mode));
        const uniqueModes = [...new Set(allModes)];
        const transitModes = uniqueModes.filter(m => m !== 'WALK');
        const displayModes = transitModes.length > 0 ? transitModes : uniqueModes;
        return displayModes.map(m => modeLabels[m] || m).join(' → ');
      };

      const transformed: RouteSummary[] = itineraries.map((it: any, index: number) => {
        const legs = it.legs || [];
        const totalDistanceM = legs.reduce((sum: number, l: any) => sum + (l.distance || 0), 0);
        const totalDistanceKm = it.distanceKm ?? Number((totalDistanceM / 1000).toFixed(1));
        const durationMinutes = it.durationMinutes ?? Math.round((it.duration || 0) / 60);

        return {
          id: it.id || `route-${Date.now()}-${index}`,
          title: it.title && it.title !== 'Mock route plan' ? it.title : buildTitle(legs),
          durationMinutes,
          distanceKm: totalDistanceKm,
          fareInRupees: it.fareInRupees ?? it.fare?.fare ?? 0,
          modes: it.modes || [...new Set(legs.map((l: any) => normalizeMode(l.mode)))],
          source: routeSource,
          generatedAt,
          warnings,
          transferCount: it.transfers ?? Math.max(0, legs.filter((l: any) => normalizeMode(l.mode) !== 'WALK').length - 1),
          waitMinutes: it.waitingTime ? Math.round(it.waitingTime / 60) : undefined,
          legs: legs.map((leg: any) => {
            const legDistM = leg.distance || 0;
            const legDurSec = leg.endTime && leg.startTime
              ? (leg.endTime - leg.startTime) / 1000
              : 0;
            return {
              mode: normalizeMode(leg.mode || 'WALK'),
              origin: leg.origin || leg.from?.name || 'Origin',
              destination: leg.destination || leg.to?.name || 'Destination',
              provider: leg.provider || leg.agencyName || leg.route || undefined,
              durationMinutes: leg.durationMinutes ?? Math.round(legDurSec / 60),
              distanceKm: leg.distanceKm ?? Number((legDistM / 1000).toFixed(2)),
              fareInRupees: leg.fareInRupees ?? 0,
              departureTime: leg.startTime,
              arrivalTime: leg.endTime,
              waitMinutes: leg.waitingTime ? Math.round(leg.waitingTime / 60) : undefined,
              routeId: leg.routeId || leg.route,
              tripId: leg.tripId,
              headsign: leg.headsign,
              realtimeStatus: routeSource === 'otp' ? 'scheduled' : 'unknown',
              alertSummaries: warnings,
              fromLat: leg.fromLat ?? leg.from?.lat,
              fromLng: leg.fromLng ?? leg.from?.lon,
              toLat: leg.toLat ?? leg.to?.lat,
              toLng: leg.toLng ?? leg.to?.lon,
              geometry: leg.geometry?.points,
              decodedGeometry: leg.geometry?.points
                ? decodePolyline(leg.geometry.points).map(([lat, lng]) => ({ lat, lng }))
                : undefined,
              steps: leg.steps?.map((step: any, stepIndex: number) => ({
                id: `${it.id || index}-step-${stepIndex}`,
                instruction: `${step.relativeDirection || step.relativeDirections || 'Continue'} ${step.streetName ? `on ${step.streetName}` : ''}`.trim(),
                mode: normalizeMode(leg.mode || 'WALK'),
                distanceMeters: Math.round(step.distance || 0),
                durationMinutes: Math.max(1, Math.round((step.distance || 0) / 80)),
                streetName: step.streetName,
                absoluteDirection: step.absoluteDirection,
                relativeDirection: step.relativeDirection || step.relativeDirections,
              })),
            };
          }),
        };
      });
      
      setResults(transformed);
      onResultsChange?.(transformed);
      if (transformed.length > 0) {
        onSelectRoute?.(transformed[0] || null);
      }
    } catch {
      toast({
        title: 'Route planning failed',
        description: 'Unable to reach the routing service.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [date, from, fromCoords, toCoords, selectedModes, time, to, toast, onResultsChange, onSelectRoute]);

  // Auto trigger search on load if search params are present
  useEffect(() => {
    if (urlFromLat && urlFromLng && urlToLat && urlToLng) {
      const initSearch = async () => {
        setIsLoading(true);
        // Small delay to allow state coordinates to settle
        await new Promise((resolve) => setTimeout(resolve, 300));
        handleSearch();
      };
      initSearch();
    }
  }, [urlFromLat, urlFromLng, urlToLat, urlToLng, handleSearch]);

  return (
    <Card className="w-full space-y-6 p-6 border-white/10 bg-slate-900/60 backdrop-blur-md rounded-3xl text-white shadow-xl">
      {/* Route Inputs */}
      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] relative">
        <div className="relative">
          <Label htmlFor="from" className="text-slate-400 font-medium text-xs mb-1.5 block">From</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-brand-400" />
            <Input
              id="from"
              value={from}
              onChange={handleFromChange}
              onFocus={() => fromSuggestions.length > 0 && setIsFromOpen(true)}
              autoComplete="off"
              className="pl-9 bg-slate-950/60 border-white/5 text-white placeholder-slate-500 rounded-xl focus:border-brand-500"
            />
          </div>
          {isFromOpen && fromSuggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 bg-slate-950 border border-white/10 rounded-xl shadow-2xl mt-1 max-h-60 overflow-y-auto z-50 divide-y divide-white/5">
              {fromSuggestions.map((s, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => selectFrom(s)}
                    className="w-full text-left px-4 py-2.5 hover:bg-white/5 transition text-xs"
                  >
                    <div className="font-semibold text-white">{s.displayName.split(',')[0]}</div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">{s.displayName}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Button
          className="self-end p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-slate-400 hover:text-white"
          onClick={() => {
            const tempVal = from;
            const tempCoords = fromCoords;
            setFrom(to);
            setFromCoords(toCoords);
            setTo(tempVal);
            setToCoords(tempCoords);
          }}
        >
          <ArrowLeftRight className="h-4 w-4" />
        </Button>

        <div className="relative">
          <Label htmlFor="to" className="text-slate-400 font-medium text-xs mb-1.5 block">To</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-brand-400" />
            <Input
              id="to"
              value={to}
              onChange={handleToChange}
              onFocus={() => toSuggestions.length > 0 && setIsToOpen(true)}
              autoComplete="off"
              className="pl-9 bg-slate-950/60 border-white/5 text-white placeholder-slate-500 rounded-xl focus:border-brand-500"
            />
          </div>
          {isToOpen && toSuggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 bg-slate-950 border border-white/10 rounded-xl shadow-2xl mt-1 max-h-60 overflow-y-auto z-50 divide-y divide-white/5">
              {toSuggestions.map((s, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => selectTo(s)}
                    className="w-full text-left px-4 py-2.5 hover:bg-white/5 transition text-xs"
                  >
                    <div className="font-semibold text-white">{s.displayName.split(',')[0]}</div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">{s.displayName}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Date / Time */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="date" className="text-slate-400 font-medium text-xs mb-1.5 block">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="bg-slate-950/60 border-white/5 text-white rounded-xl focus:border-brand-500"
          />
        </div>
        <div>
          <Label htmlFor="time" className="text-slate-400 font-medium text-xs mb-1.5 block">Depart Time</Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
            className="bg-slate-950/60 border-white/5 text-white rounded-xl focus:border-brand-500"
          />
        </div>
      </div>

      {/* Transport Modes Selectors */}
      <div>
        <Label className="text-slate-400 font-medium text-xs mb-1.5 block">Transport Modes</Label>
        <div className="flex flex-wrap gap-2">
          {MODES.map((mode) => (
            <button
              key={mode}
              onClick={() =>
                setSelectedModes((current) =>
                  current.includes(mode)
                    ? current.filter((item) => item !== mode)
                    : [...current, mode]
                )
              }
              className={`rounded-xl border px-3.5 py-2 text-xs font-semibold capitalize transition ${
                selectedModes.includes(mode)
                  ? 'border-brand-500 bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'border-white/5 bg-slate-950/60 text-slate-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Search Actions */}
      <Button
        onClick={handleSearch}
        disabled={isLoading}
        className="w-full rounded-xl bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center gap-2 py-3 shadow-lg shadow-brand-500/20 text-sm font-semibold transition"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Calculating Multi-Modal Options...</span>
          </>
        ) : (
          <span>Search Commute Options</span>
        )}
      </Button>

      {isLoading && (
        <div className="space-y-3 pt-2">
          <Skeleton className="h-28 bg-white/5 rounded-2xl" />
          <Skeleton className="h-28 bg-white/5 rounded-2xl" />
        </div>
      )}
    </Card>
  );
}
