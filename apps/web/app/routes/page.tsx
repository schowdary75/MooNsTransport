'use client';

import { useState, useMemo, useCallback, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Clock3,
  Compass,
  MapPinned,
  Route,
  Sparkles,
  Star,
  Leaf,
  Activity,
  Heart,
  ChevronRight,
  MapPin,
  Flame,
  Navigation,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@moon/ui';
import { formatDistanceKm, formatDuration, formatPrice } from '@moon/utils';

import { buildRoutePlan, cities, sampleRoutes, suggestions } from '../../lib/site-data';
import { RoutePlannerPanel } from '../../components/planner/RoutePlannerPanel';
import { MapContainer } from '@/components/map/MapContainer';
import type { RouteSummary } from '@moon/api';
import {
  buildNavigationSteps,
  decodePolyline,
  getRoutePoints,
  nearestRoutePoint,
} from '@/lib/navigation-utils';

const routeFilters = ['Recommended', 'Fastest', 'Cheapest', 'Fewer Changes', 'Eco-friendly'];

const MODE_COLORS: Record<string, string> = {
  WALK: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
  CYCLE: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  BICYCLE: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  BUS: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
  METRO: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  SUBWAY: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  TRAIN: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  RAIL: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  FLIGHT: 'bg-pink-500/10 border-pink-500/30 text-pink-400',
  CAB: 'bg-teal-500/10 border-teal-500/30 text-teal-400',
  TRAM: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
};

const MODE_EMOJIS: Record<string, string> = {
  WALK: '🚶',
  CYCLE: '🚲',
  BICYCLE: '🚲',
  BUS: '🚌',
  METRO: '🚇',
  SUBWAY: '🚇',
  TRAIN: '🚆',
  RAIL: '🚆',
  FLIGHT: '✈️',
  CAB: '🚕',
  TRAM: '🚊',
};

// Calculate Eco and Health metrics
function computeMetrics(route: RouteSummary) {
  let calories = 0;
  let co2Savings = 0; // kg CO2 saved compared to Cab

  route.legs.forEach((leg) => {
    const mins = leg.durationMinutes || 0;
    const kms = leg.distanceKm || 0;

    if (leg.mode === 'WALK') {
      calories += mins * 5;
      co2Savings += kms * 0.21;
    } else if (leg.mode === 'CYCLE' || leg.mode === 'BICYCLE') {
      calories += mins * 8;
      co2Savings += kms * 0.21;
    } else if (leg.mode === 'METRO' || leg.mode === 'SUBWAY' || leg.mode === 'TRAIN') {
      co2Savings += kms * 0.16;
    } else if (leg.mode === 'BUS') {
      co2Savings += kms * 0.11;
    }
  });

  return {
    calories: Math.round(calories),
    co2Savings: Number(co2Savings.toFixed(1)),
  };
}

function ItineraryCard({
  title,
  route,
  accent,
  onSelect,
  isSelected,
}: {
  title: string;
  route: RouteSummary;
  accent: 'emerald' | 'sky' | 'amber';
  onSelect?: () => void;
  isSelected?: boolean;
}) {
  const accentClasses = {
    emerald: 'from-emerald-400 to-emerald-600',
    sky: 'from-sky-400 to-sky-600',
    amber: 'from-amber-400 to-amber-600',
  }[accent];

  const { calories, co2Savings } = useMemo(() => computeMetrics(route), [route]);

  return (
    <Card
      onClick={onSelect}
      className={`overflow-hidden cursor-pointer transition-all duration-300 border border-white/5 bg-slate-950/40 backdrop-blur-md ${
        isSelected
          ? 'ring-2 ring-brand-500 shadow-lg shadow-brand-500/20 bg-slate-900/60'
          : 'hover:bg-slate-900/30'
      }`}
    >
      <div className={`h-1.5 bg-gradient-to-r ${accentClasses}`} />
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{title} Option</span>
            <CardTitle className="text-white text-lg mt-0.5">{route.title}</CardTitle>
          </div>
          <Badge className="bg-brand-500 text-white font-bold text-sm px-3 py-1 rounded-xl">
            {formatDuration(route.durationMinutes)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Citymapper Mode Segment Bar */}
        <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-950/60 rounded-2xl border border-white/5">
          {route.legs.map((leg, idx) => {
            const pillStyle = MODE_COLORS[leg.mode] || 'bg-slate-500/10 text-slate-400 border-white/5';
            const emoji = MODE_EMOJIS[leg.mode] || '🔹';
            return (
              <div
                key={idx}
                className={`flex items-center gap-1 border px-2.5 py-1.5 rounded-xl text-xs font-semibold ${pillStyle}`}
              >
                <span>{emoji}</span>
                <span>{leg.durationMinutes}m</span>
              </div>
            );
          })}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/5 bg-slate-950/30 p-3 flex items-center gap-3">
            <Flame className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-[9px] uppercase font-semibold text-slate-500 tracking-wider">Health</p>
              <p className="text-sm font-bold text-white mt-0.5">{calories} kcal</p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950/30 p-3 flex items-center gap-3">
            <Leaf className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-[9px] uppercase font-semibold text-slate-500 tracking-wider">Carbon Saved</p>
              <p className="text-sm font-bold text-white mt-0.5">-{co2Savings} kg CO2</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
          <div>Distance: <span className="font-bold text-white">{formatDistanceKm(route.distanceKm)}</span></div>
          <div>Estimated Fare: <span className="font-bold text-brand-400">{formatPrice(route.fareInRupees)}</span></div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-white/5 pt-3 mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>Click to center route geometry</span>
        <ArrowRight className="h-4 w-4 text-slate-500" />
      </CardFooter>
    </Card>
  );
}

function RoutesPageContent() {
  const searchParams = useSearchParams();
  const cityId = searchParams.get('city') || 'delhi';
  
  const city = useMemo(() => {
    return cities.find((c) => c.id === cityId) || cities[0]!;
  }, [cityId]);

  const staticPlan = useMemo(() => buildRoutePlan(suggestions[0].location, suggestions[1].location), []);
  const staticCheapest = sampleRoutes[1] ?? sampleRoutes[0]!;

  const [selectedRoute, setSelectedRoute] = useState<RouteSummary | null>(staticPlan);
  const [searchResults, setSearchResults] = useState<RouteSummary[]>([]);
  const [activeFilter, setActiveFilter] = useState('Recommended');

  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationMode, setNavigationMode] = useState<'gps' | 'demo' | null>(null);
  const [navIndex, setNavIndex] = useState(0);
  const [gpsPosition, setGpsPosition] = useState<[number, number] | null>(null);
  const [navigationNotice, setNavigationNotice] = useState<string | null>(null);

  const routePoints = useMemo(() => getRoutePoints(selectedRoute), [selectedRoute]);
  const navigationSteps = useMemo(() => buildNavigationSteps(selectedRoute), [selectedRoute]);

  const simulatedUserLocation: [number, number] | null = useMemo(() => {
    if (isNavigating && navigationMode === 'demo' && routePoints.length > 0) {
      return routePoints[navIndex] || routePoints[0]!;
    }
    return null;
  }, [isNavigating, navigationMode, routePoints, navIndex]);

  const currentNavigationLocation = navigationMode === 'gps' ? gpsPosition || routePoints[0] || null : simulatedUserLocation;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isNavigating && navigationMode === 'demo' && routePoints.length > 0) {
      interval = setInterval(() => {
        setNavIndex(prev => {
          if (prev >= routePoints.length - 1) {
            setIsNavigating(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setNavIndex(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isNavigating, navigationMode, routePoints]);

  useEffect(() => {
    if (!isNavigating || navigationMode !== 'gps') return;

    if (!navigator.geolocation) {
      setNavigationMode('demo');
      setNavigationNotice('Browser GPS is unavailable. Running demo playback along this route.');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setGpsPosition([position.coords.latitude, position.coords.longitude]);
        setNavigationNotice(null);
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? 'Location permission was denied. Running demo playback along this route.'
            : 'Unable to read live GPS. Running demo playback along this route.';
        setNavigationNotice(message);
        setNavigationMode('demo');
      },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isNavigating, navigationMode]);

  const navigationProgress = useMemo(() => {
    if (!currentNavigationLocation) return { index: 0, distanceMeters: 0, progress: 0 };
    return nearestRoutePoint(
      { lat: currentNavigationLocation[0], lng: currentNavigationLocation[1] },
      routePoints
    );
  }, [currentNavigationLocation, routePoints]);

  const isOffRoute = navigationProgress.distanceMeters > 140;
  const currentStep = navigationSteps[Math.min(navigationSteps.length - 1, Math.floor(navigationProgress.progress * navigationSteps.length))];

  const startNavigation = useCallback(() => {
    if (!selectedRoute || routePoints.length === 0) return;
    setIsNavigating(true);
    setNavigationMode('gps');
    setNavigationNotice(null);
    setGpsPosition(null);
    setNavIndex(0);
  }, [routePoints.length, selectedRoute]);

  const endNavigation = useCallback(() => {
    setIsNavigating(false);
    setNavigationMode(null);
    setNavigationNotice(null);
    setGpsPosition(null);
    setNavIndex(0);
  }, []);

  const handleResultsChange = useCallback((results: RouteSummary[]) => {
    setSearchResults(results);
  }, []);

  // Derive fastest / cheapest / eco from search results
  const fastestRoute = useMemo(() => {
    if (searchResults.length === 0) return staticPlan;
    return [...searchResults].sort((a, b) => a.durationMinutes - b.durationMinutes)[0]!;
  }, [searchResults, staticPlan]);

  const cheapestRoute = useMemo(() => {
    if (searchResults.length === 0) return staticCheapest;
    return [...searchResults].sort((a, b) => a.fareInRupees - b.fareInRupees)[0]!;
  }, [searchResults, staticCheapest]);

  const recommendedRoute = useMemo(() => {
    if (searchResults.length === 0) return staticPlan;
    return searchResults[0] || staticPlan;
  }, [searchResults, staticPlan]);

  // Adjust active view details based on active filter
  const displayedRoutes = useMemo(() => {
    const list = searchResults.length > 0 ? searchResults : [staticPlan, staticCheapest];
    if (activeFilter === 'Fastest') {
      return [...list].sort((a, b) => a.durationMinutes - b.durationMinutes);
    }
    if (activeFilter === 'Cheapest') {
      return [...list].sort((a, b) => a.fareInRupees - b.fareInRupees);
    }
    if (activeFilter === 'Eco-friendly') {
      return [...list].sort((a, b) => {
        const metA = computeMetrics(a);
        const metB = computeMetrics(b);
        return metB.co2Savings - metA.co2Savings; // higher savings first
      });
    }
    return list;
  }, [searchResults, staticPlan, staticCheapest, activeFilter]);

  // Map route geometries to Leaflet polylines
  const mapPolylines = useMemo(() => {
    if (!selectedRoute) return [];
    return selectedRoute.legs.map((leg) => {
      let positions: [number, number][] = [];
      if (leg.geometry) {
        positions = decodePolyline(leg.geometry);
      } else if (
        leg.fromLat !== undefined &&
        leg.fromLng !== undefined &&
        leg.toLat !== undefined &&
        leg.toLng !== undefined
      ) {
        positions = [
          [leg.fromLat, leg.fromLng],
          [leg.toLat, leg.toLng],
        ];
      }

      let color = '#3b82f6'; // default blue
      let dashArray: string | undefined;

      if (leg.mode === 'WALK') {
        color = '#818cf8';
        dashArray = '4, 8';
      } else if (leg.mode === 'CYCLE' || leg.mode === 'BICYCLE') {
        color = '#fbbf24';
        dashArray = '3, 6';
      } else if (leg.mode === 'METRO' || leg.mode === 'SUBWAY') {
        color = '#1d4ed8';
      } else if (leg.mode === 'BUS') {
        color = '#ea580c';
      } else if (leg.mode === 'TRAIN') {
        color = '#059669';
      }

      return {
        positions,
        color,
        dashArray,
        weight: leg.mode === 'WALK' || leg.mode === 'CYCLE' ? 4 : 6,
      };
    }).filter((p) => p.positions.length > 0);
  }, [selectedRoute]);

  // Map stop markers
  const mapMarkers = useMemo(() => {
    if (!selectedRoute) return [];
    const markers: Array<{
      lat: number;
      lng: number;
      label: string;
      type: 'bus' | 'metro' | 'train' | 'walk' | 'cycle' | 'user-nav';
    }> = [];

    selectedRoute.legs.forEach((leg, index) => {
      if (leg.fromLat !== undefined && leg.fromLng !== undefined) {
        markers.push({
          lat: leg.fromLat,
          lng: leg.fromLng,
          label: leg.origin,
          type: (leg.mode === 'BICYCLE' ? 'cycle' : leg.mode.toLowerCase()) as any,
        });
      }
      if (
        index === selectedRoute.legs.length - 1 &&
        leg.toLat !== undefined &&
        leg.toLng !== undefined
      ) {
        markers.push({
          lat: leg.toLat,
          lng: leg.toLng,
          label: leg.destination,
          type: (leg.mode === 'BICYCLE' ? 'cycle' : leg.mode.toLowerCase()) as any,
        });
      }
    });

    return markers;
  }, [selectedRoute]);

  // Auto center on selected route or navigation position
  const mapCenter: [number, number] = useMemo(() => {
    if (isNavigating && currentNavigationLocation) {
      return currentNavigationLocation;
    }
    if (selectedRoute && selectedRoute.legs.length > 0) {
      const firstLeg = selectedRoute.legs[0]!;
      if (firstLeg.fromLat !== undefined && firstLeg.fromLng !== undefined) {
        return [firstLeg.fromLat, firstLeg.fromLng];
      }
    }
    return [city.location.lat, city.location.lng];
  }, [selectedRoute, city, isNavigating, currentNavigationLocation]);

  // Combine static route markers with simulated user navigation marker
  const finalMapMarkers = useMemo(() => {
    const list = [...mapMarkers];
    if (isNavigating && currentNavigationLocation) {
      list.push({
        lat: currentNavigationLocation[0],
        lng: currentNavigationLocation[1],
        label: navigationMode === 'gps' ? 'Live GPS Position' : 'Demo Playback Position',
        type: 'user-nav' as const,
      });
    }
    return list;
  }, [mapMarkers, isNavigating, currentNavigationLocation, navigationMode]);

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-brand-500/5 blur-[120px] -z-10" />

      {/* Screen layout: Map fills background, left sidebar is glassmorphic controls */}
      <div className="relative flex flex-col lg:flex-row h-screen pt-16">
        
        {/* Left Side: Route Controls & Result Cards Drawer */}
        <aside className="w-full lg:w-[480px] shrink-0 border-r border-white/5 bg-slate-950/80 backdrop-blur-xl overflow-y-auto z-10 flex flex-col h-full shadow-2xl">
          <div className="p-6 space-y-6 flex-1">
            
            {/* Header / Nav */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link href="/" className="p-2 hover:bg-white/5 rounded-xl transition text-slate-400 hover:text-white">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <h1 className="text-xl font-bold text-white">Route Planner</h1>
              </div>
              <Badge className="bg-brand-500/10 text-brand-400 border-brand-500/25">
                {city.name}
              </Badge>
            </div>

            {/* Address Search Planner Panel */}
            <RoutePlannerPanel
              selectedRoute={selectedRoute}
              onSelectRoute={setSelectedRoute}
              onResultsChange={handleResultsChange}
            />

            {/* Route Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
              {routeFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl border whitespace-nowrap transition ${
                    activeFilter === filter
                      ? 'border-brand-500 bg-brand-500/10 text-brand-400'
                      : 'border-white/5 bg-white/[0.02] text-slate-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Results Drawer */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>AVAILABLE COMMUTE OPTIONS</span>
                <span>{displayedRoutes.length} ROUTES FOUND</span>
              </div>
              
              <div className="space-y-4 pb-24">
                {displayedRoutes.map((route, index) => {
                  let accent: 'emerald' | 'sky' | 'amber' = 'emerald';
                  if (index === 1) accent = 'sky';
                  if (index > 1) accent = 'amber';

                  return (
                    <ItineraryCard
                      key={route.id || index}
                      title={index === 0 ? 'Fastest' : index === 1 ? 'Cheapest' : 'Alternative'}
                      route={route}
                      accent={accent}
                      onSelect={() => setSelectedRoute(route)}
                      isSelected={selectedRoute?.id === route.id}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Side: Map Canvas */}
        <section className="flex-1 relative h-[50vh] lg:h-full z-0 bg-slate-900">
          <MapContainer
            center={mapCenter}
            zoom={isNavigating ? 15 : 13}
            markers={finalMapMarkers}
            polylines={mapPolylines}
            height="100%"
            showSearch={false}
            routeKey={selectedRoute?.id}
            followPosition={isNavigating}
          />

          {/* Live Navigation Tracking Overlay HUD */}
          {isNavigating && currentNavigationLocation && (
            <div className="absolute bottom-4 left-4 right-4 lg:bottom-6 lg:left-6 lg:right-auto lg:w-[26rem] z-[400] rounded-2xl border border-emerald-500/20 bg-slate-950/90 p-4 backdrop-blur-md shadow-2xl text-white">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    {navigationMode === 'gps' ? 'Live GPS Navigation' : 'Demo Navigation Playback'}
                  </span>
                  <h4 className="text-sm font-bold text-white">{currentStep?.instruction || 'Follow the selected route'}</h4>
                  <p className="text-xs text-slate-400">
                    {isOffRoute ? (
                      <span className="inline-flex items-center gap-1 text-amber-300">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Off route by {Math.round(navigationProgress.distanceMeters)} m
                      </span>
                    ) : (
                      <span>On route. Next guidance updates as you move.</span>
                    )}
                  </p>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-bold">
                  {Math.round(navigationProgress.progress * 100)}% Done
                </Badge>
              </div>

              {navigationNotice && (
                <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
                  {navigationNotice}
                </div>
              )}

              {/* Progress gauge bar */}
              <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-300"
                  style={{ width: `${navigationProgress.progress * 100}%` }}
                />
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                <div className="text-[10px] text-slate-500 font-mono">
                  Lat: {currentNavigationLocation[0].toFixed(5)}<br />
                  Lng: {currentNavigationLocation[1].toFixed(5)}
                </div>
                <Button
                  size="sm"
                  onClick={endNavigation}
                  className="rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs"
                >
                  End Navigation
                </Button>
              </div>
            </div>
          )}

          {/* Active Overlay Card on Map */}
          {selectedRoute && !isNavigating && (
            <div className="absolute bottom-4 left-4 right-4 lg:bottom-6 lg:left-6 lg:right-auto lg:w-96 z-[400] rounded-2xl border border-white/10 bg-slate-950/90 p-5 backdrop-blur-md shadow-2xl text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Commute Details</span>
                  <h4 className="text-base font-bold text-white mt-1">{selectedRoute.title}</h4>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
                    {selectedRoute.source === 'otp' ? 'OpenTripPlanner route' : 'Demo fallback route'}
                  </p>
                </div>
                <Badge className="bg-brand-500 text-white font-bold">{formatDuration(selectedRoute.durationMinutes)}</Badge>
              </div>

              {/* Legs timeline */}
              <div className="mt-4 space-y-3 max-h-48 overflow-y-auto pr-1">
                {selectedRoute.legs.map((leg, index) => (
                  <div key={index} className="flex gap-3 text-xs bg-white/5 border border-white/5 p-3 rounded-2xl">
                    <span className="text-base shrink-0">{MODE_EMOJIS[leg.mode] || '🔹'}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-white truncate">{leg.origin} → {leg.destination}</span>
                        <span className="text-[9px] uppercase bg-slate-900 border border-white/5 px-2 py-0.5 rounded-full text-slate-400 shrink-0">{leg.mode}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {leg.durationMinutes} min · {leg.distanceKm} km {leg.provider ? `(via ${leg.provider})` : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fare & Book Link */}
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[9px] uppercase font-semibold text-slate-500 tracking-wider">Est. Trip Fare</p>
                  <p className="text-lg font-bold text-brand-400 mt-0.5">{formatPrice(selectedRoute.fareInRupees)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={startNavigation}
                    size="sm"
                    className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center gap-1.5"
                  >
                    <Navigation className="h-4 w-4" /> Start Navigation
                  </Button>
                  <Button
                    href={
                      selectedRoute.modes.includes('METRO')
                        ? '/metro'
                        : selectedRoute.modes.includes('BUS')
                        ? '/buses'
                        : selectedRoute.modes.includes('TRAIN')
                        ? '/trains'
                        : '/bookings'
                    }
                    size="sm"
                    className="rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold"
                  >
                    Buy QR Ticket
                  </Button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function RoutesPage() {
  return (
    <Suspense fallback={
      <main className="relative min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 rounded-full border-2 border-slate-800 border-t-brand-500 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Initializing routes engine telemetry...</p>
        </div>
      </main>
    }>
      <RoutesPageContent />
    </Suspense>
  );
}
