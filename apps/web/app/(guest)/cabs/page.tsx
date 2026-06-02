'use client';

import { useState, useRef } from 'react';
import { Container } from '@/components/ui/container';
import { Card, Badge, CardHeader, CardTitle, CardDescription, CardContent, Button } from '@moon/ui';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getUberDeeplink, getOlaDeeplink, getRapidoDeeplink } from '@/lib/deeplinks';
import { geocodeAddress } from '@/lib/nominatim';
import { MapPin, Search, Navigation, Compass, Activity, CheckCircle, Clock, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Suggestion {
  lat: string;
  lon: string;
  displayName: string;
}

export default function CabsPage() {
  const [from, setFrom] = useState('Current Location (Seeded CP, Delhi)');
  const [to, setTo] = useState('');
  const [toCoords, setToCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Booking Simulation State
  const [simulatedCab, setSimulatedCab] = useState<string | null>(null);
  const [bookingStep, setBookingStep] = useState<'idle' | 'requesting' | 'dispatched'>('idle');

  const handleSearch = async (val: string) => {
    if (val.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await geocodeAddress(val);
      setSuggestions(res);
      setIsOpen(true);
    } catch (e) {
      console.error('Cabs geocoding error:', e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTo(val);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => handleSearch(val), 300);
  };

  const handleSelectSuggestion = (s: Suggestion) => {
    setTo(s.displayName.split(',')[0]!);
    setToCoords({ lat: parseFloat(s.lat), lng: parseFloat(s.lon) });
    setSuggestions([]);
    setIsOpen(false);
    setBookingStep('idle');
    setSimulatedCab(null);
  };

  const CAB_PROVIDERS = toCoords ? [
    { name: 'Uber Go', type: 'cab', fare: '₹240 - 280', time: '3 mins away', link: getUberDeeplink(toCoords.lat, toCoords.lng, to) },
    { name: 'Ola Cab Prime', type: 'cab', fare: '₹230 - 290', time: '5 mins away', link: getOlaDeeplink(toCoords.lat, toCoords.lng) },
    { name: 'Rapido Auto/Bike', type: 'auto', fare: '₹90 - 120', time: '2 mins away', link: getRapidoDeeplink(toCoords.lat, toCoords.lng) },
  ] : [
    { name: 'Uber Go', type: 'cab', fare: 'Search destination for fares', time: '--', link: '#' },
    { name: 'Ola Cab Prime', type: 'cab', fare: 'Search destination for fares', time: '--', link: '#' },
    { name: 'Rapido Auto/Bike', type: 'auto', fare: 'Search destination for fares', time: '--', link: '#' },
  ];

  const triggerSimulatedBooking = (cabName: string) => {
    setSimulatedCab(cabName);
    setBookingStep('requesting');
    toast({
      title: 'Connecting Gateway',
      description: `Contacting ${cabName} API dispatch servers...`,
    });

    setTimeout(() => {
      setBookingStep('dispatched');
      toast({
        title: 'Ride Dispatched',
        description: `Your ${cabName} driver is on the way!`,
      });
    }, 2500);
  };

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden pb-16 pt-16">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-teal-500/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-[10%] h-[500px] w-[500px] rounded-full bg-brand-500/5 blur-[100px] -z-10" />

      <Container className="py-8 max-w-4xl space-y-6 pt-24">
        {/* Header Title */}
        <div className="space-y-4 border-b border-white/5 pb-6">
          <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/20 font-bold px-3 py-1 rounded-xl">
            Micro-Mobility & Rides
          </Badge>
          <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
            Book a Cab or Auto.
          </h1>
          <p className="max-w-2xl text-base text-slate-400 sm:text-lg">
            Compare real-time fare estimates, ETA updates, and open ride-hailing apps directly in India.
          </p>
        </div>

        {/* Input Console */}
        <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl">
          <CardContent className="p-0 space-y-4">
            <div className="space-y-2 relative">
              <Label htmlFor="pickup" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Pickup Location</Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-500" />
                <input 
                  id="pickup" 
                  value={from} 
                  disabled 
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-white/5 rounded-2xl text-sm text-slate-400 outline-none cursor-not-allowed" 
                />
              </div>
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="dropoff" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-bold">Destination Dropoff</Label>
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-500" />
                <input 
                  id="dropoff" 
                  placeholder="Search destination address..." 
                  value={to} 
                  onChange={handleInputChange} 
                  onFocus={() => suggestions.length > 0 && setIsOpen(true)}
                  autoComplete="off"
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/5 rounded-2xl text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/25 outline-none transition"
                />
              </div>
              
              {isOpen && suggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 z-50 mt-2 max-h-60 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950 shadow-2xl divide-y divide-white/5 text-slate-300">
                  {suggestions.map((s, idx) => (
                    <li key={idx}>
                      <button 
                        type="button" 
                        onClick={() => handleSelectSuggestion(s)} 
                        className="w-full text-left px-4 py-3 hover:bg-white/5 transition text-sm"
                      >
                        <div className="font-bold text-white">{s.displayName.split(',')[0]}</div>
                        <div className="text-xs text-slate-400 truncate mt-0.5">{s.displayName}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Live booking simulation overlay */}
        {bookingStep !== 'idle' && (
          <Card className="border-teal-500/30 bg-teal-500/5 backdrop-blur-xl rounded-3xl p-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <CardContent className="p-0 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-left">
                {bookingStep === 'requesting' ? (
                  <div className="h-12 w-12 rounded-2xl border border-teal-500/20 bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0">
                    <Clock className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle className="h-6 w-6 animate-bounce" />
                  </div>
                )}
                
                <div>
                  <h3 className="font-bold text-white text-base">
                    {bookingStep === 'requesting' ? `Booking ${simulatedCab}...` : 'Cab Dispatched Successfully!'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {bookingStep === 'requesting' 
                      ? 'Reaching nearby GPS nodes for matching driver confirmation.'
                      : `Your ${simulatedCab} driver is arriving in 3 mins. Driver phone: +91 98765-XXXXX.`}
                  </p>
                </div>
              </div>

              <Button 
                onClick={() => { setBookingStep('idle'); setSimulatedCab(null); }} 
                className="bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 shrink-0 text-xs font-semibold px-4 py-2"
              >
                Reset Ride
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Available Providers list */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Navigation className="h-5 w-5 text-teal-400" />
            Cab Providers & Fare Indexes
          </h3>

          <div className="grid gap-4">
            {CAB_PROVIDERS.map((provider) => (
              <Card key={provider.name} className="border-white/10 bg-white/[0.02] backdrop-blur-md rounded-3xl hover:border-brand-500/30 hover:bg-white/[0.04] transition p-5">
                <CardContent className="p-0 flex justify-between items-center gap-4 text-left">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">{provider.name}</span>
                      <Badge className="bg-white/[0.04] border-white/5 text-slate-400 text-[9px] px-1.5 py-0.5 rounded font-mono uppercase">
                        {provider.type}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-400">ETA: <span className="text-teal-400 font-bold">{provider.time}</span></div>
                    <div className="text-sm font-semibold text-slate-300 mt-1">{provider.fare}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    {toCoords ? (
                      <>
                        <Button 
                          onClick={() => triggerSimulatedBooking(provider.name)}
                          className="bg-teal-500 hover:bg-teal-600 text-white rounded-2xl text-xs font-bold py-2 px-4 shadow-md shadow-teal-500/10"
                        >
                          Simulate Booking
                        </Button>
                        <a href={provider.link} target="_blank" rel="noopener noreferrer" className="shrink-0">
                          <Button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl text-xs font-bold py-2 px-4">
                            Open App
                          </Button>
                        </a>
                      </>
                    ) : (
                      <Button disabled className="bg-white/5 text-slate-500 rounded-2xl text-xs font-bold py-2 px-4 border border-white/5 cursor-not-allowed">
                        Awaiting Location
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}

