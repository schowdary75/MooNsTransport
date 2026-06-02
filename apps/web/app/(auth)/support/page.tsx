'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Send,
  CheckCircle,
  Clock,
  User,
  Plus,
  ArrowLeft,
  Loader2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  LifeBuoy,
} from 'lucide-react';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@moon/ui';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

interface Ticket {
  id: string;
  subject: string;
  description: string;
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
}

export default function SupportPage() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  // Chat messaging state
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Create Ticket Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('BOOKING_ISSUE');
  const [newPriority, setNewPriority] = useState('MEDIUM');
  const [creatingTicket, setCreatingTicket] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/support/tickets');
      if (!res.ok) throw new Error('Failed to fetch support tickets');
      const data = await res.json();
      
      const mapped = (data.tickets || []).map((t: any) => ({
        id: t.id,
        subject: t.subject,
        description: t.description,
        category: t.category,
        status: t.status,
        priority: t.priority,
        createdAt: t.createdAt,
      }));
      setTickets(mapped);
      
      // Auto-select first ticket if none selected
      if (mapped.length > 0 && !selectedTicket) {
        setSelectedTicket(mapped[0]);
      }
    } catch {
      toast({
        title: 'Error loading tickets',
        description: 'Unable to fetch support tickets from the server.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Fetch replies when selected ticket changes
  useEffect(() => {
    if (!selectedTicket) {
      setMessages([]);
      return;
    }

    // Generate simulated timeline messages from the ticket description + possible replies
    // Fetching from `/api/support/tickets/${id}`
    fetch(`/api/support/tickets/${selectedTicket.id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        const ticketDetail = data.ticket;
        const msgTimeline: Message[] = [];
        
        // Initial query
        msgTimeline.push({
          id: 'initial',
          sender: 'user',
          text: ticketDetail.description,
          timestamp: ticketDetail.createdAt,
        });

        // Add replies if any
        if (ticketDetail.replies && ticketDetail.replies.length > 0) {
          ticketDetail.replies.forEach((rep: any) => {
            msgTimeline.push({
              id: rep.id,
              sender: rep.sender === 'USER' ? 'user' : 'agent',
              text: rep.message,
              timestamp: rep.createdAt,
            });
          });
        } else {
          // If no replies, inject a welcoming agent response after 1 second for simulation
          msgTimeline.push({
            id: 'system-welcome',
            sender: 'agent',
            text: `Hello! A support representative has been assigned to ticket #${selectedTicket.id}. How can we assist you today regarding your "${selectedTicket.category.replace('_', ' ').toLowerCase()}"?`,
            timestamp: new Date(new Date(ticketDetail.createdAt).getTime() + 1000 * 60).toISOString(),
          });
        }
        
        setMessages(msgTimeline);
      })
      .catch(() => {
        // Fallback simulated timeline
        setMessages([
          {
            id: 'initial',
            sender: 'user',
            text: selectedTicket.description,
            timestamp: selectedTicket.createdAt,
          },
          {
            id: 'welcome',
            sender: 'agent',
            text: `Hi there! Thanks for reaching out. We have opened ticket #${selectedTicket.id} for you. How can we help resolve this?`,
            timestamp: selectedTicket.createdAt,
          },
        ]);
      });
  }, [selectedTicket]);

  // Scroll chat timeline to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket) return;

    setSendingMsg(true);
    const content = newMessage.trim();
    setNewMessage('');

    try {
      const res = await fetch(`/api/support/tickets/${selectedTicket.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      });

      if (!res.ok) throw new Error('Reply failed');
      const data = await res.json();

      // Append user message immediately
      const userMsg: Message = {
        id: `user-reply-${Date.now()}`,
        sender: 'user',
        text: content,
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, userMsg]);

      // Simulate a chatbot/agent response back after 1.5s
      setTimeout(() => {
        const agentMsg: Message = {
          id: `agent-reply-${Date.now()}`,
          sender: 'agent',
          text: `Thank you for the update. We have logged this details in our database for Ticket #${selectedTicket.id}. Our customer desk is reviewing it.`,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, agentMsg]);
      }, 1500);

    } catch {
      toast({
        title: 'Failed to send message',
        description: 'Unable to deliver message reply.',
        variant: 'destructive',
      });
    } finally {
      setSendingMsg(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!selectedTicket) return;

    try {
      const res = await fetch(`/api/support/tickets/${selectedTicket.id}/close`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Close failed');

      toast({
        title: 'Ticket Closed',
        description: 'This support ticket has been resolved and closed.',
      });

      setSelectedTicket({ ...selectedTicket, status: 'RESOLVED' });
      fetchTickets();
    } catch {
      toast({
        title: 'Failed to close ticket',
        description: 'Unable to update ticket status.',
        variant: 'destructive',
      });
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDesc.trim()) return;

    setCreatingTicket(true);
    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: newSubject.trim(),
          description: newDesc.trim(),
          category: newCategory,
          priority: newPriority,
        }),
      });

      if (!res.ok) throw new Error('Failed to create ticket');
      const data = await res.json();

      toast({
        title: 'Ticket Created',
        description: 'A new support ticket has been opened successfully.',
      });

      // Clear input fields and close modal
      setNewSubject('');
      setNewDesc('');
      setIsModalOpen(false);
      
      // Refresh list
      fetchTickets();
    } catch {
      toast({
        title: 'Failed to create ticket',
        description: 'Unable to submit ticket request.',
        variant: 'destructive',
      });
    } finally {
      setCreatingTicket(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
          <span className="text-sm text-slate-400 font-semibold uppercase tracking-wider">Loading Help Desk...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-brand-500/5 blur-[120px] -z-10" />

      <div className="relative flex flex-col lg:flex-row h-screen pt-16">
        
        {/* Left Side: Tickets List Drawer */}
        <aside className="w-full lg:w-[380px] shrink-0 border-r border-white/5 bg-slate-950/80 backdrop-blur-xl overflow-y-auto z-10 flex flex-col h-full shadow-2xl">
          <div className="p-6 space-y-6 flex-1 flex flex-col h-full">
            
            {/* Header branding */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link href="/" className="p-2 hover:bg-white/5 rounded-xl transition text-slate-400 hover:text-white">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <h1 className="text-xl font-bold text-white">Help Desk</h1>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs px-3 py-2 transition shadow-md shadow-brand-500/10"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Ticket</span>
              </button>
            </div>

            {/* List timeline */}
            <div className="space-y-4 flex-1 overflow-y-auto pb-24">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
                <span>Support threads</span>
                <span>{tickets.length} tickets</span>
              </div>

              {tickets.length === 0 ? (
                <div className="text-center p-6 bg-slate-950/20 border border-dashed border-white/5 rounded-2xl">
                  <HelpCircle className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No support tickets found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tickets.map((t) => {
                    const isSelected = selectedTicket?.id === t.id;
                    const isOpen = t.status === 'OPEN' || t.status === 'IN_PROGRESS';
                    
                    return (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTicket(t)}
                        className={`w-full flex items-center justify-between gap-3 text-left border rounded-2xl p-4 cursor-pointer transition ${
                          isSelected
                            ? 'border-brand-500 bg-slate-900/60 shadow-lg shadow-brand-500/5'
                            : 'border-white/5 bg-slate-950/20 hover:bg-white/5'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white text-xs truncate">{t.subject}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">Ticket ID: #{t.id}</p>
                          <p className="text-[9px] text-slate-500 mt-0.5">
                            Created: {new Date(t.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <Badge className={
                            t.status === 'RESOLVED' || t.status === 'CLOSED'
                              ? 'bg-slate-500/10 text-slate-400 border-white/5 text-[9px]'
                              : 'bg-red-500/10 text-red-400 border-red-500/20 text-[9px]'
                          }>
                            {t.status}
                          </Badge>
                          <Badge className="bg-white/5 text-slate-400 text-[8px] border-none">
                            {t.priority}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Right Side: Chat timeline interface */}
        <section className="flex-1 relative flex flex-col h-full bg-slate-900 overflow-hidden">
          {selectedTicket ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              
              {/* Active Ticket Header details */}
              <div className="border-b border-white/5 bg-slate-950/60 px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedTicket.category.replace('_', ' ')}</span>
                    <Badge className="bg-white/5 text-slate-400 text-[8px] border-none">#{selectedTicket.id}</Badge>
                  </div>
                  <h4 className="text-base font-bold text-white mt-1">{selectedTicket.subject}</h4>
                </div>
                
                {(selectedTicket.status === 'OPEN' || selectedTicket.status === 'IN_PROGRESS') && (
                  <button
                    onClick={handleCloseTicket}
                    className="flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-50 hover:text-white transition shadow-sm"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Resolve Ticket</span>
                  </button>
                )}
              </div>

              {/* Message Timeline */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
                {messages.map((msg) => {
                  const isAgent = msg.sender === 'agent';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 max-w-[80%] ${
                        isAgent ? 'mr-auto text-left' : 'ml-auto flex-row-reverse text-right'
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-xs ${
                        isAgent ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {isAgent ? <LifeBuoy className="h-4 w-4 animate-pulse" /> : <User className="h-4 w-4" />}
                      </div>
                      
                      <div className="space-y-1">
                        <div className={`rounded-3xl px-4 py-3 text-xs leading-5 ${
                          isAgent
                            ? 'bg-white/5 text-slate-200 border border-white/5'
                            : 'bg-brand-500 text-white shadow-lg shadow-brand-500/10'
                        }`}>
                          {msg.text}
                        </div>
                        <p className="text-[9px] text-slate-500 px-2">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Send Input Box */}
              {selectedTicket.status !== 'RESOLVED' && selectedTicket.status !== 'CLOSED' ? (
                <form onSubmit={handleSendMessage} className="border-t border-white/5 bg-slate-950/60 p-4 flex gap-3 items-center">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Write a message reply..."
                    className="flex-1 bg-slate-950 border border-white/5 rounded-2xl px-4 py-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-brand-500 transition"
                    disabled={sendingMsg}
                  />
                  <button
                    type="submit"
                    disabled={sendingMsg || !newMessage.trim()}
                    className="p-3 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl transition disabled:opacity-40"
                  >
                    {sendingMsg ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </form>
              ) : (
                <div className="border-t border-white/5 bg-slate-950/20 p-5 text-center text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  ✔ Support Thread Marked as Resolved/Closed
                </div>
              )}

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <MessageSquare className="h-12 w-12 text-slate-700 mb-3" />
              <p className="text-sm font-semibold">Select a support ticket from the sidebar to view chat timeline.</p>
            </div>
          )}
        </section>

      </div>

      {/* New Ticket Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-[2.5rem] bg-slate-950 border border-white/10 p-6 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white">Create Support Ticket</h3>
            <p className="mt-1 text-xs text-slate-400">Describe your transit issue to open a help desk thread.</p>

            <form onSubmit={handleCreateTicket} className="space-y-4 mt-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Issue Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-xs text-white focus:border-brand-500 outline-none transition"
                >
                  <option value="BOOKING_ISSUE">Booking Issues</option>
                  <option value="PAYMENT_FAILED">Payment failure</option>
                  <option value="REFUND_PENDING">Refund updates</option>
                  <option value="APP_ALERT_CRASH">System/app alert warnings</option>
                  <option value="OTHER">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Subject Heading</label>
                <input
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Metro pass refund request"
                  className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-xs text-white placeholder-slate-600 focus:border-brand-500 outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Description Details</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Write details of the issue here..."
                  className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-xs text-white placeholder-slate-600 focus:border-brand-500 outline-none transition h-24 resize-none"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 border border-white/5 bg-white/5 text-slate-300 text-xs font-semibold hover:bg-white/10"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={creatingTicket}
                  className="rounded-xl px-6 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  {creatingTicket ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <span>Open Ticket</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
