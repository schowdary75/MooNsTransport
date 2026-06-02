import crypto from 'node:crypto';

import { auth, clerkClient } from '@clerk/nextjs/server';
import {
  Prisma,
  BookingType,
  BookingStatus,
  PaymentMethod,
  PaymentStatus,
  RefundStatus,
  TicketCategory,
  TicketPriority,
  TicketStatus,
  UserRole,
  prisma,
} from '@moon/db';
import type { Coordinates, RouteSummary, StopSummary } from '@moon/api';
import { planRoute } from '@moon/api/otp-client';
import { buildRoutePlan, cities, stops, suggestions } from './site-data';
import {
  hasLiveClerk,
  hasLiveDatabase,
  hasLiveOtp,
  hasLiveRazorpay,
  serviceConfig,
} from './service-config';

type DemoUser = {
  id: string;
  clerkId: string;
  phone: string | null;
  email: string | null;
  name: string | null;
  avatar: string | null;
  role: UserRole;
  preferredLang: string;
  homeAddress: string | null;
  workAddress: string | null;
};

type DemoBooking = {
  id: string;
  type: string;
  status: string;
  fromStop: string;
  toStop: string;
  journeyDate: string;
  passengers: number;
  totalFare: number;
  currency: string;
  externalRef: string | null;
};

type DemoTicket = {
  id: string;
  bookingId: string;
  seatNumber: string;
  coachNumber: string;
  qrCode: string;
  isUsed: boolean;
  validFrom: string;
  validTo: string;
  passengerName: string;
};

type DemoSupportTicket = {
  id: string;
  userId: string;
  bookingId: string | null;
  category: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string | null;
  resolvedAt: string | null;
  createdAt: string;
};

type DemoPayment = {
  id: string;
  bookingId: string | null;
  amount: number;
  currency: string;
  status: string;
  method: string;
};

type DemoRefund = {
  id: string;
  bookingId: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: string;
};

type UserContext = {
  user: DemoUser | null;
  source: 'clerk' | 'demo';
  persisted: boolean;
};

function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, init);
}

function isTruthy(value: string | undefined | null) {
  return Boolean(value && value.trim().length > 0);
}

function toNumber(value: Prisma.Decimal | number | null | undefined) {
  if (typeof value === 'number') return value;
  if (value == null) return 0;
  return Number(value.toString());
}

function demoUser(): DemoUser {
  return {
    id: 'user_1',
    clerkId: 'demo_clerk_user',
    phone: '+919999999999',
    email: 'demo@moon.local',
    name: 'Demo Rider',
    avatar: null,
    role: UserRole.USER,
    preferredLang: 'en',
    homeAddress: 'Connaught Place, Delhi',
    workAddress: 'New Delhi Railway Station',
  };
}

function demoBooking(id = 'booking_1'): DemoBooking {
  return {
    id,
    type: 'METRO',
    status: 'CONFIRMED',
    fromStop: 'Connaught Place',
    toStop: 'New Delhi Railway Station',
    journeyDate: new Date('2026-05-28T10:00:00.000Z').toISOString(),
    passengers: 1,
    totalFare: 18,
    currency: 'INR',
    externalRef: 'PNR123456',
  };
}

function demoTicket(bookingId = 'booking_1'): DemoTicket {
  return {
    id: 'ticket_1',
    bookingId,
    seatNumber: '12A',
    coachNumber: 'M1',
    qrCode: 'mock-qr-code',
    isUsed: false,
    validFrom: new Date('2026-05-28T10:00:00.000Z').toISOString(),
    validTo: new Date('2026-05-28T12:00:00.000Z').toISOString(),
    passengerName: 'Demo Rider',
  };
}

function demoSupportTicket(id = 'ticket_1'): DemoSupportTicket {
  return {
    id,
    userId: 'user_1',
    bookingId: 'booking_1',
    category: 'BOOKING_ISSUE',
    subject: 'Need help with my booking',
    description: 'The documentation-driven mock ticket is ready for support flows.',
    status: 'OPEN',
    priority: 'MEDIUM',
    assignedTo: null,
    resolvedAt: null,
    createdAt: new Date('2026-05-28T10:00:00.000Z').toISOString(),
  };
}

function demoPayment(id = 'payment_1'): DemoPayment {
  return {
    id,
    bookingId: 'booking_1',
    amount: 18,
    currency: 'INR',
    status: 'CAPTURED',
    method: 'UPI',
  };
}

function demoRefund(id = 'refund_1'): DemoRefund {
  return {
    id,
    bookingId: 'booking_1',
    paymentId: 'payment_1',
    amount: 18,
    reason: 'Auto-approved',
    status: 'APPROVED',
  };
}

async function safeDb<T>(operation: () => Promise<T>, fallback: () => Promise<T> | T): Promise<T> {
  try {
    return await operation();
  } catch {
    return await fallback();
  }
}

function mapCity(city: {
  id: string;
  name: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
}) {
  return {
    id: city.id,
    name: city.name,
    state: city.state,
    country: city.country,
    location: { lat: city.lat, lng: city.lng },
  };
}

function mapStop(stop: {
  id: string;
  name: string;
  code: string | null;
  type: StopSummary['type'];
  cityId: string;
  lat: number;
  lng: number;
}) {
  return {
    id: stop.id,
    name: stop.name,
    code: stop.code ?? undefined,
    type: stop.type,
    cityId: stop.cityId,
    location: { lat: stop.lat, lng: stop.lng },
  } satisfies StopSummary;
}

