import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, MapPin, BusFront, TrainFront, Navigation } from 'lucide-react';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@moon/ui';
import { cities } from '../../../lib/site-data';

export const revalidate = 3600; // ISR revalidate every hour

export async function generateStaticParams() {
  return cities.map((city) => ({
    city: city.id,
  }));
}

type CityRoutesPageProps = {
  params: Promise<{ city: string }> | { city: string };
};

export default async function CityRoutesPage({ params }: CityRoutesPageProps) {
  const resolvedParams = await params;
  const city = cities.find((c) => c.id === resolvedParams.city);

  if (!city) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14 animate-fade-in">
      <section className="space-y-4">
        <Badge variant="neutral">{city.state}, India</Badge>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Transit Routes in {city.name}
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            Find timetables, live vehicle status, and plan multi-modal routing across {city.name} metro, bus, and regional rail networks.
          </p>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-700 mb-4">
              <Navigation className="h-5 w-5" />
            </div>
            <CardTitle>Interactive Transit Map</CardTitle>
            <CardDescription>
              Explore routes, live vehicle locations, and stops in {city.name} directly on our map.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button href={`/routes?city=${city.id}`} className="w-full bg-brand-500 hover:bg-brand-600 text-white border-0 gap-2 rounded-2xl">
              Open {city.name} Map
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-700 mb-4">
              <MapPin className="h-5 w-5" />
            </div>
            <CardTitle>Local Details</CardTitle>
            <CardDescription>
              Coordinates: {city.location.lat.toFixed(4)} N, {city.location.lng.toFixed(4)} E
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-2 text-sm text-slate-600">
            <p>• Coverage includes major metro lines and suburban bus corridors.</p>
            <p>• Integrates live data feeds from state operators where available.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supported Networks</CardTitle>
          <CardDescription>Major operators and routes supported in {city.name}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="flex gap-3 items-start border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
              <BusFront className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">City Bus Network</p>
              <p className="text-xs text-slate-500 mt-1">
                State RTC routing and schedule integration, including express and AC routes.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <TrainFront className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Metro Rail</p>
              <p className="text-xs text-slate-500 mt-1">
                Rapid transit route planning, SVG line charts, fare structure, and station gates info.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
