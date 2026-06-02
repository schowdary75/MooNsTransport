'use client';

import { useState, useRef } from 'react';
import { ArrowLeftRight, Calendar, Clock, Search, TrainFront, Users, Star, Sparkles, X, CheckCircle, HelpCircle } from 'lucide-react';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@moon/ui';
import { Container } from '@/components/ui/container';
import { searchStations, trainClasses, famousTrains, type Station } from '@/lib/stations';

type TrainClass = '1A' | '2A' | '3A' | '3E' | 'SL' | 'CC' | '2S' | 'EA';

interface TrainResult {
  number: string;
  name: string;
  from: { code: string; name: string; depart: string };
  to: { code: string; name: string; arrive: string };
  duration: string;
  type: string;
  classes: { code: TrainClass; available: number; fare: number }[];
  days: string[];
}

function generateMockResults(fromCode: string, toCode: string): TrainResult[] {
  const types = ['Rajdhani', 'Shatabdi', 'Vande Bharat', 'Superfast', 'Express', 'Mail', 'Duronto'];
  const names = [
    'Rajdhani Express', 'Shatabdi Express', 'Vande Bharat Express',
    'Garib Rath', 'Duronto Express', 'Sampark Kranti', 'Jan Shatabdi',
    'Superfast Express', 'Karnataka Express', 'Tamil Nadu Express',
  ];

  return Array.from({ length: 6 }, (_, i) => {
    const type = types[i % types.length]!;
    const depart = `${String(5 + i * 3).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`;
    const durHours = 8 + Math.floor(Math.random() * 24);
    const arrHour = (parseInt(depart) + durHours) % 24;
    return {
      number: String(12000 + Math.floor(Math.random() * 900)),
      name: names[i % names.length]!,
      from: { code: fromCode, name: fromCode, depart },
      to: { code: toCode, name: toCode, arrive: `${String(arrHour).padStart(2, '0')}:${i % 2 === 0 ? '45' : '15'}` },
      duration: `${durHours}h ${(i * 17) % 60}m`,
      type,
      classes: [
        { code: '1A' as TrainClass, available: Math.floor(Math.random() * 10), fare: 2800 + i * 200 },
        { code: '2A' as TrainClass, available: Math.floor(Math.random() * 30) + 5, fare: 1600 + i * 120 },
        { code: '3A' as TrainClass, available: Math.floor(Math.random() * 60) + 10, fare: 1100 + i * 80 },
        { code: 'SL' as TrainClass, available: Math.floor(Math.random() * 100) + 20, fare: 400 + i * 40 },
      ],
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].filter(() => Math.random() > 0.3),
    };
  });
}

