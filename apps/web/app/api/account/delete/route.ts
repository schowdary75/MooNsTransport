import { NextResponse } from 'next/server';
import { db } from '@moon/db';
import { requireAuth } from '@/lib/auth';

export async function DELETE(request: Request) {
  try {
    const clerkId = await requireAuth();

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Find DB User
    const user = await db.user.findUnique({
      where: { clerkId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User record not found' }, { status: 404 });
    }

    // 2. Perform Cascade Deletion of User Data
    const userId = user.id;
    await db.$transaction([
      db.savedPlace.deleteMany({ where: { userId } }),
      db.journeyHistory.deleteMany({ where: { userId } }),
      db.notification.deleteMany({ where: { userId } }),
      db.pushToken.deleteMany({ where: { userId } }),
      db.supportTicket.deleteMany({ where: { userId } }),
      db.booking.deleteMany({ where: { userId } }),
      db.payment.deleteMany({ where: { userId } }),
      db.user.delete({ where: { id: userId } })
    ]);

    return NextResponse.json({
      success: true,
      message: 'Account and associated telemetry successfully purged in compliance with DPDP Act 2023.'
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
