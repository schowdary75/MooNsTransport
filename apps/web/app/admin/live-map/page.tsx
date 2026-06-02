'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from '@moon/ui';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Radio, MapPin, Compass, Terminal, Activity, Wifi, HelpCircle } from 'lucide-react';
import { MapContainer } from '@/components/map/MapContainer';
import { useVehicleTracking } from '@/hooks/use-vehicle-tracking';
import { useToast } from '@/hooks/use-toast';

export default function AdminLiveMapPage() {
  const { vehicles, isConnected } = useVehicleTracking();
  const { toast } = useToast();
  
  const [simulatedVehicles, setSimulatedVehicles] = useState([
    { lat: 28.6139, lng: 77.209, label: 'DMRC-421 (Metro Blue Line)', type: 'metro' as const, id: 'DMRC-421' },
    { lat: 28.6328, lng: 77.2197, label: 'BEST-117 (City Loop Bus)', type: 'bus' as const, id: 'BEST-117' },
    { lat: 28.6429, lng: 77.2195, label: 'BMTC-33 (Tech Corridor Bus)', type: 'bus' as const, id: 'BMTC-33' },
  ]);

  const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.209]);
  const [mapZoom, setMapZoom] = useState(13);
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    'System: Telemetry channel established.',
    'System: Awaiting device handshakes...',
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedVehicles((prev) =>
        prev.map((v) => {
          const latD = (Math.random() - 0.5) * 0.0008;
          const lngD = (Math.random() - 0.5) * 0.0008;
          const nextLat = v.lat + latD;
          const nextLng = v.lng + lngD;
          
          // Append simulation logs
          setTelemetryLogs((logs) => [
            `[Telemetry] ${v.id} updated coords: lat ${nextLat.toFixed(4)}, lng ${nextLng.toFixed(4)}`,
            ...logs.slice(0, 15),
          ]);

          return {
            ...v,
            lat: nextLat,
            lng: nextLng,
            source: 'demo' as const,
            timestamp: Date.now(),
          };
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const activeVehicles = useMemo(() => {
    return vehicles.length > 0 
      ? vehicles.map((v) => ({
          lat: v.lat,
          lng: v.lng,
          label: `${v.id} (${v.routeId}) - ${v.stale ? 'stale' : v.status}`,
          type: (v.routeId.toLowerCase().includes('metro') ? 'metro' : 'bus') as 'metro' | 'bus',
          id: v.id,
          source: v.source,
          stale: v.stale,
          etaMinutes: v.etaMinutes,
          delayMinutes: v.delayMinutes,
        }))
      : simulatedVehicles.map((v) => ({ ...v, source: 'demo' as const, stale: false }));
  }, [vehicles, simulatedVehicles]);

  const handleTrackVehicle = (vehicle: typeof activeVehicles[0]) => {
    setMapCenter([vehicle.lat, vehicle.lng]);
    setMapZoom(15);
    toast({
      title: 'Target Tracked',
      description: `Centering live tracking on node ${vehicle.id}.`,
    });
  };

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden pb-16">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-brand-500/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[100px] -z-10" />

      <Container className="py-8 max-w-6xl space-y-6 pt-24">
        {/* Navigation & Header Controls */}
        <div className="flex justify-between items-center flex-wrap gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="p-3 border border-white/10 bg-white/[0.02] backdrop-blur-md rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 font-bold px-2 py-0.5 rounded-lg text-[10px] uppercase tracking-wider">
                  Command Center
                </Badge>
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-bold px-2 py-0.5 rounded-lg text-[10px] uppercase tracking-wider">
                  Live Fleet
                </Badge>
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">Fleet Live Map</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge className={isConnected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1 font-bold' : 'bg-amber-500/10 text-amber-400 border-amber-500/20 px-3 py-1 font-bold'}>
              <Radio className="h-4.5 w-4.5 animate-pulse mr-1.5 shrink-0" />
              {isConnected ? 'WebSocket Online' : 'GPS Simulation Mode'}
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-3 border border-white/10 bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition"
              onClick={() => {
                toast({ title: 'Refreshed', description: 'Re-polling device nodes status.' });
                setTelemetryLogs((logs) => ['[System] Re-polling all registered fleets...', ...logs]);
              }}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Command Grid */}
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          {/* Map Section */}
          <Card className="overflow-hidden border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem]">
            <CardContent className="p-0">
              <div className="h-[38rem] w-full relative">
                  <MapContainer 
                    center={mapCenter} 
                    zoom={mapZoom} 
                    markers={activeVehicles} 
                    routeKey={`admin-${mapCenter[0]}-${mapCenter[1]}`}
                    followPosition={mapZoom >= 15}
                  />
              </div>
            </CardContent>
          </Card>

          {/* Sidebar controls */}
          <div className="space-y-6 flex flex-col justify-between">
            {/* Stats */}
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="text-white text-lg">Fleet Summary</CardTitle>
                <CardDescription className="text-slate-400">Live reporting stats from Active Telemetry signals.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl text-center">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tracked</div>
                    <div className="text-xl font-extrabold mt-1 text-white">{activeVehicles.length}</div>
                  </div>
                  <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl text-center">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Metros</div>
                    <div className="text-xl font-extrabold mt-1 text-white">
                      {activeVehicles.filter(v => v.type === 'metro').length}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl text-center">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Buses</div>
                    <div className="text-xl font-extrabold mt-1 text-white">
                      {activeVehicles.filter(v => v.type === 'bus').length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* List of active tracking devices */}
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-3xl flex-1 flex flex-col min-h-0 overflow-hidden">
              <CardHeader className="border-b border-white/5 bg-white/[0.01]">
                <CardTitle className="text-white text-lg">Active Signals</CardTitle>
                <CardDescription className="text-slate-400">Target a vehicle to center the maps tracking focus.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 overflow-y-auto max-h-[16rem] p-5">
                {activeVehicles.map((v, i) => (
                  <div 
                    key={v.id + i} 
                    className="flex justify-between items-center border border-white/5 rounded-2xl p-4 bg-slate-950/30 hover:bg-white/5 transition"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-white text-sm truncate">{v.label.split(' ')[0]}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Lat: {v.lat.toFixed(4)}, Lng: {v.lng.toFixed(4)}
                      </div>
                      <div className="mt-1 text-[9px] uppercase tracking-wider text-slate-500">
                        {v.source === 'gtfs-rt' ? 'GTFS-RT feed' : 'Demo fallback'}{v.stale ? ' · stale' : ''}
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-brand-500/10 text-brand-400 hover:bg-brand-500 hover:text-white rounded-xl text-xs font-bold py-1.5 px-3"
                      onClick={() => handleTrackVehicle(v)}
                    >
                      Track
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Telemetry log output console */}
            <Card className="border-white/10 bg-slate-950/60 backdrop-blur-xl rounded-3xl overflow-hidden">
              <div className="bg-slate-950 px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-slate-400" />
                  <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider">GPS Telemetry Stream</span>
                </div>
                <div className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <CardContent className="p-4">
                <div className="h-28 overflow-y-auto font-mono text-[9px] text-emerald-400/80 space-y-1.5 select-text scrollbar-thin">
                  {telemetryLogs.map((log, idx) => (
                    <div key={idx} className="whitespace-nowrap truncate">{log}</div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </main>
  );
}