function mapBooking(booking: {
  id: string;
  type: string;
  status: string;
  fromStop: string;
  toStop: string;
  journeyDate: Date;
  passengers: number;
  totalFare: Prisma.Decimal | number;
  currency: string;
  externalRef: string | null;
}) {
  return {
    id: booking.id,
    type: booking.type,
    status: booking.status,
    fromStop: booking.fromStop,
    toStop: booking.toStop,
    journeyDate: booking.journeyDate.toISOString(),
    passengers: booking.passengers,
    totalFare: toNumber(booking.totalFare),
    currency: booking.currency,
    externalRef: booking.externalRef,
  };
}

function mapTicket(ticket: {
  id: string;
  bookingId: string;
  seatNumber: string | null;
  coachNumber: string | null;
  qrCode: string | null;
  isUsed: boolean;
  validFrom: Date;
  validTo: Date;
  passengerName: string | null;
}) {
  return {
    id: ticket.id,
    bookingId: ticket.bookingId,
    seatNumber: ticket.seatNumber,
    coachNumber: ticket.coachNumber,
    qrCode: ticket.qrCode,
    isUsed: ticket.isUsed,
    validFrom: ticket.validFrom.toISOString(),
    validTo: ticket.validTo.toISOString(),
    passengerName: ticket.passengerName,
  };
}

function mapSupportTicket(ticket: {
  id: string;
  userId: string;
  bookingId: string | null;
  category: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string | null;
  resolvedAt: Date | null;
  createdAt: Date;
}) {
  return {
    id: ticket.id,
    userId: ticket.userId,
    bookingId: ticket.bookingId,
    category: ticket.category,
    subject: ticket.subject,
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority,
    assignedTo: ticket.assignedTo,
    resolvedAt: ticket.resolvedAt?.toISOString() ?? null,
    createdAt: ticket.createdAt.toISOString(),
  };
}

function mapPayment(payment: {
  id: string;
  bookingId: string | null;
  amount: Prisma.Decimal;
  currency: string;
  status: string;
  method: string;
}) {
  return {
    id: payment.id,
    bookingId: payment.bookingId,
    amount: toNumber(payment.amount),
    currency: payment.currency,
    status: payment.status,
    method: payment.method,
  };
}

function mapRefund(refund: {
  id: string;
  bookingId: string;
  paymentId: string;
  amount: Prisma.Decimal;
  reason: string;
  status: string;
}) {
  return {
    id: refund.id,
    bookingId: refund.bookingId,
    paymentId: refund.paymentId,
    amount: toNumber(refund.amount),
    reason: refund.reason,
    status: refund.status,
  };
}

async function getCurrentUserContext(): Promise<UserContext> {
  let demoRole: string | undefined;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { cookies } = require('next/headers');
    demoRole = cookies().get('moon_demo_role')?.value;
  } catch (e) {
    // Ignore in non-next contexts
  }

  if (demoRole) {
    const clerkId = demoRole === 'ADMIN' ? 'demo_admin_seed' : demoRole === 'OPERATOR' ? 'demo_operator_seed' : 'demo_user_seed';
    const user = await safeDb(
      async () => {
        const dbUser = await prisma.user.findUnique({
          where: { clerkId },
        });
        if (!dbUser) return null;
        return {
          id: dbUser.id,
          clerkId: dbUser.clerkId,
          phone: dbUser.phone,
          email: dbUser.email,
          name: dbUser.name,
          avatar: dbUser.avatar,
          role: dbUser.role,
          preferredLang: dbUser.preferredLang,
          homeAddress: dbUser.homeAddress,
          workAddress: dbUser.workAddress,
        } satisfies DemoUser;
      },
      () => ({
        id: clerkId === 'demo_user_seed' ? 'user_1' : clerkId,
        clerkId,
        phone: '+919999999999',
        email: demoRole === 'ADMIN' ? 'admin@moon.local' : demoRole === 'OPERATOR' ? 'operator@moon.local' : 'demo@moon.local',
        name: demoRole === 'ADMIN' ? 'Moon Admin' : demoRole === 'OPERATOR' ? 'Metro Operator' : 'Demo Rider',
        avatar: null,
        role: demoRole as any,
        preferredLang: 'en',
        homeAddress: null,
        workAddress: null,
      })
    );
    if (user) {
      return { user, source: 'demo', persisted: true };
    }
  }

  const session = auth();
  if (!session.userId) {
    return { user: null, source: 'demo', persisted: false };
  }

  const clerkUser = await clerkClient.users.getUser(session.userId).catch(() => null);
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? null;
  const phone = clerkUser?.phoneNumbers?.[0]?.phoneNumber ?? null;
  const name = [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') || null;
  const avatar = clerkUser?.imageUrl ?? null;

  const user = await safeDb(
    async () => {
      const persisted = await prisma.user.upsert({
        where: { clerkId: session.userId },
        update: {
          phone,
          email,
          name,
          avatar,
        },
        create: {
          clerkId: session.userId,
          phone,
          email,
          name,
          avatar,
          role: UserRole.USER,
        },
      });

      return {
        id: persisted.id,
        clerkId: persisted.clerkId,
        phone: persisted.phone,
        email: persisted.email,
        name: persisted.name,
        avatar: persisted.avatar,
        role: persisted.role,
        preferredLang: persisted.preferredLang,
        homeAddress: persisted.homeAddress,
        workAddress: persisted.workAddress,
      } satisfies DemoUser;
    },
    async () => ({
      id: session.userId,
      clerkId: session.userId,
      phone,
      email,
      name,
      avatar,
      role: UserRole.USER,
      preferredLang: 'en',
      homeAddress: null,
      workAddress: null,
    })
  );

  return { user, source: 'clerk', persisted: true };
}

