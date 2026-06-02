import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const FlightSearchSchema = z.object({
  from: z.string().min(2).max(4),
  to: z.string().min(2).max(4),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  passengers: z.number().min(1).max(9).optional(),
  cabin: z.enum(['economy', 'business']).optional(),
});

const AIRLINES = [
  { code: '6E', name: 'IndiGo' },
  { code: 'AI', name: 'Air India' },
  { code: 'SG', name: 'SpiceJet' },
  { code: 'UK', name: 'Vistara' },
  { code: 'I5', name: 'AirAsia India' },
  { code: 'QP', name: 'Akasa Air' },
  { code: 'G8', name: 'Go First' },
  { code: 'IX', name: 'Air India Express' },
];

function generateMockFlights(from: string, to: string, passengers: number) {
  return Array.from({ length: 8 }, (_, i) => {
    const airline = AIRLINES[i % AIRLINES.length]!;
    const depHour = 5 + i * 2 + (i % 3);
    const durationMins = 90 + Math.floor(Math.random() * 120);
    const arrMins = depHour * 60 + durationMins;
    return {
      id: `${airline.code}-${100 + Math.floor(Math.random() * 900)}`,
      airline: airline.name,
      airlineCode: airline.code,
      flightNumber: `${airline.code} ${100 + Math.floor(Math.random() * 900)}`,
      departure: `${String(depHour % 24).padStart(2, '0')}:${String((i * 17) % 60).padStart(2, '0')}`,
      arrival: `${String(Math.floor(arrMins / 60) % 24).padStart(2, '0')}:${String(arrMins % 60).padStart(2, '0')}`,
      duration: `${Math.floor(durationMins / 60)}h ${durationMins % 60}m`,
      from,
      to,
      price: (2500 + i * 500 + Math.floor(Math.random() * 1000)) * passengers,
      pricePerPerson: 2500 + i * 500 + Math.floor(Math.random() * 1000),
      seatsAvailable: Math.floor(Math.random() * 40) + 1,
      stops: i % 4 === 3 ? 1 : 0,
      aircraft: i % 2 === 0 ? 'Airbus A320neo' : 'Boeing 737 MAX',
      baggage: '15kg cabin + 25kg check-in',
    };
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const params = FlightSearchSchema.parse(body);

    // Check if Amadeus is configured
    const amadeusClientId = process.env.AMADEUS_CLIENT_ID;
    const isRealAmadeus = amadeusClientId && !amadeusClientId.includes('your_');

    if (isRealAmadeus) {
      // Real Amadeus API flow would go here
      // For now, return mock data as the API keys aren't configured yet
    }

    const flights = generateMockFlights(params.from, params.to, params.passengers || 1);

    return NextResponse.json({
      success: true,
      data: flights,
      source: isRealAmadeus ? 'amadeus' : 'mock',
      meta: { from: params.from, to: params.to, date: params.date, passengers: params.passengers || 1 },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid parameters', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Flight search failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const from = sp.get('from') || '';
  const to = sp.get('to') || '';
  const date = sp.get('date') || new Date().toISOString().split('T')[0];
  const passengers = parseInt(sp.get('passengers') || '1');

  if (!from || !to) {
    return NextResponse.json({ success: false, error: 'Missing from/to parameters' }, { status: 400 });
  }

  const flights = generateMockFlights(from, to, passengers);
  return NextResponse.json({ success: true, data: flights, source: 'mock' });
}
