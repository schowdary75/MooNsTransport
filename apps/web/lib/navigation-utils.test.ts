import {
  buildNavigationSteps,
  decodePolyline,
  distanceMeters,
  getRoutePoints,
  isOffRoute,
  nearestRoutePoint,
} from './navigation-utils';
import type { RouteSummary } from '@moon/api';

const route: RouteSummary = {
  id: 'test-route',
  title: 'Walk test',
  durationMinutes: 10,
  distanceKm: 0.8,
  fareInRupees: 0,
  modes: ['WALK'],
  legs: [
    {
      mode: 'WALK',
      origin: 'Origin',
      destination: 'Destination',
      durationMinutes: 10,
      distanceKm: 0.8,
      fromLat: 28.6315,
      fromLng: 77.2167,
      toLat: 28.6429,
      toLng: 77.2195,
    },
  ],
};

describe('navigation-utils', () => {
  it('decodes encoded route geometry', () => {
    expect(decodePolyline('_p~iF~ps|U_ulLnnqC_mqNvxq`@')).toEqual([
      [38.5, -120.2],
      [40.7, -120.95],
      [43.252, -126.453],
    ]);
  });

  it('falls back to leg endpoints when geometry is absent', () => {
    expect(getRoutePoints(route)).toEqual([
      [28.6315, 77.2167],
      [28.6429, 77.2195],
    ]);
  });

  it('finds nearest progress and off-route state', () => {
    const points = getRoutePoints(route);
    const nearStart = nearestRoutePoint({ lat: 28.63151, lng: 77.21671 }, points);

    expect(nearStart.index).toBe(0);
    expect(nearStart.progress).toBe(0);
    expect(isOffRoute({ lat: 28.63151, lng: 77.21671 }, points)).toBe(false);
    expect(isOffRoute({ lat: 28.7, lng: 77.3 }, points)).toBe(true);
  });

  it('builds navigation steps from route legs', () => {
    const steps = buildNavigationSteps(route);

    expect(steps).toHaveLength(1);
    expect(steps[0]?.instruction).toContain('Walk from Origin to Destination');
    expect(steps[0]?.distanceMeters).toBe(800);
  });

  it('measures nearby coordinates in meters', () => {
    const meters = distanceMeters({ lat: 28.6315, lng: 77.2167 }, { lat: 28.6316, lng: 77.2167 });
    expect(meters).toBeGreaterThan(10);
    expect(meters).toBeLessThan(12);
  });
});
