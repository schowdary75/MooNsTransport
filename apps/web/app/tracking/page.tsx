'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Bell,
  BellOff,
  BusFront,
  MapPinned,
  Navigation,
  TrainFront,
  Wifi,
  ChevronRight,
  ArrowLeft,
  Info,
} from 'lucide-react';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@moon/ui';
import { MapContainer } from '@/components/map/MapContainer';
import { useVehicleTracking } from '@/hooks/use-vehicle-tracking';
import { cities, stops } from '../../lib/site-data';

const initialVehicles = [
  {
    id: 'DMRC-421',
    mode: 'Metro',
    route: 'Blue Line',
    eta: '2 min',
    status: 'On time',
    city: 'delhi',
    lat: 28.6139,
    lng: 77.209,
    type: 'metro' as const,
    source: 'demo' as const,
    timestamp: Date.now(),
    speed: undefined as number | undefined,
    stale: false,
  },
  {
    id: 'BEST-117',
    mode: 'Bus',
    route: 'City Loop 10A',
    eta: '5 min',
    status: 'Minor delay',
    city: 'mumbai',
    lat: 19.076,
    lng: 72.8777,
    type: 'bus' as const,
    source: 'demo' as const,
    timestamp: Date.now(),
    speed: undefined as number | undefined,
    stale: false,
  },
  {
    id: 'BMTC-33',
    mode: 'Bus',
    route: 'Tech Corridor Express',
    eta: '8 min',
    status: 'On time',
    city: 'bangalore',
    lat: 12.9716,
    lng: 77.5946,
    type: 'bus' as const,
    source: 'demo' as const,
    timestamp: Date.now(),
    speed: undefined as number | undefined,
    stale: false,
  },
  {
    id: 'DMRC-889',
    mode: 'Metro',
    route: 'Yellow Line',
    eta: '3 min',
    status: 'On time',
    city: 'delhi',
    lat: 28.6328,
    lng: 77.2197,
    type: 'metro' as const,
    source: 'demo' as const,
    timestamp: Date.now(),
    speed: undefined as number | undefined,
    stale: false,
  },
  {
    id: 'BMRCL-45',
    mode: 'Metro',
    route: 'Green Line',
    eta: '6 min',
    status: 'On time',
    city: 'bangalore',
    lat: 12.9767,
    lng: 77.5713,
    type: 'metro' as const,
    source: 'demo' as const,
    timestamp: Date.now(),
    speed: undefined as number | undefined,
    stale: false,
  },
];

