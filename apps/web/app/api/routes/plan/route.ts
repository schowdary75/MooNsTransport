import { NextRequest, NextResponse } from 'next/server';
import { planRouteWithMetadata } from '@moon/api/otp-client';
import { z } from 'zod';

const PlanRouteSchema = z.object({
  fromLat: z.number().min(-90).max(90),
  fromLng: z.number().min(-180).max(180),
  toLat: z.number().min(-90).max(90),
  toLng: z.number().min(-180).max(180),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
  modes: z.string().optional(),
  maxWalkDistance: z.number().optional(),
  numItineraries: z.number().min(1).max(5).optional(),
  arriveBy: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const params = {
      fromLat: parseFloat(searchParams.get('fromLat') || ''),
      fromLng: parseFloat(searchParams.get('fromLng') || ''),
      toLat: parseFloat(searchParams.get('toLat') || ''),
      toLng: parseFloat(searchParams.get('toLng') || ''),
      date: searchParams.get('date') || new Date().toISOString().split('T')[0],
      time: searchParams.get('time') || new Date().toTimeString().split(' ')[0],
      modes: searchParams.get('modes'),
      maxWalkDistance: searchParams.get('maxWalkDistance') ? parseInt(searchParams.get('maxWalkDistance')!) : undefined,
      numItineraries: searchParams.get('numItineraries') ? parseInt(searchParams.get('numItineraries')!) : undefined,
      arriveBy: searchParams.get('arriveBy') === 'true',
    };

    const validatedParams = PlanRouteSchema.parse(params);
    const result = await planRouteWithMetadata(validatedParams);

    return NextResponse.json({
      success: true,
      data: result.itineraries,
      source: result.source,
      generatedAt: result.generatedAt,
      warnings: result.warnings,
    });
  } catch (error) {
    console.error('Route planning error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid parameters', details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: 'Route planning failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validatedParams = PlanRouteSchema.parse(body);
    const result = await planRouteWithMetadata(validatedParams);

    return NextResponse.json({
      success: true,
      data: result.itineraries,
      source: result.source,
      generatedAt: result.generatedAt,
      warnings: result.warnings,
    });
  } catch (error) {
    console.error('Route planning error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid parameters', details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: 'Route planning failed' }, { status: 500 });
  }
}
