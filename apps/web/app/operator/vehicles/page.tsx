'use client';

import { useState, useMemo } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from '@moon/ui';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Car, 
  Signal, 
  Search, 
  MessageSquare, 
  Zap, 
  Activity, 
  Radio,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const INITIAL_VEHICLES = [
  { id: 'V-DMRC-101', name: 'Metro Coach 101', route: 'Blue Line Lineage', driver: 'N/A (Automated)', speed: '65 km/h', ping: '1.2s ago', status: 'ONLINE', battery: 98, strength: 5 },
  { id: 'V-BEST-505', name: 'Double Decker Bus 505', route: 'CP Loop Line', driver: 'Rajesh Kumar', speed: '24 km/h', ping: '0.8s ago', status: 'ONLINE', battery: 82, strength: 4 },
  { id: 'V-BMTC-202', name: 'Volvo Electric Bus 202', route: 'Tech Corridor', driver: 'Anil K.', speed: '32 km/h', ping: '2.5s ago', status: 'ONLINE', battery: 64, strength: 3 },
  { id: 'V-DMRC-889', name: 'Metro Yellow Express', route: 'Yellow Line Lineage', driver: 'N/A (Automated)', speed: '72 km/h', ping: '1.5s ago', status: 'ONLINE', battery: 95, strength: 5 },
  { id: 'V-SRTC-411', name: 'State Intercity Express', route: 'Delhi to Agra', driver: 'Vikram Singh', speed: '88 km/h', ping: '4.2s ago', status: 'ONLINE', battery: 78, strength: 4 },
];

export default function OperatorVehiclesPage() {
  const [vehicles, setVehicles] = useState(INITIAL_VEHICLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [pingingId, setPingingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePing = (id: string) => {
    setPingingId(id);
    setTimeout(() => {
      setPingingId(null);
      setVehicles(prev => prev.map(v => {
        if (v.id === id) {
          return {
            ...v,
            ping: '0.1s ago',
            strength: Math.min(5, v.strength + (v.strength < 5 ? 1 : 0))
          };
        }
        return v;
      }));
      toast({
        title: 'Telemetry Synced',
        description: `Successfully pinged vehicle node ${id}. Coordinates updated.`,
      });
    }, 1000);
  };

  const handleSendMessage = (name: string) => {
    const msg = prompt(`Enter message to broadcast to driver/cabin of ${name}:`);
    if (msg) {
      toast({
        title: 'Broadcast Dispatched',
        description: `Message successfully sent to ${name}: "${msg}"`,
      });
    }
  };

  const filteredVehicles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return vehicles;
    return vehicles.filter(v => 
      v.id.toLowerCase().includes(q) || 
      v.name.toLowerCase().includes(q) || 
      v.route.toLowerCase().includes(q) || 
      v.driver.toLowerCase().includes(q)
    );
  }, [vehicles, searchQuery]);

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden pb-20 pt-16">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[130px] -z-10" />
      <div className="absolute bottom-0 left-[10%] h-[500px] w-[500px] rounded-full bg-brand-500/5 blur-[120px] -z-10" />

      <Container className="max-w-5xl py-8 space-y-6">
        
        {/* Back and Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <Link href="/operator" className="p-2 border border-white/10 rounded-full hover:bg-white/5 transition text-slate-400 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <Badge className="bg-brand-500/10 text-brand-400 border-brand-500/20 font-bold">Operator Dashboard</Badge>
              <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-white">Fleet Vehicles</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold px-3 py-1 rounded-xl">
              {vehicles.length} Nodes Active
            </Badge>
          </div>
        </div>

        {/* Search Console */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-500" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by vehicle ID, operator, driver name or route..."
            className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/5 rounded-2xl text-sm text-white placeholder-slate-500 focus:border-brand-500 outline-none transition"
          />
        </div>

        {/* Vehicles Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {filteredVehicles.map((veh) => {
            const isPinging = pingingId === veh.id;
            return (
              <Card key={veh.id} className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2.2rem] overflow-hidden p-5 flex flex-col justify-between hover:border-brand-500/40 transition duration-200">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-xs font-bold text-slate-500">{veh.id}</span>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-bold text-[10px] flex items-center gap-1">
                      <Signal className="h-3 w-3 animate-pulse" />
                      {veh.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3.5 mb-5">
                    <div className="h-11 w-11 bg-slate-900 border border-white/5 rounded-xl flex items-center justify-center text-brand-400 shrink-0">
                      <Car className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base leading-tight">{veh.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">{veh.route}</p>
                    </div>
                  </div>

                  <div className="space-y-3.5 border-t border-white/5 pt-4 text-xs font-mono text-slate-400">
                    <div className="flex justify-between">
                      <span>Driver/Cabin</span>
                      <span className="font-semibold text-white">{veh.driver}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Live Speed</span>
                      <span className="font-semibold text-white">{veh.speed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Signal Stg.</span>
                      <span className="font-semibold text-white">
                        {'★'.repeat(veh.strength) + '☆'.repeat(5 - veh.strength)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Battery Charge</span>
                      <span className="font-semibold text-white flex items-center gap-1">
                        <Zap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        {veh.battery}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>GPS Ping</span>
                      <span className="font-semibold text-brand-400 font-bold">{veh.ping}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-white/5">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handlePing(veh.id)}
                    disabled={isPinging}
                    className="border-white/10 text-slate-300 hover:bg-white/5 rounded-xl py-2 text-xs flex items-center justify-center gap-1.5"
                  >
                    {isPinging ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Ping...
                      </>
                    ) : (
                      <>
                        <Radio className="h-3.5 w-3.5" /> Ping GPS
                      </>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={veh.driver.includes('N/A')}
                    onClick={() => handleSendMessage(veh.name)}
                    className="border-white/10 text-slate-300 hover:bg-white/5 rounded-xl py-2 text-xs flex items-center justify-center gap-1.5 disabled:opacity-30"
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> Message
                  </Button>
                </div>
              </Card>
            );
          })}

          {filteredVehicles.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <Activity className="h-10 w-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 font-semibold">No fleet vehicles match your query filter.</p>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
