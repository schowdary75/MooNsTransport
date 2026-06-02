'use client';

import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from '@moon/ui';
import Link from 'next/link';
import { useLocalAuth } from '@/hooks/use-local-auth';
import { 
  ShieldAlert, 
  ArrowLeft, 
  Settings, 
  Activity, 
  Map, 
  Calendar, 
  TrendingUp, 
  Compass, 
  Signal, 
  Users, 
  Percent, 
  Sparkles,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function OperatorDashboard() {
  const { role, isLoaded } = useLocalAuth();
  const [pulseState, setPulseState] = useState(true);

  // Toggle telemetry indicator animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseState(p => !p);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  if (!isLoaded) return null;

  if (role !== 'OPERATOR' && role !== 'ADMIN') {
    return (
      <main className="relative min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-red-500/5 blur-[120px] -z-10" />
        <Container className="max-w-md p-6">
          <Card className="border-white/10 bg-white/[0.03] backdrop-blur-md rounded-3xl p-6 text-center">
            <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Operator Access Required</h1>
            <p className="text-sm text-slate-400 mb-6 font-medium">Use the local operator account or admin account to inspect fleet controls.</p>
            <Button href="/login" className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-2xl py-3 shadow-md shadow-brand-500/10">
              Open demo login
            </Button>
          </Card>
        </Container>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden pb-16 pt-16">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-brand-500/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-[10%] h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px] -z-10" />

      <Container className="max-w-6xl py-8 pt-24 space-y-8">
        
        {/* Header branding */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-white/5 rounded-xl transition text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <p className="text-xs font-bold text-brand-400 uppercase tracking-widest">Operations Center</p>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">Operator Portal</h1>
            </div>
          </div>
          
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold px-3 py-1 rounded-xl flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full bg-emerald-400 ${pulseState ? 'animate-ping' : ''}`} />
            Live Fleet Feed
          </Badge>
        </header>

        {/* Mini KPI metrics list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2rem] p-5">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Routes</p>
                <p className="text-3xl font-extrabold text-white tracking-tight mt-2">12</p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                <Compass className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-500 font-semibold">
              Synced with GIS database
            </div>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2rem] p-5">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Vehicles</p>
                <p className="text-3xl font-extrabold text-white tracking-tight mt-2">8</p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <Signal className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-500 font-semibold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Telemetry ping active
            </div>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2rem] p-5">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Today's Passengers</p>
                <p className="text-3xl font-extrabold text-white tracking-tight mt-2">342</p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-brand-500/20 bg-brand-500/10 text-brand-400">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-500 font-semibold">
              +14% volume vs last Sunday
            </div>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2rem] p-5">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">On-Time %</p>
                <p className="text-3xl font-extrabold text-white tracking-tight mt-2">94%</p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                <Percent className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-500 font-semibold">
              Target SLA: 95%
            </div>
          </Card>
        </div>

        {/* Portal sections split */}
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          
          {/* Quick Actions Console */}
          <div className="space-y-6">
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem]">
              <CardHeader className="p-6">
                <CardTitle className="text-white text-xl">Quick Control Actions</CardTitle>
                <CardDescription className="text-slate-400">Navigate between active transit route nodes, vehicle telemetry sheets, timetables, and metric reports.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 p-6 pt-0">
                <OperatorLink href="/operator/routes" label="Transit Routes" desc="Inspect route geometry stops" icon={Map} color="blue" />
                <OperatorLink href="/operator/vehicles" label="Fleet Vehicles" desc="Inspect device telemetry ping" icon={Signal} color="emerald" />
                <OperatorLink href="/operator/schedule" label="Ingest Timetables" desc="Upload GTFS transit calendars" icon={Calendar} color="brand" />
                <OperatorLink href="/operator/reports" label="Performance Reports" desc="Check SLAs and compliance logs" icon={TrendingUp} color="amber" />
              </CardContent>
            </Card>

            {/* Simulated fleet anomalies panel */}
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem]">
              <CardHeader className="p-6 pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">System Telemetry Log</CardTitle>
                    <CardDescription className="text-slate-400">Live operational alerts across GPS nodes.</CardDescription>
                  </div>
                  <Activity className="h-5 w-5 text-brand-400" />
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-2 space-y-3.5">
                {[
                  { name: 'Vehicle V-BEST-505 (Bus)', detail: 'Minor route deviation detected near Connaught Place due to traffic block', status: 'ALERT', time: 'Just now', color: 'text-amber-400 bg-amber-500/10' },
                  { name: 'Schedule Ingest Engine', detail: 'GTFS parse completed for Noida Express transit table feeds', status: 'SUCCESS', time: '14m ago', color: 'text-emerald-400 bg-emerald-500/10' },
                  { name: 'Metro Coach 101 (DMRC)', detail: 'Ping latency back to normal limits (0.8s), connection fully stabilized', status: 'INFO', time: '30m ago', color: 'text-blue-400 bg-blue-500/10' },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-4 bg-slate-950/40 border border-white/5 p-4 rounded-2xl text-xs">
                    <div className="space-y-1">
                      <p className="font-bold text-white">{item.name}</p>
                      <p className="text-slate-400 font-medium leading-relaxed">{item.detail}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge className={`border-none font-bold text-[9px] ${item.color}`}>{item.status}</Badge>
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">{item.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar */}
          <aside className="space-y-6">
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-3xl">
              <CardHeader className="p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-base font-bold">Operator Session Details</CardTitle>
                  <Settings className="h-4.5 w-4.5 text-slate-400" />
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4 text-xs font-mono">
                <div className="space-y-3.5 bg-slate-950/50 border border-white/5 p-4 rounded-2xl">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Operator Role</span>
                    <span className="text-emerald-400 font-bold">{role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Session Authority</span>
                    <span className="text-white">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sync Scope</span>
                    <span className="text-white">National Feeds</span>
                  </div>
                  <div className="flex justify-between border-t border-white/5 pt-3">
                    <span className="text-slate-500">Node Location</span>
                    <span className="text-white">Delhi NCR Server</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="secondary"
                    className="w-full border-white/10 hover:bg-white/5 text-slate-300 font-semibold rounded-xl text-xs py-2 flex items-center justify-center gap-1.5"
                    onClick={() => window.location.reload()}
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Re-sync Scope
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>

      </Container>
    </main>
  );
}

function OperatorLink({
  href,
  label,
  desc,
  icon: Icon,
  color,
}: {
  href: string;
  label: string;
  desc: string;
  icon: any;
  color: string;
}) {
  const iconColors = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    brand: 'text-brand-400 bg-brand-500/10 border-brand-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  }[color];

  return (
    <Link
      href={href}
      className="p-5 border border-white/5 bg-slate-950/40 rounded-3xl hover:bg-white/5 hover:border-brand-500/30 transition flex flex-col justify-between items-start text-left group"
    >
      <div className="flex items-start justify-between w-full">
        <div className={`h-11 w-11 rounded-2xl flex items-center justify-center border transition-all ${iconColors} group-hover:scale-105`}>
          <Icon className="h-5 w-5" />
        </div>
        <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-brand-400 transition-colors mt-1" />
      </div>
      <div className="mt-4 space-y-1">
        <span className="font-extrabold text-sm text-white block leading-none">{label}</span>
        <span className="text-[10px] text-slate-400 block leading-tight font-medium">{desc}</span>
      </div>
    </Link>
  );
}
