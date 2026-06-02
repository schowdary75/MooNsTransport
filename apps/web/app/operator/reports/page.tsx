'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from '@moon/ui';
import Link from 'next/link';
import { 
  ArrowLeft, 
  TrendingUp, 
  BarChart3, 
  Activity, 
  ShieldAlert, 
  CheckCircle,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';

const PERFORMANCE_METRICS = [
  { label: 'On-Time Performance (OTP) %', value: '94%', target: '95% Target', width: 'w-[94%]', color: 'bg-emerald-500', key: 'otp', details: 'Avg Metro delay: 12s | Avg Bus delay: 1m 15s. Delay metrics are within baseline limits.' },
  { label: 'Fleet Utility Rate', value: '88%', target: '80% Target', width: 'w-[88%]', color: 'bg-emerald-500', key: 'utility', details: '8 of 9 active vehicles actively tracking. 1 standby node configured at CP Block C Hub.' },
  { label: 'Peak Ridership compliance', value: '91%', target: '90% Target', width: 'w-[91%]', color: 'bg-emerald-500', key: 'ridership', details: 'Metro capacity utility hit 94% between 09:00 - 11:00. Additional schedules pre-warmed.' },
  { label: 'Telemetry latency compliance', value: '99%', target: '98% Target', width: 'w-[99%]', color: 'bg-emerald-500', key: 'latency', details: 'Device coordinates ping interval holds flat at 1.4s average across active GPS sockets.' },
];

export default function OperatorReportsPage() {
  const [activeTab, setActiveTab] = useState<'METRICS' | 'SLA' | 'COMPLIANCE'>('METRICS');
  const [selectedKey, setSelectedKey] = useState<string | null>('otp');

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden pb-20 pt-16">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-brand-500/5 blur-[130px] -z-10" />
      <div className="absolute bottom-0 left-[10%] h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px] -z-10" />

      <Container className="max-w-5xl py-8 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <Link href="/operator" className="p-2 border border-white/10 rounded-full hover:bg-white/5 transition text-slate-400 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <Badge className="bg-brand-500/10 text-brand-400 border-brand-500/20 font-bold">Operator Dashboard</Badge>
              <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-white">Performance Reports</h1>
            </div>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold px-3 py-1 rounded-xl">
            SLA Sync Active
          </Badge>
        </div>

        {/* Report Tab Selection */}
        <div className="flex gap-1.5 bg-white/[0.02] border border-white/5 p-1.5 rounded-2xl max-w-sm">
          {(['METRICS', 'SLA', 'COMPLIANCE'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2 text-xs font-bold rounded-xl transition ${
                activeTab === tab 
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab === 'METRICS' && 'Fleet Metrics'}
              {tab === 'SLA' && 'SLA Targets'}
              {tab === 'COMPLIANCE' && 'Audits'}
            </button>
          ))}
        </div>

        {/* Content Render based on active Tab */}
        {activeTab === 'METRICS' && (
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            
            {/* Fleet Performance Indicators */}
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2.2rem] overflow-hidden p-6">
              <CardHeader className="p-0 mb-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <TrendingUp className="h-5 w-5 text-brand-400" />
                    <CardTitle className="text-white text-lg font-bold">Fleet Performance Indicators</CardTitle>
                  </div>
                  <BarChart3 className="h-4.5 w-4.5 text-slate-500" />
                </div>
                <CardDescription className="text-slate-400">Select any metric row to inspect granular telemetry reports details.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-5">
                {PERFORMANCE_METRICS.map((metric) => {
                  const isSelected = selectedKey === metric.key;
                  return (
                    <div 
                      key={metric.key} 
                      onClick={() => setSelectedKey(isSelected ? null : metric.key)}
                      className={`p-4 border rounded-2xl cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-brand-500/50 bg-brand-500/10' 
                          : 'border-white/5 bg-slate-950/20 hover:border-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs font-bold text-white mb-2">
                        <span>{metric.label}</span>
                        <div className="flex gap-2 font-mono text-[10px]">
                          <span className="text-slate-500">{metric.target}</span>
                          <span className="text-brand-400 font-extrabold">{metric.value}</span>
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${metric.color} ${metric.width}`} />
                      </div>
                      
                      {isSelected && (
                        <div className="mt-3.5 pt-3.5 border-t border-white/5 text-[11px] text-slate-400 leading-relaxed font-sans flex items-start gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                          <Activity className="h-4 w-4 text-brand-400 shrink-0 mt-0.5" />
                          <span>{metric.details}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Ridership breakdown */}
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2.2rem] overflow-hidden p-6">
              <CardHeader className="p-0 mb-5">
                <CardTitle className="text-white text-lg font-bold">Ridership Volume</CardTitle>
                <CardDescription className="text-slate-400">Estimated passenger volume shares today.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                {[
                  { mode: 'Metro Lines Route', count: '245 passengers', percent: '71% volume share', bar: 'w-[71%]' },
                  { mode: 'Bus Loop Feeds', count: '97 passengers', percent: '29% volume share', bar: 'w-[29%]' },
                ].map((r, i) => (
                  <div key={i} className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-white">
                      <span>{r.mode}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{r.percent}</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden font-mono">
                      <div className={`h-full rounded-full bg-brand-500 ${r.bar}`} />
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold">{r.count} booked</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'SLA' && (
          <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2.2rem] overflow-hidden p-6">
            <CardHeader className="p-0 mb-5">
              <CardTitle className="text-white text-lg font-bold">Transit SLA Ingestion Targets</CardTitle>
              <CardDescription className="text-slate-400">Target thresholds monitored by automated routing engine policies.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-4 text-xs">
              {[
                { title: 'OTP Threshold (National standard)', limit: '>= 95.0% compliance', val: '94.0% active', status: 'ALERT', color: 'text-amber-400 bg-amber-500/10' },
                { title: 'GPS Data Telemetry loss limit', limit: '< 10s packet timeout', val: '1.4s active', status: 'HEALTHY', color: 'text-emerald-400 bg-emerald-500/10' },
                { title: 'Refund request audit delay', limit: '< 4.0 hours SLA limit', val: '2.3 hours active', status: 'HEALTHY', color: 'text-emerald-400 bg-emerald-500/10' },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-950/40 border border-white/5 p-4 rounded-2xl font-mono">
                  <div className="space-y-1">
                    <p className="text-white font-bold font-sans">{item.title}</p>
                    <p className="text-slate-500">{item.limit}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-slate-300 font-bold block">{item.val}</span>
                    <Badge className={`border-none font-bold text-[9px] mt-1.5 ${item.color}`}>{item.status}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {activeTab === 'COMPLIANCE' && (
          <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2.2rem] overflow-hidden p-6">
            <CardHeader className="p-0 mb-5">
              <CardTitle className="text-white text-lg font-bold">Operations Logs & Compliance checks</CardTitle>
              <CardDescription className="text-slate-400">Verification log of operations audit checks.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-4 text-xs font-mono">
              {[
                { detail: 'GIS shape coordinate intersection verification', engine: 'Nominatim OTP API', status: 'VERIFIED', date: 'May 31, 2026' },
                { detail: 'Dynamic socket connections heartbeats', engine: 'Socket.IO Server', status: 'VERIFIED', date: 'May 31, 2026' },
                { detail: 'Refund payment compliance audit', engine: 'Razorpay Gateway', status: 'VERIFIED', date: 'May 31, 2026' },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-950/40 border border-white/5 p-4 rounded-2xl">
                  <div className="space-y-1.5">
                    <p className="text-white font-sans font-bold leading-normal">{item.detail}</p>
                    <p className="text-slate-500">Service: {item.engine} &bull; {item.date}</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-bold text-[9px] flex items-center gap-1 shrink-0">
                    <CheckCircle className="h-3.5 w-3.5" /> {item.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

      </Container>
    </main>
  );
}
