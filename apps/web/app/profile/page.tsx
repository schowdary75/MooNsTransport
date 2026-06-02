'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Bell,
  Briefcase,
  Home as HomeIcon,
  MapPin,
  Settings,
  Star,
  Ticket,
  UserCircle2,
  Check,
  Search,
  ArrowLeft,
  Loader2,
  Trash2,
} from 'lucide-react';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@moon/ui';
import { useToast } from '@/hooks/use-toast';
import { geocodeAddress } from '@/lib/nominatim';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  preferredLang: string;
  homeAddress: string;
  workAddress: string;
}

interface Suggestion {
  lat: string;
  lon: string;
  displayName: string;
}

const defaultLangOptions = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi (हिन्दी)' },
  { value: 'kn', label: 'Kannada (ಕನ್ನಡ)' },
  { value: 'ta', label: 'Tamil (தமிழ்)' },
  { value: 'te', label: 'Telugu (తెలుగు)' },
  { value: 'mr', label: 'Marathi (मराठी)' },
];

export default function ProfilePage() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Demo Rider',
    email: 'demo@moon.local',
    phone: '+919999999999',
    preferredLang: 'en',
    homeAddress: 'Connaught Place, Delhi',
    workAddress: 'New Delhi Railway Station',
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Address geocoding states
  const [homeInput, setHomeInput] = useState('');
  const [homeSuggestions, setHomeSuggestions] = useState<Suggestion[]>([]);
  const [isHomeOpen, setIsHomeOpen] = useState(false);
  const homeTimer = useRef<NodeJS.Timeout | null>(null);

  const [workInput, setWorkInput] = useState('');
  const [workSuggestions, setWorkSuggestions] = useState<Suggestion[]>([]);
  const [isWorkOpen, setIsWorkOpen] = useState(false);
  const workTimer = useRef<NodeJS.Timeout | null>(null);

  // Subscribed alerts from localStorage
  const [subscribedRoutes, setSubscribedRoutes] = useState<string[]>([]);
  const [recentTrips, setRecentTrips] = useState<any[]>([]);

  useEffect(() => {
    // 1. Fetch user profile
    fetch('/api/user/me')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data.user) {
          setProfile({
            name: data.user.name || 'Demo Rider',
            email: data.user.email || 'demo@moon.local',
            phone: data.user.phone || '+919999999999',
            preferredLang: data.user.preferredLang || 'en',
            homeAddress: data.user.homeAddress || 'Connaught Place, Delhi',
            workAddress: data.user.workAddress || 'New Delhi Railway Station',
          });
          setHomeInput(data.user.homeAddress || 'Connaught Place, Delhi');
          setWorkInput(data.user.workAddress || 'New Delhi Railway Station');
        }
      })
      .catch(() => {
        // Fallback to presets
        setHomeInput(profile.homeAddress);
        setWorkInput(profile.workAddress);
      })
      .finally(() => setLoading(false));

    // 2. Fetch subscribed alerts
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('moon_subscribed_routes');
      if (stored) {
        try {
          setSubscribedRoutes(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }

    // 3. Simulated trip history
    setRecentTrips([
      { id: 'trip-1', mode: '🚇 Metro', route: 'Blue Line', date: 'Yesterday', duration: '24 min', fare: '₹18' },
      { id: 'trip-2', mode: '🚌 Bus', route: 'BEST 117', date: '3 days ago', duration: '12 min', fare: '₹10' },
      { id: 'trip-3', mode: '🚇 Metro', route: 'Yellow Line', date: 'Last week', duration: '18 min', fare: '₹15' },
    ]);
  }, []);

  const handleHomeSearch = async (val: string) => {
    if (val.length < 3) {
      setHomeSuggestions([]);
      return;
    }
    const res = await geocodeAddress(val);
    setHomeSuggestions(res);
    setIsHomeOpen(true);
  };

  const handleWorkSearch = async (val: string) => {
    if (val.length < 3) {
      setWorkSuggestions([]);
      return;
    }
    const res = await geocodeAddress(val);
    setWorkSuggestions(res);
    setIsWorkOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/user/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          preferredLang: profile.preferredLang,
          homeAddress: homeInput,
          workAddress: workInput,
        }),
      });

      if (!res.ok) throw new Error('Update failed');
      const data = await res.json();
      
      toast({
        title: 'Settings Saved',
        description: 'Your transit profile settings have been updated.',
      });
    } catch {
      toast({
        title: 'Save failed',
        description: 'Unable to save profile configuration changes.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteSubscription = (route: string) => {
    const updated = subscribedRoutes.filter((r) => r !== route);
    setSubscribedRoutes(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('moon_subscribed_routes', JSON.stringify(updated));
    }
    toast({
      title: 'Alert Removed',
      description: `Unsubscribed from ${route} alerts.`,
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
          <span className="text-sm text-slate-400 font-semibold uppercase tracking-wider">Loading settings profile...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden pb-16">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 h-[600px] w-[600px] rounded-full bg-brand-500/5 blur-[120px] -z-10" />

      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 pt-24">
        {/* Header branding */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6 mb-8">
          <div className="flex items-center gap-2">
            <Link href="/" className="p-2 hover:bg-white/5 rounded-xl transition text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Commuter Profile</h1>
          </div>
          <Badge className="bg-brand-500/10 text-brand-400 border-brand-500/25">
            Settings Console
          </Badge>
        </header>

        {/* Profile Grid */}
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          
          {/* Main profile settings panel */}
          <div className="space-y-6">
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-white/5 pb-5">
                <CardTitle className="text-white text-xl">Travel Preferences</CardTitle>
                <CardDescription className="text-slate-400">Manage your commute hubs, notification alerts, and localization preferences.</CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  
                  {/* Basic Details */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Display Name</label>
                      <input
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-950/60 border border-white/5 rounded-xl text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500/25 outline-none transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Phone Contact</label>
                      <input
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-950/60 border border-white/5 rounded-xl text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500/25 outline-none transition"
                        placeholder="+91 xxxxxxxxxx"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
                    <input
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-3 bg-slate-950/20 border border-white/5 rounded-xl text-sm text-slate-500 outline-none cursor-not-allowed"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Managed via authentication provider integration.</p>
                  </div>

                  {/* Geocoding Commute Locations */}
                  <div className="border-t border-white/5 pt-5 space-y-4">
                    <h3 className="text-sm font-semibold text-white">Default Commute Anchors</h3>
                    
                    {/* Home Address geocoding form */}
                    <div className="relative">
                      <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        <HomeIcon className="h-3.5 w-3.5 text-brand-400" />
                        <span>Home Location Address</span>
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                        <input
                          value={homeInput}
                          onChange={(e) => {
                            const val = e.target.value;
                            setHomeInput(val);
                            if (homeTimer.current) clearTimeout(homeTimer.current);
                            homeTimer.current = setTimeout(() => handleHomeSearch(val), 300);
                          }}
                          onFocus={() => homeSuggestions.length > 0 && setIsHomeOpen(true)}
                          placeholder="Search Home Location..."
                          className="w-full pl-10 pr-4 py-3.5 bg-slate-950/60 border border-white/5 rounded-xl text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500/25 outline-none transition"
                          autoComplete="off"
                        />
                      </div>
                      {isHomeOpen && homeSuggestions.length > 0 && (
                        <ul className="absolute top-full left-0 right-0 bg-slate-950 border border-white/10 rounded-xl shadow-2xl mt-1 max-h-48 overflow-y-auto z-50 divide-y divide-white/5 text-slate-200">
                          {homeSuggestions.map((s, idx) => (
                            <li key={idx}>
                              <button
                                type="button"
                                onClick={() => {
                                  setHomeInput(s.displayName.split(',')[0]!);
                                  setHomeSuggestions([]);
                                  setIsHomeOpen(false);
                                }}
                                className="w-full text-left px-4 py-2.5 hover:bg-white/5 transition text-xs"
                              >
                                <div className="font-semibold text-white">{s.displayName.split(',')[0]}</div>
                                <div className="text-[9px] text-slate-400 truncate mt-0.5">{s.displayName}</div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Work Address geocoding form */}
                    <div className="relative">
                      <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        <Briefcase className="h-3.5 w-3.5 text-brand-400" />
                        <span>Work Location Address</span>
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                        <input
                          value={workInput}
                          onChange={(e) => {
                            const val = e.target.value;
                            setWorkInput(val);
                            if (workTimer.current) clearTimeout(workTimer.current);
                            workTimer.current = setTimeout(() => handleWorkSearch(val), 300);
                          }}
                          onFocus={() => workSuggestions.length > 0 && setIsWorkOpen(true)}
                          placeholder="Search Work Location..."
                          className="w-full pl-10 pr-4 py-3.5 bg-slate-950/60 border border-white/5 rounded-xl text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500/25 outline-none transition"
                          autoComplete="off"
                        />
                      </div>
                      {isWorkOpen && workSuggestions.length > 0 && (
                        <ul className="absolute top-full left-0 right-0 bg-slate-950 border border-white/10 rounded-xl shadow-2xl mt-1 max-h-48 overflow-y-auto z-50 divide-y divide-white/5 text-slate-200">
                          {workSuggestions.map((s, idx) => (
                            <li key={idx}>
                              <button
                                type="button"
                                onClick={() => {
                                  setWorkInput(s.displayName.split(',')[0]!);
                                  setWorkSuggestions([]);
                                  setIsWorkOpen(false);
                                }}
                                className="w-full text-left px-4 py-2.5 hover:bg-white/5 transition text-xs"
                              >
                                <div className="font-semibold text-white">{s.displayName.split(',')[0]}</div>
                                <div className="text-[9px] text-slate-400 truncate mt-0.5">{s.displayName}</div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Languages Preference */}
                  <div className="border-t border-white/5 pt-5 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Preferred Language</label>
                      <select
                        value={profile.preferredLang}
                        onChange={(e) => setProfile({ ...profile, preferredLang: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm text-white focus:border-brand-500 outline-none transition cursor-pointer"
                      >
                        {defaultLangOptions.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-slate-950 text-white">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="border-t border-white/5 pt-4 flex justify-end">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="rounded-2xl px-6 bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/20 text-sm font-semibold flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Save Settings</span>
                        </>
                      )}
                    </Button>
                  </div>

                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar profile stats & subscriptions */}
          <div className="space-y-6">
            
            {/* Active Alert Subscriptions */}
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="text-white text-base">Alert Subscriptions</CardTitle>
                <CardDescription className="text-slate-400">Routes you monitor for delays.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {subscribedRoutes.length === 0 ? (
                  <div className="text-center p-4 bg-slate-950/20 border border-dashed border-white/5 rounded-2xl">
                    <p className="text-xs text-slate-500">No active alerts subscribed.</p>
                    <Link href="/tracking" className="text-xs text-brand-400 hover:underline font-semibold mt-2 block">
                      Explore live vehicles map
                    </Link>
                  </div>
                ) : (
                  subscribedRoutes.map((route) => (
                    <div
                      key={route}
                      className="flex items-center justify-between gap-3 bg-slate-950/40 border border-white/5 rounded-2xl p-4 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-8 w-8 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0">
                          <Bell className="h-4 w-4" />
                        </div>
                        <span className="font-semibold text-white truncate">{route}</span>
                      </div>
                      <button
                        onClick={() => deleteSubscription(route)}
                        className="p-2 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition shrink-0"
                        title="Remove subscription"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Travel History */}
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="text-white text-base">Travel logs</CardTitle>
                <CardDescription className="text-slate-400">Your recent journeys across cities.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="flex justify-between items-center gap-3 bg-slate-950/20 border border-white/5 rounded-2xl p-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{trip.mode}</span>
                        <span className="text-[10px] text-slate-400">{trip.route}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">{trip.date} · {trip.duration}</p>
                    </div>
                    <Badge className="bg-slate-950 border border-white/5 text-slate-300 font-bold">{trip.fare}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Navigation Panel */}
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="text-white text-base">Quick Navigation</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button
                  href={`/routes?fromName=${encodeURIComponent(homeInput)}&toName=${encodeURIComponent(workInput)}`}
                  variant="secondary"
                  className="text-xs py-1 h-9 rounded-xl"
                >
                  Home to Work
                </Button>
                <Button
                  href={`/routes?fromName=${encodeURIComponent(workInput)}&toName=${encodeURIComponent(homeInput)}`}
                  variant="secondary"
                  className="text-xs py-1 h-9 rounded-xl"
                >
                  Work to Home
                </Button>
                <Button href="/bookings" variant="secondary" className="text-xs py-1 h-9 rounded-xl">
                  My Tickets
                </Button>
                <Button href="/support" variant="secondary" className="text-xs py-1 h-9 rounded-xl">
                  Help Desk
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>

      </section>
    </main>
  );
}
