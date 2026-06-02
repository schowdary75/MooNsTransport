export type ApiResponse<T> = {
  data: T;
  error?: never;
};

export type ApiError = {
  data?: never;
  error: {
    code: string;
    message: string;
  };
};

export type ApiResult<T> = ApiResponse<T> | ApiError;

export type Coordinates = {
  lat: number;
  lng: number;
};

export type TransitMode = 'BUS' | 'METRO' | 'TRAIN' | 'FLIGHT' | 'CAB' | 'WALK' | 'CYCLE' | 'BICYCLE' | 'SUBWAY' | 'RAIL' | 'TRAM';

export type TransitProvider =
  | 'DMRC'
  | 'BEST'
  | 'BMTC'
  | 'CMRL'
  | 'HMRL'
  | 'IRCTC'
  | 'AIRLINE'
  | 'RIDE_HAIL'
  | 'RENTAL';

export type DataSource = 'otp' | 'gtfs-rt' | 'demo';

export type RealtimeStatus = 'scheduled' | 'on_time' | 'delayed' | 'cancelled' | 'disrupted' | 'unknown';

export type CitySummary = {
  id: string;
  name: string;
  state: string;
  country: string;
  location: Coordinates;
};

export type StopSummary = {
  id: string;
  name: string;
  code?: string | null;
  type: 'BUS' | 'METRO' | 'RAILWAY' | 'AIRPORT' | 'FERRY';
  cityId: string;
  location: Coordinates;
};

export type RouteLeg = {
  mode: TransitMode;
  provider?: TransitProvider;
  origin: string;
  destination: string;
  durationMinutes: number;
  distanceKm: number;
  fareInRupees?: number;
  departureTime?: number;
  arrivalTime?: number;
  waitMinutes?: number;
  routeId?: string;
  tripId?: string;
  headsign?: string;
  realtimeStatus?: RealtimeStatus;
  alertSummaries?: string[];
  accessible?: boolean;
  calories?: number;
  co2SavingsKg?: number;
  fromLat?: number;
  fromLng?: number;
  toLat?: number;
  toLng?: number;
  geometry?: string;
  decodedGeometry?: Coordinates[];
  steps?: NavigationStep[];
};

export type RouteSummary = {
  id: string;
  title: string;
  durationMinutes: number;
  distanceKm: number;
  fareInRupees: number;
  modes: TransitMode[];
  legs: RouteLeg[];
  source?: DataSource;
  generatedAt?: string;
  warnings?: string[];
  realtime?: RouteRealtimeState;
  transferCount?: number;
  waitMinutes?: number;
  calories?: number;
  co2SavingsKg?: number;
};

export type NavigationStep = {
  id: string;
  instruction: string;
  mode: TransitMode;
  distanceMeters: number;
  durationMinutes: number;
  from?: Coordinates;
  to?: Coordinates;
  streetName?: string;
  absoluteDirection?: string;
  relativeDirection?: string;
  routeId?: string;
  stopName?: string;
};

export type RealtimeAlert = {
  id: string;
  routeId?: string;
  tripId?: string;
  stopId?: string;
  severity: 'info' | 'warning' | 'severe';
  title: string;
  description?: string;
  effect?: string;
  startsAt?: number;
  endsAt?: number;
  source: DataSource;
};

export type RouteRealtimeState = {
  status: RealtimeStatus;
  delayMinutes?: number;
  alerts?: RealtimeAlert[];
  lastUpdated?: number;
  source: DataSource;
};

export type RealtimeVehicle = {
  id: string;
  routeId: string;
  tripId?: string;
  label?: string;
  mode?: 'bus' | 'metro' | 'train' | 'tram' | 'ferry' | 'unknown';
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  timestamp: number;
  status: 'active' | 'inactive' | 'delayed';
  delayMinutes?: number;
  nextStop?: string;
  etaMinutes?: number;
  stale?: boolean;
  source: DataSource;
  alertIds?: string[];
};

export type PlanRouteResponse = {
  data: RouteSummary[];
  source: DataSource;
  generatedAt: string;
  warnings: string[];
};

export type SearchRouteQuery = {
  origin: Coordinates;
  destination: Coordinates;
  departureTime?: string;
  arrivalTime?: string;
  modes?: TransitMode[];
};

export type SearchSuggestion = {
  id: string;
  label: string;
  sublabel?: string;
  location: Coordinates;
  kind: 'place' | 'stop' | 'route' | 'city';
};

export type AppModuleStatus = {
  id: string;
  name: string;
  phase: 'foundation' | 'core' | 'services' | 'launch';
  status: 'done' | 'in-progress' | 'todo';
  progress: number;
  summary: string;
};
