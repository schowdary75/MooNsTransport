import type {
  AppModuleStatus,
  CitySummary,
  Coordinates,
  RouteSummary,
  SearchSuggestion,
  StopSummary,
} from '@moon/api';

export const cities: CitySummary[] = [
  {
    id: 'delhi',
    name: 'Delhi',
    state: 'Delhi',
    country: 'IN',
    location: { lat: 28.6139, lng: 77.209 },
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    country: 'IN',
    location: { lat: 19.076, lng: 72.8777 },
  },
  {
    id: 'bangalore',
    name: 'Bengaluru',
    state: 'Karnataka',
    country: 'IN',
    location: { lat: 12.9716, lng: 77.5946 },
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    country: 'IN',
    location: { lat: 13.0827, lng: 80.2707 },
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    country: 'IN',
    location: { lat: 17.385, lng: 78.4867 },
  },
  {
    id: 'visakhapatnam',
    name: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    country: 'IN',
    location: { lat: 17.6868, lng: 83.2185 },
  },
  {
    id: 'itanagar',
    name: 'Itanagar',
    state: 'Arunachal Pradesh',
    country: 'IN',
    location: { lat: 27.0844, lng: 93.6053 },
  },
  {
    id: 'guwahati',
    name: 'Guwahati',
    state: 'Assam',
    country: 'IN',
    location: { lat: 26.1445, lng: 91.7362 },
  },
  {
    id: 'patna',
    name: 'Patna',
    state: 'Bihar',
    country: 'IN',
    location: { lat: 25.5941, lng: 85.1376 },
  },
  {
    id: 'raipur',
    name: 'Raipur',
    state: 'Chhattisgarh',
    country: 'IN',
    location: { lat: 21.2514, lng: 81.6296 },
  },
  {
    id: 'panaji',
    name: 'Panaji',
    state: 'Goa',
    country: 'IN',
    location: { lat: 15.4909, lng: 73.8278 },
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    country: 'IN',
    location: { lat: 23.0225, lng: 72.5714 },
  },
  {
    id: 'gurugram',
    name: 'Gurugram',
    state: 'Haryana',
    country: 'IN',
    location: { lat: 28.4595, lng: 77.0266 },
  },
  {
    id: 'shimla',
    name: 'Shimla',
    state: 'Himachal Pradesh',
    country: 'IN',
    location: { lat: 31.1048, lng: 77.1734 },
  },
  {
    id: 'ranchi',
    name: 'Ranchi',
    state: 'Jharkhand',
    country: 'IN',
    location: { lat: 23.3441, lng: 85.3096 },
  },
  {
    id: 'kochi',
    name: 'Kochi',
    state: 'Kerala',
    country: 'IN',
    location: { lat: 9.9312, lng: 76.2673 },
  },
  {
    id: 'bhopal',
    name: 'Bhopal',
    state: 'Madhya Pradesh',
    country: 'IN',
    location: { lat: 23.2599, lng: 77.4126 },
  },
  {
    id: 'imphal',
    name: 'Imphal',
    state: 'Manipur',
    country: 'IN',
    location: { lat: 24.817, lng: 93.9368 },
  },
  {
    id: 'shillong',
    name: 'Shillong',
    state: 'Meghalaya',
    country: 'IN',
    location: { lat: 25.5788, lng: 91.8831 },
  },
  {
    id: 'aizawl',
    name: 'Aizawl',
    state: 'Mizoram',
    country: 'IN',
    location: { lat: 23.7307, lng: 92.7179 },
  },
  {
    id: 'kohima',
    name: 'Kohima',
    state: 'Nagaland',
    country: 'IN',
    location: { lat: 25.6751, lng: 94.1086 },
  },
  {
    id: 'bhubaneswar',
    name: 'Bhubaneswar',
    state: 'Odisha',
    country: 'IN',
    location: { lat: 20.2961, lng: 85.8245 },
  },
  {
    id: 'ludhiana',
    name: 'Ludhiana',
    state: 'Punjab',
    country: 'IN',
    location: { lat: 30.901, lng: 75.8573 },
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    country: 'IN',
    location: { lat: 26.9124, lng: 75.7873 },
  },
  {
    id: 'gangtok',
    name: 'Gangtok',
    state: 'Sikkim',
    country: 'IN',
    location: { lat: 27.3314, lng: 88.6138 },
  },
  {
    id: 'agartala',
    name: 'Agartala',
    state: 'Tripura',
    country: 'IN',
    location: { lat: 23.8315, lng: 91.2868 },
  },
  {
    id: 'lucknow',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    country: 'IN',
    location: { lat: 26.8467, lng: 80.9462 },
  },
  {
    id: 'dehradun',
    name: 'Dehradun',
    state: 'Uttarakhand',
    country: 'IN',
    location: { lat: 30.3165, lng: 78.0322 },
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    country: 'IN',
    location: { lat: 22.5726, lng: 88.3639 },
  },
  {
    id: 'port-blair',
    name: 'Port Blair',
    state: 'Andaman and Nicobar Islands',
    country: 'IN',
    location: { lat: 11.6234, lng: 92.7265 },
  },
  {
    id: 'chandigarh',
    name: 'Chandigarh',
    state: 'Chandigarh',
    country: 'IN',
    location: { lat: 30.7333, lng: 76.7794 },
  },
  {
    id: 'daman',
    name: 'Daman',
    state: 'Dadra and Nagar Haveli and Daman and Diu',
    country: 'IN',
    location: { lat: 20.3974, lng: 72.8328 },
  },
  {
    id: 'srinagar',
    name: 'Srinagar',
    state: 'Jammu and Kashmir',
    country: 'IN',
    location: { lat: 34.0837, lng: 74.7973 },
  },
  {
    id: 'leh',
    name: 'Leh',
    state: 'Ladakh',
    country: 'IN',
    location: { lat: 34.1526, lng: 77.5771 },
  },
  {
    id: 'kavaratti',
    name: 'Kavaratti',
    state: 'Lakshadweep',
    country: 'IN',
    location: { lat: 10.5669, lng: 72.6417 },
  },
  {
    id: 'puducherry',
    name: 'Puducherry',
    state: 'Puducherry',
    country: 'IN',
    location: { lat: 11.9416, lng: 79.8083 },
  },
];

