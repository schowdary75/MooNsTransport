import { Server } from 'socket.io';
import { createServer } from 'http';
import { Redis } from '@upstash/redis';

const PORT = process.env.PORT || 3001;
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const GTFS_RT_VEHICLE_POSITIONS_URLS = splitEnvList(process.env.GTFS_RT_VEHICLE_POSITIONS_URLS);
const GTFS_RT_TRIP_UPDATES_URLS = splitEnvList(process.env.GTFS_RT_TRIP_UPDATES_URLS);
const GTFS_RT_SERVICE_ALERTS_URLS = splitEnvList(process.env.GTFS_RT_SERVICE_ALERTS_URLS);
const GTFS_RT_POLL_INTERVAL_MS = Number(process.env.GTFS_RT_POLL_INTERVAL_MS || 30000);

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

interface VehiclePosition {
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
  source: 'gtfs-rt' | 'demo';
  alertIds?: string[];
}

interface RealtimeAlert {
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
  source: 'gtfs-rt' | 'demo';
}

function splitEnvList(value: string | undefined) {
  return value
    ? value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

// In-Memory fallback store if Upstash Redis credentials are not configured or are placeholders
class MemoryStore {
  private store = new Map<string, { value: string; expiry: number }>();

  async setex(key: string, seconds: number, value: string): Promise<void> {
    this.store.set(key, {
      value,
      expiry: Date.now() + seconds * 1000,
    });
  }

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async keys(pattern: string): Promise<string[]> {
    const allKeys = Array.from(this.store.keys());
    const regexPattern = pattern.replace('*', '.*');
    const regex = new RegExp(`^${regexPattern}$`);
    
    // Clean expired items first
    const now = Date.now();
    for (const [k, v] of this.store.entries()) {
      if (now > v.expiry) {
        this.store.delete(k);
      }
    }

    return allKeys.filter(k => this.store.has(k) && regex.test(k));
  }
}

// Check Redis credentials and connect if valid
let redisStore: any;
const isRedisConfigured = REDIS_URL && !REDIS_URL.includes('your-upstash-instance');

if (isRedisConfigured) {
  try {
    redisStore = new Redis({
      url: REDIS_URL!,
      token: REDIS_TOKEN!,
    });
    console.log('Redis initialized with URL:', REDIS_URL);
  } catch (err) {
    console.error('Failed to initialize Redis, falling back to MemoryStore:', err);
    redisStore = new MemoryStore();
  }
} else {
  console.log('Redis not configured, using in-memory fallback store');
  redisStore = new MemoryStore();
}

// Track connected clients
const vehicleSubscribers: Record<string, Set<string>> = {};

// Publish vehicle position to all subscribed clients
async function broadcastVehiclePosition(position: VehiclePosition) {
  const routeId = position.routeId;
  const normalizedPosition = {
    ...position,
    timestamp: position.timestamp || Date.now(),
    stale: Date.now() - (position.timestamp || Date.now()) > 120000,
  };

  // Save to Redis/MemoryStore for persistence
  try {
    await redisStore.setex(
      `vehicle:${normalizedPosition.id}`,
      300, // 5 minute expiry
      JSON.stringify(normalizedPosition)
    );
  } catch (err) {
    console.error(`Error persisting vehicle position for ${position.id}:`, err);
  }

  // Broadcast to subscribed clients
  io.to(`route:${routeId}`).emit('vehicle_update', normalizedPosition);
  io.to('fleet:all').emit('vehicle_update', normalizedPosition);
}

async function broadcastAlert(alert: RealtimeAlert) {
  try {
    await redisStore.setex(`alert:${alert.id}`, 900, JSON.stringify(alert));
  } catch (err) {
    console.error(`Error persisting alert ${alert.id}:`, err);
  }

  if (alert.routeId) {
    io.to(`route:${alert.routeId}`).emit('service_alert', alert);
  }
  io.to('fleet:all').emit('service_alert', alert);
}

function getEntityList(feed: any): any[] {
  if (Array.isArray(feed)) return feed;
  if (Array.isArray(feed?.entity)) return feed.entity;
  if (Array.isArray(feed?.entities)) return feed.entities;
  return [];
}

function normalizeGtfsVehicle(entity: any, feedIndex: number): VehiclePosition | null {
  const vehicle = entity.vehicle || entity;
  const position = vehicle.position || vehicle;
  const trip = vehicle.trip || {};
  const vehicleDescriptor = vehicle.vehicle || {};
  const lat = Number(position.latitude ?? position.lat);
  const lng = Number(position.longitude ?? position.lng ?? position.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  const delaySeconds = Number(vehicle.delay ?? vehicle.delaySeconds ?? 0);
  const routeId = String(trip.routeId || trip.route_id || vehicle.routeId || vehicle.route_id || `gtfs-feed-${feedIndex}`);
  const timestampSeconds = Number(vehicle.timestamp || entity.timestamp || Date.now() / 1000);

  return {
    id: String(vehicleDescriptor.id || entity.id || `${routeId}-${trip.tripId || trip.trip_id || lat}-${lng}`),
    routeId,
    tripId: trip.tripId || trip.trip_id,
    label: vehicleDescriptor.label,
    mode: 'unknown',
    lat,
    lng,
    heading: position.bearing ?? position.heading,
    speed: position.speed,
    timestamp: timestampSeconds > 10000000000 ? timestampSeconds : timestampSeconds * 1000,
    status: delaySeconds > 60 ? 'delayed' : 'active',
    delayMinutes: delaySeconds > 0 ? Math.round(delaySeconds / 60) : undefined,
    source: 'gtfs-rt',
  };
}

function normalizeGtfsAlert(entity: any, feedIndex: number): RealtimeAlert | null {
  const alert = entity.alert || entity;
  const informed = alert.informedEntity?.[0] || alert.informed_entity?.[0] || {};
  const header = alert.headerText?.translation?.[0]?.text || alert.header_text?.translation?.[0]?.text || alert.title;
  const description =
    alert.descriptionText?.translation?.[0]?.text ||
    alert.description_text?.translation?.[0]?.text ||
    alert.description;

  if (!header && !description) return null;

  return {
    id: String(entity.id || `gtfs-alert-${feedIndex}-${Date.now()}`),
    routeId: informed.routeId || informed.route_id,
    tripId: informed.trip?.tripId || informed.trip?.trip_id,
    stopId: informed.stopId || informed.stop_id,
    severity: alert.cause === 'ACCIDENT' || alert.effect === 'NO_SERVICE' ? 'severe' : 'warning',
    title: header || 'Transit service alert',
    description,
    effect: alert.effect,
    startsAt: alert.activePeriod?.[0]?.start || alert.active_period?.[0]?.start,
    endsAt: alert.activePeriod?.[0]?.end || alert.active_period?.[0]?.end,
    source: 'gtfs-rt',
  };
}

async function fetchGtfsJson(url: string) {
  const response = await fetch(url, {
    headers: { Accept: 'application/json, application/x-protobuf;q=0.9' },
  });

  if (!response.ok) {
    throw new Error(`GTFS-RT feed error ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('json')) {
    console.warn(`GTFS-RT feed ${url} is not JSON. Configure a JSON proxy or add protobuf decoding for this feed.`);
    return null;
  }

  return response.json();
}

async function pollGtfsRealtimeFeeds() {
  await Promise.all(
    GTFS_RT_VEHICLE_POSITIONS_URLS.map(async (url, feedIndex) => {
      try {
        const feed = await fetchGtfsJson(url);
        if (!feed) return;

        for (const entity of getEntityList(feed)) {
          const vehicle = normalizeGtfsVehicle(entity, feedIndex);
          if (vehicle) await broadcastVehiclePosition(vehicle);
        }
      } catch (error) {
        console.error(`VehiclePositions poll failed for ${url}:`, error);
      }
    })
  );

  await Promise.all(
    GTFS_RT_SERVICE_ALERTS_URLS.map(async (url, feedIndex) => {
      try {
        const feed = await fetchGtfsJson(url);
        if (!feed) return;

        for (const entity of getEntityList(feed)) {
          const alert = normalizeGtfsAlert(entity, feedIndex);
          if (alert) await broadcastAlert(alert);
        }
      } catch (error) {
        console.error(`ServiceAlerts poll failed for ${url}:`, error);
      }
    })
  );

  if (GTFS_RT_TRIP_UPDATES_URLS.length > 0) {
    console.log(`TripUpdates feeds configured: ${GTFS_RT_TRIP_UPDATES_URLS.length}. ETA fusion is ready for adapter-specific mapping.`);
  }
}

// Handle client connections
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Subscribe to vehicle updates for a route
  socket.on('subscribe_route', async (routeId: string) => {
    socket.join(`route:${routeId}`);
    socket.join('fleet:all');

    if (!vehicleSubscribers[routeId]) {
      vehicleSubscribers[routeId] = new Set();
    }
    vehicleSubscribers[routeId].add(socket.id);

    // Send current vehicle positions
    try {
      const vehicles = await redisStore.keys(`vehicle:*`);
      for (const key of vehicles) {
        const vehicleData = await redisStore.get(key);
        if (vehicleData) {
          const vehicle = JSON.parse(vehicleData as string) as VehiclePosition;
          if (vehicle.routeId === routeId) {
            socket.emit('vehicle_update', vehicle);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }

    socket.emit('subscription_confirmed', { routeId });
  });

  // Unsubscribe from route
  socket.on('unsubscribe_route', (routeId: string) => {
    socket.leave(`route:${routeId}`);
    if (vehicleSubscribers[routeId]) {
      vehicleSubscribers[routeId].delete(socket.id);
    }
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    // Cleanup subscriptions
    Object.keys(vehicleSubscribers).forEach((routeId) => {
      vehicleSubscribers[routeId].delete(socket.id);
    });
  });
});

// HTTP endpoint for vehicle position updates
httpServer.on('request', async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/tracking/update') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', async () => {
      try {
        const position: VehiclePosition = JSON.parse(body);
        position.timestamp = Date.now();
        position.source = position.source || 'gtfs-rt';

        await broadcastVehiclePosition(position);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (error) {
        console.error('Error processing update:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid data' }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

httpServer.listen(PORT, () => {
  console.log(`Vehicle tracking server running on port ${PORT}`);
});

// Seed data and simulator setup for vehicles
const simulatedVehicles = [
  {
    id: 'DMRC-421',
    routeId: 'Blue Line',
    lat: 28.6139,
    lng: 77.209,
    heading: 90,
    speed: 50,
    status: 'active' as const,
    source: 'demo' as const,
  },
  {
    id: 'BEST-117',
    routeId: 'City Loop 10A',
    lat: 19.076,
    lng: 72.8777,
    heading: 180,
    speed: 30,
    status: 'active' as const,
    source: 'demo' as const,
  },
  {
    id: 'BMTC-33',
    routeId: 'Tech Corridor Express',
    lat: 12.9716,
    lng: 77.5946,
    heading: 270,
    speed: 40,
    status: 'active' as const,
    source: 'demo' as const,
  },
  {
    id: 'DMRC-889',
    routeId: 'Yellow Line',
    lat: 28.6328,
    lng: 77.2197,
    heading: 0,
    speed: 55,
    status: 'active' as const,
    source: 'demo' as const,
  },
  {
    id: 'BMRCL-45',
    routeId: 'Green Line',
    lat: 12.9767,
    lng: 77.5713,
    heading: 135,
    speed: 45,
    status: 'active' as const,
    source: 'demo' as const,
  },
];

const hasGtfsRealtimeFeeds =
  GTFS_RT_VEHICLE_POSITIONS_URLS.length > 0 ||
  GTFS_RT_TRIP_UPDATES_URLS.length > 0 ||
  GTFS_RT_SERVICE_ALERTS_URLS.length > 0;

if (hasGtfsRealtimeFeeds) {
  console.log('GTFS-RT polling enabled', {
    vehicleFeeds: GTFS_RT_VEHICLE_POSITIONS_URLS.length,
    tripUpdateFeeds: GTFS_RT_TRIP_UPDATES_URLS.length,
    alertFeeds: GTFS_RT_SERVICE_ALERTS_URLS.length,
    intervalMs: GTFS_RT_POLL_INTERVAL_MS,
  });
  void pollGtfsRealtimeFeeds();
  setInterval(() => void pollGtfsRealtimeFeeds(), GTFS_RT_POLL_INTERVAL_MS);
}

// Start background server simulation of vehicle movement
setInterval(async () => {
  if (hasGtfsRealtimeFeeds) return;

  for (const v of simulatedVehicles) {
    // Add small random movement
    const latDelta = (Math.random() - 0.5) * 0.0006;
    const lngDelta = (Math.random() - 0.5) * 0.0006;
    v.lat += latDelta;
    v.lng += lngDelta;
    v.heading = (v.heading + Math.floor(Math.random() * 20) - 10 + 360) % 360;

    const position: VehiclePosition = {
      id: v.id,
      routeId: v.routeId,
      lat: v.lat,
      lng: v.lng,
      heading: v.heading,
      speed: v.speed,
      timestamp: Date.now(),
      status: Math.random() > 0.85 ? 'delayed' : 'active',
      delayMinutes: Math.random() > 0.85 ? Math.floor(Math.random() * 10) + 1 : undefined,
      etaMinutes: Math.floor(Math.random() * 8) + 1,
      source: 'demo',
    };

    try {
      await broadcastVehiclePosition(position);
    } catch (err) {
      console.error(`Simulator error broadcasting for ${v.id}:`, err);
    }
  }
}, 2000);

// Graceful shutdown
process.on('SIGTERM', () => {
  httpServer.close(() => {
    console.log('Server terminated');
    process.exit(0);
  });
});
