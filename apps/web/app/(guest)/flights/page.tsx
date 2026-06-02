'use client';

import { useState, useRef } from 'react';
import { ArrowLeftRight, Calendar, PlaneTakeoff, Search, Users, ShieldAlert, Sparkles, Star, ChevronDown, Check, Briefcase } from 'lucide-react';
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@moon/ui';
import { Container } from '@/components/ui/container';
import { searchAirports, type Airport } from '@/lib/airports';

interface FlightResult {
  id: string;
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  duration: string;
  from: string;
  to: string;
  price: number;
  seatsLeft: number;
  stops: number;
  aircraft: string;
}

const AIRLINES = [
  { code: '6E', name: 'IndiGo', color: '#0055a0' },
  { code: 'AI', name: 'Air India', color: '#d72638' },
  { code: 'SG', name: 'SpiceJet', color: '#ff6600' },
  { code: 'UK', name: 'Vistara', color: '#472148' },
  { code: 'I5', name: 'AirAsia India', color: '#e70000' },
  { code: 'QP', name: 'Akasa Air', color: '#ff6f0e' },
  { code: 'G8', name: 'Go First', color: '#fecc00' },
  { code: 'IX', name: 'Air India Express', color: '#e84228' },
];

function generateFlightResults(from: Airport, to: Airport): FlightResult[] {
  const baseDist = Math.sqrt((from.lat - to.lat) ** 2 + (from.lng - to.lng) ** 2);
  const durationMins = Math.round(baseDist * 6 + 60);

  return Array.from({ length: 8 }, (_, i) => {
    const airline = AIRLINES[i % AIRLINES.length]!;
    const depHour = 5 + i * 2 + (i % 3);
    const depMin = (i * 17) % 60;
    const arrMins = depHour * 60 + depMin + durationMins + (i % 2 === 0 ? 0 : 30);
    return {
      id: `FL-${i}`,
      airline: airline.name,
      flightNumber: `${airline.code} ${100 + Math.floor(Math.random() * 900)}`,
      departure: `${String(depHour % 24).padStart(2, '0')}:${String(depMin).padStart(2, '0')}`,
      arrival: `${String(Math.floor(arrMins / 60) % 24).padStart(2, '0')}:${String(arrMins % 60).padStart(2, '0')}`,
      duration: `${Math.floor(durationMins / 60)}h ${durationMins % 60}m`,
      from: from.iata,
      to: to.iata,
      price: 2500 + i * 500 + Math.floor(Math.random() * 1000),
      seatsLeft: Math.floor(Math.random() * 40) + 1,
      stops: i % 4 === 3 ? 1 : 0,
      aircraft: i % 2 === 0 ? 'Airbus A320neo' : 'Boeing 737 MAX',
    };
  });
}

