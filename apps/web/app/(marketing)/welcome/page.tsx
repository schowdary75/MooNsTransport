import Link from 'next/link';
import { Route, Train, Bus, Play, CheckCircle, ArrowRight, ShieldCheck, Download } from 'lucide-react';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@moon/ui';

export default function WelcomePage() {
  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-10rem] top-[-8rem] h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute right-[-10rem] top-24 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10 space-y-16 animate-fade-in">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <Badge variant="success">🌙 Introducing Moon v1.0</Badge>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-sky-600 to-indigo-600">
            India's Transit Super-App
          </h1>
          <p className="text-lg leading-8 text-slate-600 dark:text-slate-400 sm:text-xl">
            Inspired by Citymapper but built from scratch for the complex, vibrant transit networks of India. Plan commutes, get live telemetry, and book tickets seamlessly.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button href="/" className="bg-brand-500 hover:bg-brand-600 text-white border-0 gap-2 px-6 rounded-2xl shadow-lg shadow-brand-500/20">
              Open Web App
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/waitlist" variant="secondary" className="gap-2 px-6 rounded-2xl">
              Join waitlist
            </Button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-700 mb-3">
                <Route className="h-5 w-5" />
              </div>
              <CardTitle>Multi-Modal Routing</CardTitle>
              <CardDescription>
                Compare routes across Delhi Metro, state bus services, domestic flights, auto-rickshaws, and ride-hailing services instantly.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-700 mb-3">
                <Train className="h-5 w-5" />
              </div>
              <CardTitle>Metro & Rail Ticketing</CardTitle>
              <CardDescription>
                Verify PNR status, search train availability, buy tickets using UPI, and generate entry gate QR codes.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-700 mb-3">
                <Bus className="h-5 w-5" />
              </div>
              <CardTitle>Live Vehicle Telemetry</CardTitle>
              <CardDescription>
                Watch real-time vehicle markers move on the map and receive alerts if your bus or train is running behind schedule.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Call to action section */}
        <Card className="overflow-hidden border-slate-200 bg-slate-900 text-white dark:border-slate-800">
          <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl -z-10" />
            <div className="space-y-4 max-w-xl">
              <h2 className="text-3xl font-bold tracking-tight">Commute smarter starting today.</h2>
              <p className="text-slate-400 text-sm leading-6">
                Download the Moon native Android and iOS apps from the stores, or add our Progressive Web App (PWA) to your home screen.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="#" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-4 py-2 border border-slate-700 transition text-xs font-semibold">
                  <Download className="h-4 w-4" />
                  Google Play Store
                </Link>
                <Link href="#" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-4 py-2 border border-slate-700 transition text-xs font-semibold">
                  <Download className="h-4 w-4" />
                  Apple App Store
                </Link>
              </div>
            </div>
            <div className="flex shrink-0 gap-2 font-semibold text-xs border border-slate-800 bg-black/40 rounded-2xl p-4 text-slate-300">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-400">
                  <CheckCircle className="h-4 w-4" />
                  <span>Delhi NCR Live</span>
                </div>
                <div className="flex items-center gap-2 text-brand-400">
                  <CheckCircle className="h-4 w-4" />
                  <span>Mumbai Transit Live</span>
                </div>
                <div className="flex items-center gap-2 text-brand-400">
                  <CheckCircle className="h-4 w-4" />
                  <span>Bengaluru Namma Metro Live</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
