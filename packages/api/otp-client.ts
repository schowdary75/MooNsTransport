const configuredOtpUrl = process.env.OTP_API_URL || process.env.NEXT_PUBLIC_OTP_API_URL;
const OTP_API_URL = configuredOtpUrl || 'http://localhost:8080/otp/routers/default';

export interface Itinerary {
  duration: number;
  startTime: number;
  endTime: number;
  walkTime: number;
  transitTime: number;
  waitingTime: number;
  transfers: number;
  legs: Leg[];
  fare?: {
    fare: number;
    currency?: string;
  };
}

export interface Leg {
  startTime: number;
  endTime: number;
  from: Place;
  to: Place;
  distance: number;
  mode: string;
  route?: string;
  routeColor?: string;
  routeTextColor?: string;
  headsign?: string;
  agencyName?: string;
  tripId?: string;
  routeId?: string;
  steps?: Step[];
  geometry?: {
    points: string;
  };
}

export interface Place {
  name: string;
  lat: number;
  lon: number;
  stopCode?: string;
  stopId?: string;
  arrivalTime?: number;
  departureTime?: number;
}

export interface Step {
  distance: number;
  relativeDirections?: string;
  relativeDirection?: string;
  absoluteDirection?: string;
  streetName?: string;
}

export interface PlanRouteParams {
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  modes?: string; // comma-separated: WALK,BUS,SUBWAY,RAIL
  maxWalkDistance?: number;
  numItineraries?: number;
  arriveBy?: boolean;
}

export interface PlanRouteResult {
  itineraries: Itinerary[];
  source: 'otp' | 'demo';
  generatedAt: string;
  warnings: string[];
}

export async function planRouteWithMetadata(params: PlanRouteParams): Promise<PlanRouteResult> {
  const generatedAt = new Date().toISOString();
  try {
    if (!configuredOtpUrl) {
      return {
        itineraries: buildFallbackItineraries(params),
        source: 'demo',
        generatedAt,
        warnings: ['OpenTripPlanner is not configured. Showing demo routes generated from distance estimates.'],
      };
    }

    const searchParams = new URLSearchParams({
      fromPlace: `${params.fromLat},${params.fromLng}`,
      toPlace: `${params.toLat},${params.toLng}`,
      date: params.date,
      time: params.time,
      modes: params.modes || 'WALK,BUS,SUBWAY,RAIL,TRAM',
      numItineraries: (params.numItineraries || 3).toString(),
      maxWalkDistance: (params.maxWalkDistance || 2000).toString(),
      format: 'json',
      ...(params.arriveBy && { arriveBy: 'true' }),
    });

    const url = `${OTP_API_URL}/plan?${searchParams.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`OTP API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform OTP response to our format
    if (!data.plan || !data.plan.itineraries) {
      return {
        itineraries: [],
        source: 'otp',
        generatedAt,
        warnings: ['OpenTripPlanner returned no itineraries for this request.'],
      };
    }

    const itineraries = data.plan.itineraries.map((itinerary: any) => ({
      duration: itinerary.duration,
      startTime: itinerary.startTime,
      endTime: itinerary.endTime,
      walkTime: itinerary.walkTime,
      transitTime: itinerary.transitTime,
      waitingTime: itinerary.waitingTime,
      transfers: itinerary.transfers,
      legs: itinerary.legs.map((leg: any) => ({
        startTime: leg.startTime,
        endTime: leg.endTime,
        from: {
          name: leg.from.name,
          lat: leg.from.lat,
          lon: leg.from.lon,
          stopId: leg.from.stopId,
        },
        to: {
          name: leg.to.name,
          lat: leg.to.lat,
          lon: leg.to.lon,
          stopId: leg.to.stopId,
        },
        distance: leg.distance,
        mode: leg.mode,
        route: leg.route,
        routeId: leg.routeId,
        tripId: leg.tripId,
        routeColor: leg.routeColor,
        routeTextColor: leg.routeTextColor,
        headsign: leg.headsign,
        agencyName: leg.agencyName,
        steps: leg.steps,
        geometry: leg.geometry,
      })),
      fare: itinerary.fare || undefined,
    }));

    return { itineraries, source: 'otp', generatedAt, warnings: [] };
  } catch (error) {
    console.error('OTP route planning error:', error);
    return {
      itineraries: buildFallbackItineraries(params),
      source: 'demo',
      generatedAt,
      warnings: ['OpenTripPlanner could not be reached. Showing demo routes generated from distance estimates.'],
    };
  }
}

