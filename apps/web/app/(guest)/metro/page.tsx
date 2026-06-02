'use client';

import { useState } from 'react';
import { Clock, MapPin, Navigation, TrainFront, ChevronDown, ChevronUp, AlertCircle, RefreshCw } from 'lucide-react';
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@moon/ui';
import { Container } from '@/components/ui/container';
import {
  metroCities,
  searchMetroStations,
  calculateMetroFare,
  haversineDistance,
  type MetroCity,
  type MetroStation,
  type MetroLine,
} from '@/lib/metro-data';

export default function MetroPage() {
  const [selectedCity, setSelectedCity] = useState(metroCities[0]!);
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [fromStation, setFromStation] = useState<{ station: MetroStation; line: MetroLine } | null>(null);
  const [toStation, setToStation] = useState<{ station: MetroStation; line: MetroLine } | null>(null);
  const [fromResults, setFromResults] = useState<{ station: MetroStation; line: MetroLine }[]>([]);
  const [toResults, setToResults] = useState<{ station: MetroStation; line: MetroLine }[]>([]);
  const [showFromList, setShowFromList] = useState(false);
  const [showToList, setShowToList] = useState(false);

  // Line expansion state
  const [expandedLineId, setExpandedLineId] = useState<string | null>(null);

  const fare =
    fromStation && toStation
      ? calculateMetroFare(
          selectedCity,
          haversineDistance(
            fromStation.station.lat,
            fromStation.station.lng,
            toStation.station.lat,
            toStation.station.lng
          )
        )
      : null;

  const distance =
    fromStation && toStation
      ? haversineDistance(
          fromStation.station.lat,
          fromStation.station.lng,
          toStation.station.lat,
          toStation.station.lng
        )
      : null;

  const totalStations = selectedCity.lines.reduce((sum, l) => sum + l.stations.length, 0);

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden pb-16 pt-16">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-violet-500/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-[10%] h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[100px] -z-10" />

      <Container className="max-w-6xl py-8 space-y-8">
        
        {/* Header branding */}
        <section className="space-y-4 border-b border-white/5 pb-6">
          <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20 font-bold px-3 py-1 rounded-xl">
            Metro Network Navigator
          </Badge>
          <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
            Indian Metro Systems.
          </h1>
          <p className="max-w-2xl text-base text-slate-400 sm:text-lg">
            Interactive fare calculator, station details, timings, and route planners for major transit grids.
          </p>
        </section>

        {/* City Selector */}
        <div className="flex flex-wrap gap-2.5">
          {metroCities.map((city) => (
            <button
              key={city.id}
              onClick={() => {
                setSelectedCity(city);
                setFromStation(null);
                setToStation(null);
                setFromQuery('');
                setToQuery('');
                setExpandedLineId(null);
              }}
              className={`rounded-2xl px-5 py-3 text-xs font-bold transition-all duration-200 ${
                selectedCity.id === city.id
                  ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/20'
                  : 'bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>

        {/* City Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Lines Grid', value: selectedCity.lines.length, desc: 'Operational corridors' },
            { label: 'System Stations', value: totalStations, desc: 'Total terminal nodes' },
            { label: 'Base Fare', value: `₹${selectedCity.baseFare}`, desc: 'Entry-level tariff' },
            { label: 'Max Fare Slabs', value: `₹${selectedCity.fareSlabs[selectedCity.fareSlabs.length - 1]?.fare}`, desc: 'Maximum capping fare' },
          ].map((stat, i) => (
            <Card key={i} className="border-white/10 bg-white/[0.02] backdrop-blur-md rounded-2xl p-5">
              <CardContent className="p-0">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className="mt-2 text-3xl font-extrabold text-white tracking-tight">{stat.value}</p>
                <p className="text-[10px] text-slate-400 mt-1">{stat.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Fare Calculator Card */}
        <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl overflow-hidden rounded-[2.5rem]">
          <CardHeader className="bg-gradient-to-r from-violet-600/10 to-purple-600/10 border-b border-white/5 px-6 py-5">
            <CardTitle className="text-white text-xl">Fare Calculator</CardTitle>
            <CardDescription className="text-slate-400">
              Select origin and destination nodes in {selectedCity.fullName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="relative">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">From Station</label>
                <input
                  value={fromQuery}
                  onChange={(e) => {
                    setFromQuery(e.target.value);
                    setFromResults(searchMetroStations(selectedCity.id, e.target.value));
                    setShowFromList(true);
                  }}
                  onFocus={() => fromResults.length > 0 && setShowFromList(true)}
                  placeholder="Search station..."
                  className="w-full px-4 py-3 bg-slate-950/60 border border-white/5 rounded-2xl text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/25 outline-none transition"
                  autoComplete="off"
                />
                {showFromList && fromResults.length > 0 && (
                  <ul className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950 shadow-2xl divide-y divide-white/5">
                    {fromResults.map((r) => (
                      <li key={r.station.id}>
                        <button
                          onClick={() => { setFromStation(r); setFromQuery(r.station.name); setShowFromList(false); }}
                          type="button"
                          className="w-full px-4 py-3 text-left hover:bg-white/5 transition flex items-center justify-between gap-3 text-sm text-slate-300"
                        >
                          <span className="font-bold text-white">{r.station.name}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.line.colorHex }} />
                            <span className="text-[10px] font-semibold text-slate-400">{r.line.name}</span>
                            {r.station.interchange && (
                              <span className="ml-1 text-[10px] text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded-md font-bold">Interchange</span>
                            )}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="relative">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">To Station</label>
                <input
                  value={toQuery}
                  onChange={(e) => {
                    setToQuery(e.target.value);
                    setToResults(searchMetroStations(selectedCity.id, e.target.value));
                    setShowToList(true);
                  }}
                  onFocus={() => toResults.length > 0 && setShowToList(true)}
                  placeholder="Search station..."
                  className="w-full px-4 py-3 bg-slate-950/60 border border-white/5 rounded-2xl text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/25 outline-none transition"
                  autoComplete="off"
                />
                {showToList && toResults.length > 0 && (
                  <ul className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950 shadow-2xl divide-y divide-white/5">
                    {toResults.map((r) => (
                      <li key={r.station.id}>
                        <button
                          onClick={() => { setToStation(r); setToQuery(r.station.name); setShowToList(false); }}
                          type="button"
                          className="w-full px-4 py-3 text-left hover:bg-white/5 transition flex items-center justify-between gap-3 text-sm text-slate-300"
                        >
                          <span className="font-bold text-white">{r.station.name}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.line.colorHex }} />
                            <span className="text-[10px] font-semibold text-slate-400">{r.line.name}</span>
                            {r.station.interchange && (
                              <span className="ml-1 text-[10px] text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded-md font-bold">Interchange</span>
                            )}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Fare Result split container */}
            {fare !== null && distance !== null && (
              <div className="rounded-[2rem] bg-violet-500/10 border border-violet-500/20 p-6 flex flex-col md:flex-row justify-between items-center gap-6 mt-6 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="grid gap-6 grid-cols-3 flex-1 w-full">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">Estimated Fare</p>
                    <p className="mt-1 text-3xl font-extrabold text-white">₹{fare}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">Distance</p>
                    <p className="mt-1 text-3xl font-extrabold text-white">{distance.toFixed(1)} km</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">Est. Travel Time</p>
                    <p className="mt-1 text-3xl font-extrabold text-white">{Math.round(distance * 3 + 5)} min</p>
                  </div>
                </div>
                
                <div className="shrink-0 text-center md:text-right border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
                  <span className="text-[10px] text-slate-400 font-bold block">COMMUTE ROUTE</span>
                  <span className="text-white font-bold block mt-1 break-words">{fromStation?.station.name} → {toStation?.station.name}</span>
                  {fromStation?.line.id !== toStation?.line.id && (
                    <span className="inline-block mt-2 text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded-lg">
                      Line transfer required
                    </span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fare Slabs breakdown */}
        <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="text-white text-lg">System Fare Structure</CardTitle>
            <CardDescription className="text-slate-400">{selectedCity.fullName} fare capping matrices</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {selectedCity.fareSlabs.map((slab, i) => {
              const prevMax = i > 0 ? selectedCity.fareSlabs[i - 1]!.maxKm : 0;
              return (
                <div key={i} className="flex items-center justify-between rounded-2xl bg-slate-950/40 border border-white/5 p-4">
                  <span className="text-xs text-slate-400 font-medium">
                    {prevMax === 0 ? '0' : prevMax} to {slab.maxKm > 100 ? '32+' : slab.maxKm} km
                  </span>
                  <span className="text-base font-extrabold text-white">₹{slab.fare}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Metro Lines with collapsible inline station timeline map */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">{selectedCity.name} Metro Lines Corridors</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            {selectedCity.lines.map((line) => {
              const isExpanded = expandedLineId === line.id;
              
              return (
                <Card 
                  key={line.id} 
                  className="border-white/10 bg-white/[0.02] backdrop-blur-md rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-300 flex flex-col"
                  style={{ boxShadow: isExpanded ? `0 0 20px ${line.colorHex}15` : '' }}
                >
                  <div className="h-2" style={{ backgroundColor: line.colorHex }} />
                  <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-2xl border"
                          style={{ backgroundColor: `${line.colorHex}10`, borderColor: `${line.colorHex}25`, color: line.colorHex }}
                        >
                          <TrainFront className="h-5.5 w-5.5" />
                        </div>
                        <div>
                          <p className="font-extrabold text-white text-base leading-tight">{line.name}</p>
                          <p className="text-[10px] text-slate-400 mt-1 font-semibold">{line.stations.length} Active Nodes</p>
                        </div>
                      </div>
                      <div className="text-right text-xs text-slate-400">
                        <div className="flex items-center gap-1 font-medium bg-white/[0.04] px-2.5 py-1 rounded-xl border border-white/5">
                          <Clock className="h-3.5 w-3.5" />
                          {line.firstTrain} – {line.lastTrain}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center justify-between border-t border-white/5 pt-3">
                      <span className="font-semibold tracking-wide truncate max-w-[200px]">
                        {line.stations[0]?.name} ↔ {line.stations[line.stations.length - 1]?.name}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px] font-bold p-1 hover:bg-white/5 rounded-lg"
                        onClick={() => setExpandedLineId(isExpanded ? null : line.id)}
                      >
                        {isExpanded ? (
                          <>
                            Hide Stations
                            <ChevronUp className="h-3.5 w-3.5" />
                          </>
                        ) : (
                          <>
                            Show Stations
                            <ChevronDown className="h-3.5 w-3.5" />
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Inline Collapsible Station Timeline */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-white/5 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300 max-h-64 overflow-y-auto pr-1">
                        <div className="relative pl-6 space-y-4">
                          <div className="absolute top-1 left-2.5 w-0.5 bottom-1 bg-white/10" />
                          {line.stations.map((station, sIdx) => {
                            const isInterchange = station.interchange && station.interchange.length > 0;
                            return (
                              <div key={station.id} className="relative flex items-center justify-between gap-4 text-left">
                                <div className="absolute -left-5 h-3.5 w-3.5 rounded-full border-2 bg-slate-900 border-white/20 flex items-center justify-center">
                                  <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: line.colorHex }} />
                                </div>
                                
                                <div>
                                  <span className="font-bold text-white text-xs block">{station.name}</span>
                                  <span className="text-[9px] text-slate-500 font-mono">ID: {station.id} · Lat: {station.lat.toFixed(4)}, Lng: {station.lng.toFixed(4)}</span>
                                </div>

                                {isInterchange && (
                                  <span className="text-[8px] bg-brand-500/10 border border-brand-500/20 text-brand-400 font-extrabold px-1.5 py-0.5 rounded uppercase shrink-0">
                                    Interchange
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </Container>
    </main>
  );
}

