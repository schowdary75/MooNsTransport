'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Badge, 
  Button, 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@moon/ui';
import { MapContainer } from '@/components/map/MapContainer';
import { Container } from '@/components/ui/container';
import { 
  Bike, 
  Shield, 
  MapPin, 
  Zap, 
  Battery, 
  Play, 
  Pause, 
  Square, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  Navigation,
  Compass
} from 'lucide-react';
import { formatPrice } from '@moon/utils';

const BIKE_PROVIDERS = [
  {
    name: 'Yulu',
    type: 'Electric Bike',
    fare: '₹1.50/min, ₹10 unlock',
    vehiclesAvailable: 14,
    color: 'bg-emerald-500',
    link: 'https://www.yulu.bike/',
  },
  {
    name: 'Bounce',
    type: 'Keyless Scooter',
    fare: '₹6/km, ₹15 base',
    vehiclesAvailable: 8,
    color: 'bg-orange-500',
    link: 'https://bounce.bike/',
  },
  {
    name: 'Vogo',
    type: 'Keyless Scooter',
    fare: '₹5/km, ₹10 base',
    vehiclesAvailable: 5,
    color: 'bg-blue-500',
    link: 'https://www.vogo.in/',
  },
];

interface Vehicle {
  id: string;
  name: string;
  provider: string;
  type: string;
  battery: number;
  range: string;
  rate: number; // Rs per minute
  code: string;
}

interface Dock {
  id: string;
  name: string;
  lat: number;
  lng: number;
  label: string;
  type: 'cycle';
  vehicles: Vehicle[];
}

const MOCK_DOCKS: Dock[] = [
  { 
    id: 'dock-1',
    name: 'Yulu Zone - Rajiv Chowk Metro', 
    lat: 28.6328, 
    lng: 77.2197, 
    label: 'Yulu Zone - Rajiv Chowk Metro (4 Vehicles)', 
    type: 'cycle',
    vehicles: [
      { id: 'YL-908', name: 'Yulu Miracle GR', provider: 'Yulu', type: 'Electric Bike', battery: 92, range: '48 km', rate: 1.5, code: '4892' },
      { id: 'YL-112', name: 'Yulu Miracle GR', provider: 'Yulu', type: 'Electric Bike', battery: 67, range: '35 km', rate: 1.5, code: '2109' },
      { id: 'BO-402', name: 'Bounce Infinity E1', provider: 'Bounce', type: 'Electric Scooter', battery: 45, range: '22 km', rate: 2.0, code: '8872' },
      { id: 'VG-771', name: 'Vogo Fit', provider: 'Vogo', type: 'Scooter (Keyless)', battery: 80, range: '40 km', rate: 1.8, code: '1054' },
    ]
  },
  { 
    id: 'dock-2',
    name: 'Bounce Hub - CP Block F', 
    lat: 28.6304, 
    lng: 77.2178, 
    label: 'Bounce Hub - CP Block F (3 Vehicles)', 
    type: 'cycle',
    vehicles: [
      { id: 'BO-229', name: 'Bounce Infinity E1', provider: 'Bounce', type: 'Electric Scooter', battery: 89, range: '44 km', rate: 2.0, code: '9123' },
      { id: 'BO-651', name: 'Bounce Infinity E1', provider: 'Bounce', type: 'Electric Scooter', battery: 31, range: '15 km', rate: 2.0, code: '5421' },
      { id: 'YL-443', name: 'Yulu Dex', provider: 'Yulu', type: 'Delivery E-Bike', battery: 74, range: '37 km', rate: 1.5, code: '6033' },
    ]
  },
  { 
    id: 'dock-3',
    name: 'Vogo Dock - NDLS Exit 2', 
    lat: 28.6352, 
    lng: 77.2215, 
    label: 'Vogo Dock - NDLS Exit 2 (3 Vehicles)', 
    type: 'cycle',
    vehicles: [
      { id: 'VG-881', name: 'Vogo Sport', provider: 'Vogo', type: 'Scooter (Keyless)', battery: 95, range: '55 km', rate: 1.8, code: '0032' },
      { id: 'VG-098', name: 'Vogo Fit', provider: 'Vogo', type: 'Scooter (Keyless)', battery: 18, range: '8 km', rate: 1.8, code: '4411' },
      { id: 'YL-809', name: 'Yulu Miracle GR', provider: 'Yulu', type: 'Electric Bike', battery: 52, range: '27 km', rate: 1.5, code: '3941' },
    ]
  },
];

