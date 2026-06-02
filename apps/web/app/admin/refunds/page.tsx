'use client';

import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from '@moon/ui';
import Link from 'next/link';
import { ArrowLeft, RefreshCcw, DollarSign, Filter, Search, Calendar, FileText, CheckCircle2, AlertOctagon, X, ChevronRight, Scale, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@moon/utils';

interface RefundItem {
  id: string;
  bookingId: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: string;
}

export default function AdminRefundsPage() {
  const [refunds, setRefunds] = useState<RefundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedRefund, setSelectedRefund] = useState<RefundItem | null>(null);
  const { toast } = useToast();

  const fetchRefunds = async () => {
    try {
      const res = await fetch('/api/admin/refunds');
      if (!res.ok) throw new Error('Failed to fetch refunds');
      const data = await res.json();
      const list = data.refunds || [];
      setRefunds(list);
      // Default select the first item if none is selected
      if (list.length > 0 && !selectedRefund) {
        setSelectedRefund(list[0]);
      }
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to load refunds list.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const handleApproveRefund = async (refundId: string) => {
    try {
      const res = await fetch(`/api/admin/refunds/${refundId}/approve`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to approve refund');
      toast({
        title: 'Success',
        description: 'Refund approved successfully.',
      });
      // Refetch and update selected refund details
      const updatedListRes = await fetch('/api/admin/refunds');
      if (updatedListRes.ok) {
        const data = await updatedListRes.json();
        setRefunds(data.refunds || []);
        const matched = (data.refunds || []).find((r: RefundItem) => r.id === refundId);
        if (matched) setSelectedRefund(matched);
      }
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to process refund approval.',
        variant: 'destructive',
      });
    }
  };

  const handleRejectRefund = (refundId: string) => {
    toast({
      title: 'Dispute Rejected',
      description: `Refund dispute for ID ${refundId} has been rejected by audit policy.`,
      variant: 'default',
    });
  };

  // Filter logic
  const filteredRefunds = refunds.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || r.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden pb-16">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-brand-500/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-red-500/5 blur-[100px] -z-10" />

      <Container className="py-8 max-w-6xl space-y-6 pt-24">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="p-3 border border-white/10 bg-white/[0.02] backdrop-blur-md rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-red-500/10 text-red-400 border-red-500/20 font-bold px-2 py-0.5 rounded-lg text-[10px] uppercase tracking-wider">
                  Disputes Desk
                </Badge>
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-bold px-2 py-0.5 rounded-lg text-[10px] uppercase tracking-wider">
                  Live Audit
                </Badge>
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">Refund Processing</h1>
            </div>
          </div>

          <div className="text-sm text-slate-400 font-medium">
            Pending Disputes: <span className="text-white font-mono font-bold">{refunds.filter(r => r.status !== 'APPROVED').length}</span>
          </div>
        </div>

        {/* Filters Panel */}
        <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-3xl p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search disputes by Refund ID, Booking ID, or Reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-950/60 border border-white/5 rounded-2xl text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/25 outline-none transition"
              />
            </div>

            {/* Status Segments */}
            <div className="flex items-center gap-1.5 bg-slate-950/40 rounded-2xl p-1.5 border border-white/5 self-stretch md:self-auto justify-center">
              {['ALL', 'PENDING', 'PROCESSING', 'APPROVED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
                    statusFilter === status
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/15'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {status === 'ALL' ? 'All Disputes' : status}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Dual pane review dashboard */}
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left Pane: Disputes Cards Queue */}
          <div className="space-y-4">
            {loading ? (
              <div className="py-16 text-center text-slate-400 font-medium animate-pulse flex flex-col items-center justify-center gap-3">
                <RefreshCcw className="h-6 w-6 text-brand-400 animate-spin" />
                <span>Loading active refund queue...</span>
              </div>
            ) : filteredRefunds.length === 0 ? (
              <div className="py-16 text-center text-slate-400 font-medium bg-white/[0.02] border border-white/5 rounded-3xl">
                No active refund request in queue.
              </div>
            ) : (
              <div className="space-y-3 max-h-[36rem] overflow-y-auto pr-2">
                {filteredRefunds.map((r) => {
                  const isSelected = selectedRefund?.id === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedRefund(r)}
                      className={`p-5 rounded-3xl border cursor-pointer transition text-left flex items-start justify-between gap-4 ${
                        isSelected
                          ? 'border-brand-500 bg-white/[0.06] shadow-lg shadow-brand-500/5'
                          : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="space-y-2 min-w-0">
                        <div className="flex items-center gap-2">
                          <Scale className="h-4 w-4 text-slate-400 shrink-0" />
                          <span className="font-mono text-xs text-white font-bold">{r.id}</span>
                        </div>
                        <p className="text-xs text-slate-400 truncate">Booking ID: <span className="font-mono">{r.bookingId}</span></p>
                        <p className="text-slate-300 text-xs italic mt-1 truncate">"{r.reason}"</p>
                      </div>

                      <div className="text-right shrink-0 space-y-2">
                        <div className="font-extrabold text-white text-base">{formatPrice(r.amount)}</div>
                        <Badge 
                          className={
                            r.status === 'APPROVED'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold px-2 py-0.5 rounded-lg text-[10px]'
                              : r.status === 'PROCESSING'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 font-bold px-2 py-0.5 rounded-lg text-[10px]'
                              : 'bg-red-500/10 text-red-400 border-red-500/20 font-bold px-2 py-0.5 rounded-lg text-[10px]'
                          }
                        >
                          {r.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Pane: Disputes Inspector */}
          <aside>
            {selectedRefund ? (
              <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] p-6 space-y-6 sticky top-24">
                <div className="border-b border-white/5 pb-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dispute Inspector</span>
                  <h3 className="text-xl font-extrabold text-white mt-1">Reviewing Claim</h3>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">Dispute ID: {selectedRefund.id}</p>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Info table */}
                  <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Booking Target</span>
                      <span className="font-mono text-white font-bold">{selectedRefund.bookingId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Payment Gateway ID</span>
                      <span className="font-mono text-white font-medium">{selectedRefund.paymentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dispute Claim Amount</span>
                      <span className="text-brand-400 font-extrabold text-sm">{formatPrice(selectedRefund.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Current Status</span>
                      <Badge className="bg-white/5 text-slate-300 border-none font-bold text-[10px]">
                        {selectedRefund.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Rider statement */}
                  <div className="space-y-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Rider Cancellation Statement</span>
                    <blockquote className="bg-slate-950/60 border-l-2 border-brand-500 p-4 rounded-r-2xl text-slate-300 italic">
                      "{selectedRefund.reason}"
                    </blockquote>
                  </div>

                  {/* Simulated Audit Risk engine */}
                  <div className="space-y-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Auto policy risk scoring</span>
                    <div className="flex items-center gap-3 bg-slate-950/40 border border-white/5 p-4 rounded-2xl">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-white font-bold">Policy Compliance: Low Risk (98%)</p>
                        <p className="text-[10px] text-slate-500">Rider cancelled within 5 minutes of booking confirmation.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirm actions */}
                <div className="border-t border-white/5 pt-4 flex gap-3">
                  {selectedRefund.status !== 'APPROVED' && selectedRefund.status !== 'PROCESSING' ? (
                    <>
                      <Button
                        onClick={() => handleRejectRefund(selectedRefund.id)}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold border border-white/10"
                      >
                        Reject Dispute
                      </Button>
                      <Button
                        onClick={() => handleApproveRefund(selectedRefund.id)}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold shadow-md shadow-emerald-500/10"
                      >
                        Approve Refund
                      </Button>
                    </>
                  ) : (
                    <div className="w-full text-center bg-emerald-500/5 border border-emerald-500/20 py-3 rounded-2xl text-xs text-emerald-400 font-bold flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                      Refund disbursed & completed
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center border border-white/5 bg-white/[0.01] rounded-[2.5rem] p-12 text-slate-500 text-center font-medium">
                Select a dispute card to view auditor details.
              </div>
            )}
          </aside>
        </div>
      </Container>
    </main>
  );
}