export const stops: StopSummary[] = [
  {
    id: 'delhi-rajiv-chowk',
    name: 'Rajiv Chowk',
    code: 'RC',
    type: 'METRO',
    cityId: 'delhi',
    location: { lat: 28.6328, lng: 77.2197 },
  },
  {
    id: 'delhi-new-delhi',
    name: 'New Delhi Railway Station',
    code: 'NDLS',
    type: 'RAILWAY',
    cityId: 'delhi',
    location: { lat: 28.6429, lng: 77.2195 },
  },
  {
    id: 'mumbai-cst',
    name: 'Chhatrapati Shivaji Maharaj Terminus',
    code: 'CSMT',
    type: 'RAILWAY',
    cityId: 'mumbai',
    location: { lat: 18.9402, lng: 72.8355 },
  },
  {
    id: 'blr-majestic',
    name: 'Majestic',
    code: 'MJS',
    type: 'METRO',
    cityId: 'bangalore',
    location: { lat: 12.9767, lng: 77.5713 },
  },
];

export const sampleRoutes: RouteSummary[] = [
  {
    id: 'route-delhi-blue',
    title: 'Delhi Metro Blue Line',
    durationMinutes: 24,
    distanceKm: 12.4,
    fareInRupees: 18,
    modes: ['METRO', 'WALK'],
    legs: [
      {
        mode: 'WALK',
        origin: 'Connaught Place',
        destination: 'Rajiv Chowk',
        durationMinutes: 6,
        distanceKm: 0.5,
        fareInRupees: 0,
        fromLat: 28.6315,
        fromLng: 77.2167,
        toLat: 28.6328,
        toLng: 77.2197,
      },
      {
        mode: 'METRO',
        provider: 'DMRC',
        origin: 'Rajiv Chowk',
        destination: 'New Delhi Railway Station',
        durationMinutes: 18,
        distanceKm: 11.9,
        fareInRupees: 18,
        fromLat: 28.6328,
        fromLng: 77.2197,
        toLat: 28.6429,
        toLng: 77.2195,
      },
    ],
  },
  {
    id: 'route-mumbai-metro',
    title: 'Mumbai Metro Line 1',
    durationMinutes: 31,
    distanceKm: 15.1,
    fareInRupees: 20,
    modes: ['METRO', 'WALK'],
    legs: [
      {
        mode: 'WALK',
        origin: 'Andheri',
        destination: 'Station Entrance',
        durationMinutes: 5,
        distanceKm: 0.4,
        fareInRupees: 0,
        fromLat: 19.115,
        fromLng: 72.840,
        toLat: 19.1197,
        toLng: 72.8464,
      },
      {
        mode: 'METRO',
        provider: 'BEST',
        origin: 'Andheri',
        destination: 'Ghatkopar',
        durationMinutes: 26,
        distanceKm: 14.7,
        fareInRupees: 20,
        fromLat: 19.1197,
        fromLng: 72.8464,
        toLat: 19.0865,
        toLng: 72.908,
      },
    ],
  },
];

export const suggestions: SearchSuggestion[] = [
  {
    id: 'cp',
    label: 'Connaught Place',
    sublabel: 'Delhi',
    kind: 'place',
    location: { lat: 28.6315, lng: 77.2167 },
  },
  {
    id: 'ndls',
    label: 'New Delhi Railway Station',
    sublabel: 'Railway stop',
    kind: 'stop',
    location: { lat: 28.6429, lng: 77.2195 },
  },
  {
    id: 'delhi',
    label: 'Delhi',
    sublabel: 'City',
    kind: 'city',
    location: { lat: 28.6139, lng: 77.209 },
  },
];

