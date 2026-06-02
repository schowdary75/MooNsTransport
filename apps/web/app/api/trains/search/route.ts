import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const TrainSearchSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  date: z.string(),
  class: z.enum(['sl', '3a', '2a', '1a', 'cc']),
  passengers: z.string().optional(),
});

// Mock train data for MVP
const mockTrains = [
  {
    trainNumber: '12001',
    trainName: 'Shatabdi Express',
    departure: '08:00',
    arrival: '14:30',
    duration: '6h 30m',
    fare: 450,
    seats: 25,
    class: '3a',
  },
  {
    trainNumber: '12002',
    trainName: 'Rajdhani Express',
    departure: '16:00',
    arrival: '22:00',
    duration: '6h',
    fare: 680,
    seats: 12,
    class: '3a',
  },
  {
    trainNumber: '12003',
    trainName: 'Duronto Express',
    departure: '22:30',
    arrival: '05:00',
    duration: '6h 30m',
    fare: 520,
    seats: 8,
    class: '3a',
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = TrainSearchSchema.parse(body);

    // In a real app, this would query IRCTC API
    // For MVP, return mock data
    const results = mockTrains.filter((train) => train.class === validatedData.class);

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid parameters', details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
