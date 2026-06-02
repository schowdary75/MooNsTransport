'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Calendar, AlertCircle, RefreshCw, X } from 'lucide-react';
import { Badge } from '@moon/ui';

interface RefundRequest {
  id: string;
  bookingId: string;
  amount: number;
  reason: string;
  status: string;
  createdDate: string;
}

interface Booking {
  id: string;
  fromStop: string;
  toStop: string;
  totalFare: number;
  status: string;
  journeyDate: string;
  type: string;
}

export default function RefundsPage() {
  const { toast } = useToast();
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [refundReason, setRefundReason] = useState('User requested cancellation');
  const [submitting, setSubmitting] = useState(false);

  const fetchRefundsAndBookings = async () => {
    try {
      // Fetch refunds
      const refundsRes = await fetch('/api/refunds');
      if (!refundsRes.ok) throw new Error('Failed to fetch refunds');
      const refundsData = await refundsRes.json();
      
      const mappedRefunds = (refundsData.refunds || []).map((r: any) => ({
        id: r.id,
        bookingId: r.bookingId,
        amount: r.amount,
        reason: r.reason,
        status: r.status,
        createdDate: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      }));
      setRefunds(mappedRefunds);

      // Fetch bookings to see which ones are eligible for refund
      const bookingsRes = await fetch('/api/bookings');
      if (!bookingsRes.ok) throw new Error('Failed to fetch bookings');
      const bookingsData = await bookingsRes.json();
      
      // Keep only DB records shape
      setBookings(bookingsData.bookings || []);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error loading refunds',
        description: 'Unable to retrieve your refund history.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefundsAndBookings();
    
    // Check if redirect contains query param
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const bId = urlParams.get('bookingId');
      if (bId) {
        setSelectedBookingId(bId);
        setIsModalOpen(true);
      }
    }
  }, []);

  // Filter bookings that don't already have refunds associated
  const eligibleBookings = bookings.filter((b) => {
    const hasRefund = refunds.some((r) => r.bookingId === b.id);
    return !hasRefund && (b.status === 'CANCELLED' || b.status === 'CONFIRMED');
  });

  const handleSubmitRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId) {
      toast({
        title: 'Validation Error',
        description: 'Please select a booking to request a refund.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const targetBooking = bookings.find((b) => b.id === selectedBookingId);
      
      // If it is active/confirmed, cancel it first on the server
      if (targetBooking?.status === 'CONFIRMED') {
        const cancelRes = await fetch(`/api/bookings/${selectedBookingId}/cancel`, {
          method: 'POST',
        });
        if (!cancelRes.ok) throw new Error('Failed to cancel active booking');
      }

      // Submit refund creation
      const res = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBookingId,
          reason: refundReason,
        }),
      });

      if (!res.ok) throw new Error('Refund submission failed');

      toast({
        title: 'Refund Request Created',
        description: 'Your refund request has been submitted and is being processed.',
      });

      setIsModalOpen(false);
      setSelectedBookingId('');
      setRefundReason('User requested cancellation');
      fetchRefundsAndBookings();
    } catch (err) {
      toast({
        title: 'Submission failed',
        description: 'Unable to initiate refund. Please check connections and try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
          <span className="text-sm font-medium text-slate-500">Loading refunds page...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-8 sm:px-8 sm:py-10">
      <div className="flex justify-between items-start gap-4">
        <div>
          <Badge variant="neutral">Refund Center</Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl mt-3">
            Track and Request Refunds
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600 mt-2">
            View transaction status and request reversals for your cancelled itineraries.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchRefundsAndBookings} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Request Refund
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {refunds.length === 0 ? (
          <Card className="border border-dashed border-slate-200 p-8 text-center bg-slate-50/50">
            <AlertCircle className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <p className="text-lg font-semibold text-slate-700">No refunds found</p>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
              You haven't initiated any refund requests yet. Active or cancelled bookings are eligible.
            </p>
          </Card>
        ) : (
          refunds.map((refund) => (
            <Card key={refund.id} className="p-5 border border-slate-200/80 hover:shadow-sm transition">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-950 text-base">Booking ID: #{refund.bookingId}</span>
                    <Badge variant={refund.status === 'APPROVED' ? 'success' : refund.status === 'REJECTED' ? 'warning' : 'neutral'}>
                      {refund.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500">Refund reference: {refund.id}</p>
                  <p className="text-sm text-slate-600 italic">Reason: "{refund.reason}"</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                    <Calendar className="h-3.5 w-3.5" />
                    Requested on {new Date(refund.createdDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div className="text-right sm:self-center">
                  <div className="text-2xl font-bold text-slate-950">₹{refund.amount}</div>
                  <p className="text-xs text-slate-400 mt-1">To original source</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Request Refund Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl relative border border-slate-100">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-2xl font-bold text-slate-950 mb-1">Request Refund</h3>
            <p className="text-sm text-slate-500 mb-6">Select an eligible trip to cancel and refund.</p>
            
            <form onSubmit={handleSubmitRefund} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Select Booking</label>
                {eligibleBookings.length === 0 ? (
                  <div className="rounded-xl border border-red-100 bg-red-50/50 p-4 text-sm text-red-600 flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">No eligible bookings</p>
                      <p className="text-xs text-red-500 mt-0.5">All your active or cancelled bookings already have refund requests pending or approved.</p>
                    </div>
                  </div>
                ) : (
                  <select
                    value={selectedBookingId}
                    onChange={(e) => setSelectedBookingId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    required
                  >
                    <option value="" disabled>-- Choose a booking --</option>
                    {eligibleBookings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.type} Pass: {b.fromStop} → {b.toStop} (₹{b.totalFare})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Reason for Refund</label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 h-24 resize-none"
                  placeholder="Tell us why you are requesting a refund..."
                  required
                />
              </div>

              <div className="pt-2 flex gap-3">
                <Button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  variant="outline" 
                  className="flex-1 rounded-xl"
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 rounded-xl" 
                  disabled={submitting || eligibleBookings.length === 0}
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
