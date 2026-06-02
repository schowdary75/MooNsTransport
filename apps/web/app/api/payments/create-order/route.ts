import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@moon/db';
import { z } from 'zod';

const CreateOrderSchema = z.object({
  bookingId: z.string(),
  amount: z.number().positive(),
  description: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth();

    const body = await req.json();
    const { bookingId, amount, description } = CreateOrderSchema.parse(body);

    // Verify booking belongs to user
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || booking.userId !== userId) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Create Razorpay order
    const razorpayKey = process.env.RAZORPAY_KEY_ID;
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKey || !razorpaySecret) {
      return NextResponse.json({ error: 'Payment service not configured' }, { status: 500 });
    }

    const auth = Buffer.from(`${razorpayKey}:${razorpaySecret}`).toString('base64');

    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to paise
        currency: 'INR',
        receipt: bookingId,
        notes: {
          bookingId,
          userId,
        },
      }),
    });

    if (!razorpayResponse.ok) {
      throw new Error('Failed to create Razorpay order');
    }

    const razorpayOrder = await razorpayResponse.json();

    // Save payment record
    await db.payment.create({
      data: {
        bookingId,
        userId,
        amount,
        status: 'CREATED',
        method: 'UPI',
        razorpayOrderId: razorpayOrder.id,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      keyId: razorpayKey,
      amount,
      bookingId,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