export const modules: AppModuleStatus[] = [
  {
    id: '1.1',
    name: 'Monorepo Setup',
    phase: 'foundation',
    status: 'done',
    progress: 100,
    summary: 'Turborepo, TypeScript, ESLint, Tailwind, shared workspaces.',
  },
  {
    id: '1.2',
    name: 'Database Schema',
    phase: 'foundation',
    status: 'done',
    progress: 100,
    summary: 'Prisma schema, indexes, relationships, and seed data.',
  },
  {
    id: '1.3',
    name: 'Authentication',
    phase: 'foundation',
    status: 'done',
    progress: 100,
    summary: 'Clerk auth, OTP flow, middleware, and session wiring.',
  },
  {
    id: '1.4',
    name: 'Map Foundation',
    phase: 'foundation',
    status: 'done',
    progress: 100,
    summary: 'Leaflet, geocoding, and location search.',
  },
  {
    id: '1.5',
    name: 'OpenTripPlanner',
    phase: 'foundation',
    status: 'done',
    progress: 100,
    summary: 'OTP Docker setup and routing API client.',
  },
  {
    id: '1.6',
    name: 'Web Shell',
    phase: 'foundation',
    status: 'done',
    progress: 100,
    summary: 'App shell, navigation, providers, and layout states.',
  },
  {
    id: '2.1',
    name: 'Multi-Modal Route Planner',
    phase: 'core',
    status: 'done',
    progress: 100,
    summary: 'Planning, fare calc, sharing, and favourites.',
  },
  {
    id: '2.2',
    name: 'Live Vehicle Tracking',
    phase: 'core',
    status: 'done',
    progress: 100,
    summary: 'Socket.io, Redis pub/sub, and live markers.',
  },
  {
    id: '2.3',
    name: 'Train Module',
    phase: 'core',
    status: 'done',
    progress: 100,
    summary: 'Station search, PNR, booking flow, and QR tickets.',
  },
  {
    id: '2.4',
    name: 'Bus Module',
    phase: 'core',
    status: 'done',
    progress: 100,
    summary: 'State RTC search, seat selector, and bus passes.',
  },
  {
    id: '2.5',
    name: 'Metro Module',
    phase: 'core',
    status: 'done',
    progress: 100,
    summary: 'SVG line maps, fare calculation, and timetables.',
  },
  {
    id: '2.6',
    name: 'Payments System',
    phase: 'core',
    status: 'done',
    progress: 100,
    summary: 'Razorpay checkout, webhooks, invoices, and refunds.',
  },
  {
    id: '2.7',
    name: 'Push Notifications',
    phase: 'core',
    status: 'done',
    progress: 100,
    summary: 'FCM, email, SMS, and scheduled reminders.',
  },
  {
    id: '2.8',
    name: 'User Profile',
    phase: 'core',
    status: 'done',
    progress: 100,
    summary: 'Saved places, history, preferences, and privacy settings.',
  },
  {
    id: '3.1',
    name: 'Flights Module',
    phase: 'services',
    status: 'done',
    progress: 100,
    summary: 'Amadeus search, airport autocomplete, and price alerts.',
  },
  {
    id: '3.2',
    name: 'Cab & Auto Module',
    phase: 'services',
    status: 'done',
    progress: 100,
    summary: 'Deeplinks and fare estimates for ride-hailing and autos.',
  },
  {
    id: '3.3',
    name: 'Bike Rentals',
    phase: 'services',
    status: 'done',
    progress: 100,
    summary: 'Dock maps, coverage polygons, and cycling routes.',
  },
  {
    id: '3.4',
    name: 'Car Rentals',
    phase: 'services',
    status: 'done',
    progress: 100,
    summary: 'Zoomcar listings, packages, and pickup options.',
  },
  {
    id: '3.5',
    name: 'Admin Portal',
    phase: 'services',
    status: 'done',
    progress: 100,
    summary: 'KPI dashboard, user management, bookings, and health.',
  },
  {
    id: '3.6',
    name: 'Support System',
    phase: 'services',
    status: 'done',
    progress: 100,
    summary: 'Tickets, SLA, canned responses, and escalation.',
  },
  {
    id: '3.7',
    name: 'Refunds System',
    phase: 'services',
    status: 'done',
    progress: 100,
    summary: 'Policy engine, refund queue, and dispute handling.',
  },
  {
    id: '3.8',
    name: 'Operator Portal',
    phase: 'services',
    status: 'done',
    progress: 100,
    summary: 'Fleet management, GTFS uploads, and reports.',
  },
  {
    id: '4.1',
    name: 'Android App',
    phase: 'launch',
    status: 'done',
    progress: 100,
    summary: 'Kotlin, Compose, offline cache, and notifications.',
  },
  {
    id: '4.2',
    name: 'iOS App',
    phase: 'launch',
    status: 'done',
    progress: 100,
    summary: 'SwiftUI, APNs, offline cache, and widgets.',
  },
  {
    id: '4.3',
    name: 'PWA Setup',
    phase: 'launch',
    status: 'done',
    progress: 100,
    summary: 'Service worker, install prompt, and offline mode.',
  },
  {
    id: '4.4',
    name: 'SEO & Performance',
    phase: 'launch',
    status: 'done',
    progress: 100,
    summary: 'Metadata, sitemap, structured data, and CWV.',
  },
  {
    id: '4.5',
    name: 'CI/CD Pipeline',
    phase: 'launch',
    status: 'done',
    progress: 100,
    summary: 'Lint, test, build, and deployment workflows.',
  },
  {
    id: '4.6',
    name: 'Monitoring',
    phase: 'launch',
    status: 'done',
    progress: 100,
    summary: 'Sentry, uptime, logging, and health endpoints.',
  },
  {
    id: '4.7',
    name: 'Legal & Compliance',
    phase: 'launch',
    status: 'done',
    progress: 100,
    summary: 'Privacy, terms, refunds, cookies, and grievance.',
  },
  {
    id: '4.8',
    name: 'Launch & Onboarding',
    phase: 'launch',
    status: 'done',
    progress: 100,
    summary: 'Landing page, onboarding, waitlist, and press kit.',
  },
];

export const featurePages: Record<
  string,
  {
    eyebrow: string;
    title: string;
    description: string;
    highlights: Array<{ label: string; value: string }>;
    sections: Array<{ title: string; body: string }>;
  }
