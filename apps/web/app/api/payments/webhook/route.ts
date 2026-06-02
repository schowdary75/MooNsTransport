import { NextRequest, NextResponse } from 'next/server';
import { db } from '@moon/db';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify webhook signature
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);

    // Handle payment.authorized
    if (event.event === 'payment.authorized') {
      const { payment_id, entity } = event.payload.payment;
      const { order_id, bookingId } = entity.notes || {};

      // Update payment status
      await db.payment.updateMany({
        where: { razorpayOrderId: order_id },
        data: {
          status: 'CAPTURED',
          razorpayPayId: payment_id,
        },
      });

      // Update booking status
      if (bookingId) {
        await db.booking.update({
          where: { id: bookingId },
          data: { status: 'CONFIRMED' },
        });
      }
    }

    // Handle payment.failed
    if (event.event === 'payment.failed') {
      const { entity } = event.payload.payment;
      const { order_id } = entity.notes || {};

      await db.payment.updateMany({
        where: { razorpayOrderId: order_id },
        data: { status: 'FAILED' },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
