'use client';

import { useState, useEffect } from 'react';
import {
  Bell,
  BusFront,
  CheckCheck,
  CreditCard,
  Info,
  PlaneTakeoff,
  TrainFront,
  AlertTriangle,
} from 'lucide-react';
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@moon/ui';

type NotificationType = 'booking' | 'payment' | 'delay' | 'info' | 'promo';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  link?: string;
}

const typeConfig: Record<NotificationType, { icon: typeof Bell; bg: string; color: string }> = {
  booking: { icon: TrainFront, bg: 'bg-emerald-100', color: 'text-emerald-700' },
  payment: { icon: CreditCard, bg: 'bg-blue-100', color: 'text-blue-700' },
  delay: { icon: AlertTriangle, bg: 'bg-amber-100', color: 'text-amber-700' },
  info: { icon: Info, bg: 'bg-slate-100', color: 'text-slate-700' },
  promo: { icon: Bell, bg: 'bg-purple-100', color: 'text-purple-700' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | NotificationType>('all');
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (e) {
      console.error('Failed to fetch notifications:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    // Optimistic UI update
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllRead' }),
      });
    } catch (e) {
      console.error(e);
      fetchNotifications(); // Revert/sync on failure
    }
  };

  const markRead = async (id: string) => {
    const item = notifications.find((n) => n.id === id);
    if (!item || item.read) return;

    // Optimistic UI update
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markRead', id }),
      });
    } catch (e) {
      console.error(e);
      fetchNotifications(); // Revert/sync on failure
    }
  };

  const filtered = filter === 'all' ? notifications : notifications.filter((n) => n.type === filter);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 py-8 sm:px-8 sm:py-10">
      <section className="space-y-4">
        <Badge variant="neutral">Notifications</Badge>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Notifications
            </h1>
            <p className="mt-2 text-lg text-slate-600">
              {loading ? 'Retrieving notifications...' : unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </button>
          )}
        </div>
      </section>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'booking', 'payment', 'delay', 'info', 'promo'] as const).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`rounded-xl px-3 py-2 text-xs font-semibold capitalize transition ${
              filter === key ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {loading ? (
        <div className="py-8 text-center text-slate-500 font-medium animate-pulse">Loading notifications...</div>
      ) : filtered.length === 0 ? (
        <div className="py-8 text-center text-slate-500 font-medium">No notifications.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => {
            const config = typeConfig[n.type] || typeConfig.info;
            const Icon = config.icon;
            return (
              <Card
                key={n.id}
                className={`overflow-hidden transition hover:shadow-md cursor-pointer ${!n.read ? 'border-l-4 border-l-blue-500' : ''}`}
                onClick={() => markRead(n.id)}
              >
                <CardContent className="flex items-start gap-4 p-5">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg} ${config.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`font-semibold ${!n.read ? 'text-slate-950' : 'text-slate-700'}`}>{n.title}</p>
                      {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{n.body}</p>
                    <p className="mt-2 text-xs text-slate-400">{n.time}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
