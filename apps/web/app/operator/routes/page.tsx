'use client';

import { useState, useMemo } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from '@moon/ui';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Route as RouteIcon, 
  GitCommit, 
  Plus, 
  Check, 
  MapPin, 
  Clock, 
  Sparkles,
  Search,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const INITIAL_ROUTES = [
  {
    id: 'R-METRO-BLUE',
    name: 'Metro Blue Line',
    type: 'METRO',
    stopsCount: 44,
    interval: '3-5 min',
    status: 'ACTIVE',
    stops: ['Dwarka Sector 21', 'Rajiv Chowk', 'Noida Electronic City / Vaishali'],
  },
  {
    id: 'R-BUS-LOOP',
    name: 'City Loop Bus Feed',
    type: 'BUS',
    stopsCount: 18,
    interval: '10 min',
    status: 'ACTIVE',
    stops: ['Connaught Place', 'New Delhi Railway Station', 'Karol Bagh'],
  },
  {
    id: 'R-RAIL-LKO',
    name: 'Delhi - Lucknow Express Route',
    type: 'TRAIN',
    stopsCount: 8,
    interval: 'Daily schedules',
    status: 'ACTIVE',
    stops: ['New Delhi', 'Kanpur Central', 'Lucknow Charbagh'],
  },
];

export default function OperatorRoutesPage() {
  const [routes, setRoutes] = useState(INITIAL_ROUTES);
  const [activeTab, setActiveTab] = useState<'ALL' | 'METRO' | 'BUS' | 'TRAIN'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const handleAddStop = (routeId: string) => {
    const newStop = prompt('Enter name of the stop to insert into the route layout timeline:');
    if (!newStop) return;

    setRoutes(prev => prev.map(r => {
      if (r.id === routeId) {
        // Insert in middle/end
        const nextStops = [...r.stops];
        nextStops.splice(nextStops.length - 1, 0, newStop);
        return {
          ...r,
          stopsCount: r.stopsCount + 1,
          stops: nextStops
        };
      }
      return r;
    }));

    toast({
      title: 'Stop Layout Inserted',
      description: `Added "${newStop}" to the active route path successfully.`,
    });
  };

  const filteredRoutes = useMemo(() => {
    return routes.filter(r => {
      const matchQuery = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         r.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTab = activeTab === 'ALL' || r.type === activeTab;
      return matchQuery && matchTab;
    });
  }, [routes, activeTab, searchQuery]);

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
              <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-white">Transit Routes</h1>
            </div>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold px-3 py-1 rounded-xl">
            GIS Database Synced
          </Badge>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 bg-white/[0.02] border border-white/5 p-2 rounded-2xl">
          <div className="flex flex-wrap gap-1">
            {(['ALL', 'METRO', 'BUS', 'TRAIN'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
                  activeTab === tab 
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search route name..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-white/5 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-brand-500 transition"
            />
          </div>
        </div>

        {/* Routes Queue */}
        <div className="grid gap-6">
          {filteredRoutes.map((route) => (
            <Card key={route.id} className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2.2rem] overflow-hidden p-6 hover:border-brand-500/30 transition">
              <div className="flex justify-between items-start flex-wrap gap-4 border-b border-white/5 pb-4 mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-white/5 text-slate-300 border-white/10 font-bold text-[10px] uppercase">
                      {route.type}
                    </Badge>
                    <span className="font-mono text-xs text-slate-500 font-semibold">{route.id}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white mt-2 flex items-center gap-2">
                    <RouteIcon className="h-5 w-5 text-brand-400" />
                    {route.name}
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-bold text-[10px]">
                    {route.status} FEED
                  </Badge>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-1 justify-end font-semibold">
                    <Clock className="h-3.5 w-3.5" /> {route.interval}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Anchor Station Timeline ({route.stopsCount} stops total)</span>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => handleAddStop(route.id)}
                    className="border-white/10 text-brand-400 hover:bg-white/5 rounded-lg py-1 px-2.5 text-[10px] font-bold flex items-center gap-1.5"
                  >
                    <Plus className="h-3 w-3" /> Add Stop
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 bg-slate-950/40 border border-white/5 p-5 rounded-2xl">
                  {route.stops.map((stop, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-white text-xs font-mono font-semibold">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 font-bold text-[10px]">
                        {idx + 1}
                      </div>
                      <span>{stop}</span>
                      {idx < route.stops.length - 1 && (
                        <ChevronRight className="hidden sm:inline text-slate-600 h-4.5 w-4.5" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}

          {filteredRoutes.length === 0 && (
            <div className="py-16 text-center bg-white/[0.02] rounded-3xl border border-white/5">
              <RouteIcon className="h-10 w-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 font-semibold">No transit routes found matching query or category.</p>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