export async function planRoute(params: PlanRouteParams): Promise<Itinerary[]> {
  const result = await planRouteWithMetadata(params);
  return result.itineraries;
}

function buildFallbackItineraries(params: PlanRouteParams): Itinerary[] {
  const distanceKm = Math.max(
    0.5,
    Math.sqrt((params.fromLat - params.toLat) ** 2 + (params.fromLng - params.toLng) ** 2) * 111
  );
  const start = Date.now();
  const requestedModes = params.modes 
    ? params.modes.split(',').map((m) => m.trim().toUpperCase()) 
    : ['WALK', 'BUS', 'METRO', 'TRAIN', 'SUBWAY'];

  const itineraries: Itinerary[] = [];

  // 1. Pure walking (if requested, or if walk is the only option)
  const wantsWalk = requestedModes.includes('WALK');
  const onlyWalk = wantsWalk && requestedModes.length === 1;

  if (onlyWalk || (wantsWalk && itineraries.length === 0 && requestedModes.includes('WALK'))) {
    const walkMins = Math.round(distanceKm * 12);
    itineraries.push({
      duration: walkMins * 60,
      startTime: start,
      endTime: start + walkMins * 60 * 1000,
      walkTime: walkMins * 60,
      transitTime: 0,
      waitingTime: 0,
      transfers: 0,
      fare: { fare: 0, currency: 'INR' },
      legs: [
        {
          startTime: start,
          endTime: start + walkMins * 60 * 1000,
          from: { name: 'Origin', lat: params.fromLat, lon: params.fromLng },
          to: { name: 'Destination', lat: params.toLat, lon: params.toLng },
          distance: Math.round(distanceKm * 1000),
          mode: 'WALK',
        },
      ],
    });
  }

  // 2. Pure cycling (if requested)
  if (requestedModes.includes('CYCLE') || requestedModes.includes('BICYCLE')) {
    const cycleMins = Math.round(distanceKm * 4);
    // Create intermediate waypoints for a smoother polyline
    const midLat = params.fromLat + (params.toLat - params.fromLat) * 0.35;
    const midLng = params.fromLng + (params.toLng - params.fromLng) * 0.4;
    itineraries.push({
      duration: cycleMins * 60,
      startTime: start,
      endTime: start + cycleMins * 60 * 1000,
      walkTime: 0,
      transitTime: cycleMins * 60,
      waitingTime: 0,
      transfers: 0,
      fare: { fare: 0, currency: 'INR' },
      legs: [
        {
          startTime: start,
          endTime: start + cycleMins * 60 * 1000,
          from: { name: 'Origin', lat: params.fromLat, lon: params.fromLng },
          to: { name: 'Destination', lat: params.toLat, lon: params.toLng },
          distance: Math.round(distanceKm * 1000),
          mode: 'CYCLE',
        },
      ],
    });
  }

  // 3. Metro / Subway option (if requested)
  if (requestedModes.includes('METRO') || requestedModes.includes('SUBWAY') || requestedModes.includes('TRANSIT')) {
    const metroMinutes = Math.round(distanceKm * 3 + 12);
    itineraries.push({
      duration: metroMinutes * 60,
      startTime: start,
      endTime: start + metroMinutes * 60 * 1000,
      walkTime: 6 * 60,
      transitTime: Math.max(1, metroMinutes - 6) * 60,
      waitingTime: 3 * 60,
      transfers: 1,
      fare: { fare: Math.max(10, Math.round(distanceKm * 2)), currency: 'INR' },
      legs: [
        {
          startTime: start,
          endTime: start + 6 * 60 * 1000,
          from: { name: 'Origin', lat: params.fromLat, lon: params.fromLng },
          to: { name: 'Nearest metro station', lat: params.fromLat + 0.004, lon: params.fromLng + 0.004 },
          distance: 500,
          mode: 'WALK',
        },
        {
          startTime: start + 6 * 60 * 1000,
          endTime: start + metroMinutes * 60 * 1000,
          from: { name: 'Nearest metro station', lat: params.fromLat + 0.004, lon: params.fromLng + 0.004 },
          to: { name: 'Destination stop', lat: params.toLat, lon: params.toLng },
          distance: Math.round(distanceKm * 1000),
          mode: 'METRO',
          route: 'Moon Metro Line 1',
          routeColor: '2563eb',
          headsign: 'City Centre',
          agencyName: 'Moon Metro Corp',
        },
      ],
    });
  }

  // 4. Bus option (if requested)
  if (requestedModes.includes('BUS') || requestedModes.includes('TRANSIT')) {
    const busMinutes = Math.round(distanceKm * 4 + 18);
    itineraries.push({
      duration: busMinutes * 60,
      startTime: start,
      endTime: start + busMinutes * 60 * 1000,
      walkTime: 8 * 60,
      transitTime: Math.max(1, busMinutes - 8) * 60,
      waitingTime: 5 * 60,
      transfers: 0,
      fare: { fare: Math.max(8, Math.round(distanceKm * 1.5)), currency: 'INR' },
      legs: [
        {
          startTime: start,
          endTime: start + 8 * 60 * 1000,
          from: { name: 'Origin', lat: params.fromLat, lon: params.fromLng },
          to: { name: 'Nearest bus stop', lat: params.fromLat + 0.003, lon: params.fromLng + 0.003 },
          distance: 400,
          mode: 'WALK',
        },
        {
          startTime: start + 8 * 60 * 1000,
          endTime: start + busMinutes * 60 * 1000,
          from: { name: 'Nearest bus stop', lat: params.fromLat + 0.003, lon: params.fromLng + 0.003 },
          to: { name: 'Destination bus stop', lat: params.toLat, lon: params.toLng },
          distance: Math.round(distanceKm * 1100),
          mode: 'BUS',
          route: 'City Loop 10A',
          routeColor: '16a34a',
          headsign: 'Central Station',
          agencyName: 'Moon Bus RTC',
        },
      ],
    });
  }

  // If no itineraries generated, return a basic walk itinerary
  if (itineraries.length === 0) {
    const walkMins = Math.round(distanceKm * 12);
    itineraries.push({
      duration: walkMins * 60,
      startTime: start,
      endTime: start + walkMins * 60 * 1000,
      walkTime: walkMins * 60,
      transitTime: 0,
      waitingTime: 0,
      transfers: 0,
      fare: { fare: 0, currency: 'INR' },
      legs: [
        {
          startTime: start,
          endTime: start + walkMins * 60 * 1000,
          from: { name: 'Origin', lat: params.fromLat, lon: params.fromLng },
          to: { name: 'Destination', lat: params.toLat, lon: params.toLng },
          distance: Math.round(distanceKm * 1000),
          mode: 'WALK',
        },
      ],
    });
  }

  return itineraries;
}

export async function getStops(lat: number, lng: number, radius: number = 500): Promise<Place[]> {
  try {
    const searchParams = new URLSearchParams({
      lat: lat.toString(),
      lon: lng.toString(),
      radius: radius.toString(),
      format: 'json',
    });

    const url = `${OTP_API_URL}/nearby?${searchParams.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`OTP API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.stops) {
      return [];
    }

    return data.stops.map((stop: any) => ({
      name: stop.name,
      lat: stop.lat,
      lon: stop.lon,
      stopCode: stop.code,
      stopId: stop.id,
    }));
  } catch (error) {
    console.error('OTP stops error:', error);
    throw error;
  }
}

export async function getStopInfo(stopId: string): Promise<Place | null> {
  try {
    const url = `${OTP_API_URL}/stops/${stopId}`;
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return {
      name: data.name,
      lat: data.lat,
      lon: data.lon,
      stopCode: data.code,
      stopId: data.id,
    };
  } catch (error) {
    console.error('OTP stop info error:', error);
    return null;
  }
}