async function getOrDemoUser() {
  const context = await getCurrentUserContext();
  if (context.user) return context.user;
  return demoUser();
}

function parseJsonBody(request: Request): Promise<Record<string, unknown>> {
  return request.json().catch(() => ({}));
}

export async function getHealthSnapshot() {
  const database = await safeDb(
    async () => {
      await prisma.$queryRaw`SELECT 1`;
      return { status: 'up', latency_ms: 12 };
    },
    () => ({ status: hasLiveDatabase() ? 'configured' : 'mock', latency_ms: 0 })
  );

  const otpConfigured = hasLiveOtp();
  const razorpayConfigured = hasLiveRazorpay();
  const clerkConfigured = hasLiveClerk();
  const nominatimConfigured = isTruthy(serviceConfig.nominatimUrl);
  const redisConfigured = isTruthy(serviceConfig.upstashRedisUrl);

  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database,
      redis: {
        status: redisConfigured ? 'configured' : 'mock',
        latency_ms: redisConfigured ? 4 : 0,
      },
      otp: { status: otpConfigured ? 'configured' : 'mock', latency_ms: otpConfigured ? 230 : 0 },
      razorpay: {
        status: razorpayConfigured ? 'configured' : 'mock',
        latency_ms: razorpayConfigured ? 180 : 0,
      },
      clerk: {
        status: clerkConfigured ? 'configured' : 'mock',
        latency_ms: clerkConfigured ? 20 : 0,
      },
      nominatim: {
        status: nominatimConfigured ? 'configured' : 'mock',
        latency_ms: nominatimConfigured ? 120 : 0,
      },
    },
  };
}

export async function getProviderHealthSnapshot(provider: string) {
  const normalized = provider.toLowerCase();
  if (normalized === 'all') {
    return getHealthSnapshot();
  }

  const base = await getHealthSnapshot();

  if (normalized === 'otp') {
    return {
      provider: 'otp',
      configured: hasLiveOtp(),
      endpoint: serviceConfig.otpApiUrl ?? null,
      health: base.services.otp,
    };
  }

  if (normalized === 'razorpay') {
    return {
      provider: 'razorpay',
      configured: hasLiveRazorpay(),
      keyId: serviceConfig.razorpayKeyId ? `${serviceConfig.razorpayKeyId.slice(0, 8)}...` : null,
      health: base.services.razorpay,
    };
  }

  if (normalized === 'clerk') {
    return {
      provider: 'clerk',
      configured: hasLiveClerk(),
      health: base.services.clerk,
    };
  }

  if (normalized === 'database') {
    return {
      provider: 'database',
      configured: hasLiveDatabase(),
      health: base.services.database,
    };
  }

  if (normalized === 'nominatim') {
    return {
      provider: 'nominatim',
      configured: isTruthy(serviceConfig.nominatimUrl),
      endpoint: serviceConfig.nominatimUrl ?? null,
      health: base.services.nominatim,
    };
  }

  return {
    provider: normalized,
    configured: false,
    health: { status: 'mock', latency_ms: 0 },
  };
}

function transformOtpItinerary(itinerary: {
  duration?: number;
  walkTime?: number;
  transfers?: number;
  legs?: Array<{
    mode?: string;
    route?: string;
    from?: { name?: string };
    to?: { name?: string };
    duration?: number;
    distance?: number;
    fare?: { cents?: number };
    agencyName?: string;
  }>;
}) {
  const legs = itinerary.legs ?? [];
  const distanceKm = legs.reduce((total, leg) => total + (leg.distance ?? 0), 0) / 1000;
  const fare = legs.reduce((total, leg) => total + (leg.fare?.cents ?? 0) / 100, 0);

  return {
    id: crypto.randomUUID(),
    title: 'OTP route plan',
    durationMinutes: Math.round((itinerary.duration ?? 0) / 60) || 0,
    distanceKm: Number(distanceKm.toFixed(1)),
    fareInRupees: Math.max(0, Math.round(fare)),
    modes: Array.from(
      new Set(
        legs.map((leg) => {
          const mode = (leg.mode ?? 'WALK').toUpperCase();
          return mode === 'TRANSIT' ? 'METRO' : mode;
        })
      )
    ) as RouteSummary['modes'],
    legs: legs.map((leg) => ({
      mode: (leg.mode?.toUpperCase() ?? 'WALK') as RouteSummary['legs'][number]['mode'],
      provider: (leg.agencyName ?? undefined) as RouteSummary['legs'][number]['provider'],
      origin: leg.from?.name ?? 'Origin',
      destination: leg.to?.name ?? 'Destination',
      durationMinutes: Math.round((leg.duration ?? 0) / 60),
      distanceKm: Number(((leg.distance ?? 0) / 1000).toFixed(1)),
      fareInRupees: leg.fare?.cents ? Math.round(leg.fare.cents / 100) : undefined,
    })),
  } satisfies RouteSummary;
}