export default function TrainsPage() {
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [fromStation, setFromStation] = useState<Station | null>(null);
  const [toStation, setToStation] = useState<Station | null>(null);
  const [fromSuggestions, setFromSuggestions] = useState<Station[]>([]);
  const [toSuggestions, setToSuggestions] = useState<Station[]>([]);
  const [showFromList, setShowFromList] = useState(false);
  const [showToList, setShowToList] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState<TrainClass>('3A');
  const [results, setResults] = useState<TrainResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [pnr, setPnr] = useState('');
  
  // PNR query simulation state
  const [pnrDetails, setPnrDetails] = useState<any | null>(null);
  const [isCheckingPnr, setIsCheckingPnr] = useState(false);

  const fromTimer = useRef<NodeJS.Timeout | null>(null);
  const toTimer = useRef<NodeJS.Timeout | null>(null);

  const handleFromInput = (val: string) => {
    setFromQuery(val);
    if (fromTimer.current) clearTimeout(fromTimer.current);
    fromTimer.current = setTimeout(() => {
      setFromSuggestions(searchStations(val));
      setShowFromList(true);
    }, 200);
  };

  const handleToInput = (val: string) => {
    setToQuery(val);
    if (toTimer.current) clearTimeout(toTimer.current);
    toTimer.current = setTimeout(() => {
      setToSuggestions(searchStations(val));
      setShowToList(true);
    }, 200);
  };

  const selectFrom = (s: Station) => {
    setFromStation(s);
    setFromQuery(`${s.name} (${s.code})`);
    setShowFromList(false);
  };

  const selectTo = (s: Station) => {
    setToStation(s);
    setToQuery(`${s.name} (${s.code})`);
    setShowToList(false);
  };

  const handleSearch = () => {
    if (!fromStation || !toStation) return;
    setIsSearching(true);
    setPnrDetails(null);
    setTimeout(() => {
      setResults(generateMockResults(fromStation.code, toStation.code));
      setIsSearching(false);
    }, 800);
  };

  const swapStations = () => {
    const tmp = fromStation;
    setFromStation(toStation);
    setToStation(tmp);
    setFromQuery(toQuery);
    setToQuery(fromQuery);
  };

  const handleCheckPnr = () => {
    if (pnr.length < 5) return;
    setIsCheckingPnr(true);
    setResults([]);
    setTimeout(() => {
      setPnrDetails({
        pnr,
        trainName: 'Vande Bharat Express',
        trainNumber: '22436',
        date: '2026-06-15',
        from: 'NDLS (New Delhi)',
        to: 'BSBS (Varanasi)',
        paxList: [
          { name: 'Rider Alpha', status: 'CNF (Confirmed)', seat: 'Coach C4, Seat 24' },
          { name: 'Rider Beta', status: 'CNF (Confirmed)', seat: 'Coach C4, Seat 25' },
        ],
        platform: 'Platform 16',
      });
      setIsCheckingPnr(false);
    }, 1200);
  };

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden pb-16 pt-16">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-[10%] h-[500px] w-[500px] rounded-full bg-teal-500/5 blur-[100px] -z-10" />

      <Container className="max-w-6xl py-8 space-y-8">
        
        {/* Header branding */}
        <section className="space-y-4 border-b border-white/5 pb-6">
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold px-3 py-1 rounded-xl">
            Rail Link Hub
          </Badge>
          <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
            Search Trains Across India.
          </h1>
          <p className="max-w-2xl text-base text-slate-400 sm:text-lg">
            Find trains between stations, verify availability schedules, check live PNR status indexes.
          </p>
        </section>

        {/* Search Console Card */}
        <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl overflow-hidden rounded-[2.5rem]">
          <CardHeader className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border-b border-white/5 px-6 py-5">
            <CardTitle className="text-white text-xl">Search Trains</CardTitle>
            <CardDescription className="text-slate-400">
              Direct integration mappings for national railway network nodes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] items-center relative">
              <div className="relative">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">From Station</label>
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-500" />
                  <input
                    value={fromQuery}
                    onChange={(e) => handleFromInput(e.target.value)}
                    onFocus={() => fromSuggestions.length > 0 && setShowFromList(true)}
                    placeholder="e.g. New Delhi, NDLS"
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/5 rounded-2xl text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/25 outline-none transition"
                    autoComplete="off"
                  />
                </div>
                {showFromList && fromSuggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950 shadow-2xl divide-y divide-white/5">
                    {fromSuggestions.map((s) => (
                      <li key={s.code}>
                        <button 
                          onClick={() => selectFrom(s)} 
                          type="button" 
                          className="w-full px-4 py-3 text-left hover:bg-white/5 transition text-sm text-slate-300"
                        >
                          <span className="font-bold text-white">{s.code}</span>
                          <span className="ml-2 text-xs text-slate-400">— {s.name}, {s.city}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button 
                onClick={swapStations} 
                className="self-end md:mb-1 p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition text-slate-400 hover:text-white" 
                title="Swap stations"
              >
                <ArrowLeftRight className="h-5 w-5" />
              </button>

              <div className="relative">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">To Station</label>
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-500" />
                  <input
                    value={toQuery}
                    onChange={(e) => handleToInput(e.target.value)}
                    onFocus={() => toSuggestions.length > 0 && setShowToList(true)}
                    placeholder="e.g. Mumbai Central, BCT"
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/5 rounded-2xl text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/25 outline-none transition"
                    autoComplete="off"
                  />
                </div>
                {showToList && toSuggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950 shadow-2xl divide-y divide-white/5">
                    {toSuggestions.map((s) => (
                      <li key={s.code}>
                        <button 
                          onClick={() => selectTo(s)} 
                          type="button" 
                          className="w-full px-4 py-3 text-left hover:bg-white/5 transition text-sm text-slate-300"
                        >
                          <span className="font-bold text-white">{s.code}</span>
                          <span className="ml-2 text-xs text-slate-400">— {s.name}, {s.city}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 pt-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Journey Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  className="w-full px-4 py-3 bg-slate-950/60 border border-white/5 rounded-2xl text-sm text-white focus:border-emerald-500 focus:outline-none transition" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Travel Class</label>
                <select 
                  value={selectedClass} 
                  onChange={(e) => setSelectedClass(e.target.value as TrainClass)} 
                  className="w-full px-4 py-3 bg-slate-950/60 border border-white/5 rounded-2xl text-sm text-white focus:border-emerald-500 focus:outline-none transition appearance-none"
                >
                  {trainClasses.map((tc) => (
                    <option key={tc.code} value={tc.code} className="bg-slate-950">{tc.code} — {tc.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleSearch} 
                  disabled={!fromStation || !toStation || isSearching} 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl py-3 font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {isSearching ? 'Searching Trains...' : 'Search Trains'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PNR Check Console */}
        <Card className="border-white/10 bg-white/[0.02] backdrop-blur-md rounded-3xl">
          <CardContent className="flex flex-col sm:flex-row items-center gap-4 p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Search className="h-5 w-5" />
            </div>
            <div className="flex-1 w-full text-left">
              <p className="font-bold text-white text-sm">Check PNR Status Inquiry</p>
              <input
                value={pnr}
                onChange={(e) => setPnr(e.target.value)}
                placeholder="Enter 10-digit ticket PNR number (e.g. 1234567890)"
                className="mt-1.5 w-full bg-slate-950/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition font-mono"
              />
            </div>
            <Button 
              onClick={handleCheckPnr}
              disabled={pnr.length < 5 || isCheckingPnr}
              className="rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-2.5 px-6 shrink-0 w-full sm:w-auto"
            >
              {isCheckingPnr ? 'Checking...' : 'Check Status'}
            </Button>
          </CardContent>
        </Card>

        {/* PNR inquiry results overlay display */}
        {pnrDetails && (
          <Card className="border-amber-500/20 bg-amber-500/5 backdrop-blur-xl rounded-[2.5rem] p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">PNR Inquiry Successful</span>
                <h3 className="text-lg font-extrabold text-white mt-0.5">{pnrDetails.trainName} (#{pnrDetails.trainNumber})</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5"
                onClick={() => setPnrDetails(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 text-xs text-slate-300 text-left">
              <div className="bg-slate-950/40 border border-white/5 p-4 rounded-2xl">
                <span className="text-slate-500 font-semibold block">Route</span>
                <span className="text-white font-bold block mt-1">{pnrDetails.from} → {pnrDetails.to}</span>
              </div>
              <div className="bg-slate-950/40 border border-white/5 p-4 rounded-2xl">
                <span className="text-slate-500 font-semibold block">Departing Date & Platform</span>
                <span className="text-white font-bold block mt-1">{pnrDetails.date} · {pnrDetails.platform}</span>
              </div>
            </div>

            <div className="space-y-2.5 text-left">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Passenger Seat Manifest</span>
              <div className="space-y-2 bg-slate-950/60 border border-white/5 p-4 rounded-2xl">
                {pnrDetails.paxList.map((pax: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-xs pb-2 border-b border-white/5 last:border-0 last:pb-0">
                    <span className="font-bold text-white">{pax.name}</span>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-bold text-[9px]">{pax.status}</Badge>
                      <span className="font-mono text-slate-400">{pax.seat}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Famous Trains list */}
        {results.length === 0 && !pnrDetails && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              Famous Domestic Express routes
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {famousTrains.slice(0, 6).map((train) => (
                <Card 
                  key={train.number} 
                  className="border-white/10 bg-white/[0.02] backdrop-blur-md rounded-2xl hover:border-emerald-500/30 hover:bg-white/[0.04] transition cursor-pointer"
                >
                  <CardContent className="p-5 flex items-center gap-4 text-left">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <TrainFront className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <p className="font-bold text-white text-sm truncate">{train.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">#{train.number} · {train.from} → {train.to}</p>
                      <Badge className="bg-white/[0.04] text-slate-400 border-white/5 text-[9px] px-1.5 py-0.5 rounded font-mono uppercase">
                        {train.type}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Results list */}
        {results.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-xl font-bold text-white">
                {results.length} trains found matching schedule
              </h2>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-bold">Live seat indexes active</Badge>
            </div>

            <div className="grid gap-6">
              {results.map((train) => (
                <Card key={train.number} className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-3xl overflow-hidden hover:border-brand-500/30 transition-all duration-300">
                  <CardContent className="p-6 text-left">
                    
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-bold text-white text-lg">{train.name}</span>
                          <span className="text-xs text-slate-400 font-mono">#{train.number}</span>
                          <Badge className="bg-white/[0.04] text-slate-300 border-white/10 font-bold px-2 py-0.5 rounded-lg text-[10px]">
                            {train.type}
                          </Badge>
                        </div>

                        <div className="mt-3 flex items-center gap-6 text-slate-300">
                          <div>
                            <p className="text-2xl font-extrabold text-white tracking-tight">{train.from.depart}</p>
                            <p className="text-xs text-slate-400 mt-1">{train.from.code}</p>
                          </div>
                          <div className="flex flex-col items-center min-w-[100px]">
                            <p className="text-[10px] text-slate-500 font-medium">{train.duration}</p>
                            <div className="my-1.5 h-px w-full bg-gradient-to-r from-emerald-500/20 via-emerald-500 to-teal-500/20 relative">
                              <TrainFront className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 text-emerald-400" />
                            </div>
                            <p className="text-[9px] text-slate-500 font-semibold truncate max-w-[80px]">{train.days.join(', ')}</p>
                          </div>
                          <div>
                            <p className="text-2xl font-extrabold text-white tracking-tight">{train.to.arrive}</p>
                            <p className="text-xs text-slate-400 mt-1">{train.to.code}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 border-t border-white/5 pt-4">
                      {train.classes.map((cls) => {
                        const isAvail = cls.available > 0;
                        return (
                          <button
                            key={cls.code}
                            className={`rounded-2xl border p-4 text-left transition-all ${
                              isAvail
                                ? 'border-white/10 bg-slate-950/40 hover:border-brand-500/40 hover:bg-slate-950/70'
                                : 'border-red-500/10 bg-red-500/5 cursor-not-allowed opacity-50'
                            }`}
                            onClick={() => {
                              if (isAvail) {
                                alert(`Initiated booking on train ${train.name} (${train.number}) - Class: ${cls.code}. Fare: ₹${cls.fare.toLocaleString()}`);
                              }
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">{cls.code}</span>
                              <Badge className={isAvail ? 'bg-emerald-500/10 text-emerald-400 border-none font-bold text-[9px]' : 'bg-red-500/15 text-red-500 border-none font-bold text-[9px]'}>
                                {isAvail ? `AVL ${cls.available}` : 'SOLD OUT'}
                              </Badge>
                            </div>
                            <p className="mt-2 text-xl font-extrabold text-white">₹{cls.fare.toLocaleString()}</p>
                          </button>
                        );
                      })}
                    </div>

                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </Container>
    </main>
  );
}

