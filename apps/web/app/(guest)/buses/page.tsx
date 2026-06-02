'use client';

import { useState } from 'react';
import { ArrowLeftRight, BusFront, Calendar, Clock, Filter, MapPin, Sparkles, Star, Armchair } from 'lucide-react';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@moon/ui';
import { Container } from '@/components/ui/container';
import { formatPrice } from '@moon/utils';

const INDIAN_CITIES = [
  'Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune',
  'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Goa', 'Kochi', 'Indore',
  'Bhopal', 'Nagpur', 'Varanasi', 'Coimbatore', 'Mysuru', 'Mangaluru',
  'Thiruvananthapuram', 'Visakhapatnam', 'Udaipur', 'Jodhpur', 'Agra',
  'Dehradun', 'Rishikesh', 'Shimla', 'Manali', 'Ooty', 'Munnar',
];

const OPERATORS = [
  { id: 'ksrtc', name: 'KSRTC', state: 'Karnataka', rating: 4.2 },
  { id: 'tsrtc', name: 'TSRTC', state: 'Telangana', rating: 3.9 },
  { id: 'msrtc', name: 'MSRTC', state: 'Maharashtra', rating: 3.7 },
  { id: 'apsrtc', name: 'APSRTC', state: 'Andhra Pradesh', rating: 4.0 },
  { id: 'rsrtc', name: 'RSRTC', state: 'Rajasthan', rating: 3.8 },
  { id: 'upsrtc', name: 'UPSRTC', state: 'Uttar Pradesh', rating: 3.5 },
  { id: 'tnstc', name: 'TNSTC / SETC', state: 'Tamil Nadu', rating: 4.1 },
  { id: 'gsrtc', name: 'GSRTC', state: 'Gujarat', rating: 3.6 },
  { id: 'hrtc', name: 'HRTC', state: 'Himachal Pradesh', rating: 4.0 },
  { id: 'volvo-pvt', name: 'VRL Travels', state: 'Private', rating: 4.3 },
  { id: 'orange', name: 'Orange Travels', state: 'Private', rating: 4.1 },
  { id: 'srs', name: 'SRS Travels', state: 'Private', rating: 4.4 },
];

const BUS_TYPES = ['All', 'AC Sleeper', 'AC Seater', 'Non-AC Sleeper', 'Non-AC Seater', 'Volvo Multi-Axle', 'AC Semi-Sleeper'];

interface BusResult {
  id: string;
  operator: string;
  type: string;
  departure: string;
  arrival: string;
  duration: string;
  from: string;
  to: string;
  fare: number;
  rating: number;
  seatsAvailable: number;
  amenities: string[];
}