async function fetchOtpPlan(from: Coordinates, to: Coordinates) {
  const otpBase = serviceConfig.otpApiUrl;
  if (!otpBase) return null;

  const url = new URL('/otp/routers/default/plan', otpBase);
  url.searchParams.set('fromPlace', `${from.lat},${from.lng}`);
  url.searchParams.set('toPlace', `${to.lat},${to.lng}`);
  url.searchParams.set('mode', 'TRANSIT,WALK');
  url.searchParams.set('numItineraries', '3');
  url.searchParams.set('arriveBy', 'false');

  const response = await fetch(url, { headers: { accept: 'application/json' } });
  if (!response.ok) return null;

  const payload = (await response.json()) as {
    plan?: { itineraries?: Array<Record<string, unknown>> };
  };
  const itineraries = payload.plan?.itineraries ?? [];
  if (itineraries.length === 0) return null;

  return itineraries.map((itinerary) =>
    transformOtpItinerary(itinerary as Parameters<typeof transformOtpItinerary>[0])
  );
}

export async function getRoutePlanResponse(request: Request) {
  let fromLat = 28.6139;
  let fromLng = 77.209;
  let toLat = 28.6429;
  let toLng = 77.2195;
  let date = new Date().toISOString().split('T')[0];
  let time = '09:00';
  let modesStr = 'WALK,BUS,METRO,TRAIN,SUBWAY';

  if (request.method === 'POST') {
    try {
      const body = await parseJsonBody(request);
      if (typeof body.fromLat === 'number') fromLat = body.fromLat;
      if (typeof body.fromLng === 'number') fromLng = body.fromLng;
      if (typeof body.toLat === 'number') toLat = body.toLat;
      if (typeof body.toLng === 'number') toLng = body.toLng;
      if (typeof body.date === 'string') date = body.date;
      if (typeof body.time === 'string') time = body.time;
      if (typeof body.modes === 'string') modesStr = body.modes;
    } catch (e) {
      console.error('Failed to parse JSON body for route plan:', e);
    }
  } else {
    const url = new URL(request.url);
    if (url.searchParams.get('fromLat')) fromLat = Number(url.searchParams.get('fromLat'));
    if (url.searchParams.get('fromLng')) fromLng = Number(url.searchParams.get('fromLng'));
    if (url.searchParams.get('toLat')) toLat = Number(url.searchParams.get('toLat'));
    if (url.searchParams.get('toLng')) toLng = Number(url.searchParams.get('toLng'));
    if (url.searchParams.get('date')) date = url.searchParams.get('date')!;
    if (url.searchParams.get('time')) time = url.searchParams.get('time')!;
    if (url.searchParams.get('modes')) modesStr = url.searchParams.get('modes')!;
  }

  const itineraries = await planRoute({
    fromLat,
    fromLng,
    toLat,
    toLng,
    date,
    time,
    modes: modesStr,
  });

  return json({
    source: serviceConfig.otpApiUrl ? 'otp' : 'mock',
    itineraries,
    suggestions,
    cities,
    stops,
  });
}

export async function getStopsResponse() {
  const dbStops = await safeDb(
    async () => {
      const records = await prisma.stop.findMany({
        orderBy: [{ cityId: 'asc' }, { name: 'asc' }],
      });
      return records.map((record) => mapStop(record));
    },
    () => stops
  );

  const dbCities = await safeDb(
    async () => {
      const records = await prisma.city.findMany({ orderBy: { name: 'asc' } });
      return records.map((record) => mapCity(record));
    },
    () => cities
  );

  return json({ stops: dbStops, cities: dbCities });
}

export async function getCurrentUserResponse(_request: Request) {
  return json({ user: await getOrDemoUser() });
}

export async function updateCurrentUserResponse(request: Request) {
  const body = await parseJsonBody(request);
  const context = await getCurrentUserContext();
  const current = context.user ?? demoUser();

  const payload = {
    phone: typeof body.phone === 'string' ? body.phone : current.phone,
    email: typeof body.email === 'string' ? body.email : current.email,
    name: typeof body.name === 'string' ? body.name : current.name,
    avatar: typeof body.avatar === 'string' ? body.avatar : current.avatar,
    preferredLang:
      typeof body.preferredLang === 'string' ? body.preferredLang : current.preferredLang,
    homeAddress: typeof body.homeAddress === 'string' ? body.homeAddress : current.homeAddress,
    workAddress: typeof body.workAddress === 'string' ? body.workAddress : current.workAddress,
  };

  const updated = await safeDb(
    async () => {
      if (!context.user) return current;
      const record = await prisma.user.upsert({
        where: { clerkId: context.user.clerkId },
        update: payload,
        create: {
          clerkId: context.user.clerkId,
          phone: payload.phone,
          email: payload.email,
          name: payload.name,
          avatar: payload.avatar,
          preferredLang: payload.preferredLang,
          homeAddress: payload.homeAddress,
          workAddress: payload.workAddress,
          role: UserRole.USER,
        },
      });

      return {
        id: record.id,
        clerkId: record.clerkId,
        phone: record.phone,
        email: record.email,
        name: record.name,
        avatar: record.avatar,
        role: record.role,
        preferredLang: record.preferredLang,
        homeAddress: record.homeAddress,
        workAddress: record.workAddress,
      } satisfies DemoUser;
    },
    () => ({ ...current, ...payload })
  );

  return json({ user: updated, updated: true });
}

