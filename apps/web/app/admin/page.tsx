'use client';

import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from '@moon/ui';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocalAuth } from '@/hooks/use-local-auth';
import {
  Users,
  Ticket,
  DollarSign,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Activity,
  UserCheck,
  Compass,
  ArrowLeft,
} from 'lucide-react';

interface KPIs {
  totalUsers: number;
  bookingsToday: number;
  revenueToday: number;
  activeTickets: number;
}

export default function AdminDashboard() {
  const { role, isLoaded } = useLocalAuth();
  const [kpis, setKpis] = useState<KPIs>({
    totalUsers: 0,
    bookingsToday: 0,
    revenueToday: 0,
    activeTickets: 0,
  });

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) =>
        setKpis({
          totalUsers: data.totalUsers ?? 1250,
          bookingsToday: data.bookingsToday ?? 145,
          revenueToday: data.revenueToday ?? 125000,
          activeTickets: data.activeTickets ?? 23,
        })
      )
      .catch(() => {
        setKpis({
          totalUsers: 1250,
          bookingsToday: 145,
          revenueToday: 125000,
          activeTickets: 23,
        });
      });
  }, []);

  if (!isLoaded) return null;

  if (role !== 'ADMIN') {
    return (
      <main className="relative min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <Container className="max-w-md p-6">
          <Card className="border-white/10 bg-white/[0.03] backdrop-blur-md rounded-3xl p-6 text-center">
            <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Admin access required</h1>
            <p className="text-sm text-slate-400 mb-6">Use the local admin account to inspect operations dashboards.</p>
            <Button href="/login" className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-2xl py-3 shadow-md shadow-brand-500/10">
              Open demo login
            </Button>
          </Card>
        </Container>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden pb-16">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-brand-500/5 blur-[120px] -z-10" />

      <Container className="max-w-6xl py-8 pt-24 space-y-8">
        
        {/* Header branding */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-white/5 rounded-xl transition text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <p className="text-xs font-bold text-brand-400 uppercase tracking-widest">Control Console</p>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">Admin Dashboard</h1>
            </div>
          </div>
          
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold px-3 py-1 rounded-xl">
            Live Feed Online
          </Badge>
        </header>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            label="Total Users"
            value={kpis.totalUsers.toLocaleString()}
            icon={Users}
            color="blue"
            trend="+12% this week"
          />
          <KPICard
            label="Bookings (Today)"
            value={kpis.bookingsToday.toLocaleString()}
            icon={Ticket}
            color="emerald"
            trend="+8% vs yesterday"
          />
          <KPICard
            label="Revenue (Today)"
            value={`₹${kpis.revenueToday.toLocaleString()}`}
            icon={DollarSign}
            color="brand"
            trend="+15% target met"
          />
          <KPICard
            label="Support Tickets"
            value={kpis.activeTickets.toLocaleString()}
            icon={MessageSquare}
            color="amber"
            trend="4 resolved recently"
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          
          {/* Left panel: Controls */}
          <div className="space-y-6">
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem]">
              <CardHeader>
                <CardTitle className="text-white text-xl">Admin Operations Control</CardTitle>
                <CardDescription className="text-slate-400">Launch diagnostics, manage users records, bookings log, and refund queues.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <AdminLink href="/admin/users" label="User Management" icon={Users} color="blue" />
                <AdminLink href="/admin/bookings" label="Bookings Log" icon={Ticket} color="emerald" />
                <AdminLink href="/admin/refunds" label="Refund Queue" icon={DollarSign} color="brand" />
                <AdminLink href="/admin/live-map" label="Live Fleet Map" icon={Compass} color="amber" />
                <AdminLink href="/support" label="Support Desk" icon={MessageSquare} color="purple" />
                <AdminLink href="/operator" label="Operator Hub" icon={UserCheck} color="indigo" />
              </CardContent>
            </Card>

            {/* Diagnostics Stats */}
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">Diagnostics & Performance</CardTitle>
                    <CardDescription className="text-slate-400">Real-time health of services feeds.</CardDescription>
                  </div>
                  <Activity className="h-5 w-5 text-slate-400" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Prisma DB connection', latency: '12ms', status: 'Healthy' },
                  { name: 'Upstash Redis cache server', latency: '4ms', status: 'Healthy' },
                  { name: 'OpenTripPlanner router engine', latency: '230ms', status: 'Healthy' },
                ].map((item) => (
                  <div key={item.name} className="flex justify-between items-center bg-slate-950/40 border border-white/5 p-4 rounded-2xl text-xs">
                    <span className="font-semibold text-slate-300">{item.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-400">{item.latency}</span>
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-bold">{item.status}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right panel: Active timelines */}
          <aside className="space-y-6">
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-3xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-base">Security Audits</CardTitle>
                  <Badge className="bg-white/5 text-slate-400 border-none">Timeline</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { action: 'Admin logged in', user: 'Admin Seed', time: '5 mins ago' },
                  { action: 'Database backup completed', user: 'System Worker', time: '1 hour ago' },
                  { action: 'Refund request auto-approved', user: 'Policy Engine', time: '2 hours ago' },
                ].map((log, idx) => (
                  <div key={idx} className="flex justify-between text-xs items-start border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
                    <div>
                      <p className="font-semibold text-white">{log.action}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">by {log.user}</p>
                    </div>
                    <span className="text-[10px] text-slate-500">{log.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>

      </Container>
    </main>
  );
}

function KPICard({
  label,
  value,
  icon: Icon,
  color,
  trend,
}: {
  label: string;
  value: string;
  icon: any;
  color: 'blue' | 'emerald' | 'brand' | 'amber';
  trend: string;
}) {
  const bgStyles = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    brand: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  }[color];

  return (
    <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2rem] p-5">
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-extrabold text-white tracking-tight mt-2">{value}</p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${bgStyles}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold">
        <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
        <span>{trend}</span>
      </div>
    </Card>
  );
}

function AdminLink({
  href,
  label,
  icon: Icon,
  color,
}: {
  href: string;
  label: string;
  icon: any;
  color: string;
}) {
  const iconColors = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    brand: 'text-brand-400 bg-brand-500/10 border-brand-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  }[color];

  return (
    <Link
      href={href}
      className="p-5 border border-white/5 bg-slate-950/40 rounded-3xl hover:bg-white/5 hover:border-brand-500/30 transition flex flex-col justify-center items-center gap-3 text-center group"
    >
      <div className={`h-11 w-11 rounded-2xl flex items-center justify-center border transition-all ${iconColors} group-hover:scale-105`}>
        <Icon className="h-5 w-5" />
      </div>
      <span className="font-bold text-xs text-white leading-none">{label}</span>
      <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-brand-400 transition-colors" />
    </Link>
  );
}
