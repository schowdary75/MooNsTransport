'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from '@moon/ui';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, Send, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  ticketId: string;
  senderId: string;
  senderRole: string;
  body: string;
  isInternal: boolean;
  createdAt: string;
}

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

export default function SupportTicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;
  
  const [ticket, setTicket] = useState<TicketItem | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const { toast } = useToast();

  const fetchTicketDetails = async () => {
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}`);
      if (!res.ok) throw new Error('Failed to fetch ticket detail');
      const data = await res.json();
      setTicket(data.ticket);
      setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to load ticket details.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      fetchTicketDetails();
    }
  }, [ticketId]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSubmittingReply(true);
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: replyText }),
      });
      if (!res.ok) throw new Error('Failed to reply');
      toast({
        title: 'Success',
        description: 'Your reply has been sent.',
      });
      setReplyText('');
      fetchTicketDetails();
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to send reply.',
        variant: 'destructive',
      });
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleCloseTicket = async () => {
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}/close`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to close ticket');
      toast({
        title: 'Ticket Closed',
        description: 'The support ticket has been resolved and closed.',
      });
      fetchTicketDetails();
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to resolve ticket.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Container className="py-12 max-w-4xl text-center text-slate-500 animate-pulse font-medium">
        Loading ticket thread detail...
      </Container>
    );
  }

  if (!ticket) {
    return (
      <Container className="py-12 max-w-4xl text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Ticket not found</h2>
        <p className="text-slate-600">The support ticket you are looking for does not exist.</p>
        <Link href="/support/dashboard">
          <Button variant="secondary">Back to Dashboard</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-8 max-w-4xl space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link href="/support/dashboard" className="p-2 border border-slate-200 rounded-full hover:bg-slate-50 transition">
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </Link>
          <div>
            <Badge variant="neutral">Ticket Detail</Badge>
            <h1 className="text-3xl font-bold tracking-tight mt-1 text-slate-900">{ticket.subject}</h1>
          </div>
        </div>

        {ticket.status !== 'CLOSED' && (
          <Button 
            variant="secondary" 
            onClick={handleCloseTicket}
            className="flex items-center gap-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl"
          >
            <Check className="h-4 w-4" />
            Resolve & Close
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-[0.65fr_0.35fr]">
        <div className="space-y-6 flex flex-col">
          {/* Conversation Thread */}
          <Card className="flex-1 flex flex-col min-h-[24rem]">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-slate-600">
                <MessageCircle className="h-5 w-5 text-brand-600" />
                <span className="font-semibold text-sm">Conversation Feed</span>
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-1 overflow-y-auto space-y-4 max-h-[30rem]">
              {/* Initial message */}
              <div className="p-4 bg-slate-50 rounded-2xl max-w-[85%] text-left">
                <div className="text-xs font-semibold text-slate-500 mb-1">Rider Query</div>
                <p className="text-sm text-slate-800">{ticket.description}</p>
                <div className="text-[10px] text-slate-400 text-right mt-1">{new Date(ticket.createdAt).toLocaleString()}</div>
              </div>

              {messages.map((msg) => {
                const isAgent = msg.senderRole === 'ADMIN' || msg.senderRole === 'OPERATOR';
                return (
                  <div 
                    key={msg.id} 
                    className={`p-4 rounded-2xl max-w-[85%] text-left ${
                      isAgent 
                        ? 'bg-brand-500 text-white ml-auto' 
                        : 'bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className={`text-xs font-semibold mb-1 ${isAgent ? 'text-brand-100' : 'text-slate-500'}`}>
                      {isAgent ? 'Support Agent' : 'Rider'}
                    </div>
                    <p className="text-sm">{msg.body}</p>
                    <div className={`text-[10px] text-right mt-1 ${isAgent ? 'text-brand-200' : 'text-slate-400'}`}>
                      {new Date(msg.createdAt).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Reply form */}
          {ticket.status !== 'CLOSED' ? (
            <Card className="p-4 border-slate-200">
              <form onSubmit={handleSendReply} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your response..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800"
                />
                <Button type="submit" disabled={submittingReply} className="flex items-center gap-1 rounded-xl">
                  <Send className="h-4 w-4" />
                  Send
                </Button>
              </form>
            </Card>
          ) : (
            <div className="p-4 text-center text-slate-500 bg-slate-100 rounded-2xl font-medium border border-slate-200">
              This ticket has been resolved and closed. No further replies are allowed.
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Metadata</CardTitle>
              <CardDescription>System identifiers and state logs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Ticket ID</span>
                <span className="font-mono font-semibold text-slate-900">{ticket.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Category</span>
                <span className="font-semibold text-slate-950 uppercase">{ticket.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Priority</span>
                <Badge variant={ticket.priority === 'HIGH' ? 'warning' : 'neutral'}>
                  {ticket.priority}
                </Badge>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Booking reference</span>
                <span className="font-mono text-slate-900 font-semibold">{ticket.bookingId || 'None'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Status</span>
                <Badge 
                  variant={ticket.status === 'IN_PROGRESS' ? 'warning' : ticket.status === 'CLOSED' ? 'success' : 'neutral'}
                  className={ticket.status === 'OPEN' ? 'bg-red-500/15 text-red-700 ring-red-500/20' : ''}
                >
                  {ticket.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