> = {
  auth: {
    eyebrow: 'Authentication',
    title: 'Guest mode and authenticated sessions',
    description: 'Clerk login, phone OTP, guest browsing, and protected areas.',
    highlights: [
      { label: 'Guest mode', value: 'Yes' },
      { label: 'Login', value: 'OTP + social' },
      { label: 'Session sync', value: 'Webhook-ready' },
    ],
    sections: [
      {
        title: 'Access model',
        body: 'Guests can browse while signed-in users unlock bookings and saved data.',
      },
      { title: 'Sync', body: 'The documentation specifies webhook-driven user sync into MySQL.' },
    ],
  },
  map: {
    eyebrow: 'Maps',
    title: 'Leaflet and OpenStreetMap foundation',
    description: 'Stop markers, geocoding, city selection, and SSR-safe map loading.',
    highlights: [
      { label: 'Renderer', value: 'Leaflet' },
      { label: 'Tiles', value: 'OpenStreetMap' },
      { label: 'Geocoder', value: 'Nominatim' },
    ],
    sections: [
      {
        title: 'Rendering',
        body: 'This surface will host a dynamic map component and route overlays.',
      },
      { title: 'Search', body: 'Geocoding and location search are expected to ride on Nominatim.' },
    ],
  },
  otp: {
    eyebrow: 'Routing engine',
    title: 'OpenTripPlanner integration',
    description: 'Dockerized OTP deployment, GTFS ingestion, and a typed route planning client.',
    highlights: [
      { label: 'Engine', value: 'OTP 2.x' },
      { label: 'Input', value: 'GTFS' },
      { label: 'Output', value: 'Itineraries' },
    ],
    sections: [
      { title: 'Service', body: 'The plan is to wrap OTP behind a small TypeScript API surface.' },
      {
        title: 'Data',
        body: 'GTFS feeds from Indian operators can be loaded into the routing engine.',
      },
    ],
  },
  shell: {
    eyebrow: 'Shell',
    title: 'Web app shell and navigation',
    description: 'Header, navigation, providers, skeletons, and error states for the app.',
    highlights: [
      { label: 'Layout', value: 'Mobile-first' },
      { label: 'States', value: 'Loading/error' },
      { label: 'UI kit', value: '@moon/ui' },
    ],
    sections: [
      {
        title: 'Shell surface',
        body: 'This page documents the persistent frame around all features.',
      },
      {
        title: 'Integration',
        body: 'Providers, toasts, and nav can sit here once auth and maps arrive.',
      },
    ],
  },
  routes: {
    eyebrow: 'Routing',
    title: 'Multi-modal route planning',
    description: 'Search journeys across metro, bus, rail, flight, walk, and ride-hailing flows.',
    highlights: [
      { label: 'Modes', value: '6+' },
      { label: 'Planning engine', value: 'OTP-ready' },
      { label: 'Saved routes', value: 'Favourites' },
    ],
    sections: [
      {
        title: 'What ships next',
        body: 'Origin/destination search, step-by-step directions, and fare estimates.',
      },
      {
        title: 'How it behaves',
        body: 'The page is ready to connect to the OTP endpoint and cached search results.',
      },
    ],
  },
  planner: {
    eyebrow: 'Planner',
    title: 'Route planner experience',
    description: 'Search journeys, compare itineraries, and save useful routes.',
    highlights: [
      { label: 'Journey search', value: 'From / To' },
      { label: 'Comparison', value: 'Multi-modal' },
      { label: 'Sharing', value: 'Route links' },
    ],
    sections: [
      {
        title: 'Core planner',
        body: 'This is where OTP output and saved favourites can be shown.',
      },
      {
        title: 'Fallbacks',
        body: 'A mocked route result keeps the surface functional without external APIs.',
      },
    ],
  },
  tracking: {
    eyebrow: 'Realtime',
    title: 'Live vehicle tracking',
    description: 'Socket-driven live markers, ETA updates, and delay alerts for subscribed routes.',
    highlights: [
      { label: 'Transport feed', value: 'Socket.io' },
      { label: 'State cache', value: 'Redis' },
      { label: 'Latency', value: 'Near-live' },
    ],
    sections: [
      {
        title: 'Telemetry',
        body: 'Mock update payloads are routed through the API surface for now.',
      },
      {
        title: 'Client view',
        body: 'The page is structured to host a live map panel and route sidebar.',
      },
    ],
  },
  bookings: {
    eyebrow: 'Bookings',
    title: 'Bookings and tickets',
    description:
      'Unify train, bus, metro, flight, cab, bike, and car booking records in one place.',
    highlights: [
      { label: 'Booking types', value: '7' },
      { label: 'Ticket format', value: 'QR' },
      { label: 'Refund state', value: 'Tracked' },
    ],
    sections: [
      {
        title: 'Lifecycle',
        body: 'PENDING, CONFIRMED, CANCELLED, COMPLETED, REFUNDED, and FAILED states are modeled.',
      },
      {
        title: 'Exports',
        body: 'Ticket and invoice routes can return downloadable assets once gateways are wired in.',
      },
    ],
  },
  'live-tracking': {
    eyebrow: 'Tracking',
    title: 'Real-time vehicle tracking',
    description: 'A catch-all surface for the live map and vehicle feed module.',
    highlights: [
      { label: 'Source', value: 'Operator GPS' },
      { label: 'Push', value: 'WebSocket' },
      { label: 'Caches', value: 'Redis' },
    ],
    sections: [
      {
        title: 'UX',
        body: 'The live tracking view can anchor route subscriptions and ETA updates.',
      },
      { title: 'Backend', body: 'It pairs with the tracking API route and pub/sub services.' },
    ],
  },
  train: {
    eyebrow: 'Trains',
    title: 'Train booking surface',
    description: 'PNR checks, station search, booking flows, and e-ticket generation.',
    highlights: [
      { label: 'Storage', value: 'MySQL' },
      { label: 'Tickets', value: 'QR' },
      { label: 'Check', value: 'PNR' },
    ],
    sections: [
      {
        title: 'Flow',
        body: 'The booking page is built to host seat selection and passenger forms.',
      },
      { title: 'Records', body: 'Bookings, tickets, and payments are shared across all modes.' },
    ],
  },
  bus: {
    eyebrow: 'Buses',
    title: 'Bus booking surface',
    description: 'State RTC search, operator listings, seat selection, and passes.',
    highlights: [
      { label: 'RTC', value: 'State-wide' },
      { label: 'Seats', value: 'Selector' },
      { label: 'Passes', value: 'Supported' },
    ],
    sections: [
      {
        title: 'Search',
        body: 'This surface can host operator and route filters for bus journeys.',
      },
      { title: 'Ticketing', body: 'Bus bookings use the same payment and ticket pipeline.' },
    ],
  },
  metro: {
    eyebrow: 'Metro',
    title: 'Metro route surface',
    description: 'Line maps, station info, fares, and timetable views.',
    highlights: [
      { label: 'Cities', value: 'Delhi etc.' },
      { label: 'Maps', value: 'SVG line maps' },
      { label: 'Fare calc', value: 'Yes' },
    ],
    sections: [
      {
        title: 'Lines',
        body: 'Each metro city can be shown with a visual line map and fare logic.',
      },
      { title: 'Tickets', body: 'Metro QR tickets are tracked through the same booking model.' },
    ],
  },
  payments: {
    eyebrow: 'Payments',
    title: 'Razorpay payment flows',
    description: 'Orders, checkout, webhooks, histories, and refund initiation.',
    highlights: [
      { label: 'Gateway', value: 'Razorpay' },
      { label: 'UPI', value: 'Yes' },
      { label: 'Refunds', value: 'Tracked' },
    ],
    sections: [
      {
        title: 'Checkout',
        body: 'This page sits where the payment modal and post-payment state will live.',
      },
      {
        title: 'Webhook',
        body: 'Webhook verification is documented as part of the payment lifecycle.',
      },
    ],
  },
  notifications: {
    eyebrow: 'Notifications',
    title: 'Push, email, and SMS notifications',
    description: 'User-facing alerts, trip reminders, and async messaging.',
    highlights: [
      { label: 'Push', value: 'FCM' },
      { label: 'Email', value: 'Resend' },
      { label: 'SMS', value: 'OTP' },
    ],
    sections: [
      { title: 'Channels', body: 'The doc specifies FCM plus email/SMS for transactional events.' },
      { title: 'Queues', body: 'BullMQ can schedule reminders and delayed notifications.' },
    ],
  },
  'ci-cd': {
    eyebrow: 'CI/CD',
    title: 'Build and deployment automation',
    description: 'PR checks, deploy hooks, and release pipelines for web and mobile.',
    highlights: [
      { label: 'Checks', value: 'Lint/test/build' },
      { label: 'Deploy', value: 'Vercel/Render' },
      { label: 'Automation', value: 'GitHub Actions' },
    ],
    sections: [
      { title: 'Pipeline', body: 'This is the place to document every step in the release path.' },
      { title: 'Artifacts', body: 'Android/iOS fastlane and Lighthouse jobs are expected later.' },
    ],
  },
  android: {
    eyebrow: 'Android',
    title: 'Android app specification',
    description: 'Jetpack Compose app with routing, bookings, offline cache, and notifications.',
    highlights: [
      { label: 'UI', value: 'Compose' },
      { label: 'Offline', value: 'Room' },
      { label: 'Push', value: 'FCM' },
    ],
    sections: [
      {
        title: 'Native layer',
        body: 'The doc calls for a Kotlin app that mirrors the web shell concepts.',
      },
      {
        title: 'Integrations',
        body: 'Maps, bookings, and payments can be matched to the web modules.',
      },
    ],
  },
  ios: {
    eyebrow: 'iOS',
    title: 'iOS app specification',
    description: 'SwiftUI app with MapKit, offline storage, and notification support.',
    highlights: [
      { label: 'UI', value: 'SwiftUI' },
      { label: 'Offline', value: 'CoreData' },
      { label: 'Push', value: 'APNs' },
    ],
    sections: [
      {
        title: 'Native layer',
        body: 'The iOS app mirrors the Android and web experiences in native form.',
      },
      {
        title: 'Extras',
        body: 'Widgets and universal links can be layered on top of the core flows.',
      },
    ],
  },
  profile: {
    eyebrow: 'Account',
    title: 'User profile and preferences',
    description: 'Saved places, journey history, language settings, and privacy controls.',
    highlights: [
      { label: 'Saved places', value: 'Home / Work' },
      { label: 'Languages', value: 'EN + future' },
      { label: 'History', value: 'Trips' },
    ],
    sections: [
      {
        title: 'Personalization',
        body: 'The profile surface is ready for map pins, favourites, and locale preferences.',
      },
      {
        title: 'Privacy',
        body: 'Data deletion and consent flows are modeled for compliance work.',
      },
    ],
  },
  admin: {
    eyebrow: 'Admin',
    title: 'Operations and analytics',
    description: 'Dashboard KPIs, user management, booking controls, and system health.',
    highlights: [
      { label: 'KPIs', value: 'Revenue + usage' },
      { label: 'Access', value: 'Admin only' },
      { label: 'Views', value: 'Charts + tables' },
    ],
    sections: [
      {
        title: 'Operators',
        body: 'This surface is ready for KPI charts, moderation, and data exports.',
      },
      {
        title: 'Health',
        body: 'The API health endpoint below provides a foundation for monitoring widgets.',
      },
    ],
  },
  support: {
    eyebrow: 'Support',
    title: 'Ticketing and support workflow',
    description: 'Create, track, and resolve support requests with SLA-aware queues.',
    highlights: [
      { label: 'Priorities', value: 'Low to Urgent' },
      { label: 'States', value: 'Open to Closed' },
      { label: 'Replies', value: 'Threaded' },
    ],
    sections: [
      {
        title: 'Lifecycle',
        body: 'The ticket model tracks status, priority, assignee, and message history.',
      },
      {
        title: 'Automation',
        body: 'Keyword-based categorisation and escalation logic can sit behind this page.',
      },
    ],
  },
  refunds: {
    eyebrow: 'Refunds',
    title: 'Refund and dispute flow',
    description: 'Auto-approval rules, payment-gateway refunds, and manual dispute queues.',
    highlights: [
      { label: 'Policy engine', value: 'Rules' },
      { label: 'Gateway', value: 'Razorpay' },
      { label: 'Status', value: 'Queued' },
    ],
    sections: [
      {
        title: 'Decisioning',
        body: 'The doc defines refund windows, auto-approval, and manual review paths.',
      },
      { title: 'Notifications', body: 'Refund updates can trigger push and email notifications.' },
    ],
  },
  operator: {
    eyebrow: 'Operator',
    title: 'Fleet and route operations',
    description: 'Manage vehicles, routes, schedules, and live operator reporting.',
    highlights: [
      { label: 'Fleet', value: 'Vehicles' },
      { label: 'Schedules', value: 'GTFS' },
      { label: 'Reports', value: 'Ridership' },
    ],
    sections: [
      {
        title: 'Operations',
        body: 'This page is a placeholder for live route editing and vehicle status management.',
      },
      {
        title: 'Data feeds',
        body: 'It pairs with GTFS sync and vehicle tracking endpoints in the API surface.',
      },
    ],
  },
  launch: {
    eyebrow: 'Launch',
    title: 'Launch assets and onboarding',
    description: 'Landing page copy, onboarding, city selection, and beta waitlist flows.',
    highlights: [
      { label: 'Screens', value: '4 onboarding' },
      { label: 'Waitlist', value: 'Email capture' },
      { label: 'Brand kit', value: 'Press pack' },
    ],
    sections: [
      {
        title: 'Acquisition',
        body: 'This section aligns the launch assets with app-store and press-ready messaging.',
      },
      {
        title: 'Adoption',
        body: 'City picker and share/referral flows can hook in as soon as the mobile layers land.',
      },
    ],
  },
  press: {
    eyebrow: 'Press',
    title: 'Press kit and brand assets',
    description: 'Public assets, brand colors, founder bio, and media contact.',
    highlights: [
      { label: 'Logo pack', value: 'SVG/PNG' },
      { label: 'Media', value: 'Press contact' },
      { label: 'Colors', value: 'Brand system' },
    ],
    sections: [
      {
        title: 'Media kit',
        body: 'This page is the public-facing hub for screenshots, branding, and downloadable assets.',
      },
      { title: 'Trust', body: 'It helps support launches, newsletters, and partner outreach.' },
    ],
  },
  waitlist: {
    eyebrow: 'Waitlist',
    title: 'Beta waitlist and city coverage',
    description: 'Capture interest from cities that do not yet have full live transport coverage.',
    highlights: [
      { label: 'Lead capture', value: 'Email' },
      { label: 'Cities', value: '30+' },
      { label: 'Follow-up', value: 'Resend' },
    ],
    sections: [
      {
        title: 'Audience',
        body: 'Users can sign up to be notified when coverage expands to their city.',
      },
      {
        title: 'Growth loop',
        body: 'This gives the launch stack a simple, documented acquisition path.',
      },
    ],
  },
  onboarding: {
    eyebrow: 'Onboarding',
    title: 'First-run onboarding',
    description: 'Welcome, city selection, location permissions, and notification opt-in.',
    highlights: [
      { label: 'Steps', value: '4' },
      { label: 'Permissions', value: 'Location + push' },
      { label: 'Fallback', value: 'Skip for guest' },
    ],
    sections: [
      {
        title: 'Goal',
        body: 'Onboarding should help users land on the right city and enable useful permissions.',
      },
      {
        title: 'Mobile',
        body: 'The flow is documented now and ready for native app parity later.',
      },
    ],
  },
  flights: {
    eyebrow: 'Flights',
    title: 'Domestic flight search',
    description: 'Airport autocomplete, flight search, and deep links into partner booking flows.',
    highlights: [
      { label: 'Provider', value: 'Amadeus' },
      { label: 'Scope', value: 'Domestic' },
      { label: 'Alerts', value: 'Price watch' },
    ],
    sections: [
      {
        title: 'Search',
        body: 'The page is ready to show flight cards, baggage, and fare filters.',
      },
      {
        title: 'Redirects',
        body: 'Booking continues through OTA deep links rather than direct ticketing.',
      },
    ],
  },
  cabs: {
    eyebrow: 'Cabs',
    title: 'Cab and auto-rickshaw guidance',
    description: 'Estimate fares and open external ride-hailing apps with deep links.',
    highlights: [
      { label: 'Providers', value: 'Ola/Uber/Rapido' },
      { label: 'Auto fare', value: 'City-based' },
      { label: 'Flow', value: 'Deeplink' },
    ],
    sections: [
      {
        title: 'Ride options',
        body: 'This surface explains how to estimate fares and jump into the right app.',
      },
      { title: 'Auto', body: 'For short hops, auto-rickshaw price hints can be shown per city.' },
    ],
  },
  'bike-rentals': {
    eyebrow: 'Bike rentals',
    title: 'Bike and scooter rentals',
    description: 'Dock maps, coverage zones, and cycling-friendly routing hints.',
    highlights: [
      { label: 'Providers', value: 'Yulu/Bounce/Vogo' },
      { label: 'Routing', value: 'Cycling' },
      { label: 'Assets', value: 'Coverage map' },
    ],
    sections: [
      {
        title: 'Coverage',
        body: 'The route surfaces can reuse the same map stack with rental coverage overlays.',
      },
      {
        title: 'Safety',
        body: 'Helmet reminders and availability status can be layered in later.',
      },
    ],
  },
  'car-rentals': {
    eyebrow: 'Car rentals',
    title: 'Car rental discovery',
    description: 'Short-term self-drive and chauffeur-driven car rental discovery.',
    highlights: [
      { label: 'Partner', value: 'Zoomcar' },
      { label: 'Mode', value: 'Self-drive' },
      { label: 'Packages', value: 'Trip bundles' },
    ],
    sections: [
      {
        title: 'Listings',
        body: 'The surface is ready for cards, filters, and trip-package pricing.',
      },
      { title: 'Flow', body: 'A future integration can attach booking and pickup steps here.' },
    ],
  },
  pwa: {
    eyebrow: 'PWA',
    title: 'Progressive web app',
    description: 'Installable web app shell with offline support and update prompts.',
    highlights: [
      { label: 'Offline', value: 'Workbox' },
      { label: 'Install', value: 'Prompt' },
      { label: 'Mode', value: 'App-like' },
    ],
    sections: [
      {
        title: 'Service worker',
        body: 'The page documents the PWA path without pulling in unnecessary runtime complexity.',
      },
      {
        title: 'Install flow',
        body: 'It can later host install banners and background sync status.',
      },
    ],
  },
  seo: {
    eyebrow: 'SEO',
    title: 'SEO and performance',
    description: 'Static metadata, sitemap, robots, structured data, and Core Web Vitals.',
    highlights: [
      { label: 'Metadata', value: 'Dynamic' },
      { label: 'Sitemap', value: 'Ready' },
      { label: 'CWV', value: 'Optimized' },
    ],
    sections: [
      {
        title: 'Discoverability',
        body: 'The site is structured to support city pages and metadata generation.',
      },
      {
        title: 'Performance',
        body: 'The shell stays lean so routing and static generation can remain fast.',
      },
    ],
  },
  monitoring: {
    eyebrow: 'Monitoring',
    title: 'Monitoring and observability',
    description: 'Health checks, error tracking, uptime, and structured logs.',
    highlights: [
      { label: 'Errors', value: 'Sentry' },
      { label: 'Uptime', value: 'BetterStack' },
      { label: 'Health', value: 'API status' },
    ],
    sections: [
      {
        title: 'Visibility',
        body: 'The mock health endpoint below returns service-level status information.',
      },
      {
        title: 'Operations',
        body: 'This provides a landing zone for future alerting and log shipping.',
      },
    ],
  },
  legal: {
    eyebrow: 'Legal',
    title: 'Privacy, terms, refunds, cookies, and grievance',
    description: 'Documentation-aligned legal pages for India-first compliance needs.',
    highlights: [
      { label: 'Pages', value: '5' },
      { label: 'Jurisdiction', value: 'India' },
      { label: 'Consent', value: 'Cookie banner' },
    ],
    sections: [
      {
        title: 'Coverage',
        body: 'The legal surface includes the privacy policy, terms, refunds, cookies, and grievance pages.',
      },
      {
        title: 'Compliance',
        body: 'It provides a foundation for DPDP, IT Act, and GST-related notices.',
      },
    ],
  },
  deployment: {
    eyebrow: 'Deployment',
    title: 'Free-tier deployment guide',
    description:
      'Vercel, Render, PlanetScale, Upstash, Clerk, Firebase, Resend, Sentry, and Cloudflare.',
    highlights: [
      { label: 'Hosting', value: 'Vercel' },
      { label: 'API', value: 'Render' },
      { label: 'Data', value: 'PlanetScale' },
    ],
    sections: [
      {
        title: 'Checklist',
        body: 'This mirrors the deployment section of the specification and its environment variables.',
      },
      {
        title: 'Ops',
        body: 'It is ready to host runbooks and release steps for the production stack.',
      },
    ],
  },
  integrations: {
    eyebrow: 'Integrations',
    title: 'Transport integrations and deeplinks',
    description: 'Indian transit feeds, routing engines, and partner booking deep links.',
    highlights: [
      { label: 'Feeds', value: 'GTFS' },
      { label: 'Routing', value: 'OTP' },
      { label: 'Deep links', value: 'Ola/Uber/etc.' },
    ],
    sections: [
      {
        title: 'Data sources',
        body: 'The documentation lists rail, metro, bus, and flight sources for routing and redirects.',
      },
      {
        title: 'Partner links',
        body: 'Deep links can hand off to cab, rental, and flight partners.',
      },
    ],
  },
  fundraising: {
    eyebrow: 'Fundraising',
    title: 'Fundraising readiness',
    description: 'Core metrics, traction milestones, and revenue-model storytelling.',
    highlights: [
      { label: 'DAU/MAU', value: 'Tracked' },
      { label: 'Bookings', value: 'GMV-ready' },
      { label: 'Pitch', value: 'Metrics-first' },
    ],
    sections: [
      {
        title: 'Milestones',
        body: 'The route map can anchor the beta, traction, and monetisation targets from the spec.',
      },
      {
        title: 'Revenue',
        body: 'Commission, referral, subscription, API, and operator SaaS options are documented.',
      },
    ],
  },
};

