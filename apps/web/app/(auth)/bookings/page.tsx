'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BusFront,
  Calendar,
  CreditCard,
  PlaneTakeoff,
  QrCode,
  TrainFront,
  X,
  Loader2,
  AlertTriangle,
  ArrowLeft,
  Info,
  BadgeAlert,
  Ticket as TicketIcon,
} from 'lucide-react';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@moon/ui';
import { useToast } from '@/hooks/use-toast';

type BookingStatus = 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'PENDING' | 'REFUNDED';
type BookingType = 'TRAIN' | 'BUS' | 'METRO' | 'FLIGHT' | 'CAB' | 'BIKE_RENTAL' | 'CAR_RENTAL';

interface Booking {
  id: string;
  type: BookingType;
  from: string;
  to: string;
  date: string;
  time: string;
  status: BookingStatus;
  pnr: string;
  fare: number;
  passengers: number;
  provider: string;
}

const modeIcons: Record<BookingType, typeof TrainFront> = {
  TRAIN: TrainFront,
  BUS: BusFront,
  METRO: TrainFront,
  FLIGHT: PlaneTakeoff,
  CAB: BusFront,
  BIKE_RENTAL: BusFront,
  CAR_RENTAL: BusFront,
};

const statusStyles: Record<BookingStatus, { bg: string; text: string; border: string; variant: 'success' | 'warning' | 'neutral' }> = {
  CONFIRMED: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', variant: 'success' },
  COMPLETED: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20', variant: 'neutral' },
  CANCELLED: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', variant: 'warning' },
  PENDING: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', variant: 'warning' },
  REFUNDED: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', variant: 'neutral' },
};

type TabType = 'upcoming' | 'past' | 'cancelled';

