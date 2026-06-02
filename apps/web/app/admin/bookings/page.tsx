'use client';

import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from '@moon/ui';
import Link from 'next/link';
import { ArrowLeft, Ticket, Search, Filter, Calendar, DollarSign, Clock, Users, X, Info, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@moon/utils';

interface BookingItem {
  id: string;
  type: string;
  status: string;
  fromStop: string;
  toStop: string;
  journeyDate: string;
  passengers: number;
  totalFare: number;
  currency: string;
  externalRef: string | null;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const { toast } = useToast();

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/admin/bookings');
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to load bookings log.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filters logic
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.fromStop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.toStop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.externalRef || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'ALL' || b.type.toUpperCase() === typeFilter.toUpperCase();
    const matchesStatus = statusFilter === 'ALL' || b.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden pb-16">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-brand-500/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-emerald-500/5 blur-[100px] -z-10" />

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
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold px-2 py-0.5 rounded-lg text-[10px] uppercase tracking-wider">
                  Bookings Desk
                </Badge>
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-bold px-2 py-0.5 rounded-lg text-[10px] uppercase tracking-wider">
                  Operational Control
                </Badge>
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">Bookings Manager</h1>
            </div>
          </div>

          <div className="text-sm text-slate-400 font-medium">
            Active Records: <span className="text-white font-mono font-bold">{bookings.length}</span>
          </div>
        </div>

        {/* Filters and search card */}
        <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-3xl p-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by ID, route stops, or external reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-950/60 border border-white/5 rounded-2xl text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/25 outline-none transition"
              />
            </div>

            {/* Sub-Filters Tabs */}
            <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto justify-end">
              {/* Type Filter */}
              <div className="flex items-center gap-1 bg-slate-950/40 rounded-2xl p-1 border border-white/5">
                {['ALL', 'METRO', 'BUS', 'FLIGHT', 'TRAIN'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                      typeFilter === t
                        ? 'bg-brand-500 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t === 'ALL' ? 'All Modes' : t}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-slate-950/40 rounded-2xl p-1 border border-white/5">
                {['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                      statusFilter === st
                        ? 'bg-emerald-500 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st === 'ALL' ? 'All Status' : st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Bookings Table Card */}
        <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="border-b border-white/5 bg-white/[0.01]">
            <CardTitle className="text-white text-xl">System Booking Logs</CardTitle>
            <CardDescription className="text-slate-400">
              Monitor transit bookings, passenger seat assignments, and external operator handshakes.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-16 text-center text-slate-400 font-medium animate-pulse flex flex-col items-center justify-center gap-3">
                <Clock className="h-6 w-6 text-brand-400 animate-spin" />
                <span>Retrieving real-time transit logs...</span>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="py-16 text-center text-slate-400 font-medium">
                No matching booking records found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-950/50 border-b border-white/10 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                      <th className="p-5 pl-8">Booking Identifier</th>
                      <th className="p-5">Transit Type</th>
                      <th className="p-5">Journey Route</th>
                      <th className="p-5">Date & Time</th>
                      <th className="p-5">Fare Details</th>
                      <th className="p-5">Status</th>
                      <th className="p-5 pr-8 text-right">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-white/[0.02] transition">
                        <td className="p-5 pl-8 font-mono font-medium text-white">
                          <div className="flex items-center gap-2">
                            <Ticket className="h-4.5 w-4.5 text-brand-400 shrink-0" />
                            <span>{b.id}</span>
                          </div>
                        </td>
                        <td className="p-5">
                          <Badge className="bg-white/[0.04] text-slate-300 border-white/10 font-bold px-2 py-0.5 rounded-lg text-[10px] tracking-wide">
                            {b.type.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-5">
                          <div className="font-bold text-white text-base">{b.fromStop}</div>
                          <div className="text-xs text-slate-400 mt-0.5">to {b.toStop}</div>
                        </td>
                        <td className="p-5">
                          <div className="text-slate-200 font-medium">{new Date(b.journeyDate).toLocaleDateString()}</div>
                          <div className="text-xs text-slate-500 mt-0.5 font-mono">
                            {new Date(b.journeyDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="font-extrabold text-white text-base">{formatPrice(b.totalFare)}</div>
                          <div className="text-xs text-slate-500 mt-0.5 font-medium">{b.passengers} Rider(s)</div>
                        </td>
                        <td className="p-5">
                          <Badge 
                            className={
                              b.status === 'CONFIRMED'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold px-3 py-1 rounded-xl'
                                : b.status === 'PENDING'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 font-bold px-3 py-1 rounded-xl'
                                : 'bg-red-500/10 text-red-400 border-red-500/20 font-bold px-3 py-1 rounded-xl'
                            }
                          >
                            {b.status}
                          </Badge>
                        </td>
                        <td className="p-5 pr-8 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl px-2.5 py-1.5"
                            onClick={() => setSelectedBooking(b)}
                          >
                            <Info className="h-4 w-4 mr-1.5" />
                            Receipt
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Booking Receipt Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-opacity">
          <Card className="w-full max-w-md border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Barcode header effect */}
            <div className="bg-slate-950 p-6 flex flex-col items-center justify-center border-b border-white/5 relative">
              <button 
                onClick={() => setSelectedBooking(null)} 
                className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 mb-4 mt-2">
                <Ticket className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Transit Ticket Receipt</h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">{selectedBooking.id}</p>

              {/* Simulated barcode */}
              <div className="mt-5 w-full bg-white p-3.5 rounded-2xl flex flex-col items-center justify-center">
                <div className="w-full h-11 bg-[repeating-linear-gradient(90deg,black,black_2px,transparent_2px,transparent_6px)] opacity-85" />
                <span className="text-[9px] font-mono text-slate-700 tracking-[0.4em] mt-2 select-all">*{selectedBooking.id}*</span>
              </div>
            </div>

            <CardContent className="p-6 space-y-5 text-sm">
              {/* Route */}
              <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Origin Stop</span>
                  <span className="text-white font-extrabold text-base mt-1 block">{selectedBooking.fromStop}</span>
                </div>
                <div className="h-px bg-white/10 flex-1 border-dashed mx-2 mt-4" />
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Destination</span>
                  <span className="text-white font-extrabold text-base mt-1 block">{selectedBooking.toStop}</span>
                </div>
              </div>

              {/* Ticket details */}
              <div className="grid grid-cols-2 gap-4 text-xs border-b border-white/5 pb-4">
                <div>
                  <span className="text-slate-500 font-semibold">Travel Date</span>
                  <p className="text-slate-200 font-bold mt-0.5">{new Date(selectedBooking.journeyDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">Mode / Type</span>
                  <p className="text-slate-200 font-bold mt-0.5 uppercase">{selectedBooking.type}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">Passengers</span>
                  <p className="text-slate-200 font-bold mt-0.5">{selectedBooking.passengers} Rider(s)</p>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">Partner Ref</span>
                  <p className="text-slate-200 font-mono mt-0.5">{selectedBooking.externalRef || 'LOCAL_SEEDED'}</p>
                </div>
              </div>

              {/* Price calculation */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Base ticket charge</span>
                  <span>{formatPrice(selectedBooking.totalFare * 0.9)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>CGST + SGST (18%)</span>
                  <span>{formatPrice(selectedBooking.totalFare * 0.08)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Local transit surcharge</span>
                  <span>{formatPrice(selectedBooking.totalFare * 0.02)}</span>
                </div>
                <div className="flex justify-between text-sm text-white font-bold border-t border-white/5 pt-3">
                  <span>Total Amount Paid</span>
                  <span className="text-brand-400 font-extrabold text-base">{formatPrice(selectedBooking.totalFare)}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center pt-3 text-[10px] text-slate-500">
                <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-extrabold px-2 py-0.5 rounded-md">
                  {selectedBooking.status}
                </Badge>
                <span>Authorized via Moon Gateway</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}

