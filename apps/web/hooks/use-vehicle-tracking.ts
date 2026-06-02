'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { RealtimeVehicle } from '@moon/api';

type VehiclePosition = RealtimeVehicle;

interface UseVehicleTrackingReturn {
  vehicles: VehiclePosition[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  subscribe: (routeId: string) => void;
  unsubscribe: (routeId: string) => void;
}

export function useVehicleTracking(): UseVehicleTrackingReturn {
  const socketRef = useRef<Socket | null>(null);
  const [vehicles, setVehicles] = useState<VehiclePosition[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const subscribedRoutes = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Initialize Socket.io connection
    const trackingServerUrl = process.env.NEXT_PUBLIC_TRACKING_SERVER_URL || 'http://localhost:3001';

    const socket = io(trackingServerUrl, {
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      setIsConnected(true);
      setIsLoading(false);
      console.log('Connected to tracking server');

      // Re-subscribe to previously subscribed routes
      subscribedRoutes.current.forEach((routeId) => {
        socket.emit('subscribe_route', routeId);
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('vehicle_update', (vehicle: VehiclePosition) => {
      const normalizedVehicle: VehiclePosition = {
        ...vehicle,
        source: vehicle.source || 'demo',
        timestamp: vehicle.timestamp || Date.now(),
        stale: vehicle.stale ?? Date.now() - (vehicle.timestamp || Date.now()) > 120000,
      };

      setVehicles((prev) => {
        const existing = prev.findIndex((v) => v.id === normalizedVehicle.id);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = normalizedVehicle;
          return updated;
        }
        return [...prev, normalizedVehicle];
      });
    });

    socket.on('subscription_confirmed', (data) => {
      console.log(`Subscribed to route ${data.routeId}`);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setError('Failed to connect to tracking service');
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  const subscribe = useCallback((routeId: string) => {
    if (socketRef.current && !subscribedRoutes.current.has(routeId)) {
      socketRef.current.emit('subscribe_route', routeId);
      subscribedRoutes.current.add(routeId);
    }
  }, []);

  const unsubscribe = useCallback((routeId: string) => {
    if (socketRef.current && subscribedRoutes.current.has(routeId)) {
      socketRef.current.emit('unsubscribe_route', routeId);
      subscribedRoutes.current.delete(routeId);
      setVehicles((prev) => prev.filter((v) => v.routeId !== routeId));
    }
  }, []);

  return {
    vehicles,
    isConnected,
    isLoading,
    error,
    subscribe,
    unsubscribe,
  };
}