export default function BookingsPage() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [showQr, setShowQr] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const json = await res.json();
      
      const mapped = (json.bookings || []).map((b: any) => {
        const jDate = new Date(b.journeyDate);
        return {
          id: b.id,
          type: b.type as BookingType,
          from: b.fromStop,
          to: b.toStop,
          date: b.journeyDate.split('T')[0],
          time: jDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
          status: b.status as BookingStatus,
          pnr: b.externalRef || 'N/A',
          fare: b.totalFare,
          passengers: b.passengers,
          provider: b.provider || (b.type === 'METRO' ? 'Delhi Metro Rail Corp' : b.type === 'BUS' ? 'State RTC' : 'Transit booking'),
        };
      });
      setBookings(mapped);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error loading bookings',
        description: 'We could not fetch your booking history from the server.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      // 1. Cancel the booking via server API
      const cancelRes = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
      });
      if (!cancelRes.ok) throw new Error('Cancellation failed');

      // 2. Request refund
      const refundRes = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, reason: 'Commuter cancellation request' }),
      });
      if (!refundRes.ok) {
        console.warn('Refund request failed, but booking was cancelled');
      }

      toast({
        title: 'Booking Cancelled',
        description: 'Your booking has been cancelled and a refund has been initiated.',
      });

      fetchBookings();
    } catch (err) {
      toast({
        title: 'Cancellation failed',
        description: 'Unable to cancel this booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setCancellingId(null);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const filtered = bookings.filter((b) => {
    if (activeTab === 'upcoming') return b.date >= today! && b.status !== 'CANCELLED' && b.status !== 'REFUNDED';
    if (activeTab === 'past') return b.date < today! && b.status !== 'CANCELLED' && b.status !== 'REFUNDED';
    return b.status === 'CANCELLED' || b.status === 'REFUNDED';
  });

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: 'upcoming', label: 'Upcoming Trips', count: bookings.filter((b) => b.date >= today! && b.status !== 'CANCELLED' && b.status !== 'REFUNDED').length },
    { key: 'past', label: 'Past Journeys', count: bookings.filter((b) => b.date < today! && b.status !== 'CANCELLED' && b.status !== 'REFUNDED').length },
    { key: 'cancelled', label: 'Refunds & Cancellations', count: bookings.filter((b) => b.status === 'CANCELLED' || b.status === 'REFUNDED').length },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
          <span className="text-sm text-slate-400 font-semibold uppercase tracking-wider">Loading active tickets...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden pb-16">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-brand-500/5 blur-[120px] -z-10" />

      <section className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 pt-24">
        {/* Header branding */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6 mb-8">
          <div className="flex items-center gap-2">
            <Link href="/" className="p-2 hover:bg-white/5 rounded-xl transition text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Boarding Passes</h1>
          </div>
          <Badge className="bg-brand-500/10 text-brand-400 border-brand-500/25">
            Travel Tickets
          </Badge>
        </header>

        {/* Stats Grid */}
        <section className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-8">
          {[
            { label: 'Total Trips', value: String(bookings.length) },
            { label: 'Active Tickets', value: String(tabs[0].count) },
            { label: 'Completed Trips', value: String(tabs[1].count) },
            { label: 'Spent Amount', value: `₹${bookings.reduce((s, b) => s + b.fare, 0).toLocaleString()}` },
          ].map((stat) => (
            <Card key={stat.label} className="border-white/5 bg-white/[0.02] backdrop-blur-md rounded-2xl">
              <CardContent className="p-5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className="mt-2 text-2xl font-bold text-white tracking-tight">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Tab Controls */}
        <div className="flex gap-2 border-b border-white/5 pb-3 mb-6 overflow-x-auto scrollbar-thin">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-xl px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
              <span className={`ml-2 rounded-lg px-2 py-0.5 text-[10px] ${
                activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Bookings Timeline */}
        <section className="space-y-6">
          {filtered.length === 0 ? (
            <Card className="border-white/5 bg-white/[0.02] backdrop-blur-md rounded-3xl p-10 text-center">
              <CardContent className="flex flex-col items-center gap-4 py-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 border border-white/5 text-slate-500">
                  <TicketIcon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">No Tickets Found</h3>
                  <p className="text-sm text-slate-400 mt-1 max-w-sm">
                    {activeTab === 'upcoming'
                      ? 'Plan a new trip and purchase tickets to display them here.'
                      : 'Your travel records and history will be listed here.'}
                  </p>
                </div>
                <Button href="/routes" className="rounded-xl px-6 bg-brand-500 hover:bg-brand-600 text-white font-semibold">
                  Plan Journey
                </Button>
              </CardContent>
            </Card>
          ) : (
            filtered.map((booking) => {
              const Icon = modeIcons[booking.type] || TrainFront;
              const style = statusStyles[booking.status] || { bg: 'bg-white/5', text: 'text-slate-400', border: 'border-white/5', variant: 'neutral' as const };
              
              return (
                <div
                  key={booking.id}
                  className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950 shadow-2xl flex flex-col md:flex-row items-stretch"
                >
                  {/* Left part: Boarding Card details */}
                  <div className="flex-1 p-6 md:p-8 space-y-4">
                    
                    {/* Header info */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          booking.type === 'METRO' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{booking.provider}</span>
                          <h3 className="text-lg font-bold text-white leading-tight mt-0.5">{booking.type} Ride</h3>
                        </div>
                      </div>
                      
                      <Badge className={`${style.bg} ${style.text} ${style.border} px-3 py-1 rounded-xl font-bold border`}>
                        {booking.status}
                      </Badge>
                    </div>

                    {/* From / To Stations visual */}
                    <div className="py-2 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[9px] uppercase font-bold text-slate-500">Boarding Point</p>
                        <p className="text-base font-extrabold text-white truncate mt-1">{booking.from}</p>
                      </div>
                      <div className="flex-1 border-t border-dashed border-white/10 mx-4 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 px-2 text-slate-500 text-xs">
                          ➔
                        </div>
                      </div>
                      <div className="min-w-0 text-right">
                        <p className="text-[9px] uppercase font-bold text-slate-500">Destination</p>
                        <p className="text-base font-extrabold text-white truncate mt-1">{booking.to}</p>
                      </div>
                    </div>

                    {/* Date/Time Details */}
                    <div className="grid grid-cols-3 gap-4 pt-2 text-xs border-t border-white/5">
                      <div>
                        <span className="text-slate-500 block">JOURNEY DATE</span>
                        <span className="font-semibold text-white mt-1 block">
                          {new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">DEPARTURE</span>
                        <span className="font-semibold text-white mt-1 block">{booking.time}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">PASSENGERS</span>
                        <span className="font-semibold text-white mt-1 block">{booking.passengers} Rider(s)</span>
                      </div>
                    </div>

                    {/* Ticket rules alert */}
                    {booking.status === 'CONFIRMED' && (
                      <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 p-3 rounded-2xl text-[10px] leading-4 text-amber-400 mt-2">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Boarding Notice</p>
                          <p className="mt-0.5 text-slate-400">Please arrive at the platform 10-15 minutes prior to the scheduled departure time.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Visual separation line for ticket card (horizontal on mobile, vertical on desktop) */}
                  <div className="relative flex items-center justify-center md:w-6 bg-slate-950">
                    <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-slate-950 md:left-auto md:top-[-12px] md:translate-y-0" />
                    <div className="absolute right-[-12px] top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-slate-950 md:right-auto md:bottom-[-12px] md:translate-y-0" />
                    <div className="h-full border-l border-dashed border-white/10 w-0 hidden md:block" />
                    <div className="w-full border-t border-dashed border-white/10 h-0 block md:hidden" />
                  </div>

                  {/* Right part: Price, PNR, QR button action */}
                  <div className="md:w-[220px] shrink-0 bg-white/[0.01] p-6 md:p-8 flex flex-col justify-between items-center text-center border-t border-white/5 md:border-t-0 md:border-l border-white/5">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">PNR NUMBER</p>
                      <p className="font-mono text-sm font-bold text-white mt-1 bg-slate-900 border border-white/5 px-3 py-1 rounded-xl">
                        {booking.pnr}
                      </p>
                    </div>

                    <div className="my-4">
                      <p className="text-[10px] text-slate-500 uppercase">Paid Amount</p>
                      <p className="text-2xl font-extrabold text-white mt-1">₹{booking.fare.toLocaleString()}</p>
                    </div>

                    <div className="w-full space-y-2">
                      {booking.status === 'CONFIRMED' && (
                        <>
                          <button
                            onClick={() => setShowQr(booking.id)}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-500/10 transition"
                          >
                            <QrCode className="h-4 w-4" />
                            <span>Scan Ticket</span>
                          </button>
                          <button
                            onClick={() => handleCancel(booking.id)}
                            disabled={cancellingId === booking.id}
                            className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition disabled:opacity-50"
                          >
                            {cancellingId === booking.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <X className="h-3.5 w-3.5" />
                            )}
                            <span>Cancel Booking</span>
                          </button>
                        </>
                      )}
                      
                      {booking.status === 'CANCELLED' && (
                        <div className="w-full text-center text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
                          Booking Cancelled
                        </div>
                      )}

                      {booking.status === 'REFUNDED' && (
                        <div className="w-full text-center text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 p-2.5 rounded-xl">
                          Refund Processed
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </section>

        {/* Interactive QR Code Modal */}
        {showQr && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowQr(null)}
          >
            <div
              className="w-full max-w-sm rounded-[2.5rem] bg-slate-950 border border-white/10 p-8 text-center shadow-2xl text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white">Digital Travel Ticket</h3>
              <p className="mt-1.5 text-xs text-slate-400">Scan this code at the gate/boarding entrance.</p>
              
              <div className="mx-auto my-6 flex h-52 w-52 items-center justify-center rounded-[2rem] border-2 border-dashed border-slate-800 bg-slate-900 shadow-inner">
                <QrCode className="h-28 w-28 text-white" />
              </div>
              
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-left space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">PNR Reference:</span>
                  <span className="font-mono font-bold text-white">{bookings.find((b) => b.id === showQr)?.pnr}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Travel Route:</span>
                  <span className="font-bold text-white">
                    {bookings.find((b) => b.id === showQr)?.from} ➔ {bookings.find((b) => b.id === showQr)?.to}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowQr(null)}
                className="mt-6 w-full rounded-2xl bg-brand-500 hover:bg-brand-600 px-4 py-3.5 text-xs font-semibold text-white shadow-lg shadow-brand-500/20 transition"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
