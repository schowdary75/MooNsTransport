import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const BusSearchSchema = z.object({
  from: z.string(),
  to: z.string(),
  date: z.string(),
  passengers: z.string().optional(),
});

const mockBuses = [
  {
    operator: 'KSRTC',
    type: 'Volvo AC',
    seats: 50,
    availableSeats: 12,
    fare: 350,
    departure: '08:00',
    arrival: '16:00',
  },
  {
    operator: 'Private Operator',
    type: 'Sleeper',
    seats: 40,
    availableSeats: 5,
    fare: 450,
    departure: '21:00',
    arrival: '07:00',
  },
  {
    operator: 'MSRTC',
    type: 'Seater',
    seats: 45,
    availableSeats: 18,
    fare: 320,
    departure: '14:00',
    arrival: '22:00',
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = BusSearchSchema.parse(body);

    // Mock data for MVP
    const results = mockBuses;

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
