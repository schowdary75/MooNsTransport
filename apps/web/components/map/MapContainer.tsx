'use client';

import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./map-component'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 dark:bg-slate-900 animate-pulse flex items-center justify-center rounded-2xl">
      <div className="flex flex-col items-center gap-2">
        <svg className="w-8 h-8 text-slate-400 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className="text-sm text-slate-500 font-medium">Loading map…</span>
      </div>
    </div>
  ),
});

interface MapContainerProps {
  center?: [number, number];
  zoom?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  markers?: Array<{
    lat: number;
    lng: number;
    label: string;
    type: 'bus' | 'metro' | 'train' | 'walk' | 'cycle' | 'user-nav';
  }>;
  /** CSS height string — defaults to '100vh' */
  height?: string;
  /** Whether to show the search overlay — defaults to true */
  showSearch?: boolean;
  /** Additional CSS classes for the wrapper */
  className?: string;
  polylines?: Array<{
    positions: [number, number][];
    color?: string;
    weight?: number;
    dashArray?: string;
  }>;
  routeKey?: string;
  followPosition?: boolean;
}

export function MapContainer({
  center = [28.6139, 77.209],
  zoom = 12,
  onLocationSelect,
  markers = [],
  height = '100vh',
  showSearch = true,
  className,
  polylines = [],
  routeKey,
  followPosition = false,
}: MapContainerProps) {
  return (
    <div className={className} style={{ height, width: '100%' }}>
      <MapComponent
        center={center}
        zoom={zoom}
        onLocationSelect={onLocationSelect}
        markers={markers}
        height={height}
        showSearch={showSearch}
        polylines={polylines}
        routeKey={routeKey}
        followPosition={followPosition}
      />
    </div>
  );
}