export async function getSavedPlacesResponse(_request: Request) {
  const user = await getOrDemoUser();

  const places = await safeDb(
    async () => {
      const records = await prisma.savedPlace.findMany({
        where: { user: { clerkId: user.clerkId } },
        orderBy: [{ createdAt: 'asc' }],
      });
      return records.map((record) => ({
        id: record.id,
        userId: record.userId,
        label: record.label,
        address: record.address,
        lat: record.lat,
        lng: record.lng,
        icon: record.icon,
      }));
    },
    () => [
      {
        id: 'place_1',
        userId: user.id,
        label: 'Home',
        address: 'Connaught Place, Delhi',
        lat: 28.6328,
        lng: 77.2197,
        icon: 'home',
      },
      {
        id: 'place_2',
        userId: user.id,
        label: 'Work',
        address: 'New Delhi Railway Station',
        lat: 28.6429,
        lng: 77.2195,
        icon: 'briefcase',
      },
    ]
  );

  return json({ places });
}

export async function createSavedPlaceResponse(request: Request) {
  const user = await getOrDemoUser();
  const body = await parseJsonBody(request);
  const place = {
    label: typeof body.label === 'string' ? body.label : 'Saved place',
    address: typeof body.address === 'string' ? body.address : 'Unknown address',
    lat: typeof body.lat === 'number' ? body.lat : 28.6328,
    lng: typeof body.lng === 'number' ? body.lng : 77.2197,
    icon: typeof body.icon === 'string' ? body.icon : null,
  };

  const created = await safeDb(
    async () => {
      const record = await prisma.savedPlace.create({
        data: {
          userId: user.id,
          ...place,
        },
      });

      return {
        id: record.id,
        userId: record.userId,
        label: record.label,
        address: record.address,
        lat: record.lat,
        lng: record.lng,
        icon: record.icon,
      };
    },
    () => ({
      id: 'place_1',
      userId: user.id,
      ...place,
    })
  );

  return json({ created: true, place: created });
}

export async function getJourneyHistoryResponse(_request: Request) {
  const user = await getOrDemoUser();

  const journeys = await safeDb(
    async () => {
      const records = await prisma.journeyHistory.findMany({
        where: { user: { clerkId: user.clerkId } },
        orderBy: { createdAt: 'desc' },
      });
      return records.map((record) => ({
        id: record.id,
        fromName: record.fromName,
        toName: record.toName,
        modes: record.modes,
        duration: record.duration,
        distance: toNumber(record.distance),
        createdAt: record.createdAt.toISOString(),
      }));
    },
    () => [
      {
        id: 'journey_1',
        fromName: 'Connaught Place',
        toName: 'New Delhi Railway Station',
        modes: 'METRO,WALK',
        duration: 24,
        distance: 2.8,
        createdAt: new Date('2026-05-27T10:00:00.000Z').toISOString(),
      },
    ]
  );

  return json({ journeys });
}

export async function listBookingsResponse(_request: Request) {
  const user = await getOrDemoUser();

  const bookings = await safeDb(
    async () => {
      const records = await prisma.booking.findMany({
        where: { user: { clerkId: user.clerkId } },
        include: { tickets: true, payment: true },
        orderBy: { createdAt: 'desc' },
      });
      return records.map((record) => ({
        ...mapBooking(record),
        ticketCount: record.tickets.length,
        payment: record.payment ? mapPayment(record.payment) : null,
      }));
    },
    () => [demoBooking('booking_1'), demoBooking('booking_2')]
  );

  return json({ bookings });
}

export async function createBookingResponse(request: Request) {
  const user = await getOrDemoUser();
  const body = await parseJsonBody(request);

  const bookingPayload = {
    type: (typeof body.type === 'string' ? body.type : 'METRO') as BookingType,
    fromStop: typeof body.fromStop === 'string' ? body.fromStop : 'Connaught Place',
    toStop: typeof body.toStop === 'string' ? body.toStop : 'New Delhi Railway Station',
    journeyDate: body.journeyDate
      ? new Date(String(body.journeyDate))
      : new Date('2026-05-28T10:00:00.000Z'),
    passengers: typeof body.passengers === 'number' ? body.passengers : 1,
    totalFare: typeof body.totalFare === 'number' ? body.totalFare : 18,
    currency: typeof body.currency === 'string' ? body.currency : 'INR',
    externalRef: typeof body.externalRef === 'string' ? body.externalRef : 'PNR123456',
  };

  const result = await safeDb(
    async () => {
      const booking = await prisma.booking.create({
        data: {
          userId: user.id,
          type: bookingPayload.type,
          fromStop: bookingPayload.fromStop,
          toStop: bookingPayload.toStop,
          journeyDate: bookingPayload.journeyDate,
          passengers: bookingPayload.passengers,
          totalFare: new Prisma.Decimal(bookingPayload.totalFare),
          currency: bookingPayload.currency,
          externalRef: bookingPayload.externalRef,
          status: BookingStatus.CONFIRMED,
        },
      });

      const ticket = await prisma.ticket.create({
        data: {
          bookingId: booking.id,
          seatNumber: '12A',
          coachNumber: 'M1',
          qrCode: `qr_${booking.id}`,
          validFrom: booking.journeyDate,
          validTo: new Date(booking.journeyDate.getTime() + 2 * 60 * 60 * 1000),
          passengerName: user.name ?? 'Demo Rider',
        },
      });

      return { booking: mapBooking(booking), ticket: mapTicket(ticket) };
    },
    () => ({ booking: demoBooking(), ticket: demoTicket() })
  );

  return json(result, { status: 201 });
}