export default function BikeRentalsPage() {
  const [selectedDockId, setSelectedDockId] = useState<string>('dock-1');
  
  // Active ride states
  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(null);
  const [rideState, setRideState] = useState<'idle' | 'connecting' | 'active' | 'paused' | 'completed'>('idle');
  const [connectionStep, setConnectionStep] = useState<number>(0);
  const [rideDuration, setRideDuration] = useState<number>(0);
  const [rideSpeed, setRideSpeed] = useState<number>(0);
  const [simulatedBattery, setSimulatedBattery] = useState<number>(100);
  
  // Completed ride receipt details
  const [receipt, setReceipt] = useState<{
    vehicleId: string;
    provider: string;
    durationMinutes: number;
    baseFare: number;
    distanceTravelled: number;
    totalAmount: number;
    unlockCode: string;
  } | null>(null);

  const selectedDock = useMemo(() => {
    return MOCK_DOCKS.find(d => d.id === selectedDockId) || MOCK_DOCKS[0]!;
  }, [selectedDockId]);

  // Connect Map markers trigger state updates when clicked
  const mapCenter: [number, number] = useMemo(() => {
    return [selectedDock.lat, selectedDock.lng];
  }, [selectedDock]);

  const mapMarkers = useMemo(() => {
    return MOCK_DOCKS.map(dock => ({
      lat: dock.lat,
      lng: dock.lng,
      label: `${dock.name} (${dock.vehicles.length} available)`,
      type: 'cycle' as const
    }));
  }, []);

  // Timer interval for ride simulator
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (rideState === 'active') {
      interval = setInterval(() => {
        setRideDuration(prev => prev + 1);
        
        // Fluctuating speed
        setRideSpeed(Math.round(15 + Math.random() * 12));
        
        // Depleting battery slowly
        setSimulatedBattery(prev => {
          if (prev <= 1) return 1;
          // Every 8 seconds drops 1%
          if (Math.random() > 0.85) {
            return prev - 1;
          }
          return prev;
        });
      }, 1000);
    } else {
      setRideSpeed(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [rideState]);

  // Simulation connection step timer
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (rideState === 'connecting') {
      if (connectionStep < 4) {
        timeout = setTimeout(() => {
          setConnectionStep(prev => prev + 1);
        }, 1200);
      } else {
        setRideState('active');
        setRideDuration(0);
        setSimulatedBattery(activeVehicle?.battery || 80);
      }
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [rideState, connectionStep, activeVehicle]);

  const handleStartUnlock = (vehicle: Vehicle) => {
    setActiveVehicle(vehicle);
    setConnectionStep(0);
    setRideState('connecting');
    setReceipt(null);
  };

  const handlePauseResume = () => {
    if (rideState === 'active') {
      setRideState('paused');
    } else if (rideState === 'paused') {
      setRideState('active');
    }
  };

  const handleEndRide = () => {
    if (!activeVehicle) return;
    
    const minutes = Math.max(1, Math.round(rideDuration / 6)); // Scaled: 1 real second = 10 simulated seconds
    const unlockBase = 10;
    const usageCost = minutes * activeVehicle.rate;
    const total = unlockBase + usageCost;

    setReceipt({
      vehicleId: activeVehicle.id,
      provider: activeVehicle.provider,
      durationMinutes: minutes,
      baseFare: unlockBase,
      distanceTravelled: parseFloat((minutes * 0.25).toFixed(2)), // 15km/h approx
      totalAmount: total,
      unlockCode: activeVehicle.code,
    });
    
    setRideState('completed');
    setActiveVehicle(null);
  };

  const connectionText = [
    'Establishing Bluetooth handshake with BLE unit...',
    'Authenticating GPS location with server...',
    'Transmitting digital token to smart lock...',
    'Lock bolt release sequence completed successfully!'
  ];

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden pb-20 pt-16">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[130px] -z-10" />
      <div className="absolute bottom-0 left-[10%] h-[500px] w-[500px] rounded-full bg-brand-500/5 blur-[120px] -z-10" />

      <Container className="max-w-6xl py-8 space-y-8">
        
        {/* Page Header */}
        <section className="space-y-4 border-b border-white/5 pb-6">
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold px-3 py-1 rounded-xl">
            Micro Mobility Hub
          </Badge>
          <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
            Bike & Scooter Rentals
          </h1>
          <p className="max-w-2xl text-base text-slate-400 sm:text-lg">
            Find nearby electric bikes, smart keyless scooters. Compare providers, unlock directly with digital BLE tokens, and track your metrics.
          </p>
        </section>

        {/* Live Ride Simulator Panel */}
        {rideState !== 'idle' && (
          <Card className="border-emerald-500/30 bg-slate-900/40 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden border-2 animate-in zoom-in-95 duration-200">
            <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-white/5 p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="animate-ping h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                  <CardTitle className="text-white text-lg font-bold">
                    {rideState === 'connecting' && 'Connecting to Vehicle...'}
                    {rideState === 'active' && 'Active Rental Session'}
                    {rideState === 'paused' && 'Rental Session Paused'}
                    {rideState === 'completed' && 'Session Summary'}
                  </CardTitle>
                </div>
                {activeVehicle && (
                  <Badge className="bg-white/5 border-white/10 text-slate-300 font-mono">
                    ID: {activeVehicle.id}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Connecting Steps */}
              {rideState === 'connecting' && (
                <div className="py-8 text-center space-y-6 max-w-md mx-auto">
                  <div className="relative flex justify-center items-center">
                    <div className="h-16 w-16 rounded-full border-4 border-slate-800 border-t-emerald-400 animate-spin" />
                    <Bike className="h-6 w-6 text-emerald-400 absolute" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-white font-semibold text-sm">Bluetooth pairing sequence in progress...</p>
                    <div className="h-1.5 w-full bg-slate-850 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-400 transition-all duration-1000" 
                        style={{ width: `${(connectionStep / 4) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 font-mono h-6 overflow-hidden">
                      {connectionText[connectionStep] || 'Finalizing telemetry...'}
                    </p>
                  </div>
                </div>
              )}

              {/* Active & Paused State */}
              {(rideState === 'active' || rideState === 'paused') && activeVehicle && (
                <div className="grid gap-6 md:grid-cols-4 items-center">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Vehicle Model</p>
                    <p className="text-lg font-bold text-white flex items-center gap-1.5">
                      <Bike className="h-5 w-5 text-emerald-400" />
                      {activeVehicle.name}
                    </p>
                    <p className="text-xs text-slate-400">{activeVehicle.type}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:col-span-2">
                    <div className="bg-slate-950/60 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                      <Clock className="h-8 w-8 text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Ride Duration</p>
                        <p className="text-base font-extrabold text-white font-mono">
                          {Math.floor(rideDuration / 60).toString().padStart(2, '0')}:
                          {(rideDuration % 60).toString().padStart(2, '0')}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-950/60 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                      <Battery className={`h-8 w-8 shrink-0 ${simulatedBattery < 30 ? 'text-red-400' : 'text-emerald-400'}`} />
                      <div>
                        <p className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Charge Remaining</p>
                        <p className="text-base font-extrabold text-white font-mono">{simulatedBattery}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 justify-end">
                    <Button 
                      onClick={handlePauseResume}
                      variant="secondary"
                      className="border-white/10 hover:bg-white/5 rounded-2xl py-3 font-semibold text-slate-300 flex items-center gap-1.5"
                    >
                      {rideState === 'active' ? (
                        <>
                          <Pause className="h-4 w-4" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" /> Resume
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={handleEndRide}
                      className="bg-red-500 hover:bg-red-600 text-white rounded-2xl py-3 font-bold flex items-center gap-1.5 shadow-lg shadow-red-500/20"
                    >
                      <Square className="h-4 w-4" /> End Ride
                    </Button>
                  </div>
                </div>
              )}

              {/* Completed Receipt Summary */}
              {rideState === 'completed' && receipt && (
                <div className="max-w-md mx-auto space-y-6 py-4">
                  <div className="text-center space-y-2">
                    <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h3 className="text-white font-extrabold text-lg">Smart Lock Re-engaged</h3>
                    <p className="text-xs text-slate-400">Lock code: <span className="font-mono text-white font-bold">{receipt.unlockCode}</span>. Billing complete.</p>
                  </div>

                  <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-5 space-y-3.5 text-sm font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Provider Hub</span>
                      <span className="text-white font-bold">{receipt.provider} Mobile</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Vehicle ID</span>
                      <span className="text-white">{receipt.vehicleId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Elapsed Time</span>
                      <span className="text-white">{receipt.durationMinutes} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Distance Travelled</span>
                      <span className="text-white">{receipt.distanceTravelled} km</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-3">
                      <span className="text-slate-400">Unlock Base Charge</span>
                      <span className="text-white">₹10.00</span>
                    </div>
                    <div className="flex justify-between pt-1 text-base text-white font-bold">
                      <span className="text-slate-300">Total Charged</span>
                      <span className="text-emerald-400 font-extrabold">{formatPrice(receipt.totalAmount)}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setRideState('idle')}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl py-3 font-semibold"
                  >
                    Done
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Map & Docks Grid */}
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          
          {/* Map view card */}
          <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-white/5 px-6 py-5 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white text-lg font-bold">Active Rental Stations</CardTitle>
                <CardDescription className="text-slate-400">Select an anchor station zone to list parked vehicles</CardDescription>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold">
                Live Docks
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[28rem] w-full relative">
                <MapContainer
                  center={mapCenter}
                  zoom={15}
                  markers={mapMarkers}
                  height="100%"
                />
              </div>
            </CardContent>
          </Card>

          {/* Dock Vehicles List */}
          <div className="space-y-6">
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-3xl shadow-2xl">
              <CardHeader className="border-b border-white/5 px-6 py-4 flex flex-row justify-between items-center">
                <div>
                  <CardTitle className="text-white text-base font-bold">Vehicles Parking Hub</CardTitle>
                  <CardDescription className="text-slate-400">Select dock area:</CardDescription>
                </div>
                <select 
                  value={selectedDockId}
                  onChange={(e) => setSelectedDockId(e.target.value)}
                  className="bg-slate-950 text-slate-200 text-xs border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-emerald-500"
                >
                  {MOCK_DOCKS.map((d) => (
                    <option key={d.id} value={d.id}>{d.name.split(' - ')[1] || d.name}</option>
                  ))}
                </select>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex justify-between">
                  <span>Vehicles at {selectedDock.name.split(' - ')[1]}</span>
                  <span>{selectedDock.vehicles.length} ready</span>
                </div>

                <div className="space-y-3.5">
                  {selectedDock.vehicles.map((v) => (
                    <div 
                      key={v.id}
                      className="border border-white/5 hover:border-emerald-500/40 bg-slate-950/40 p-4 rounded-2xl flex items-center justify-between transition-all"
                    >
                      <div className="flex gap-3">
                        <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-emerald-400 border border-white/5">
                          <Bike className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm flex items-center gap-1.5">
                            {v.name}
                            <Badge className="bg-white/5 border-none text-slate-400 font-mono text-[9px] px-1.5 py-0">#{v.id}</Badge>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                            <span>{v.provider}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <Battery className={`h-3 w-3 ${v.battery < 30 ? 'text-orange-400' : 'text-emerald-400'}`} />
                              {v.battery}% ({v.range})
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-semibold text-white">₹{v.rate}/min</p>
                        <Button 
                          size="sm"
                          disabled={rideState !== 'idle' || v.battery < 20}
                          onClick={() => handleStartUnlock(v)}
                          className="mt-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-1.5 px-3 font-semibold text-xs disabled:opacity-40"
                        >
                          {v.battery < 20 ? 'Low Battery' : 'Unlock'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Provider Pricing and Deeplink Compare */}
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-3xl shadow-2xl">
              <CardHeader className="border-b border-white/5 px-6 py-4">
                <CardTitle className="text-white text-base font-bold font-sans">Compare Providers</CardTitle>
                <CardDescription className="text-slate-400">Unlock rates, fleet specs, and external checkout links</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {BIKE_PROVIDERS.map((provider) => (
                  <div
                    key={provider.name}
                    className="flex items-center justify-between border border-white/5 rounded-2xl p-4 bg-slate-950/30 hover:border-emerald-500/30 transition"
                  >
                    <div className="flex gap-3">
                      <div className={`h-10 w-10 rounded-xl ${provider.color} flex items-center justify-center text-white font-extrabold text-base`}>
                        {provider.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm flex items-center gap-1.5">
                          {provider.name}
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-bold text-[9px] px-1.5">
                            {provider.vehiclesAvailable} online
                          </Badge>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">{provider.type} • {provider.fare}</div>
                      </div>
                    </div>
                    <a href={provider.link} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="secondary" className="border-white/15 text-slate-300 hover:bg-white/5 hover:text-white rounded-xl">
                        Open App
                      </Button>
                    </a>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Commuter Safety Guidelines */}
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-3xl shadow-2xl">
              <CardHeader className="border-b border-white/5 px-6 py-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-400" />
                  <CardTitle className="text-white text-base font-bold">Commuter Safety Guidelines</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-3.5 text-xs text-slate-400">
                <div className="flex gap-2">
                  <Zap className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                  <p>Always inspect the vehicle's dual brakes, battery levels, and headlight intensity before unlocking the ride.</p>
                </div>
                <div className="flex gap-2">
                  <Shield className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                  <p>Wearing a helmet is mandatory by law. Helmets are provided inside lock boxes at designated Yulu hubs.</p>
                </div>
                <div className="flex gap-2">
                  <AlertTriangle className="h-4.5 w-4.5 text-red-400 shrink-0 mt-0.5" />
                  <p>Always park in designated virtual docking boundaries to avoid penalty surcharges from state transport authorities.</p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </Container>
    </main>
  );
}
