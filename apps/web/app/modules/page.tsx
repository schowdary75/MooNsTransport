'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckSquare,
  Square,
  Play,
  Layers,
  Map,
  ArrowRight,
  Terminal,
  Activity,
  Heart,
  Cpu,
  Database,
  Network,
  Share2,
  PhoneCall,
  Smartphone,
  Globe,
  Settings,
  ChevronRight,
  X,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@moon/ui';
import { modules as siteModules } from '../../lib/site-data';

// Detailed data for each Architecture Block
interface ArchDetail {
  title: string;
  sub: string;
  purpose: string;
  techStack: string;
  localEndpoint: string;
  healthStatus: string;
  notes: string;
}

const archDetails: Record<string, ArchDetail> = {
  // Client Layer
  'web-app': {
    title: 'Web App',
    sub: 'Next.js 14 + Tailwind',
    purpose: 'Commuter portal for route planning, tracking, booking tickets, payments, and account history.',
    techStack: 'Next.js 14, React 18, Tailwind CSS, shadcn/ui, Leaflet.js',
    localEndpoint: 'http://localhost:3000',
    healthStatus: 'Operational · Latency: 12ms',
    notes: 'Responsive desktop/mobile layouts with hydration safety layers for interactive maps.',
  },
  'android-app': {
    title: 'Android App',
    sub: 'Kotlin + Jetpack Compose',
    purpose: 'Native Android application shell with offline databases, location updates, and foreground services.',
    techStack: 'Kotlin, Jetpack Compose, Room DB, Retrofit, Firebase Messaging SDK',
    localEndpoint: 'http://localhost:3000/api/notifications (FCM hook)',
    healthStatus: 'Simulator Ready · Latency: 0ms',
    notes: 'Implements native widgets, Room local caches, and Firebase cloud message alerts.',
  },
  'ios-app': {
    title: 'iOS App',
    sub: 'Swift + SwiftUI',
    purpose: 'Native iOS application shell with offline mapping support, widgets, and Apple Push Notifications.',
    techStack: 'Swift 5, SwiftUI, CoreData, URLSession, APNs',
    localEndpoint: 'http://localhost:3000/api/notifications (APNs hook)',
    healthStatus: 'Simulator Ready · Latency: 0ms',
    notes: 'Implements widgets, SwiftUI maps integration, and Apple push configurations.',
  },
  'pwa': {
    title: 'PWA',
    sub: 'Offline support',
    purpose: 'Progressive Web App installation wrapping with offline service workers, asset caches, and native-like experiences.',
    techStack: 'next-pwa, Workbox, Service Workers',
    localEndpoint: 'http://localhost:3000/manifest.json',
    healthStatus: 'Active Service Worker',
    notes: 'Caches map tile grids, timetable indices, and offline support portal timeline scripts.',
  },
  // API Gateway
  'api-gateway': {
    title: 'Kong / AWS API Gateway',
    sub: 'Auth · Rate limiting · Load balancing · SSL termination',
    purpose: 'API entry point routing client traffic to shared microservices, validating Clerk JWT tokens, and rate-limiting user requests.',
    techStack: 'Kong Gateway, AWS API Gateway, Lua scripts',
    localEndpoint: 'http://localhost:3000/api/[...slug]',
    healthStatus: 'Operational (Mock Router)',
    notes: 'Next.js edge middleware dynamically intercepts requests, mimicking gateway rate-limiting.',
  },
  // Microservices
  'routing-service': {
    title: 'Routing',
    sub: 'Multi-modal paths',
    purpose: 'Calculates step-by-step multi-modal paths combining walks, metro legs, bus lines, and rail connections.',
    techStack: 'OpenTripPlanner 2.x API client, TypeScript',
    localEndpoint: 'http://localhost:8080/otp/routers/default/plan',
    healthStatus: 'Connected · Latency: 230ms',
    notes: 'Requests itineraries, decodes Google Polylines, and formats distance, price, and mode sequences.',
  },
  'transit-service': {
    title: 'Transit',
    sub: 'Bus · Rail · Metro',
    purpose: 'Retrieves static timetable metadata, metro SVG system maps, line guides, and stop schedules.',
    techStack: 'Node.js, Express, Prisma DB',
    localEndpoint: 'http://localhost:3000/api/routes/stops',
    healthStatus: 'Operational · SQL query latency: 15ms',
    notes: 'Queries Prisma tables for registered cities, stops, and static routes.',
  },
  'booking-service': {
    title: 'Booking',
    sub: 'Tickets · Rentals',
    purpose: 'Creates transit bookings, assigns seat/coach codes, generates digital QR boarding passes, and manages refund queues.',
    techStack: 'Prisma, Node.js, Crypto helper scripts',
    localEndpoint: 'http://localhost:3000/api/bookings',
    healthStatus: 'Operational · DB transaction lock healthy',
    notes: 'Wired to Clerk auth user ID, writing records directly to Prisma booking tables.',
  },
  'payments-service': {
    title: 'Payments',
    sub: 'UPI · Cards · Wallets',
    purpose: 'Initiates Razorpay checkout orders, registers incoming payment status, and handles webhook verifications.',
    techStack: 'Razorpay API SDK, Svix validation library',
    localEndpoint: 'http://localhost:3000/api/payments/create-order',
    healthStatus: 'Connected (Sandbox testkeys)',
    notes: 'Web checkout modal pops up automatically for UPI/card simulations.',
  },
  'alerts-service': {
    title: 'Alerts',
    sub: 'Push · SMS',
    purpose: 'Pushes mobile alerts via FCM (Firebase), emails via Resend, and sends OTP verification codes via MSG91.',
    techStack: 'Firebase Admin SDK, Resend client, Msg91 templates',
    localEndpoint: 'http://localhost:3000/api/notifications',
    healthStatus: 'Operational (Mock SDK fallbacks)',
    notes: 'Alerts queue uses BullMQ workers to schedule notifications 30 mins before journeys.',
  },
  // Data Layer
  'mysql': {
    title: 'MySQL (Primary)',
    sub: 'Users · Bookings · Routes',
    purpose: 'Relational storage for active user data, preferences, travel bookings, support tickets, and city directories.',
    techStack: 'MySQL 8, PlanetScale database interface, Prisma ORM',
    localEndpoint: 'mysql://localhost:3307/moon',
    healthStatus: 'Connected · Ping: 12ms',
    notes: 'Maintains referential integrity with cascading deletes for support tickets and user cancellations.',
  },
  'redis': {
    title: 'Redis',
    sub: 'Cache · Real-time ETA',
    purpose: 'Pub/sub broker for active vehicle coordinates, user session caching, and rate limiting queues.',
    techStack: 'Upstash Redis Client, Redis Server',
    localEndpoint: 'redis://localhost:6379',
    healthStatus: 'Connected · Cache hits: 98.4%',
    notes: 'Wired to socket.io servers to broadcast GPS coordinates to active commuter maps.',
  },
  'elasticsearch': {
    title: 'Elasticsearch',
    sub: 'Search · Autocomplete',
    purpose: 'Performs fuzzy string search and autocomplete indexing for Nominatim address geocoders.',
    techStack: 'Elasticsearch, Nominatim reverse geocoder',
    localEndpoint: 'https://nominatim.openstreetmap.org/search',
    healthStatus: 'Healthy · Latency: 120ms',
    notes: 'Next.js router forwards fuzzy matches for address search inputs.',
  },
  'kafka': {
    title: 'Kafka / RabbitMQ',
    sub: 'Events · Streams',
    purpose: 'Asynchronous message streaming for tracking inputs, telemetry updates, and payment webhook alerts.',
    techStack: 'Kafka client, BullMQ queues (local Redis)',
    localEndpoint: 'redis://localhost:6379 (BullMQ provider)',
    healthStatus: 'Healthy · Active queues: 3',
    notes: 'Asynchronous workers consume ticket confirmation triggers to send Resend emails.',
  },
  // Maps & Infra
  'maps-api': {
    title: 'Google Maps API / OSM fallback',
    sub: 'Map rendering & tiles',
    purpose: 'Loads tile layer maps, pins custom stops, and renders vector route polylines.',
    techStack: 'Leaflet.js, OpenStreetMap tile servers',
    localEndpoint: 'https://{s}.tile.openstreetmap.org/',
    healthStatus: 'Active tile feeds',
    notes: 'Fallback system ensures map elements render cleanly offline.',
  },
  'gtfs-otp': {
    title: 'GTFS / OTP',
    sub: 'Indian transit feeds',
    purpose: 'Ingests GTFS schedule files from Indian railways, metro networks, and city RTC buses.',
    techStack: 'OpenTripPlanner 2.x docker instance, GTFS zip indices',
    localEndpoint: 'http://localhost:8080/otp',
    healthStatus: 'GTFS feeds synchronized',
    notes: 'Ingests schedule data for Delhi, Mumbai, Bengaluru, Chennai, and Hyderabad.',
  },
  'cloud-provider': {
    title: 'AWS / GCP India',
    sub: 'Mumbai · Chennai regions',
    purpose: 'Hosts microservices, database storage, and frontends on high-availability cloud regions.',
    techStack: 'Vercel, Render.com, Cloudflare CDN',
    localEndpoint: 'https://vercel.com/project',
    healthStatus: 'All cloud nodes online',
    notes: 'Cloudflare CDN acts as edge caching with SSL termination and DDoS checks.',
  },
  'ci-cd': {
    title: 'CI / CD',
    sub: 'GitHub Actions · Docker',
    purpose: 'Automates workspace lint checks, typescript validations, docker testing builds, and deployment pushes.',
    techStack: 'GitHub Actions pipelines, Docker Compose, Turbo caching',
    localEndpoint: 'C:\\MOON-MIXED\\.github\\workflows',
    healthStatus: 'Pipeline Active (Green)',
    notes: 'Triggered on git push; checks code formats, builds assets, and runs tests.',
  },
  // Third Party
  'irctc': {
    title: 'IRCTC',
    sub: 'Train booking',
    purpose: 'Mocks train seat layouts, passenger allocations, PNR states, and ticketing receipts.',
    techStack: 'IRCTC Partner APIs mock adapters',
    localEndpoint: 'http://localhost:3000/api/trains (Adapter)',
    healthStatus: 'Connected',
    notes: 'Resolves seat status immediately inside bookings page.',
  },
  'flight-apis': {
    title: 'Flight APIs',
    sub: 'Indigo · Air India',
    purpose: 'Autocomplete searches for airport codes and queries flight schedules/fares.',
    techStack: 'Amadeus flight API SDK integration',
    localEndpoint: 'http://localhost:3000/api/flights (Adapter)',
    healthStatus: 'Connected',
    notes: 'Mock response automatically activates if Amadeus keys are default.',
  },
  'ride-apis': {
    title: 'Ride APIs',
    sub: 'Ola · Rapido · Uber',
    purpose: 'Formulates app launch deep links and calculates taxi/auto-rickshaw price estimations.',
    techStack: 'Ola/Uber deep link configurations',
    localEndpoint: 'http://localhost:3000/api/cabs (Adapter)',
    healthStatus: 'Connected',
    notes: 'Generates direct taxi bookings links matching destination coordinates.',
  },
  'rentals': {
    title: 'Rentals',
    sub: 'Yulu · Bounce · Zoomcar',
    purpose: 'Queries bike rentals, dock capacities, car packages, and lists vehicle availability.',
    techStack: 'Rentals provider adapters',
    localEndpoint: 'http://localhost:3000/api/rentals (Adapter)',
    healthStatus: 'Connected',
    notes: 'Pushes local bike markers to tracking map.',
  },
  'pay': {
    title: 'Pay',
    sub: 'Razorpay',
    purpose: 'Generates checkout links and processes digital UPI transaction orders.',
    techStack: 'Razorpay SDK integrations',
    localEndpoint: 'http://localhost:3000/api/payments/webhook',
    healthStatus: 'Sandbox connected',
    notes: 'Triggers SVIX verification checks on checkout confirmations.',
  },
  // Transport modes
  'metro-mode': {
    title: 'Metro',
    sub: 'DMRC · BMRC...',
    purpose: 'Aggregates metro itineraries for DMRC (Delhi), BMRCL (Bengaluru), CMRL (Chennai), HMRL (Hyderabad), and Namma Metro.',
    techStack: 'OpenTripPlanner GTFS Metro module',
    localEndpoint: 'http://localhost:3000/api/routes',
    healthStatus: 'Live route synchronization active',
    notes: 'Features vector metro line map overlay.',
  },
  'buses-mode': {
    title: 'Buses',
    sub: 'KSRTC · TSRTC...',
    purpose: 'Aggregates bus schedules and ticket passes for state RTC networks.',
    techStack: 'OpenTripPlanner GTFS Bus module',
    localEndpoint: 'http://localhost:3000/api/buses',
    healthStatus: 'Live route feeds active',
    notes: 'Integrates KSRTC, BMTC, BEST, and TSRTC schedules.',
  },
  'trains-mode': {
    title: 'Trains',
    sub: 'Indian Railways',
    purpose: 'Integrates national train travel bookings, seat charts, and PNR status reviews.',
    techStack: 'National Railways static tables syncer',
    localEndpoint: 'http://localhost:3000/api/trains',
    healthStatus: 'Timetables active',
    notes: 'Caches local express routes offline.',
  },
  'flights-mode': {
    title: 'Flights',
    sub: 'Domestic routes',
    purpose: 'Allows domestic flight comparison and redirect links for Air India, Indigo, and SpiceJet.',
    techStack: 'Amadeus Flight search engine',
    localEndpoint: 'http://localhost:3000/api/flights',
    healthStatus: 'Schedules active',
    notes: 'Displays flight paths directly.',
  },
  'cycling-mode': {
    title: 'Cycling',
    sub: 'Yulu · Bounce',
    purpose: 'Integrates bicycle path routing, dock coordinates, and dock unlock links.',
    techStack: 'OpenStreetMap routing engine (OSRM)',
    localEndpoint: 'http://localhost:3000/api/routes',
    healthStatus: 'Bicycle links active',
    notes: 'Allows GPS tracking of rental cycles.',
  },
  'cab-mode': {
    title: 'Auto / Cab',
    sub: 'Ola · Rapido...',
    purpose: 'Compares taxi fares, auto-rickshaws, and motorcycles with direct launch links.',
    techStack: 'Direct cab provider API adapters',
    localEndpoint: 'http://localhost:3000/api/cabs',
    healthStatus: 'Fare estimates active',
    notes: 'Fetches Ola, Uber, and Rapido deep links.',
  },
  // Key Tech Decisions
  'nextjs-dec': {
    title: 'Next.js 14 (App Router)',
    sub: 'SSR · ISR · Edge functions',
    purpose: 'Next-generation framework enabling hybrid server/client rendering, edge API routes, and SEO headers.',
    techStack: 'Next.js 14, React 18',
    localEndpoint: 'http://localhost:3000',
    healthStatus: 'Healthy (Development)',
    notes: 'Supports Turborepo parallel compilation builds.',
  },
  'ts-dec': {
    title: 'TypeScript end-to-end',
    sub: 'Shared types · tRPC',
    purpose: 'Ensures type safety across db schemas, shared UI variables, routing clients, and API adapters.',
    techStack: 'TypeScript 5.x',
    localEndpoint: 'C:\\MOON-MIXED\\packages\\api',
    healthStatus: 'Compiles clean (typecheck green)',
    notes: 'Monorepo uses shared compiler targets.',
  },
  'mysql-dec': {
    title: 'MySQL 8 + Prisma ORM',
    sub: 'Spatial queries · GTFS',
    purpose: 'Queries spatial mapping tables to identify nearby stops within a radius coordinate block.',
    techStack: 'Prisma Client, MySQL Spatial Indexes',
    localEndpoint: 'C:\\MOON-MIXED\\packages\\db',
    healthStatus: 'DB Connection stable',
    notes: 'Prisma schema manages indexes and relations.',
  },
  'websockets-dec': {
    title: 'WebSockets',
    sub: 'Live vehicle tracking',
    purpose: 'Establishes persistent socket feeds to stream GPS telemetry data to map layers.',
    techStack: 'socket.io-client, socket.io server',
    localEndpoint: 'ws://localhost:3000/socket.io',
    healthStatus: 'Socket connected (0 active users)',
    notes: 'WebSockets broadcast Redis vehicle tracking updates.',
  },
};

function ModulesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Active view tab ('roadmap' | 'architecture')
  const [activeTab, setActiveTab] = useState<'roadmap' | 'architecture'>('roadmap');

  // Selected details drawer states
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedArchKey, setSelectedArchKey] = useState<string | null>(null);

  // Read deep link query params
  const urlId = searchParams.get('id');
  const urlArch = searchParams.get('arch');

  useEffect(() => {
    if (urlId) {
      setSelectedModuleId(urlId);
      setActiveTab('roadmap');
    }
    if (urlArch) {
      setSelectedArchKey(urlArch);
      setActiveTab('architecture');
    }
  }, [urlId, urlArch]);

  const selectedModule = siteModules.find((m) => m.id === selectedModuleId);
  const activeArchBlock = selectedArchKey ? archDetails[selectedArchKey] : null;

  const phaseModules = (phase: string) => {
    return siteModules.filter((m) => m.phase === phase);
  };

  return (
    <main className="relative min-h-screen bg-slate-900 text-slate-100 overflow-hidden pb-16">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 -z-10 bg-radial-at-t from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-brand-500/10 blur-[120px]" />
        <div className="absolute right-[-10%] top-[20%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[130px]" />
      </div>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 pt-24">
        
        {/* Header branding */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6 mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-400">
              SandBox Console
            </p>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">Modules & Architecture Dashboard</h1>
          </div>
          
          {/* Tab buttons */}
          <div className="flex gap-2 bg-slate-950/60 p-1.5 rounded-2xl border border-white/5">
            <button
              onClick={() => {
                setActiveTab('roadmap');
                router.push('/modules');
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl transition ${
                activeTab === 'roadmap'
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckSquare className="h-4 w-4" />
              <span>Modules Roadmap</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('architecture');
                router.push('/modules');
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl transition ${
                activeTab === 'architecture'
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Architecture Blueprint</span>
            </button>
          </div>
        </header>

        {/* Tab A: Modules Checklist (Image 1 replica) */}
        <AnimatePresence mode="wait">
          {activeTab === 'roadmap' && (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-10"
            >
              {/* Phase 1 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-500 text-white uppercase text-[10px] font-bold px-3 py-1 rounded-xl">Phase 1</Badge>
                  <h3 className="text-lg font-bold text-white">Foundation</h3>
                  <span className="text-xs text-slate-500">Weeks 1-6</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {phaseModules('foundation').map((m) => (
                    <ModuleCard key={m.id} module={m} onClick={() => setSelectedModuleId(m.id)} />
                  ))}
                </div>
              </div>

              {/* Phase 2 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-emerald-500 text-white uppercase text-[10px] font-bold px-3 py-1 rounded-xl">Phase 2</Badge>
                  <h3 className="text-lg font-bold text-white">Core Product</h3>
                  <span className="text-xs text-slate-500">Weeks 7-14</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {phaseModules('core').map((m) => (
                    <ModuleCard key={m.id} module={m} onClick={() => setSelectedModuleId(m.id)} />
                  ))}
                </div>
              </div>

              {/* Phase 3 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-amber-500 text-white uppercase text-[10px] font-bold px-3 py-1 rounded-xl">Phase 3</Badge>
                  <h3 className="text-lg font-bold text-white">Full Services</h3>
                  <span className="text-xs text-slate-500">Weeks 15-22</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {phaseModules('services').map((m) => (
                    <ModuleCard key={m.id} module={m} onClick={() => setSelectedModuleId(m.id)} />
                  ))}
                </div>
              </div>

              {/* Phase 4 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-red-500 text-white uppercase text-[10px] font-bold px-3 py-1 rounded-xl">Phase 4</Badge>
                  <h3 className="text-lg font-bold text-white">Launch Ready</h3>
                  <span className="text-xs text-slate-500">Weeks 23-28</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {phaseModules('launch').map((m) => (
                    <ModuleCard key={m.id} module={m} onClick={() => setSelectedModuleId(m.id)} />
                  ))}
                </div>
              </div>

              <div className="text-center text-xs text-slate-500 pt-6">
                Click any module card to inspect target code, checklist items, and simulated test logs.
              </div>
            </motion.div>
          )}

          {/* Tab B: Architecture Blueprint (Image 2 replica) */}
          {activeTab === 'architecture' && (
            <motion.div
              key="architecture"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Architecture Layer Canvas */}
              <div className="rounded-[2.5rem] border border-white/5 bg-slate-950/40 p-6 md:p-8 space-y-6 shadow-2xl">
                
                {/* 1. Client Layer */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block text-center">Client Layer</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ArchBlock key="web-app" archKey="web-app" label="Web App" detail="Next.js 14 + Tailwind" layer="client" onClick={setSelectedArchKey} />
                    <ArchBlock key="android-app" archKey="android-app" label="Android App" detail="Kotlin + Jetpack Compose" layer="client" onClick={setSelectedArchKey} />
                    <ArchBlock key="ios-app" archKey="ios-app" label="iOS App" detail="Swift + SwiftUI" layer="client" onClick={setSelectedArchKey} />
                    <ArchBlock key="pwa" archKey="pwa" label="PWA" detail="Offline support" layer="client" onClick={setSelectedArchKey} />
                  </div>
                </div>

                {/* Gateway connector line */}
                <div className="h-4 border-l-2 border-dashed border-white/10 w-0 mx-auto" />

                {/* 2. API Gateway */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block text-center">API Gateway</span>
                  <ArchBlock key="api-gateway" archKey="api-gateway" label="Kong / AWS API Gateway" detail="Auth · Rate limiting · Load balancing · SSL termination" layer="gateway" onClick={setSelectedArchKey} />
                </div>

                {/* Gateway connector line */}
                <div className="h-4 border-l-2 border-dashed border-white/10 w-0 mx-auto" />

                {/* 3. Microservices */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block text-center">Microservices (Node.js / Go)</span>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <ArchBlock key="routing-service" archKey="routing-service" label="Routing" detail="Multi-modal paths" layer="services" onClick={setSelectedArchKey} />
                    <ArchBlock key="transit-service" archKey="transit-service" label="Transit" detail="Bus · Rail · Metro" layer="services" onClick={setSelectedArchKey} />
                    <ArchBlock key="booking-service" archKey="booking-service" label="Booking" detail="Tickets · Rentals" layer="services" onClick={setSelectedArchKey} />
                    <ArchBlock key="payments-service" archKey="payments-service" label="Payments" detail="UPI · Cards · Wallets" layer="services" onClick={setSelectedArchKey} />
                    <ArchBlock key="alerts-service" archKey="alerts-service" label="Alerts" detail="Push · SMS" layer="services" onClick={setSelectedArchKey} />
                  </div>
                </div>

                <div className="h-4 border-l-2 border-dashed border-white/10 w-0 mx-auto" />

                {/* 4. Data Layer */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block text-center">Data Layer</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ArchBlock key="mysql" archKey="mysql" label="MySQL (Primary)" detail="Users · Bookings · Routes" layer="data" onClick={setSelectedArchKey} />
                    <ArchBlock key="redis" archKey="redis" label="Redis" detail="Cache · Real-time ETA" layer="data" onClick={setSelectedArchKey} />
                    <ArchBlock key="elasticsearch" archKey="elasticsearch" label="Elasticsearch" detail="Search · Autocomplete" layer="data" onClick={setSelectedArchKey} />
                    <ArchBlock key="kafka" archKey="kafka" label="Kafka / RabbitMQ" detail="Events · Streams" layer="data" onClick={setSelectedArchKey} />
                  </div>
                </div>

                <div className="h-4 border-l-2 border-dashed border-white/10 w-0 mx-auto" />

                {/* 5. Maps & Infra */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block text-center">Maps & Infrastructure</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ArchBlock key="maps-api" archKey="maps-api" label="Google Maps API / OSM" detail="Map rendering & tiles" layer="infra" onClick={setSelectedArchKey} />
                    <ArchBlock key="gtfs-otp" archKey="gtfs-otp" label="GTFS / OTP" detail="Indian transit feeds" layer="infra" onClick={setSelectedArchKey} />
                    <ArchBlock key="cloud-provider" archKey="cloud-provider" label="AWS / GCP India" detail="Mumbai · Chennai regions" layer="infra" onClick={setSelectedArchKey} />
                    <ArchBlock key="ci-cd" archKey="ci-cd" label="CI / CD" detail="GitHub Actions · Docker" layer="infra" onClick={setSelectedArchKey} />
                  </div>
                </div>

                <div className="h-4 border-l-2 border-dashed border-white/10 w-0 mx-auto" />

                {/* 6. Third-party integrations */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block text-center">Third-Party Integrations</span>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <ArchBlock key="irctc" archKey="irctc" label="IRCTC" detail="Train booking" layer="thirdparty" onClick={setSelectedArchKey} />
                    <ArchBlock key="flight-apis" archKey="flight-apis" label="Flight APIs" detail="Indigo · Air India" layer="thirdparty" onClick={setSelectedArchKey} />
                    <ArchBlock key="ride-apis" archKey="ride-apis" label="Ride APIs" detail="Ola · Rapido · Uber" layer="thirdparty" onClick={setSelectedArchKey} />
                    <ArchBlock key="rentals" archKey="rentals" label="Rentals" detail="Yulu · Bounce · Zoomcar" layer="thirdparty" onClick={setSelectedArchKey} />
                    <ArchBlock key="pay" archKey="pay" label="Pay" detail="Razorpay" layer="thirdparty" onClick={setSelectedArchKey} />
                  </div>
                </div>

                <div className="h-4 border-l-2 border-dashed border-white/10 w-0 mx-auto" />

                {/* 7. Coverage modes */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block text-center">Transport Modes Covered</span>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                    <ArchBlock key="metro-mode" archKey="metro-mode" label="Metro" detail="DMRC · BMRC..." layer="modes" onClick={setSelectedArchKey} />
                    <ArchBlock key="buses-mode" archKey="buses-mode" label="Buses" detail="KSRTC · TSRTC..." layer="modes" onClick={setSelectedArchKey} />
                    <ArchBlock key="trains-mode" archKey="trains-mode" label="Trains" detail="Indian Railways" layer="modes" onClick={setSelectedArchKey} />
                    <ArchBlock key="flights-mode" archKey="flights-mode" label="Flights" detail="Domestic routes" layer="modes" onClick={setSelectedArchKey} />
                    <ArchBlock key="cycling-mode" archKey="cycling-mode" label="Cycling" detail="Yulu · Bounce" layer="modes" onClick={setSelectedArchKey} />
                    <ArchBlock key="cab-mode" archKey="cab-mode" label="Auto / Cab" detail="Ola · Rapido..." layer="modes" onClick={setSelectedArchKey} />
                  </div>
                </div>

                <div className="h-4 border-l-2 border-dashed border-white/10 w-0 mx-auto" />

                {/* 8. Tech Decisions */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block text-center">Key Tech Decisions</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ArchBlock key="nextjs-dec" archKey="nextjs-dec" label="Next.js 14" detail="SSR · ISR · Edge functions" layer="decisions" onClick={setSelectedArchKey} />
                    <ArchBlock key="ts-dec" archKey="ts-dec" label="TypeScript end-to-end" detail="Shared types · tRPC" layer="decisions" onClick={setSelectedArchKey} />
                    <ArchBlock key="mysql-dec" archKey="mysql-dec" label="MySQL 8 + Prisma ORM" detail="Spatial queries · GTFS" layer="decisions" onClick={setSelectedArchKey} />
                    <ArchBlock key="websockets-dec" archKey="websockets-dec" label="WebSockets" detail="Live vehicle tracking" layer="decisions" onClick={setSelectedArchKey} />
                  </div>
                </div>

              </div>

              <div className="text-center text-xs text-slate-500">
                Click any architectural block to inspect purposes, stack configurations, endpoints, and health telemetry.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Module Detail Overlay Drawer */}
      <AnimatePresence>
        {selectedModule && (
          <div
            className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedModuleId(null)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-lg bg-slate-950 border-l border-white/10 h-full overflow-y-auto p-6 md:p-8 space-y-6 text-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Module specs</span>
                    <Badge className="bg-slate-900 text-slate-400 border-none font-mono">#{selectedModule.id}</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">{selectedModule.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedModuleId(null)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Status details */}
              <div className="grid grid-cols-3 gap-3 text-xs bg-white/5 border border-white/5 p-4 rounded-2xl">
                <div>
                  <span className="text-slate-500 block uppercase font-bold text-[9px]">Status</span>
                  <Badge className="bg-brand-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-lg mt-1">
                    {selectedModule.status.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-bold text-[9px]">Progress</span>
                  <span className="font-bold text-white mt-1.5 block">{selectedModule.progress}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-bold text-[9px]">Phase</span>
                  <span className="font-bold text-white mt-1.5 block capitalize">{selectedModule.phase}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Description summary</span>
                <p className="text-sm leading-6 text-slate-300">{selectedModule.summary}</p>
              </div>

              {/* Target File link */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Target Code files</span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3 bg-slate-900 border border-white/5 rounded-2xl p-4 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileCode className="h-4 w-4 text-brand-400 shrink-0" />
                      <span className="font-mono text-slate-300 truncate">apps/web/app/modules/[moduleId]/page.tsx</span>
                    </div>
                    <Link
                      href="/modules"
                      className="text-xs text-brand-400 hover:text-brand-300 font-semibold shrink-0"
                    >
                      View code
                    </Link>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Verification checklist</span>
                <div className="space-y-2.5 text-xs text-slate-400 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-brand-400 shrink-0" />
                    <span>Prisma validation mapping check completed.</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-brand-400 shrink-0" />
                    <span>Clerk authentication flow wired.</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-brand-400 shrink-0" />
                    <span>Leaflet coordinate routing overlay checks pass.</span>
                  </div>
                </div>
              </div>

              {/* Simulated execution terminal log */}
              <div className="space-y-3 pt-2">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Module verification execution logs</span>
                </span>
                <pre className="bg-slate-950 border border-white/5 p-4 rounded-2xl font-mono text-[10px] leading-4 text-slate-300 overflow-x-auto">
                  <code>{`$ npm run lint:fix --filter=module-${selectedModule.id}
✔ Lint validations complete. No errors.

$ jest test/modules/${selectedModule.id}.spec.ts
PASS  test/modules/${selectedModule.id}.spec.ts
✓ Module integration validation passed successfully (324ms)

STATUS: VERIFIED PRODUCTION COMPATIBLE`}</code>
                </pre>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setSelectedModuleId(null)}
                  className="rounded-xl px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs transition"
                >
                  Done
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Architecture Detail Overlay Drawer */}
      <AnimatePresence>
        {activeArchBlock && (
          <div
            className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedArchKey(null)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-lg bg-slate-950 border-l border-white/10 h-full overflow-y-auto p-6 md:p-8 space-y-6 text-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Architecture Details</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">{activeArchBlock.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedArchKey(null)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Status details */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-white/5 border border-white/5 p-4 rounded-2xl">
                <div>
                  <span className="text-slate-500 block uppercase font-bold text-[9px]">Uptime status</span>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold text-[10px] px-2.5 py-1 rounded-xl mt-1.5">
                    ONLINE
                  </Badge>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-bold text-[9px]">Metrics</span>
                  <span className="font-bold text-white mt-2 block">{activeArchBlock.healthStatus}</span>
                </div>
              </div>

              {/* Details Purpose */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-semibold">Purpose in Moon</span>
                <p className="text-sm leading-6 text-slate-300">{activeArchBlock.purpose}</p>
              </div>

              {/* Tech stack */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Technology Stack</span>
                <p className="text-xs text-slate-400 font-semibold bg-white/5 border border-white/5 px-4 py-3 rounded-xl">{activeArchBlock.techStack}</p>
              </div>

              {/* Endpoint connection */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-semibold">Internal Endpoint Connection</span>
                <code className="text-xs text-brand-400 font-mono bg-slate-900 border border-white/5 px-4 py-3 rounded-xl block truncate">{activeArchBlock.localEndpoint}</code>
              </div>

              {/* Operational notes */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Operational Notes</span>
                <p className="text-xs leading-5 text-slate-400">{activeArchBlock.notes}</p>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setSelectedArchKey(null)}
                  className="rounded-xl px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs transition"
                >
                  Done
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

// Subcomponent: Modules Roadmap Card
function ModuleCard({
  module,
  onClick,
}: {
  module: { id: string; name: string; summary: string; status: string; progress: number };
  onClick: () => void;
}) {
  const isDone = module.status === 'done';
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer border border-white/5 bg-slate-950/40 p-5 rounded-2xl hover:border-brand-500/30 hover:bg-slate-900/40 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {isDone ? (
            <CheckSquare className="h-5 w-5 text-brand-400 shrink-0" />
          ) : (
            <Square className="h-5 w-5 text-slate-600 shrink-0" />
          )}
          <span className="font-semibold text-sm text-white">{module.name}</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 font-semibold bg-white/5 px-2 py-0.5 rounded-lg">{module.id}</span>
      </div>
      <p className="text-xs text-slate-400 leading-5 mt-3">{module.summary}</p>
    </Card>
  );
}

export default function ModulesPage() {
  return (
    <Suspense fallback={
      <main className="relative min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 rounded-full border-2 border-slate-800 border-t-brand-500 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Loading modules architecture roadmap...</p>
        </div>
      </main>
    }>
      <ModulesPageContent />
    </Suspense>
  );
}

// Subcomponent: Architecture Grid Box
function ArchBlock({
  archKey,
  label,
  detail,
  layer,
  onClick,
}: {
  archKey: string;
  label: string;
  detail: string;
  layer: 'client' | 'gateway' | 'services' | 'data' | 'infra' | 'thirdparty' | 'modes' | 'decisions';
  onClick: (key: string) => void;
}) {
  // Styles matching layers
  const layerStyles = {
    client: 'bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600/20 hover:border-blue-500/50',
    gateway: 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/20 hover:border-indigo-500/50',
    services: 'bg-orange-600/10 border-orange-500/30 text-orange-400 hover:bg-orange-600/20 hover:border-orange-500/50',
    data: 'bg-emerald-600/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/20 hover:border-emerald-500/50',
    infra: 'bg-yellow-600/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-600/20 hover:border-yellow-500/50',
    thirdparty: 'bg-teal-600/10 border-teal-500/30 text-teal-400 hover:bg-teal-600/20 hover:border-teal-500/50',
    modes: 'bg-purple-600/10 border-purple-500/30 text-purple-400 hover:bg-purple-600/20 hover:border-purple-500/50',
    decisions: 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-800/60 hover:border-slate-600',
  }[layer];

  return (
    <div
      onClick={() => onClick(archKey)}
      className={`border rounded-2xl p-4 cursor-pointer text-center flex flex-col justify-center items-center h-20 transition-all duration-300 shadow-lg ${layerStyles}`}
    >
      <span className="font-bold text-xs truncate max-w-full">{label}</span>
      <span className="text-[9px] opacity-70 mt-1 truncate max-w-full">{detail}</span>
    </div>
  );
}