export default function TrackingPage() {
  const { vehicles: socketVehicles, isConnected, subscribe, unsubscribe } = useVehicleTracking();
  const [selectedCity, setSelectedCity] = useState(cities[0]!);
  const [simulatedVehicles, setSimulatedVehicles] = useState(initialVehicles);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  
  // Subscription state persisted to localStorage
  const [subscribedRoutes, setSubscribedRoutes] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('moon_subscribed_routes');
      if (stored) {
        try {
          setSubscribedRoutes(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const toggleSubscription = (routeLabel: string) => {
    const updated = subscribedRoutes.includes(routeLabel)
      ? subscribedRoutes.filter((r) => r !== routeLabel)
      : [...subscribedRoutes, routeLabel];
    
    setSubscribedRoutes(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('moon_subscribed_routes', JSON.stringify(updated));
    }
  };

  // Subscribe to all routes on socket connection
  useEffect(() => {
    if (!isConnected) return;
    
    // Subscribe to all vehicle routes
    initialVehicles.forEach((v) => {
      subscribe(v.route);
    });

    return () => {
      initialVehicles.forEach((v) => {
        unsubscribe(v.route);
      });
    };
  }, [isConnected, subscribe, unsubscribe]);

  // Simulate vehicle movement (client-side fallback)
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedVehicles((prev) =>
        prev.map((v) => {
          // Add small delta
          const latDelta = (Math.random() - 0.5) * 0.0007;
          const lngDelta = (Math.random() - 0.5) * 0.0007;
          return {
            ...v,
            lat: v.lat + latDelta,
            lng: v.lng + lngDelta,
            timestamp: Date.now(),
          };
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Combine socket updates and simulated positions
  const activeVehicles = useMemo(() => {
    return simulatedVehicles.map((v) => {
      const socketUpdate = socketVehicles.find((sv) => sv.id === v.id);
      if (isConnected && socketUpdate) {
        return {
          ...v,
          lat: socketUpdate.lat,
          lng: socketUpdate.lng,
          status: socketUpdate.status === 'delayed' ? 'Delayed' : 'On time',
          eta: socketUpdate.etaMinutes
            ? `${socketUpdate.etaMinutes} min`
            : socketUpdate.delayMinutes 
            ? `${socketUpdate.delayMinutes} min delay` 
            : (v.id === 'DMRC-421' ? '2 min' : v.id === 'DMRC-889' ? '3 min' : v.id === 'BEST-117' ? '5 min' : v.id === 'BMRCL-45' ? '6 min' : '8 min'),
          source: socketUpdate.source,
          timestamp: socketUpdate.timestamp,
          stale: socketUpdate.stale,
          heading: socketUpdate.heading,
          speed: socketUpdate.speed,
          nextStop: socketUpdate.nextStop,
          alertIds: socketUpdate.alertIds,
        };
      }
      return { ...v, stale: Date.now() - v.timestamp > 120000 };
    });
  }, [simulatedVehicles, socketVehicles, isConnected]);

  // Filter vehicles by active city
  const cityVehicles = useMemo(() => {
    return activeVehicles.filter((v) => v.city === selectedCity.id);
  }, [activeVehicles, selectedCity]);

  // Find selected vehicle details dynamically from live city vehicles
  const selectedVehicle = useMemo(() => {
    if (!selectedVehicleId) return null;
    return cityVehicles.find((v) => v.id === selectedVehicleId) || null;
  }, [cityVehicles, selectedVehicleId]);

  // Map markers for active vehicles
  const mapMarkers = useMemo(() => {
    return cityVehicles.map((v) => ({
      lat: v.lat,
      lng: v.lng,
      label: `${v.id} (${v.route}) - ${v.stale ? 'stale signal' : v.status}`,
      type: v.type,
    }));
  }, [cityVehicles]);

  // Set active map center coordinates
  const mapCenter: [number, number] = useMemo(() => {
    if (selectedVehicle) {
      return [selectedVehicle.lat, selectedVehicle.lng];
    }
    return [selectedCity.location.lat, selectedCity.location.lng];
  }, [selectedVehicle, selectedCity]);

  // City stops list
  const cityStops = useMemo(() => {
    return stops.filter((s) => s.cityId === selectedCity.id);
  }, [selectedCity]);

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-brand-500/5 blur-[120px] -z-10" />

      {/* Main Full View Grid */}
      <div className="relative flex flex-col lg:flex-row h-screen pt-16">
        
        {/* Left column: Live listings side drawer */}
        <aside className="w-full lg:w-[480px] shrink-0 border-r border-white/5 bg-slate-950/80 backdrop-blur-xl overflow-y-auto z-10 flex flex-col h-full shadow-2xl">
          <div className="p-6 space-y-6 flex-1 pb-24">
            
            {/* Header branding */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link href="/" className="p-2 hover:bg-white/5 rounded-xl transition text-slate-400 hover:text-white">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <h1 className="text-xl font-bold text-white">Live Tracking</h1>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900 border border-white/5 p-1 rounded-xl">
                {cities.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedCity(item);
                      setSelectedVehicleId(null);
                    }}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                      selectedCity.id === item.id ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Connection Status Card */}
            <Card className="border-white/5 bg-slate-950/40 backdrop-blur-md rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Wifi className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Live Status Signals</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {isConnected ? 'Connected to live feeds' : 'Running explicit demo vehicle playback'}
                    </p>
                  </div>
                </div>
                <Badge className={isConnected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-brand-500/10 text-brand-400 border-brand-500/20'}>
                  {isConnected ? 'Active Socket' : 'Demo GPS'}
                </Badge>
              </div>
            </Card>

            {/* Active Vehicles Timeline List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
                <span>Vehicles on map</span>
                <span>{cityVehicles.length} active</span>
              </div>

              <div className="space-y-3">
                {cityVehicles.map((v) => {
                  const isSelected = selectedVehicle?.id === v.id;
                  const isSubscribed = subscribedRoutes.includes(`${v.mode} ${v.route}`);
                  const Icon = v.type === 'metro' ? TrainFront : BusFront;
                  
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVehicleId(v.id)}
                      className={`w-full flex items-center justify-between gap-4 text-left border rounded-2xl p-4 cursor-pointer transition ${
                        isSelected
                          ? 'border-brand-500 bg-slate-900/60 shadow-lg shadow-brand-500/5'
                          : 'border-white/5 bg-slate-950/20 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                          v.type === 'metro' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{v.route}</span>
                            <Badge className="bg-white/5 text-slate-400 text-[9px] border-none px-1.5 py-0">#{v.id}</Badge>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">
                            Status: <span className={v.status === 'On time' && !v.stale ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>{v.stale ? 'Stale signal' : v.status}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <p className="text-sm font-bold text-white">{v.eta}</p>
                          <p className="text-[9px] text-slate-500">{v.source === 'gtfs-rt' ? 'GTFS-RT' : 'demo'} ETA</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSubscription(`${v.mode} ${v.route}`);
                          }}
                          className={`p-2 rounded-xl transition ${
                            isSubscribed
                              ? 'bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 border border-brand-500/20'
                              : 'bg-white/5 text-slate-500 hover:text-white hover:bg-white/10'
                          }`}
                          title={isSubscribed ? 'Unsubscribe' : 'Subscribe to alerts'}
                        >
                          {isSubscribed ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hub Stations List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
                <span>Hubs & Stops</span>
                <span>{cityStops.length} stops</span>
              </div>

              <div className="space-y-3">
                {cityStops.map((stop) => (
                  <div
                    key={stop.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-slate-950/20 p-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-slate-400">
                        <MapPinned className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-white text-xs truncate">{stop.name}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Code: {stop.code || 'N/A'}</p>
                      </div>
                    </div>
                    <Badge className="bg-slate-900 text-slate-400 border-white/5 text-[9px] uppercase tracking-wider">
                      {stop.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* Right column: Full viewport Leaflet Map */}
        <section className="flex-1 relative h-[50vh] lg:h-full z-0 bg-slate-950">
          <MapContainer
            center={mapCenter}
            zoom={14}
            markers={mapMarkers}
            height="100%"
            showSearch={false}
            routeKey={selectedVehicle?.id || selectedCity.id}
            followPosition={Boolean(selectedVehicle)}
          />

          {/* Active Overlay Card on Map */}
          {selectedVehicle && (
            <div className="absolute bottom-6 left-6 right-6 lg:left-6 lg:right-auto lg:w-96 z-[400] rounded-3xl border border-white/10 bg-slate-950/90 p-5 backdrop-blur-md shadow-2xl text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Vehicle Telemetry</span>
                  <h4 className="text-base font-bold text-white mt-1">{selectedVehicle.route}</h4>
                  <p className="text-xs text-slate-400 mt-1">Vehicle ID: <span className="font-mono text-white">{selectedVehicle.id}</span></p>
                </div>
                <Badge className={selectedVehicle.status === 'On time' && !selectedVehicle.stale ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}>
                  {selectedVehicle.stale ? 'Stale' : selectedVehicle.status}
                </Badge>
              </div>

              {/* Coordinates info */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs bg-white/5 border border-white/5 p-3 rounded-2xl font-mono">
                <div>Latitude: <span className="text-white">{selectedVehicle.lat.toFixed(6)}</span></div>
                <div>Longitude: <span className="text-white">{selectedVehicle.lng.toFixed(6)}</span></div>
                <div>Source: <span className="text-white uppercase">{selectedVehicle.source}</span></div>
                <div>Speed: <span className="text-white">{selectedVehicle.speed ? `${Math.round(selectedVehicle.speed)} km/h` : 'n/a'}</span></div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => toggleSubscription(`${selectedVehicle.mode} ${selectedVehicle.route}`)}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition ${
                    subscribedRoutes.includes(`${selectedVehicle.mode} ${selectedVehicle.route}`)
                      ? 'border-brand-500 bg-brand-500/10 text-brand-400'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Bell className="h-3.5 w-3.5" />
                  <span>
                    {subscribedRoutes.includes(`${selectedVehicle.mode} ${selectedVehicle.route}`)
                      ? 'Subscribed to Alerts'
                      : 'Get Live Delay Alerts'}
                  </span>
                </button>
                <Button
                  href={`/routes?city=${selectedCity.id}`}
                  size="sm"
                  className="rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold"
                >
                  Plan Route
                </Button>
              </div>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
