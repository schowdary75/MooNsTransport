'use client';

import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl, useMap } from 'react-leaflet';
import { useEffect, useState, useMemo, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { SearchBox } from './SearchBox';
import { useGeolocation } from '@/hooks/use-geolocation';

// Custom futuristic neon icons creator for transit categories
const createFuturisticIcon = (type: 'bus' | 'metro' | 'train' | 'walk' | 'cycle') => {
  const colorSchemes = {
    bus: {
      glow: 'bg-orange-500/40',
      border: 'border-orange-500/80',
      bg: 'bg-orange-950/90 text-orange-400',
      svg: `<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="12" rx="2"/><path d="M8 20h.01"/><path d="M16 20h.01"/><path d="m6 16-.5 3"/><path d="m18 16 .5 3"/><path d="M4 12h16"/></svg>`
    },
    metro: {
      glow: 'bg-blue-500/40',
      border: 'border-blue-500/80',
      bg: 'bg-blue-950/90 text-blue-400',
      svg: `<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/><path d="M8 8h8"/><path d="M12 8v5"/></svg>`
    },
    train: {
      glow: 'bg-emerald-500/40',
      border: 'border-emerald-500/80',
      bg: 'bg-emerald-950/90 text-emerald-400',
      svg: `<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m16 19 2 3"/></svg>`
    },
    walk: {
      glow: 'bg-purple-500/40',
      border: 'border-purple-500/80',
      bg: 'bg-purple-950/90 text-purple-400',
      svg: `<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 5a3 3 0 1 0-4.5-2.6"/><path d="m7 9 3-2 3 2"/><path d="m7 9 1.5 5 1.5 5.5"/><path d="M13 9v5l2.5 3.5"/><path d="m11.5 14-2.5-3"/></svg>`
    },
    cycle: {
      glow: 'bg-yellow-500/40',
      border: 'border-yellow-500/80',
      bg: 'bg-yellow-950/90 text-yellow-400',
      svg: `<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M9 17.5A2.5 2.5 0 0 0 6.5 15H5"/><path d="M12 11.5V15"/><path d="M12 11.5h3.5l1.5-3.5"/><path d="M17 5H9.5L7 11.5h5Z"/></svg>`
    }
  }[type] || {
    glow: 'bg-slate-500/40',
    border: 'border-slate-500/80',
    bg: 'bg-slate-900/90 text-slate-400',
    svg: `<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`
  };

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer group">
      <!-- Glow Ring -->
      <div class="absolute h-8 w-8 rounded-full ${colorSchemes.glow} blur-xs opacity-50 group-hover:scale-110 transition-transform duration-300"></div>
      <!-- Center Circle -->
      <div class="relative h-6.5 w-6.5 rounded-full border-1.5 ${colorSchemes.border} ${colorSchemes.bg} backdrop-blur-md flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-105">
        ${colorSchemes.svg}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'bg-transparent border-none',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

interface MapComponentProps {
  center: [number, number];
  zoom: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  markers: Array<{
    lat: number;
    lng: number;
    label: string;
    type: 'bus' | 'metro' | 'train' | 'walk' | 'cycle' | 'user-nav';
  }>;
  height?: string;
  showSearch?: boolean;
  polylines?: Array<{
    positions: [number, number][];
    color?: string;
    weight?: number;
    dashArray?: string;
  }>;
  routeKey?: string;
  followPosition?: boolean;
}

interface MapContentProps extends MapComponentProps {
  mapStyle: 'dark' | 'streets' | 'light' | 'satellite';
}

function MapContent({ 
  center, 
  zoom, 
  onLocationSelect, 
  markers, 
  showSearch = true, 
  polylines = [], 
  mapStyle,
  routeKey,
  followPosition = false,
}: MapContentProps) {
  const map = useMap();
  const [isUserControlled, setIsUserControlled] = useState(false);
  const lastCenterRef = useRef<string>('');
  const lastRouteFitRef = useRef<string>('');

  // Pulsing user location marker icon using CSS animations
  const userLocationIcon = useMemo(() => L.divIcon({
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute h-6 w-6 rounded-full bg-blue-500 animate-ping opacity-40"></div>
        <div class="absolute h-3.5 w-3.5 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>
      </div>
    `,
    className: 'bg-transparent border-none',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  }), []);

  // Pulsing green navigation user marker icon using CSS animations
  const userNavIcon = useMemo(() => L.divIcon({
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute h-6 w-6 rounded-full bg-emerald-500 animate-ping opacity-40"></div>
        <div class="absolute h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-lg"></div>
      </div>
    `,
    className: 'bg-transparent border-none',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  }), []);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const { location, requestLocation } = useGeolocation();

  const isMapReady = () => Boolean(map.getContainer()?.isConnected && map.getPane('mapPane'));

  const safeSetView = (nextCenter: [number, number], nextZoom: number) => {
    if (!isMapReady()) return;
    map.stop();
    map.setView(nextCenter, nextZoom, { animate: false });
  };

  const safeFitBounds = (bounds: L.LatLngBounds) => {
    if (!isMapReady() || !bounds.isValid()) return;
    map.stop();
    map.fitBounds(bounds, { padding: [50, 50], animate: false });
  };

  useEffect(() => {
    if (location) {
      setUserLocation([location.latitude, location.longitude]);
      safeSetView([location.latitude, location.longitude], Math.max(map.getZoom(), 15));
      setIsUserControlled(false);
    }
  }, [location, map]);

  useEffect(() => {
    const centerKey = `${center[0].toFixed(6)},${center[1].toFixed(6)},${zoom}`;
    if ((!isUserControlled || followPosition) && lastCenterRef.current !== centerKey && (!polylines || polylines.length === 0)) {
      safeSetView(center, followPosition ? Math.max(map.getZoom(), zoom) : zoom);
      lastCenterRef.current = centerKey;
    }
  }, [center, zoom, map, polylines, isUserControlled, followPosition]);

  useEffect(() => {
    const polylineSignature = polylines
      .map((polyline) => `${polyline.positions[0]?.join(',')}:${polyline.positions.length}:${polyline.positions.at(-1)?.join(',')}`)
      .join('|');
    const fitKey = routeKey || polylineSignature;

    if (!fitKey || lastRouteFitRef.current === fitKey || isUserControlled) {
      return;
    }

    if (polylines && polylines.length > 0) {
      const bounds = L.latLngBounds([]);
      let hasPoints = false;
      polylines.forEach(p => {
        p.positions.forEach(pos => {
          bounds.extend(pos);
          hasPoints = true;
        });
      });
      if (hasPoints && bounds.isValid()) {
        safeFitBounds(bounds);
        lastRouteFitRef.current = fitKey;
      }
    }
  }, [polylines, map, routeKey, isUserControlled]);

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (onLocationSelect) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  };

  useEffect(() => {
    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, onLocationSelect]);

  useEffect(() => {
    const markUserControlled = () => setIsUserControlled(true);
    map.on('dragstart', markUserControlled);
    map.on('zoomstart', markUserControlled);

    return () => {
      map.off('dragstart', markUserControlled);
      map.off('zoomstart', markUserControlled);
    };
  }, [map]);

  const recenterMap = () => {
    setIsUserControlled(false);

    if (followPosition && center) {
      safeSetView(center, Math.max(map.getZoom(), zoom));
      return;
    }

    if (polylines.length > 0) {
      lastRouteFitRef.current = '';
      const bounds = L.latLngBounds([]);
      polylines.forEach((polyline) => polyline.positions.forEach((pos) => bounds.extend(pos)));
      if (bounds.isValid()) {
        safeFitBounds(bounds);
        return;
      }
    }

    if (userLocation) {
      safeSetView(userLocation, Math.max(map.getZoom(), 15));
      return;
    }

    safeSetView(center, zoom);
  };

  return (
    <>
      {/* Custom Key-Controlled Tile Layers */}
      {mapStyle === 'dark' && (
        <TileLayer
          key="dark"
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors'
          maxZoom={20}
        />
      )}
      {mapStyle === 'streets' && (
        <TileLayer
          key="streets"
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors'
          maxZoom={20}
        />
      )}
      {mapStyle === 'light' && (
        <TileLayer
          key="light"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors'
          maxZoom={20}
        />
      )}
      {mapStyle === 'satellite' && (
        <TileLayer
          key="satellite"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS'
          maxZoom={19}
        />
      )}

      {/* Route Polylines */}
      {polylines.map((polyline, idx) => (
        <Polyline
          key={`poly-${idx}`}
          positions={polyline.positions}
          color={polyline.color || '#3b82f6'}
          weight={polyline.weight || 5}
          dashArray={polyline.dashArray}
        />
      ))}

      {/* Pulsing GPS user marker */}
      {userLocation && (
        <Marker position={userLocation} icon={userLocationIcon}>
          <Popup>Your Location</Popup>
        </Marker>
      )}

      {/* Futuristic markers */}
      {markers.map((marker, idx) => (
        <Marker 
          key={idx} 
          position={[marker.lat, marker.lng]} 
          icon={marker.type === 'user-nav' ? userNavIcon : createFuturisticIcon(marker.type as 'bus' | 'metro' | 'train' | 'walk' | 'cycle')}
        >
          <Popup>
            <div className="font-sans p-1">
              <span className="font-bold text-slate-900 block text-xs">{marker.label}</span>
              <span className="text-[10px] text-slate-500 capitalize font-semibold block mt-0.5">Mode: {marker.type}</span>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Search box overlay */}
      {showSearch && (
        <div className="absolute top-4 left-4 z-[400] w-96 max-w-[calc(100%-2rem)]">
          <SearchBox onLocationSelect={onLocationSelect} onRequestLocation={requestLocation} />
        </div>
      )}

      {/* Zoom controls */}
      <ZoomControl position="bottomright" />

      {/* Locate button */}
      <div className="absolute bottom-4 right-4 z-[400]">
        <button
          onClick={requestLocation}
          className="bg-slate-950/85 backdrop-blur-md border border-white/10 hover:border-brand-500/50 text-slate-300 hover:text-white rounded-xl p-2.5 shadow-2xl transition"
          title="Find my location"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1 1 15 0Z" />
          </svg>
        </button>
      </div>

      {(isUserControlled || polylines.length > 0 || followPosition) && (
        <div className="absolute bottom-16 right-4 z-[400]">
          <button
            onClick={recenterMap}
            className="bg-slate-950/85 backdrop-blur-md border border-white/10 hover:border-brand-500/50 text-slate-300 hover:text-white rounded-xl px-3 py-2 shadow-2xl transition text-xs font-semibold"
            title={followPosition ? 'Resume following position' : 'Recenter map'}
          >
            Recenter
          </button>
        </div>
      )}
    </>
  );
}

export default function MapComponentWrapper({
  center,
  zoom,
  onLocationSelect,
  markers,
  height = '100vh',
  showSearch = true,
  polylines = [],
  routeKey,
  followPosition = false,
}: MapComponentProps) {
  const [mapStyle, setMapStyle] = useState<'dark' | 'streets' | 'light' | 'satellite'>('dark');

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden" style={{ height }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }} 
        zoomControl={false}
        zoomAnimation={false}
        fadeAnimation={false}
        markerZoomAnimation={false}
      >
        <MapContent
          center={center}
          zoom={zoom}
          onLocationSelect={onLocationSelect}
          markers={markers}
          showSearch={showSearch}
          polylines={polylines}
          mapStyle={mapStyle}
          routeKey={routeKey}
          followPosition={followPosition}
        />
      </MapContainer>

      {/* Futuristic Glassmorphic Layer Selector Overlay */}
      <div className="absolute top-4 right-4 z-[400] bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-2xl p-2 flex items-center gap-1 shadow-2xl">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 font-mono hidden sm:inline">Layers:</span>
        {(['dark', 'streets', 'light', 'satellite'] as const).map(style => (
          <button
            key={style}
            onClick={() => setMapStyle(style)}
            className={`px-2.5 py-1 text-[9px] font-extrabold rounded-lg capitalize transition-all ${
              mapStyle === style 
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {style}
          </button>
        ))}
      </div>
    </div>
  );
}
