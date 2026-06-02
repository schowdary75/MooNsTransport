'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Bell,
  Briefcase,
  BusFront,
  Clock3,
  Home as HomeIcon,
  Navigation,
  PlaneTakeoff,
  Route,
  ShieldCheck,
  Sparkles,
  TrainFront,
  Wifi,
  Search,
  MapPin,
  MapPinned,
  ChevronRight,
  TrendingUp,
  Map as MapIcon,
  ArrowUpDown,
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

import { cities, sampleRoutes, suggestions } from '../lib/site-data';
import { HomeMapSection } from '@/components/home/HomeMapSection';
import { savedPlaces } from '../lib/saved-places-data';
import { geocodeAddress } from '@/lib/nominatim';

interface Suggestion {
  lat: string;
  lon: string;
  displayName: string;
}

const serviceAlertsByCity: Record<string, Array<{ label: string; status: string; detail: string; tone: 'success' | 'warning' | 'neutral' }>> = {
  delhi: [
    {
      label: 'DMRC Blue Line',
      status: 'On time',
      detail: 'Peak-hour frequency is steady with no service advisories.',
      tone: 'success',
    },
    {
      label: 'DMRC Yellow Line',
      status: 'Minor delay',
      detail: 'Track maintenance at Rajiv Chowk causing 3-5 min delays.',
      tone: 'warning',
    },
    {
      label: 'Airport Express',
      status: 'Healthy',
      detail: 'High speed transfers running at 10-minute intervals.',
      tone: 'success',
    },
  ],
  mumbai: [
    {
      label: 'Mumbai Metro 1',
      status: 'Minor delay',
      detail: 'Signal testing at Andheri causing minor delays of 4 minutes.',
      tone: 'warning',
    },
    {
      label: 'BEST Western Corridor',
      status: 'On time',
      detail: 'Bus lanes active. Normal travel schedules reported.',
      tone: 'success',
    },
  ],
  bangalore: [
    {
      label: 'Namma Metro Purple Line',
      status: 'On time',
      detail: 'Service running on peak frequency with zero active issues.',
      tone: 'success',
    },
    {
      label: 'BMTC Airport Volvo V-KIAS',
      status: 'Traffic slow',
      detail: 'Heavy congestion on Hebbal flyover; expect 15 mins delay.',
      tone: 'warning',
    },
  ],
};

const defaultAlerts = [
  {
    label: 'State RTC transit',
    status: 'Healthy',
    detail: 'Standard inter-city links and operators reporting stable timelines.',
    tone: 'success' as const,
  },
];

