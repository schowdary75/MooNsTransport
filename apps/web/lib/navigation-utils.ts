import type { Coordinates, NavigationStep, RouteSummary, TransitMode } from '@moon/api';

export type LatLngTuple = [number, number];

const EARTH_RADIUS_M = 6371000;

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function distanceMeters(a: Coordinates, b: Coordinates) {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function decodePolyline(encoded: string): LatLngTuple[] {
  const points: LatLngTuple[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20 && index < encoded.length);

    lat += result & 1 ? ~(result >> 1) : result >> 1;
    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20 && index < encoded.length);

    lng += result & 1 ? ~(result >> 1) : result >> 1;
    points.push([lat / 1e5, lng / 1e5]);
  }

  return points;
}

export function getRoutePoints(route: RouteSummary | null): LatLngTuple[] {
  if (!route) return [];
  const points: LatLngTuple[] = [];

  route.legs.forEach((leg) => {
    if (leg.decodedGeometry?.length) {
      points.push(...leg.decodedGeometry.map((point) => [point.lat, point.lng] as LatLngTuple));
      return;
    }

    if (leg.geometry) {
      try {
        points.push(...decodePolyline(leg.geometry));
        return;
      } catch {
        // Fall through to endpoint geometry.
      }
    }

    if (
      leg.fromLat !== undefined &&
      leg.fromLng !== undefined &&
      leg.toLat !== undefined &&
      leg.toLng !== undefined
    ) {
      points.push([leg.fromLat, leg.fromLng], [leg.toLat, leg.toLng]);
    }
  });

  return points;
}

export function buildNavigationSteps(route: RouteSummary | null): NavigationStep[] {
  if (!route) return [];

  return route.legs.flatMap((leg, legIndex) => {
    if (leg.steps?.length) return leg.steps;

    const mode = leg.mode as TransitMode;
    const verb =
      mode === 'WALK'
        ? 'Walk'
        : mode === 'CYCLE' || mode === 'BICYCLE'
          ? 'Cycle'
          : mode === 'BUS'
            ? 'Ride bus'
            : mode === 'METRO' || mode === 'SUBWAY'
              ? 'Take metro'
              : mode === 'TRAIN' || mode === 'RAIL'
                ? 'Take train'
                : `Take ${mode.toLowerCase()}`;

    return [
      {
        id: `${route.id}-leg-${legIndex}`,
        instruction: `${verb} from ${leg.origin} to ${leg.destination}`,
        mode,
        distanceMeters: Math.round((leg.distanceKm || 0) * 1000),
        durationMinutes: leg.durationMinutes || 0,
        from:
          leg.fromLat !== undefined && leg.fromLng !== undefined
            ? { lat: leg.fromLat, lng: leg.fromLng }
            : undefined,
        to:
          leg.toLat !== undefined && leg.toLng !== undefined
            ? { lat: leg.toLat, lng: leg.toLng }
            : undefined,
        routeId: leg.routeId,
        stopName: leg.destination,
      },
    ];
  });
}

export function nearestRoutePoint(position: Coordinates, points: LatLngTuple[]) {
  if (points.length === 0) {
    return { index: 0, distanceMeters: Number.POSITIVE_INFINITY, progress: 0 };
  }

  let nearestIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  points.forEach(([lat, lng], index) => {
    const distance = distanceMeters(position, { lat, lng });
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  return {
    index: nearestIndex,
    distanceMeters: nearestDistance,
    progress: points.length <= 1 ? 1 : nearestIndex / (points.length - 1),
  };
}

export function isOffRoute(position: Coordinates, points: LatLngTuple[], thresholdMeters = 120) {
  return nearestRoutePoint(position, points).distanceMeters > thresholdMeters;
}
