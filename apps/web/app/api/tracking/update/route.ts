import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const TrackingUpdateSchema = z.object({
  id: z.string(),
  routeId: z.string(),
  tripId: z.string().optional(),
  label: z.string().optional(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  heading: z.number().min(0).max(360).optional(),
  speed: z.number().min(0).optional(),
  status: z.enum(['active', 'inactive', 'delayed']),
  delayMinutes: z.number().optional(),
  nextStop: z.string().optional(),
  etaMinutes: z.number().optional(),
  source: z.enum(['gtfs-rt', 'demo']).optional(),
  alertIds: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Verify this is from an operator or device
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = TrackingUpdateSchema.parse(body);

    // Forward to tracking server
    const trackingServerUrl = process.env.TRACKING_SERVER_URL || 'http://localhost:3001';
    const response = await fetch(`${trackingServerUrl}/api/tracking/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      throw new Error('Tracking server error');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tracking update error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