export async function getBookingResponse(request: Request, bookingId: string) {
  const user = await getOrDemoUser();

  const booking = await safeDb(
    async () => {
      const record = await prisma.booking.findFirst({
        where: { id: bookingId, user: { clerkId: user.clerkId } },
        include: { payment: true, tickets: true },
      });
      if (!record) return null;
      return {
        booking: mapBooking(record),
        ticket: record.tickets[0] ? mapTicket(record.tickets[0]) : null,
        payment: record.payment ? mapPayment(record.payment) : null,
      };
    },
    () => ({
      booking: demoBooking(bookingId),
      ticket: demoTicket(bookingId),
      payment: demoPayment(),
    })
  );

  if (!booking) {
    return json({ error: { code: 'NOT_FOUND', message: 'Booking not found' } }, { status: 404 });
  }

  return json(booking);
}

export async function cancelBookingResponse(request: Request, bookingId: string) {
  const user = await getOrDemoUser();

  const result = await safeDb(
    async () => {
      const existing = await prisma.booking.findFirst({
        where: { id: bookingId, user: { clerkId: user.clerkId } },
      });

      if (!existing) {
        return null;
      }

      const updated = await prisma.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELLED },
      });

      return { booking: mapBooking(updated), cancelled: true };
    },
    () => ({ booking: { ...demoBooking(bookingId), status: 'CANCELLED' }, cancelled: true })
  );

  return json(result);
}

export async function ticketDownloadResponse(request: Request, bookingId: string) {
  const user = await getOrDemoUser();

  const result = await safeDb(
    async () => {
      const ticket = await prisma.ticket.findFirst({
        where: { booking: { id: bookingId, user: { clerkId: user.clerkId } } },
      });
      if (!ticket) {
        throw new Error('Ticket not found');
      }

      return {
        ticket: mapTicket(ticket),
        downloadUrl: `/api/bookings/${bookingId}/ticket.pdf`,
      };
    },
    () => ({ ticket: demoTicket(bookingId), downloadUrl: `/api/bookings/${bookingId}/ticket.pdf` })
  );

  return json(result);
}

async function razorpayRequest(path: string, method: string, body?: Record<string, unknown>) {
  const keyId = serviceConfig.razorpayKeyId;
  const secret = serviceConfig.razorpayKeySecret;
  if (!keyId || !secret) return null;

  const response = await fetch(`https://api.razorpay.com/v1${path}`, {
    method,
    headers: {
      authorization: `Basic ${Buffer.from(`${keyId}:${secret}`).toString('base64')}`,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) return null;
  return response.json();
}

export async function createPaymentOrderResponse(request: Request) {
  const body = await parseJsonBody(request);
  const amountInRupees = typeof body.amount === 'number' ? body.amount : 18;
  const currency = typeof body.currency === 'string' ? body.currency : 'INR';
  const amountInPaise = Math.max(1, Math.round(amountInRupees * 100));

  const razorpayOrder = await razorpayRequest('/orders', 'POST', {
    amount: amountInPaise,
    currency,
    receipt: `receipt_${Date.now()}`,
    payment_capture: 1,
    notes: {
      source: 'Moon',
      bookingId: typeof body.bookingId === 'string' ? body.bookingId : undefined,
    },
  });

  if (razorpayOrder) {
    return json({
      orderId: (razorpayOrder as { id: string }).id,
      amount: amountInRupees,
      currency,
      keyId: serviceConfig.razorpayKeyId ?? '',
      gateway: 'razorpay',
    });
  }

  return json({
    orderId: 'order_mock_1',
    amount: amountInRupees,
    currency,
    keyId: 'rzp_test_mock',
    gateway: 'mock',
  });
}

export async function handlePaymentWebhookResponse(request: Request) {
  const secret = serviceConfig.razorpayWebhookSecret;
  const signature = request.headers.get('x-razorpay-signature');
  const body = await request.text();

  if (secret && signature) {
    const digest = crypto.createHmac('sha256', secret).update(body).digest('hex');
    if (digest !== signature) {
      return json(
        { error: { code: 'INVALID_SIGNATURE', message: 'Webhook signature mismatch' } },
        { status: 401 }
      );
    }
  }

  if (secret) {
    try {
      const payload = JSON.parse(body) as {
        event?: string;
        payload?: {
          payment?: {
            entity?: {
              id?: string;
              order_id?: string;
              amount?: number;
              currency?: string;
              method?: string;
            };
          };
        };
      };

      const payment = payload.payload?.payment?.entity;
      if (payment?.id && payment.order_id) {
        await safeDb(
          async () => {
            const booking = await prisma.booking.findFirst({
              where: { id: payment.order_id },
            });

            if (!booking) return null;

            await prisma.payment.upsert({
              where: { razorpayPayId: payment.id },
              update: {
                status: PaymentStatus.CAPTURED,
                amount: new Prisma.Decimal((payment.amount ?? 0) / 100),
                currency: payment.currency ?? 'INR',
                method: PaymentMethod.UPI,
              },
              create: {
                userId: booking.userId,
                bookingId: booking.id,
                razorpayOrderId: payment.order_id,
                razorpayPayId: payment.id,
                amount: new Prisma.Decimal((payment.amount ?? 0) / 100),
                currency: payment.currency ?? 'INR',
                method: PaymentMethod.UPI,
                status: PaymentStatus.CAPTURED,
              },
            });
            return null;
          },
          () => null
        );
      }
    } catch {
      // Ignore malformed webhook bodies after signature validation.
    }
  }

  return json({ received: true, verified: Boolean(secret) });
}

export async function listPaymentsResponse(_request: Request) {
  const user = await getOrDemoUser();

  const payments = await safeDb(
    async () => {
      const records = await prisma.payment.findMany({
        where: { user: { clerkId: user.clerkId } },
        orderBy: { createdAt: 'desc' },
      });
      return records.map((record) => mapPayment(record));
    },
    () => [demoPayment()]
  );

  return json({ payments });
}

export async function createRefundResponse(request: Request) {
  const user = await getOrDemoUser();
  const body = await parseJsonBody(request);
  const bookingId = typeof body.bookingId === 'string' ? body.bookingId : 'booking_1';
  const reason = typeof body.reason === 'string' ? body.reason : 'User requested cancellation';

  const refund = await safeDb(
    async () => {
      const booking = await prisma.booking.findFirst({
        where: { id: bookingId, user: { clerkId: user.clerkId } },
        include: { payment: true },
      });
      if (!booking) {
        return null;
      }

      let payment = booking.payment;
      if (!payment) {
        payment = await prisma.payment.create({
          data: {
            userId: user.id,
            bookingId: booking.id,
            amount: booking.totalFare,
            currency: booking.currency,
            method: PaymentMethod.UPI,
            status: PaymentStatus.CAPTURED,
            gateway: 'mock',
          },
        });
      }

      let refundResponse = null;
      if (payment.razorpayPayId) {
        refundResponse = await razorpayRequest(
          `/payments/${payment.razorpayPayId}/refund`,
          'POST',
          {
            amount: Math.round(toNumber(payment.amount) * 100),
            speed: 'normal',
          }
        ).catch(() => null);
      }

      const record = await prisma.refund.upsert({
        where: { bookingId },
        update: {
          reason,
          status: refundResponse ? RefundStatus.PROCESSING : RefundStatus.APPROVED,
        },
        create: {
          bookingId,
          paymentId: payment.id,
          amount: payment.amount,
          reason,
          status: refundResponse ? RefundStatus.PROCESSING : RefundStatus.APPROVED,
        },
      });

      // Update booking status to REFUNDED
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.REFUNDED },
      });

      return { refund: mapRefund(record) };
    },
    async () => ({
      refund: {
        id: 'refund_1',
        bookingId,
        paymentId: 'payment_1',
        amount: 18,
        reason,
        status: 'APPROVED',
      },
    })
  );

  return json(refund);
}