function generateBusResults(from: string, to: string): BusResult[] {
  const amenities = ['WiFi', 'Charging Point', 'Blanket', 'Water Bottle', 'Snacks', 'Movie', 'Track My Bus'];
  return Array.from({ length: 8 }, (_, i) => ({
    id: `BUS-${i}`,
    operator: OPERATORS[i % OPERATORS.length]!.name,
    type: BUS_TYPES[1 + (i % (BUS_TYPES.length - 1))]!,
    departure: `${String(18 + (i * 2) % 8).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
    arrival: `${String(4 + (i * 2) % 10).padStart(2, '0')}:${i % 2 === 0 ? '30' : '00'}`,
    duration: `${8 + (i % 5)}h ${(i * 13) % 60}m`,
    from,
    to,
    fare: 600 + i * 150 + Math.floor(Math.random() * 200),
    rating: 3.5 + Math.round(Math.random() * 10) / 10,
    seatsAvailable: Math.floor(Math.random() * 30) + 1,
    amenities: amenities.slice(0, 3 + (i % 4)),
  }));
}

export default function BusesPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [busType, setBusType] = useState('All');
  const [results, setResults] = useState<BusResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [showFromList, setShowFromList] = useState(false);
  const [showToList, setShowToList] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'departure' | 'rating'>('departure');
  
  // Interactive Seat Selection State
  const [seatSelectorBusId, setSeatSelectorBusId] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const handleCityInput = (val: string, setter: typeof setFromSuggestions) => {
    const q = val.toLowerCase();
    setter(q.length >= 2 ? INDIAN_CITIES.filter((c) => c.toLowerCase().includes(q)).slice(0, 8) : []);
  };

  const handleSearch = () => {
    if (!from || !to) return;
    setIsSearching(true);
    setSeatSelectorBusId(null);
    setSelectedSeats([]);
    setTimeout(() => {
      let results = generateBusResults(from, to);
      if (busType !== 'All') results = results.filter((r) => r.type === busType);
      setResults(results);
      setIsSearching(false);
    }, 600);
  };

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'price') return a.fare - b.fare;
    if (sortBy === 'rating') return b.rating - a.rating;
    return a.departure.localeCompare(b.departure);
  });

  const toggleSeat = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden pb-20 pt-16">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-orange-500/5 blur-[130px] -z-10" />
      <div className="absolute bottom-0 left-[10%] h-[500px] w-[500px] rounded-full bg-brand-500/5 blur-[120px] -z-10" />

      <Container className="max-w-6xl py-8 space-y-8">
        
        {/* Header branding */}
        <section className="space-y-4 border-b border-white/5 pb-6">
          <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 font-bold px-3 py-1 rounded-xl">
            Bus Booking Hub
          </Badge>
          <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
            Book buses across India.
          </h1>
          <p className="max-w-2xl text-base text-slate-400 sm:text-lg">
            Compare KSRTC, TSRTC, MSRTC, VRL, Orange, and 100+ private operators. Sleeper, Volvo, AC — synced in real time.
          </p>
        </section>

        {/* Search Console */}
        <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl overflow-hidden rounded-[2.5rem]">
          <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b border-white/5 px-6 py-5">
            <CardTitle className="text-white text-xl">Search Buses</CardTitle>
            <CardDescription className="text-slate-400">
              {OPERATORS.length} state & private operators · {INDIAN_CITIES.length} cities covered
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] items-center relative">
              
              <div className="relative">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">From City</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-500" />
                  <input
                    value={from}
                    onChange={(e) => { setFrom(e.target.value); handleCityInput(e.target.value, setFromSuggestions); setShowFromList(true); }}
                    placeholder="e.g. Bengaluru"
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/5 rounded-2xl text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/25 outline-none transition"
                    autoComplete="off"
                  />
                </div>
                {showFromList && fromSuggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 top-full z-50 mt-2 max-h-48 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950 shadow-2xl divide-y divide-white/5">
                    {fromSuggestions.map((c) => (
                      <li key={c}>
                        <button 
                          onClick={() => { setFrom(c); setShowFromList(false); }} 
                          type="button" 
                          className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/5 transition"
                        >
                          <MapPin className="h-4 w-4 text-slate-500" /> {c}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button 
                onClick={() => { const tmp = from; setFrom(to); setTo(tmp); }} 
                className="self-end md:mb-1 p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition text-slate-400 hover:text-white"
              >
                <ArrowLeftRight className="h-5 w-5" />
              </button>

              <div className="relative">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">To City</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-500" />
                  <input
                    value={to}
                    onChange={(e) => { setTo(e.target.value); handleCityInput(e.target.value, setToSuggestions); setShowToList(true); }}
                    placeholder="e.g. Mysuru"
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/5 rounded-2xl text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/25 outline-none transition"
                    autoComplete="off"
                  />
                </div>
                {showToList && toSuggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 top-full z-50 mt-2 max-h-48 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950 shadow-2xl divide-y divide-white/5">
                    {toSuggestions.map((c) => (
                      <li key={c}>
                        <button 
                          onClick={() => { setTo(c); setShowToList(false); }} 
                          type="button" 
                          className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/5 transition"
                        >
                          <MapPin className="h-4 w-4 text-slate-500" /> {c}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 pt-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Travel Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  className="w-full px-4 py-3 bg-slate-950/60 border border-white/5 rounded-2xl text-sm text-white focus:border-orange-500 focus:outline-none transition" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Bus Type</label>
                <select 
                  value={busType} 
                  onChange={(e) => setBusType(e.target.value)} 
                  className="w-full px-4 py-3 bg-slate-950/60 border border-white/5 rounded-2xl text-sm text-white focus:border-orange-500 focus:outline-none transition appearance-none"
                >
                  {BUS_TYPES.map((t) => <option key={t} value={t} className="bg-slate-950">{t}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleSearch} 
                  disabled={!from || !to || isSearching} 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-2xl py-3 font-semibold shadow-lg shadow-orange-500/20 disabled:opacity-50"
                >
                  {isSearching ? 'Searching Operators...' : 'Search Available Buses'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* State Transport Corporations */}
        {results.length === 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-400" />
              State Transport Networks
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {OPERATORS.slice(0, 8).map((op) => (
                <Card key={op.id} className="border-white/10 bg-white/[0.02] backdrop-blur-md rounded-2xl hover:border-orange-500/30 transition hover:bg-white/[0.04]">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        <BusFront className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{op.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{op.state} · ★ {op.rating}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Results Queue */}
        {sortedResults.length > 0 && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-3">
              <h2 className="text-xl font-bold text-white">{sortedResults.length} buses matching schedule</h2>
              <div className="flex gap-1.5 bg-slate-950/40 rounded-xl p-1 border border-white/5">
                {(['departure', 'price', 'rating'] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSortBy(key)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                      sortBy === key ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sort by {key}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              {sortedResults.map((bus) => {
                const isSelectingSeats = seatSelectorBusId === bus.id;
                
                return (
                  <Card key={bus.id} className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-3xl overflow-hidden transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-bold text-white text-lg">{bus.operator}</span>
                            <Badge className="bg-white/[0.05] text-slate-300 border-white/10 font-bold px-2 py-0.5 rounded-lg text-[10px]">
                              {bus.type}
                            </Badge>
                            <Badge className="bg-amber-500/10 text-amber-400 border-none font-bold px-2 py-0.5 rounded-lg text-[10px] flex items-center gap-1">
                              <Star className="h-3 w-3 fill-current" /> {bus.rating}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-6 text-slate-300">
                            <div>
                              <p className="text-2xl font-extrabold text-white tracking-tight">{bus.departure}</p>
                              <p className="text-xs text-slate-400 mt-1">{bus.from}</p>
                            </div>
                            <div className="flex flex-col items-center min-w-[80px]">
                              <p className="text-[10px] text-slate-500 font-medium">{bus.duration}</p>
                              <div className="my-1.5 h-px w-full bg-gradient-to-r from-orange-500/20 via-orange-500 to-red-500/20 relative">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-orange-400" />
                              </div>
                              <p className="text-[9px] text-slate-500">Direct Route</p>
                            </div>
                            <div>
                              <p className="text-2xl font-extrabold text-white tracking-tight">{bus.arrival}</p>
                              <p className="text-xs text-slate-400 mt-1">{bus.to}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                            {bus.amenities.map((a) => (
                              <span key={a} className="rounded-lg bg-white/[0.04] border border-white/5 px-2.5 py-1 text-[10px] text-slate-400 font-semibold">{a}</span>
                            ))}
                          </div>
                        </div>

                        <div className="text-right shrink-0 flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
                          <div>
                            <p className="text-3xl font-extrabold text-white">₹{bus.fare}</p>
                            <p className={`text-xs font-bold mt-1 ${bus.seatsAvailable < 5 ? 'text-red-400' : 'text-emerald-400'}`}>
                              {bus.seatsAvailable} seats available
                            </p>
                          </div>
                          <Button 
                            className="mt-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl py-2 px-6 shadow-md shadow-orange-500/10 font-bold"
                            onClick={() => {
                              if (isSelectingSeats) {
                                setSeatSelectorBusId(null);
                                setSelectedSeats([]);
                              } else {
                                setSeatSelectorBusId(bus.id);
                                setSelectedSeats([]);
                              }
                            }}
                          >
                            {isSelectingSeats ? 'Cancel Selection' : 'Select Seat'}
                          </Button>
                        </div>
                      </div>

                      {/* Interactive Seat Selection Area */}
                      {isSelectingSeats && (
                        <div className="mt-6 pt-6 border-t border-white/5 grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-4 duration-300">
                          {/* Seat map */}
                          <div className="bg-slate-950/50 border border-white/5 p-6 rounded-[2rem] flex flex-col items-center">
                            <div className="w-full flex justify-between items-center text-xs text-slate-400 mb-6 border-b border-white/5 pb-3">
                              <span className="font-bold uppercase tracking-wider">Driver Cabin</span>
                              <div className="h-6 w-6 rounded-full border border-white/20 flex items-center justify-center text-[10px]">steering wheel</div>
                            </div>
                            
                            {/* Seats Grid */}
                            <div className="grid grid-cols-4 gap-3 max-w-[240px]">
                              {Array.from({ length: 24 }).map((_, idx) => {
                                const row = Math.floor(idx / 4) + 1;
                                const col = (idx % 4) + 1;
                                const seatNum = `${row}${String.fromCharCode(64 + col)}`;
                                const isOccupied = idx % 5 === 2 || idx === 11;
                                const isChosen = selectedSeats.includes(seatNum);
                                
                                // Walkway space in middle (between column 2 and 3)
                                const isLeftColumn = col <= 2;
                                
                                return (
                                  <button
                                    key={seatNum}
                                    disabled={isOccupied}
                                    onClick={() => toggleSeat(seatNum)}
                                    className={`h-10 w-10 rounded-xl flex items-center justify-center border transition-all ${
                                      isOccupied
                                        ? 'bg-white/[0.01] border-white/5 text-slate-700 cursor-not-allowed'
                                        : isChosen
                                        ? 'bg-orange-500 border-orange-600 text-white shadow-md shadow-orange-500/20'
                                        : 'bg-white/[0.03] border-white/10 text-slate-400 hover:border-orange-500/40 hover:bg-white/5'
                                    } ${col === 3 ? 'ml-6' : ''}`}
                                    title={isOccupied ? `Seat ${seatNum} (Occupied)` : `Seat ${seatNum}`}
                                  >
                                    <Armchair className="h-5.5 w-5.5" />
                                  </button>
                                );
                              })}
                            </div>

                            <div className="flex gap-4 mt-6 text-xs text-slate-400 flex-wrap justify-center">
                              <div className="flex items-center gap-1.5">
                                <div className="h-4.5 w-4.5 rounded-md bg-white/[0.03] border border-white/10" />
                                <span>Available</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <div className="h-4.5 w-4.5 rounded-md bg-white/[0.01] border border-white/5 text-slate-700 flex items-center justify-center"><Armchair className="h-3 w-3" /></div>
                                <span>Occupied</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <div className="h-4.5 w-4.5 rounded-md bg-orange-500" />
                                <span>Selected</span>
                              </div>
                            </div>
                          </div>

                          {/* Pricing & Booking flow */}
                          <div className="flex flex-col justify-between space-y-6">
                            <div className="space-y-4">
                              <h4 className="font-bold text-white text-base">Seat Summary</h4>
                              <p className="text-xs text-slate-400">Review selected seat assignments and fare details.</p>

                              <div className="bg-slate-950/40 border border-white/5 p-4 rounded-2xl space-y-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Selected Seats</span>
                                  <span className="font-mono text-white font-bold">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None selected'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Base Fare ({selectedSeats.length} seat)</span>
                                  <span className="text-white font-bold">{formatPrice(selectedSeats.length * bus.fare)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Booking Surcharge</span>
                                  <span className="text-white font-bold">{formatPrice(selectedSeats.length > 0 ? 30 : 0)}</span>
                                </div>
                                <div className="flex justify-between border-t border-white/5 pt-3 text-white font-bold text-base">
                                  <span>Total Fare</span>
                                  <span className="text-orange-400 font-extrabold">{formatPrice(selectedSeats.length * bus.fare + (selectedSeats.length > 0 ? 30 : 0))}</span>
                                </div>
                              </div>
                            </div>

                            <Button 
                              disabled={selectedSeats.length === 0}
                              className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-2xl py-3 font-bold shadow-lg shadow-orange-500/20 disabled:opacity-40"
                              onClick={() => {
                                alert(`Simulated booking successful for seats ${selectedSeats.join(', ')} on ${bus.operator}.`);
                              }}
                            >
                              Confirm and Book Now
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </Container>
    </main>
  );
}

