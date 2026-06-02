import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, syncUserToDb } from '@/lib/auth';
import { db } from '@moon/db';

export async function GET() {
  try {
    const userId = await requireAuth();

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await requireAuth();

    const body = await req.json();
    const { name, preferredLang, homeAddress, workAddress } = body;

    const user = await db.user.update({
      where: { clerkId: userId },
      data: {
        ...(name && { name }),
        ...(preferredLang && { preferredLang }),
        ...(homeAddress !== undefined && { homeAddress }),
        ...(workAddress !== undefined && { workAddress }),
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 400 });
  }
}
