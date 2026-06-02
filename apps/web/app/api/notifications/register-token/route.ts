import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@moon/db';
import { z } from 'zod';

const RegisterTokenSchema = z.object({
  token: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth();

    const body = await req.json();
    const { token } = RegisterTokenSchema.parse(body);

    // Save token to database
    await db.pushToken.upsert({
      where: { userId_token: { userId, token } },
      create: {
        userId,
        token,
        platform: 'WEB',
      },
      update: {
        lastUpdated: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Token registration error:', error);
    return NextResponse.json({ error: 'Failed to register token' }, { status: 500 });
  }
}
