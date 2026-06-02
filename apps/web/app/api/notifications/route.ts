import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@moon/db';

const MOCK_NOTIFICATIONS = [
  { id: '1', type: 'booking', title: 'Booking Confirmed', body: 'Your Rajdhani Express ticket NDLS → BCT on Jun 15 is confirmed. PNR: 284756381', time: '2 hours ago', read: false },
  { id: '2', type: 'delay', title: 'Delay Alert: Blue Line', body: 'Delhi Metro Blue Line experiencing 5-minute delays between Rajiv Chowk and Yamuna Bank due to a signal fault.', time: '3 hours ago', read: false },
  { id: '3', type: 'payment', title: 'Payment Successful', body: '₹2,450 paid for Rajdhani Express booking. Transaction ID: demo_pay_17280001', time: '3 hours ago', read: false },
  { id: '4', type: 'info', title: 'Route Update', body: 'New direct metro connection available from Aerocity to Dwarka via Magenta Line.', time: '1 day ago', read: true },
];

export async function GET() {
  try {
    const userId = await requireAuth();

    let dbNotifications = await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    if (dbNotifications.length === 0) {
      // Seed default mock notifications for demo / new user experience
      await Promise.all(
        MOCK_NOTIFICATIONS.map((n) =>
          db.notification.create({
            data: {
              userId,
              type: n.type.toUpperCase() as any,
              title: n.title,
              body: n.body,
              isRead: n.read,
            },
          })
        )
      ).catch(() => {});
      dbNotifications = await db.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({
      success: true,
      notifications: dbNotifications.map((n) => ({
        id: n.id,
        type: n.type.toLowerCase(),
        title: n.title,
        body: n.body,
        time: formatRelativeTime(n.createdAt),
        read: n.isRead,
      })),
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      notifications: MOCK_NOTIFICATIONS,
      source: 'mock',
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth();
    const body = await req.json();
    const { action, id } = body;

    if (action === 'markAllRead') {
      await db.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });
    } else if (action === 'markRead' && id) {
      await db.notification.update({
        where: { id, userId },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update notification' }, { status: 500 });
  }
}

function formatRelativeTime(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}