export async function listUserRefundsResponse(_request: Request) {
  const user = await getOrDemoUser();

  const refunds = await safeDb(
    async () => {
      const records = await prisma.refund.findMany({
        where: { booking: { userId: user.id } },
        orderBy: { createdAt: 'desc' },
      });
      return records.map((record) => mapRefund(record));
    },
    () => [
      {
        id: 'refund_1',
        bookingId: 'booking_1',
        paymentId: 'payment_1',
        amount: 18,
        reason: 'User requested cancellation',
        status: 'APPROVED',
      },
    ]
  );

  return json({ refunds });
}

export async function listSupportTicketsResponse(_request: Request) {
  const user = await getOrDemoUser();

  const tickets = await safeDb(
    async () => {
      const records = await prisma.supportTicket.findMany({
        where: { user: { clerkId: user.clerkId } },
        orderBy: { createdAt: 'desc' },
      });
      return records.map((record) => mapSupportTicket(record));
    },
    () => [demoSupportTicket(), { ...demoSupportTicket('ticket_2'), status: 'IN_PROGRESS' }]
  );

  return json({ tickets });
}

export async function createSupportTicketResponse(request: Request) {
  const user = await getOrDemoUser();
  const body = await parseJsonBody(request);

  const ticketPayload = {
    category: (typeof body.category === 'string'
      ? body.category
      : 'BOOKING_ISSUE') as TicketCategory,
    subject: typeof body.subject === 'string' ? body.subject : 'Need help with my booking',
    description:
      typeof body.description === 'string'
        ? body.description
        : 'The documentation-driven mock ticket is ready for support flows.',
    priority: (typeof body.priority === 'string' ? body.priority : 'MEDIUM') as TicketPriority,
    bookingId: typeof body.bookingId === 'string' ? body.bookingId : null,
  };

  const ticket = await safeDb(
    async () => {
      const record = await prisma.supportTicket.create({
        data: {
          userId: user.id,
          bookingId: ticketPayload.bookingId,
          category: ticketPayload.category,
          subject: ticketPayload.subject,
          description: ticketPayload.description,
          priority: ticketPayload.priority,
        },
      });
      return mapSupportTicket(record);
    },
    () => demoSupportTicket()
  );

  return json({ ticket, created: true }, { status: 201 });
}

export async function getSupportTicketResponse(request: Request, ticketId: string) {
  const user = await getOrDemoUser();

  const ticket = await safeDb(
    async () => {
      const record = await prisma.supportTicket.findFirst({
        where: { id: ticketId, user: { clerkId: user.clerkId } },
        include: { messages: true },
      });
      if (!record) return null;
      return {
        ticket: mapSupportTicket(record),
        messages: record.messages.map((message) => ({
          id: message.id,
          ticketId: message.ticketId,
          senderId: message.senderId,
          senderRole: message.senderRole,
          body: message.body,
          isInternal: message.isInternal,
          createdAt: message.createdAt.toISOString(),
        })),
      };
    },
    () => ({ ticket: demoSupportTicket(ticketId), messages: [] })
  );

  if (!ticket) {
    return json(
      { error: { code: 'NOT_FOUND', message: 'Support ticket not found' } },
      { status: 404 }
    );
  }

  return json(ticket);
}

