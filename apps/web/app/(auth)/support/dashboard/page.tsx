'use client';

import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from '@moon/ui';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TicketItem {
  id: string;
  userId: string;
  bookingId: string | null;
  category: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string | null;
  resolvedAt: string | null;
  createdAt: string;
}

export default function SupportDashboardPage() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const { toast } = useToast();

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/support/tickets');
      if (!res.ok) throw new Error('Failed to fetch tickets');
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to load support tickets.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = filterStatus === 'ALL' 
    ? tickets 
    : tickets.filter(t => t.status === filterStatus);

  return (
    <Container className="py-8 max-w-6xl space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 border border-slate-200 rounded-full hover:bg-slate-50 transition">
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </Link>
          <div>
            <Badge variant="neutral">Agent Console</Badge>
            <h1 className="text-4xl font-bold tracking-tight mt-1 text-slate-900">Support Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-100 pb-2 overflow-x-auto">
        {['ALL', 'OPEN', 'IN_PROGRESS', 'CLOSED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              filterStatus === status 
                ? 'bg-brand-600 text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Tickets Queue</CardTitle>
          <CardDescription>SLA-monitored client complaints, app feedback, and ticketing requests.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-slate-500 font-medium animate-pulse">Loading tickets queue...</div>
          ) : filteredTickets.length === 0 ? (
            <div className="py-8 text-center text-slate-500 font-medium">No tickets found in this queue.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredTickets.map((t) => (
                <Card key={t.id} className="p-5 border border-slate-150 hover:border-brand-500 transition relative flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <Badge variant={t.priority === 'HIGH' ? 'warning' : 'neutral'}>
                        {t.priority} Priority
                      </Badge>
                      <Badge 
                        variant={t.status === 'IN_PROGRESS' ? 'warning' : t.status === 'CLOSED' ? 'success' : 'neutral'}
                        className={t.status === 'OPEN' ? 'bg-red-500/15 text-red-700 ring-red-500/20' : ''}
                      >
                        {t.status}
                      </Badge>
                    </div>

                    <div className="font-semibold text-slate-900 text-base line-clamp-1 mb-1">{t.subject}</div>
                    <div className="text-xs text-slate-500 font-mono mb-3">Ticket ID: {t.id}</div>
                    
                    <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                      {t.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                    <span className="text-xs text-slate-400 font-semibold">{new Date(t.createdAt).toLocaleDateString()}</span>
                    <Link href={`/support/tickets/${t.id}`}>
                      <Button variant="secondary" size="sm" className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        Reply / Inspect
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