export default function FlightsPage() {
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [fromAirport, setFromAirport] = useState<Airport | null>(null);
  const [toAirport, setToAirport] = useState<Airport | null>(null);
  const [fromSuggestions, setFromSuggestions] = useState<Airport[]>([]);
  const [toSuggestions, setToSuggestions] = useState<Airport[]>([]);
  const [showFromList, setShowFromList] = useState(false);
  const [showToList, setShowToList] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [passengers, setPassengers] = useState(1);
  const [cabin, setCabin] = useState<'economy' | 'business'>('economy');
  const [results, setResults] = useState<FlightResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'departure' | 'duration'>('price');
  
  // Baggage addon state simulation
  const [extraBaggage, setExtraBaggage] = useState(false);
  const [mealPlan, setMealPlan] = useState(false);

  const fromTimer = useRef<NodeJS.Timeout | null>(null);
  const toTimer = useRef<NodeJS.Timeout | null>(null);

  const handleFromInput = (val: string) => {
    setFromQuery(val);
    if (fromTimer.current) clearTimeout(fromTimer.current);
    fromTimer.current = setTimeout(() => { setFromSuggestions(searchAirports(val)); setShowFromList(true); }, 200);
  };

  const handleToInput = (val: string) => {
    setToQuery(val);
    if (toTimer.current) clearTimeout(toTimer.current);
    toTimer.current = setTimeout(() => { setToSuggestions(searchAirports(val)); setShowToList(true); }, 200);
  };

  const selectFrom = (a: Airport) => { setFromAirport(a); setFromQuery(`${a.city} (${a.iata})`); setShowFromList(false); };
  const selectTo = (a: Airport) => { setToAirport(a); setToQuery(`${a.city} (${a.iata})`); setShowToList(false); };

  const swapAirports = () => {
    const tmp = fromAirport; setFromAirport(toAirport); setToAirport(tmp);
    const tmpQ = fromQuery; setFromQuery(toQuery); setToQuery(tmpQ);
  };

  const handleSearch = () => {
    if (!fromAirport || !toAirport) return;
    setIsSearching(true);
    setTimeout(() => {
      setResults(generateFlightResults(fromAirport, toAirport));
      setIsSearching(false);
    }, 700);
  };

  const sorted = [...results].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'duration') return a.duration.localeCompare(b.duration);
    return a.departure.localeCompare(b.departure);
  });

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden pb-16 pt-16">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-[10%] h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[100px] -z-10" />

      <Container className="max-w-6xl py-8 space-y-8">
        
        {/* Header branding */}
        <section className="space-y-4 border-b border-white/5 pb-6">
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-bold px-3 py-1 rounded-xl">
            Aviation Link
          </Badge>
          <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
            Book Flights Across India.
          </h1>
          <p className="max-w-2xl text-base text-slate-400 sm:text-lg">
            Compare IndiGo, Air India, SpiceJet, Vistara, Akasa, and more. {AIRLINES.length} carriers, 50+ airports instantly mapped.
          </p>
        </section>

        {/* Flight Search Console Card */}
        <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl overflow-hidden rounded-[2.5rem]">
          <CardHeader className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-b border-white/5 px-6 py-5">
            <CardTitle className="text-white text-xl">Search Flights</CardTitle>
            <CardDescription className="text-slate-400">
              Direct connection algorithms for domestic and international routes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] items-center relative">
              <div className="relative">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Origin</label>
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-500" />
                  <input
                    value={fromQuery}
                    onChange={(e) => handleFromInput(e.target.value)}
                    onFocus={() => fromSuggestions.length > 0 && setShowFromList(true)}
                    placeholder="Search city or airport code..."
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/5 rounded-2xl text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25 outline-none transition"
                    autoComplete="off"
                  />
                </div>
                {showFromList && fromSuggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950 shadow-2xl divide-y divide-white/5">
                    {fromSuggestions.map((a) => (
                      <li key={a.iata}>
                        <button 
                          onClick={() => selectFrom(a)} 
                          type="button" 
                          className="w-full px-4 py-3 text-left hover:bg-white/5 transition text-sm text-slate-300"
                        >
                          <span className="font-bold text-white">{a.iata}</span>
                          <span className="ml-2 text-xs text-slate-400">— {a.city}, {a.state}</span>
                          <span className="block text-[10px] text-slate-500 truncate mt-0.5">{a.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button 
                onClick={swapAirports} 
                className="self-end md:mb-1 p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition text-slate-400 hover:text-white"
              >
                <ArrowLeftRight className="h-5 w-5" />
              </button>

              <div className="relative">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Destination</label>
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-500" />
                  <input
                    value={toQuery}
                    onChange={(e) => handleToInput(e.target.value)}
                    onFocus={() => toSuggestions.length > 0 && setShowToList(true)}
                    placeholder="Search destination airport..."
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/5 rounded-2xl text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25 outline-none transition"
                    autoComplete="off"
                  />
                </div>
                {showToList && toSuggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950 shadow-2xl divide-y divide-white/5">
                    {toSuggestions.map((a) => (
                      <li key={a.iata}>
                        <button 
                          onClick={() => selectTo(a)} 
                          type="button" 
                          className="w-full px-4 py-3 text-left hover:bg-white/5 transition text-sm text-slate-300"
                        >
                          <span className="font-bold text-white">{a.iata}</span>
                          <span className="ml-2 text-xs text-slate-400">— {a.city}, {a.state}</span>
                          <span className="block text-[10px] text-slate-500 truncate mt-0.5">{a.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4 pt-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Departure Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  className="w-full px-4 py-3 bg-slate-950/60 border border-white/5 rounded-2xl text-sm text-white focus:border-blue-500 focus:outline-none transition" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Passengers</label>
                <select 
                  value={passengers} 
                  onChange={(e) => setPassengers(Number(e.target.value))} 
                  className="w-full px-4 py-3 bg-slate-950/60 border border-white/5 rounded-2xl text-sm text-white focus:border-blue-500 focus:outline-none transition appearance-none"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n} className="bg-slate-950">{n} Passenger{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Cabin Tier</label>
                <select 
                  value={cabin} 
                  onChange={(e) => setCabin(e.target.value as any)} 
                  className="w-full px-4 py-3 bg-slate-950/60 border border-white/5 rounded-2xl text-sm text-white focus:border-blue-500 focus:outline-none transition appearance-none"
                >
                  <option value="economy" className="bg-slate-950">Economy Class</option>
                  <option value="business" className="bg-slate-950">Business Class</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleSearch} 
                  disabled={!fromAirport || !toAirport || isSearching} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3 font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  {isSearching ? 'Searching Flights...' : 'Search Flights'}
                </Button>
              </div>
            </div>

            {/* Inclusions checklist */}
            <div className="flex items-center gap-6 pt-3 text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={extraBaggage} 
                  onChange={(e) => setExtraBaggage(e.target.checked)} 
                  className="rounded border-white/10 bg-slate-950 text-blue-500 focus:ring-0 focus:ring-offset-0" 
                />
                <span>Add Check-in Baggage (+₹750)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={mealPlan} 
                  onChange={(e) => setMealPlan(e.target.checked)} 
                  className="rounded border-white/10 bg-slate-950 text-blue-500 focus:ring-0 focus:ring-offset-0" 
                />
                <span>Pre-book In-flight Meal (+₹350)</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Popular Routes */}
        {results.length === 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-400" />
              Popular Domestic Sectors
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { from: 'DEL', to: 'BOM', price: '₹3,200', desc: 'Delhi to Mumbai Metro' },
                { from: 'BLR', to: 'DEL', price: '₹3,800', desc: 'Bengaluru to Delhi Corridor' },
                { from: 'BOM', to: 'GOI', price: '₹2,500', desc: 'Mumbai to Goa Leisure Link' },
                { from: 'DEL', to: 'BLR', price: '₹3,500', desc: 'Delhi to Bengaluru Techway' },
                { from: 'CCU', to: 'DEL', price: '₹4,100', desc: 'Kolkata to Delhi Link' },
                { from: 'HYD', to: 'BOM', price: '₹2,800', desc: 'Hyderabad to Mumbai' },
              ].map((route) => (
                <Card 
                  key={`${route.from}-${route.to}`} 
                  className="border-white/10 bg-white/[0.02] backdrop-blur-md rounded-2xl hover:border-blue-500/30 hover:bg-white/[0.04] transition cursor-pointer"
                >
                  <CardContent className="p-4 flex items-center justify-between gap-4 text-left">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <PlaneTakeoff className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{route.from} → {route.to}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{route.desc}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-white">{route.price}</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">One-way</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Results Queue */}
        {sorted.length > 0 && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-3">
              <h2 className="text-xl font-bold text-white">{sorted.length} flights scheduled today</h2>
              <div className="flex gap-1.5 bg-slate-950/40 rounded-xl p-1 border border-white/5">
                {(['price', 'departure', 'duration'] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSortBy(key)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                      sortBy === key ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sort by {key}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              {sorted.map((flight) => {
                const basePrice = cabin === 'business' ? flight.price * 2.2 : flight.price;
                const addonPrice = (extraBaggage ? 750 : 0) + (mealPlan ? 350 : 0);
                const finalPrice = Math.round((basePrice + addonPrice) * passengers);

                return (
                  <Card key={flight.id} className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-3xl overflow-hidden hover:border-blue-500/20 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-bold text-white text-lg">{flight.airline}</span>
                            <span className="text-xs text-slate-400 font-mono">{flight.flightNumber}</span>
                            <Badge className="bg-white/[0.05] text-slate-300 border-white/10 font-bold px-2 py-0.5 rounded-lg text-[10px]">
                              {flight.aircraft}
                            </Badge>
                            
                            {flight.stops === 0 ? (
                              <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-bold px-2 py-0.5 rounded-lg text-[10px]">Non-stop</Badge>
                            ) : (
                              <Badge className="bg-amber-500/10 text-amber-400 border-none font-bold px-2 py-0.5 rounded-lg text-[10px]">{flight.stops} stop</Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-6 text-slate-300">
                            <div>
                              <p className="text-2xl font-extrabold text-white tracking-tight">{flight.departure}</p>
                              <p className="text-xs text-slate-400 mt-1">{flight.from}</p>
                            </div>
                            <div className="flex flex-col items-center min-w-[100px]">
                              <p className="text-[10px] text-slate-500 font-medium">{flight.duration}</p>
                              <div className="my-1.5 h-px w-full bg-gradient-to-r from-blue-500/20 via-blue-500 to-indigo-500/20 relative">
                                <PlaneTakeoff className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-400" />
                              </div>
                            </div>
                            <div>
                              <p className="text-2xl font-extrabold text-white tracking-tight">{flight.arrival}</p>
                              <p className="text-xs text-slate-400 mt-1">{flight.to}</p>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0 flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
                          <div>
                            <p className="text-3xl font-extrabold text-white">₹{finalPrice.toLocaleString()}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Total for {passengers} Pax ({cabin === 'business' ? 'Biz' : 'Eco'})</p>
                            <p className={`text-xs font-bold mt-1.5 ${flight.seatsLeft < 5 ? 'text-red-400' : 'text-emerald-400'}`}>
                              {flight.seatsLeft} seat{flight.seatsLeft !== 1 ? 's' : ''} left
                            </p>
                          </div>
                          
                          <Button 
                            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-2.5 px-6 shadow-md shadow-blue-500/10 font-bold"
                            onClick={() => {
                              alert(`Simulated checkout created for ${flight.airline} ${flight.flightNumber}. Cabin: ${cabin.toUpperCase()}. Seats: ${passengers}. Total Price: ₹${finalPrice.toLocaleString()}`);
                            }}
                          >
                            Book Now
                          </Button>
                        </div>

                      </div>
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