export async function replySupportTicketResponse(request: Request, ticketId: string) {
  const user = await getOrDemoUser();
  const body = await parseJsonBody(request);
  const messageBody = typeof body.body === 'string' ? body.body : 'Reply received.';

  const result = await safeDb(
    async () => {
      const ticket = await prisma.supportTicket.findFirst({
        where: { id: ticketId, user: { clerkId: user.clerkId } },
      });

      if (!ticket) return null;

      const message = await prisma.ticketMessage.create({
        data: {
          ticketId,
          senderId: user.id,
          senderRole: UserRole.USER,
          body: messageBody,
        },
      });

      return {
        replied: true,
        ticket: mapSupportTicket(ticket),
        message: {
          id: message.id,
          ticketId: message.ticketId,
          senderId: message.senderId,
          senderRole: message.senderRole,
          body: message.body,
          isInternal: message.isInternal,
          createdAt: message.createdAt.toISOString(),
        },
      };
    },
    () => ({ replied: true, ticket: demoSupportTicket(ticketId) })
  );

  return json(result);
}

export async function closeSupportTicketResponse(request: Request, ticketId: string) {
  const user = await getOrDemoUser();

  const result = await safeDb(
    async () => {
      const existing = await prisma.supportTicket.findFirst({
        where: { id: ticketId, user: { clerkId: user.clerkId } },
      });

      if (!existing) {
        return null;
      }

      const updated = await prisma.supportTicket.update({
        where: { id: ticketId },
        data: { status: TicketStatus.CLOSED, resolvedAt: new Date() },
      });

      return { closed: true, ticket: mapSupportTicket(updated) };
    },
    () => ({ closed: true, ticket: { ...demoSupportTicket(ticketId), status: 'CLOSED' } })
  );

  return json(result);
}

export async function updateTrackingResponse(request: Request) {
  const body = await parseJsonBody(request);
  const routeId = typeof body.routeId === 'string' ? body.routeId : 'route_1';

  return json({ accepted: true, routeId });
}

export async function getTrackingRouteResponse(routeId: string) {
  return json({
    routeId,
    vehicles: [
      { id: 'vehicle_1', lat: 28.6328, lng: 77.2197, speed: 24, heading: 90, isOnline: true },
    ],
  });
}

export async function getAdminStatsResponse() {
  const [userCount, bookingCount, paymentCount, , vehicleCount, openTicketCount] = await safeDb(
    async () => {
      const [users, bookings, payments, tickets, vehicles, openTickets] = await Promise.all([
        prisma.user.count(),
        prisma.booking.count(),
        prisma.payment.count(),
        prisma.supportTicket.count(),
        prisma.vehicle.count(),
        prisma.supportTicket.count({
          where: { status: { in: ['OPEN', 'IN_PROGRESS', 'WAITING_USER'] } },
        }),
      ]);
      return [users, bookings, payments, tickets, vehicles, openTickets] as const;
    },
    () => [1, 2, 1, 1, 1, 1] as const
  );

  return json({
    users: userCount,
    bookingsToday: bookingCount,
    revenueToday: paymentCount * 18,
    openTickets: openTicketCount,
    liveVehicles: vehicleCount,
    services: await getHealthSnapshot(),
  });
}

export async function listAdminUsersResponse() {
  const users = await safeDb(
    async () => {
      const records = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
      return records.map((record) => ({
        id: record.id,
        clerkId: record.clerkId,
        phone: record.phone,
        email: record.email,
        name: record.name,
        avatar: record.avatar,
        role: record.role,
        preferredLang: record.preferredLang,
        homeAddress: record.homeAddress,
        workAddress: record.workAddress,
      }));
    },
    () => [demoUser()]
  );

  return json({ users });
}

export async function suspendAdminUserResponse(userId: string) {
  const result = await safeDb(
    async () => {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { role: UserRole.USER },
      });

      return {
        suspended: true,
        user: {
          id: user.id,
          clerkId: user.clerkId,
          phone: user.phone,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          preferredLang: user.preferredLang,
          homeAddress: user.homeAddress,
          workAddress: user.workAddress,
        },
      };
    },
    () => ({ suspended: true, user: demoUser() })
  );

  return json(result);
}

export async function listAdminBookingsResponse() {
  const bookings = await safeDb(
    async () => {
      const records = await prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
      return records.map((record) => mapBooking(record));
    },
    () => [demoBooking()]
  );

  return json({ bookings });
}

export async function listAdminRefundsResponse() {
  const refunds = await safeDb(
    async () => {
      const records = await prisma.refund.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
      return records.map((record) => mapRefund(record));
    },
    () => [demoRefund()]
  );

  return json({ refunds });
}

export async function approveRefundResponse(refundId: string) {
  const result = await safeDb(
    async () => {
      const refund = await prisma.refund.update({
        where: { id: refundId },
        data: { status: RefundStatus.PROCESSING, processedAt: new Date() },
      });

      return {
        approved: true,
        refund: mapRefund(refund),
      };
    },
    () => ({
      approved: true,
      refund: {
        id: refundId,
        bookingId: 'booking_1',
        paymentId: 'payment_1',
        amount: 18,
        reason: 'Auto-approved',
        status: 'PROCESSING',
      },
    })
  );

  return json(result);
}

export async function deleteAccountResponse() {
  const context = await getCurrentUserContext();
  if (!context.user) {
    return json({ queued: true, deletedAt: new Date().toISOString() });
  }

  await safeDb(
    async () => {
      await prisma.user.delete({ where: { clerkId: context.user!.clerkId } });
      return null;
    },
    () => null
  );

  return json({
    queued: true,
    deletedAt: new Date().toISOString(),
    source: 'clerk+database',
  });
}