export default function Home() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState(cities[0]!);
  
  // Search state
  const [searchFrom, setSearchFrom] = useState('Connaught Place, Delhi');
  const [fromCoords, setFromCoords] = useState({ lat: 28.6315, lng: 77.2167 });
  const [fromSuggestions, setFromSuggestions] = useState<Suggestion[]>([]);
  const [isFromOpen, setIsFromOpen] = useState(false);

  const [searchTo, setSearchTo] = useState('');
  const [toCoords, setToCoords] = useState<any>(null);
  const [toSuggestions, setToSuggestions] = useState<Suggestion[]>([]);
  const [isToOpen, setIsToOpen] = useState(false);
  
  const [isSearching, setIsSearching] = useState(false);
  const fromTimer = useRef<NodeJS.Timeout | null>(null);
  const toTimer = useRef<NodeJS.Timeout | null>(null);

  // Switch city updates coordinates
  const handleCityChange = (cityId: string) => {
    const target = cities.find((c) => c.id === cityId);
    if (target) {
      setSelectedCity(target);
      // Auto-update sample search anchor for city
      setSearchFrom(`Rajiv Chowk, ${target.name}`);
      setFromCoords({ lat: target.location.lat, lng: target.location.lng });
      setSearchTo('');
      setToCoords(null);
    }
  };

  const handleFromSearch = async (val: string) => {
    if (val.length < 3) {
      setFromSuggestions([]);
      return;
    }
    const res = await geocodeAddress(val);
    setFromSuggestions(res);
    setIsFromOpen(true);
  };

  const handleToSearch = async (val: string) => {
    if (val.length < 3) {
      setToSuggestions([]);
      return;
    }
    const res = await geocodeAddress(val);
    setToSuggestions(res);
    setIsToOpen(true);
  };

  const selectFrom = (s: Suggestion) => {
    setSearchFrom(s.displayName.split(',')[0]!);
    setFromCoords({ lat: parseFloat(s.lat), lng: parseFloat(s.lon) });
    setFromSuggestions([]);
    setIsFromOpen(false);
  };

  const selectTo = (s: Suggestion) => {
    setSearchTo(s.displayName.split(',')[0]!);
    setToCoords({ lat: parseFloat(s.lat), lng: parseFloat(s.lon) });
    setToSuggestions([]);
    setIsToOpen(false);
  };

  const handlePlanRoute = () => {
    if (!fromCoords || !toCoords) return;
    router.push(
      `/routes?fromLat=${fromCoords.lat}&fromLng=${fromCoords.lng}&fromName=${encodeURIComponent(
        searchFrom
      )}&toLat=${toCoords.lat}&toLng=${toCoords.lng}&toName=${encodeURIComponent(searchTo)}&city=${selectedCity.id}`
    );
  };

  const handleCommuteShortcut = (shortcut: typeof savedPlaces[0]) => {
    // Look up some coordinates to simulate route
    let startCoords = fromCoords;
    let endCoords = { lat: 28.6429, lng: 77.2195 }; // NDLS default
    
    if (shortcut.label === 'Home') {
      startCoords = { lat: 28.6315, lng: 77.2167 };
      endCoords = { lat: 28.6429, lng: 77.2195 };
    } else if (shortcut.label === 'Work') {
      startCoords = { lat: 28.6429, lng: 77.2195 };
      endCoords = { lat: 28.6315, lng: 77.2167 };
    } else if (shortcut.label === 'Airport') {
      startCoords = { lat: 28.6315, lng: 77.2167 };
      endCoords = { lat: 28.5562, lng: 77.1000 }; // IGI Airport
    }

    router.push(
      `/routes?fromLat=${startCoords.lat}&fromLng=${startCoords.lng}&fromName=${encodeURIComponent(
        shortcut.label === 'Work' ? shortcut.place : 'Home'
      )}&toLat=${endCoords.lat}&toLng=${endCoords.lng}&toName=${encodeURIComponent(
        shortcut.label === 'Work' ? 'Home' : shortcut.place
      )}&city=${selectedCity.id}`
    );
  };

  const activeAlerts = serviceAlertsByCity[selectedCity.id] || defaultAlerts;

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-900 text-slate-100 antialiased selection:bg-brand-500/30 selection:text-white">
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 -z-10 bg-radial-at-t from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-brand-500/10 blur-[120px]" />
        <div className="absolute right-[-10%] top-[20%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[30%] h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px]" />
      </div>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Header Branding */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-400 to-brand-600 shadow-lg shadow-brand-500/25 ring-1 ring-white/10">
              <Route className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-400">
                Moon Transit
              </p>
              <h2 className="text-lg font-medium text-slate-400">Citymapper-Style Route Super-App</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Live Transit Engines
            </span>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          
          {/* Main Column */}
          <div className="space-y-8">
            
            {/* Hero / Pitch */}
            <div className="space-y-3">
              <Badge className="bg-brand-500/10 text-brand-300 border-brand-500/25">Multi-Modal Planner</Badge>
              <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
                The fastest way across the city.
              </h1>
              <p className="max-w-2xl text-base text-slate-400 sm:text-lg">
                Compare metro, buses, trains, cabs, rentals, and walking in real time. Choose your city, select your commute, and watch live transit sync instantly.
              </p>
            </div>

            {/* Premium Planner Glass Card */}
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl overflow-hidden rounded-[2.5rem]">
              <div className="border-b border-white/5 bg-white/[0.02] px-6 py-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Fast Route Finder</span>
                    <h3 className="text-xl font-bold text-white mt-0.5">Where are you going?</h3>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-950/40 rounded-2xl p-1.5 border border-white/5">
                    {cities.slice(0, 5).map((city) => (
                      <button
                        key={city.id}
                        onClick={() => handleCityChange(city.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                          selectedCity.id === city.id
                            ? 'bg-brand-500 text-white shadow-md'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {city.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <CardContent className="p-6 space-y-5">
                {/* Search inputs */}
                <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] items-center relative">
                  <div className="relative">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">From</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                      <input
                        value={searchFrom}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSearchFrom(val);
                          if (fromTimer.current) clearTimeout(fromTimer.current);
                          fromTimer.current = setTimeout(() => handleFromSearch(val), 300);
                        }}
                        onFocus={() => fromSuggestions.length > 0 && setIsFromOpen(true)}
                        placeholder="Search origin address..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/5 rounded-2xl text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/25 outline-none transition"
                        autoComplete="off"
                      />
                    </div>
                    {isFromOpen && fromSuggestions.length > 0 && (
                      <ul className="absolute top-full left-0 right-0 bg-slate-950 border border-white/10 rounded-2xl shadow-2xl mt-2 max-h-60 overflow-y-auto z-50 divide-y divide-white/5">
                        {fromSuggestions.map((s, idx) => (
                          <li key={idx}>
                            <button
                              type="button"
                              onClick={() => selectFrom(s)}
                              className="w-full text-left px-4 py-3 hover:bg-white/5 transition text-sm"
                            >
                              <div className="font-semibold text-white">{s.displayName.split(',')[0]}</div>
                              <div className="text-xs text-slate-400 truncate mt-0.5">{s.displayName}</div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      const tempS = searchFrom;
                      const tempC = fromCoords;
                      setSearchFrom(searchTo);
                      setFromCoords(toCoords);
                      setSearchTo(tempS);
                      setToCoords(tempC);
                    }}
                    className="self-end md:mb-1 p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition text-slate-400 hover:text-white"
                  >
                    <ArrowUpDown className="h-4 w-4 md:rotate-90" />
                  </button>

                  <div className="relative">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">To</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                      <input
                        value={searchTo}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSearchTo(val);
                          if (toTimer.current) clearTimeout(toTimer.current);
                          toTimer.current = setTimeout(() => handleToSearch(val), 300);
                        }}
                        onFocus={() => toSuggestions.length > 0 && setIsToOpen(true)}
                        placeholder="Search destination..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/5 rounded-2xl text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/25 outline-none transition"
                        autoComplete="off"
                      />
                    </div>
                    {isToOpen && toSuggestions.length > 0 && (
                      <ul className="absolute top-full left-0 right-0 bg-slate-950 border border-white/10 rounded-2xl shadow-2xl mt-2 max-h-60 overflow-y-auto z-50 divide-y divide-white/5">
                        {toSuggestions.map((s, idx) => (
                          <li key={idx}>
                            <button
                              type="button"
                              onClick={() => selectTo(s)}
                              className="w-full text-left px-4 py-3 hover:bg-white/5 transition text-sm"
                            >
                              <div className="font-semibold text-white">{s.displayName.split(',')[0]}</div>
                              <div className="text-xs text-slate-400 truncate mt-0.5">{s.displayName}</div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Suggestions / Shortcuts */}
                <div className="flex flex-wrap gap-2 items-center text-xs text-slate-400 pt-2 border-t border-white/5">
                  <span className="font-semibold text-slate-500">Popular:</span>
                  {suggestions.slice(0, 3).map((sug) => (
                    <button
                      key={sug.id}
                      onClick={() => {
                        setSearchTo(sug.label);
                        setToCoords(sug.location);
                      }}
                      className="bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-1.5 rounded-xl transition text-slate-300 hover:text-white"
                    >
                      {sug.label}
                    </button>
                  ))}
                </div>

                {/* Plan button */}
                <div className="pt-2 flex justify-end">
                  <Button
                    onClick={handlePlanRoute}
                    disabled={!fromCoords || !toCoords}
                    size="lg"
                    className="rounded-2xl px-8 bg-brand-500 hover:bg-brand-600 text-white flex items-center gap-2 shadow-lg shadow-brand-500/25 disabled:opacity-50"
                  >
                    <span>Find Fastest Route</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* City Hub Map & Stops List */}
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl overflow-hidden rounded-[2.5rem]">
              <CardHeader className="border-b border-white/5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-white text-xl">Interactive Hub View</CardTitle>
                    <CardDescription className="text-slate-400">Transit stops and line overlay in {selectedCity.name}.</CardDescription>
                  </div>
                  <Badge className="bg-slate-950/60 text-slate-300 border-white/5">
                    {selectedCity.name}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <HomeMapSection />
              </CardContent>
            </Card>

            {/* Stats Dashboard */}
            <section className="grid gap-4 sm:grid-cols-4">
              <InfoCard
                icon={ShieldCheck}
                label="System Health"
                value="Active"
                note="All local transit syncer processes online."
              />
              <InfoCard
                icon={TrainFront}
                label="Tracked Cities"
                value={String(cities.length)}
                note="Metro network coverages up to date."
              />
              <InfoCard
                icon={Route}
                label="Seeded Fares"
                value="Configured"
                note="Live rate charts updated for 2026."
              />
              <InfoCard
                icon={Wifi}
                label="Feed Status"
                value="99.9%"
                note="High performance latency average (12ms)."
              />
            </section>
          </div>

          {/* Sidebar Column */}
          <aside className="space-y-6">
            
            {/* Quick Actions (Mode Selectors) */}
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem]">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-white">Transit Modes</CardTitle>
                    <CardDescription className="text-slate-400">Quick explore local city maps.</CardDescription>
                  </div>
                  <Sparkles className="h-5 w-5 text-brand-400" />
                </div>
              </CardHeader>
              <CardContent className="grid gap-3">
                {[
                  { label: 'Compare Metro Lines', icon: TrainFront, href: '/metro', tone: 'primary' as const },
                  { label: 'Bus Feeds & Routes', icon: BusFront, href: '/buses', tone: 'secondary' as const },
                  { label: 'Cab Deeplink Fares', icon: Navigation, href: '/cabs', tone: 'secondary' as const },
                  { label: 'Live Airport Flights', icon: PlaneTakeoff, href: '/flights', tone: 'secondary' as const },
                ].map((shortcut) => {
                  const Icon = shortcut.icon;
                  return (
                    <Button
                      key={shortcut.label}
                      href={shortcut.href}
                      variant={shortcut.tone}
                      className="justify-between rounded-2xl hover:translate-x-1 transition-transform"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{shortcut.label}</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Saved Commutes */}
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem]">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-white">Commute Anchors</CardTitle>
                    <CardDescription className="text-slate-400">One-tap routes for your common trips.</CardDescription>
                  </div>
                  <MapPinned className="h-5 w-5 text-brand-400" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {savedPlaces.map((place) => {
                  const Icon = place.icon;
                  return (
                    <button
                      key={place.label}
                      onClick={() => handleCommuteShortcut(place)}
                      className="w-full flex items-center justify-between gap-3 text-left rounded-2xl border border-white/5 bg-slate-950/30 p-4 hover:bg-white/5 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white">{place.label}</p>
                          <p className="truncate text-xs text-slate-400 mt-0.5">{place.place}</p>
                          <p className="text-[10px] text-slate-500 mt-1">{place.hint}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-500" />
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Live Service Alerts */}
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem]">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-white">Service Feeds</CardTitle>
                    <CardDescription className="text-slate-400">Live operational status updates.</CardDescription>
                  </div>
                  <Bell className="h-5 w-5 text-brand-400" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeAlerts.map((alert) => (
                  <div
                    key={alert.label}
                    className="rounded-2xl border border-white/5 bg-slate-950/20 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold text-white">{alert.label}</p>
                      <Badge className={
                        alert.tone === 'success'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : alert.tone === 'warning'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }>
                        {alert.status}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      {alert.detail}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* Feature Index */}
        <section className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem]">
            <CardHeader>
              <Badge className="bg-slate-950/60 text-slate-300 border-white/5 self-start">Commuter Experience</Badge>
              <CardTitle className="text-white text-xl mt-2">Go deeper into transit bookings</CardTitle>
              <CardDescription className="text-slate-400">
                Book local metro cards, purchase bus passes, and view flight bookings directly in Moon.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {[
                { label: 'Plan a trip', href: '/routes', detail: 'Multi-modal route comparison' },
                { label: 'Live tracking', href: '/tracking', detail: 'Vehicle positions and delay alerts' },
                { label: 'My bookings', href: '/bookings', detail: 'View active QR tickets & cancellations' },
                { label: 'Operator portal', href: '/operator', detail: 'Manage fleets and update schedules' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-2xl border border-white/5 bg-slate-950/20 p-5 hover:bg-white/5 transition hover:border-brand-500/30"
                >
                  <p className="font-semibold text-white">{link.label}</p>
                  <p className="mt-1.5 text-xs text-slate-400 leading-5">{link.detail}</p>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] flex flex-col justify-between">
            <CardHeader>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 self-start">Local Sync</Badge>
              <CardTitle className="text-white text-xl mt-2">Active Dev Sandbox</CardTitle>
              <CardDescription className="text-slate-400">
                Local database services, Clerk authentication, and OTP servers are active.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-400 space-y-2">
              <p>✔ PlanetScale MySQL server connection verified.</p>
              <p>✔ Upstash Redis queue & pub-sub engines responding.</p>
              <p>✔ Auto-geocoding via OpenStreetMap Nominatim live.</p>
            </CardContent>
            <CardFooter className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between">
              <Link
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 underline underline-offset-4"
                href="/modules"
              >
                Open the modules map index
              </Link>
              <Clock3 className="h-4 w-4 text-slate-500" />
            </CardFooter>
          </Card>
        </section>
      </section>
    </main>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: any;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2rem]">
      <CardContent className="p-5">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
          <Icon className="h-5 w-5" />
        </div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="mt-1 text-2xl font-bold text-white tracking-tight">{value}</p>
        <p className="mt-1 text-[10px] leading-4 text-slate-500">{note}</p>
      </CardContent>
    </Card>
  );
}