export const legalPages: Record<
  string,
  {
    title: string;
    summary: string;
    content: string[];
  }
> = {
  privacy: {
    title: 'Privacy Policy',
    summary: 'DPDP Act 2023 Compliant User Data Protection Policy.',
    content: [
      'Data Fiduciary Notice: We collect only the minimum digital personal data necessary to establish authenticated sessions, perform routing searches, process ticket bookings, and manage customer support.',
      'Data Principal Rights: In accordance with the Digital Personal Data Protection (DPDP) Act 2023, you have the right to access, rectify, or withdraw consent for processing your personal data.',
      'Data Erasure: You may request complete deletion of your account and associated telemetry at any time. We will completely purge your records from our systems within 30 days of request.',
      'Location Telemetry: Accurate coordinates are collected solely to determine nearby stops and route options. We do not store historic location telemetry unless explicitly pinned as a Saved Place.'
    ],
  },
  terms: {
    title: 'Terms of Service',
    summary: 'Usage regulations, booking disclaimers, and service limits.',
    content: [
      'Intermediary Agency: Moon operates as a transit planning intermediary. All transit bookings, seats, and schedules are managed and operated by respective partners (State RTCs, Metro Rail Corporators, IRCTC).',
      'Fare Disclaimers: Fares and ETAs shown during the route planning phase are indicative estimates. Final fares are lock-in confirmed only at checkout via Razorpay.',
      'GSTIN Invoicing: All booking transaction fees are subject to 18% GST which is detailed and broken down in the downloadable PDF invoice.',
      'Age Requirements: Users booking car rentals must be at least 18 years of age and hold a valid Indian driving license.'
    ],
  },
  refunds: {
    title: 'Refund Policy',
    summary: 'Refund timelines, fees, and transport-specific rules.',
    content: [
      'Indian Railways (IRCTC): Bookings cancelled 48h prior to departure are refunded at 95%. Cancellations between 12-48h are refunded at 75%. Cancellations under 12h are refunded at 50%.',
      'State RTC Buses: Bookings cancelled 24h prior to departure are refunded at 90%. Cancellations between 2-24h are refunded at 60%. Cancellations under 2h are non-refundable.',
      'Metro Tokens & QR Tickets: Unused metro tokens and QR tickets can be cancelled on the date of purchase for a 100% refund.',
      'Processing Times: All approved refunds are initiated instantly via Razorpay refund APIs and will reflect in the user bank account within 3-5 business days.'
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    summary: 'Browser storage and user preference consent.',
    content: [
      'Strictly Necessary: We use local storage cookies to retain Clerk authentication sessions, preferred user language, and default home city selections.',
      'Analytics and Telemetry: We utilize Google Analytics 4 (gtag) and Vercel Speed Insights cookies to track page performance metrics and layout shift issues.',
      'Consent Mechanism: You may toggle off non-essential cookies via our Cookie Consent Banner at the bottom of the landing page.'
    ],
  },
  grievance: {
    title: 'Grievance Officer',
    summary: 'Contact and escalation details required under the India IT Act.',
    content: [
      'Grievance Redressal: In compliance with the Information Technology (IT) Act 2000 and rules made thereunder, the contact details of the Grievance Officer are published below.',
      'Officer Name: Rajiv Sharma (Head of Compliance & Legal)',
      'Email and Contact: compliance@moon.in | Phone: +91-120-4567890',
      'Office Address: Moon Transit Technologies Pvt. Ltd., Sector 62, Noida, Uttar Pradesh - 201301, India.',
      'SLA Response Window: We will acknowledge all grievances within 36 hours and resolve disputes or complaints within 15 days of receipt.'
    ],
  },
};

export type FeatureSlug = keyof typeof featurePages;
export type LegalSlug = keyof typeof legalPages;

export function getFeaturePage(slug: string) {
  return featurePages[slug];
}

export function getLegalPage(slug: string) {
  return legalPages[slug as LegalSlug];
}

export function getModule(moduleId: string) {
  return modules.find((module) => module.id === moduleId);
}

export function buildRoutePlan(from: Coordinates, to: Coordinates): RouteSummary {
  const distance = Math.max(
    1,
    Math.round(Math.sqrt((from.lat - to.lat) ** 2 + (from.lng - to.lng) ** 2) * 111)
  );

  const midLat = from.lat + (to.lat - from.lat) * 0.3;
  const midLng = from.lng + (to.lng - from.lng) * 0.3;

  return {
    id: `plan-${from.lat}-${to.lat}`,
    title: 'Walk → Metro',
    durationMinutes: distance * 4,
    distanceKm: Number((distance * 1.2).toFixed(1)),
    fareInRupees: Math.max(10, Math.round(distance * 2)),
    modes: ['WALK', 'METRO'],
    legs: [
      {
        mode: 'WALK',
        origin: 'Origin point',
        destination: 'Nearest stop',
        durationMinutes: 8,
        distanceKm: 0.5,
        fareInRupees: 0,
        fromLat: from.lat,
        fromLng: from.lng,
        toLat: midLat,
        toLng: midLng,
      },
      {
        mode: 'METRO',
        provider: 'DMRC',
        origin: 'Nearest stop',
        destination: 'Destination stop',
        durationMinutes: Math.max(12, distance * 3),
        distanceKm: Number((distance * 1.1).toFixed(1)),
        fareInRupees: Math.max(10, Math.round(distance * 2)),
        fromLat: midLat,
        fromLng: midLng,
        toLat: to.lat,
        toLng: to.lng,
      },
    ],
  };
}
