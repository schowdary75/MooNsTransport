'use client';

import { WifiOff, MapPin, RefreshCw, ChevronRight } from 'lucide-react';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@moon/ui';
import { savedPlaces } from '../../lib/saved-places-data'; // Reuse mocked saved places

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <main className="relative min-h-[80vh] overflow-hidden flex flex-col justify-center items-center py-10 px-4">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-10rem] top-[-8rem] h-80 w-80 rounded-full bg-brand-300/10 blur-3xl" />
        <div className="absolute right-[-10rem] top-24 h-96 w-96 rounded-full bg-sky-300/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md space-y-8 text-center animate-fade-in">
        {/* Offline Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-400 dark:bg-slate-900/50 shadow-md">
          <WifiOff className="h-10 w-10 animate-pulse text-brand-600" />
        </div>

        <div className="space-y-3">
          <Badge variant="warning">Connection Lost</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            You're currently offline
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Moon is in offline mode. Check your connection or explore your saved places and cached routes below.
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Button onClick={handleRetry} className="flex items-center gap-2 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white border-0 shadow-lg shadow-brand-500/20">
            <RefreshCw className="h-4 w-4" />
            Retry Connection
          </Button>
        </div>

        {/* Offline Cache Display */}
        <Card className="text-left border-slate-200/80 bg-white/70 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Saved Locations (Offline Cache)</CardTitle>
            <CardDescription>Always available even without internet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {savedPlaces.map((place: any) => {
              const Icon = place.icon;
              return (
                <div
                  key={place.label}
                  className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50 p-3 hover:border-brand-300 transition dark:border-slate-800 dark:bg-slate-900/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-700">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-950 dark:text-white">{place.label}</p>
                      <p className="truncate text-xs text-slate-500">{place.place}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
