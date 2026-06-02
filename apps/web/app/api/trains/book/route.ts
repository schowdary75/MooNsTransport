import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@moon/db';
import { z } from 'zod';

const TrainBookingSchema = z.object({
  trainNumber: z.string(),
  trainName: z.string(),
  date: z.string(),
  class: z.string(),
  passengers: z.array(
    z.object({
      name: z.string(),
      age: z.number(),
      berth: z.string().optional(),
    })
  ),
  fare: z.number(),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth();

    const body = await req.json();
    const validatedData = TrainBookingSchema.parse(body);

    // Create booking in database
    const booking = await db.booking.create({
      data: {
        userId,
        type: 'TRAIN',
        status: 'PENDING',
        fromStop: 'Origin Station',
        toStop: 'Destination Station',
        journeyDate: new Date(validatedData.date),
        totalFare: validatedData.fare,
        passengers: validatedData.passengers.length,
        externalRef: validatedData.trainNumber,
      },
    });

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      redirectUrl: `/bookings/${booking.id}/payment`,
    });
  } catch (error) {
    console.error('Booking error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: 'Booking failed' }, { status: 500 });
  }
}
