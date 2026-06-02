import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@moon/ui';
import { Download, Mail, Phone, Globe, Briefcase } from 'lucide-react';

export default function PressKitPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14 animate-fade-in">
      <section className="space-y-4">
        <Badge variant="neutral">Media Center</Badge>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Press & Media Kit
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-400">
            Download official logos, brand guidelines, founder biographies, and read about our mission to digitize public transport across India.
          </p>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Download Assets</CardTitle>
            <CardDescription>Official logo packs, PNG/SVG formats, and guidelines.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="flex w-full items-center justify-between border border-slate-100 rounded-2xl p-4 bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50 transition">
              <span className="font-semibold text-sm">Official Logo Pack (SVG/PNG)</span>
              <Download className="h-4 w-4 text-slate-500" />
            </button>
            <button className="flex w-full items-center justify-between border border-slate-100 rounded-2xl p-4 bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50 transition">
              <span className="font-semibold text-sm">App Screenshots (Android/iOS)</span>
              <Download className="h-4 w-4 text-slate-500" />
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Brand Guidelines</CardTitle>
            <CardDescription>Core identity colors and typography specifications.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
            <div className="rounded-2xl border p-4 bg-white dark:bg-slate-900/50 dark:border-slate-800">
              <div className="h-8 rounded-lg bg-[#22c55e] mb-2" />
              <p className="font-semibold">Brand Green</p>
              <p className="text-slate-400">#22C55E</p>
            </div>
            <div className="rounded-2xl border p-4 bg-white dark:bg-slate-900/50 dark:border-slate-800">
              <div className="h-8 rounded-lg bg-[#0ea5e9] mb-2" />
              <p className="font-semibold">Sky Blue</p>
              <p className="text-slate-400">#0EA5E9</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Founder Biography</CardTitle>
          <CardDescription>The team behind Moon Transit.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
          <p>
            Moon was founded in 2026 by a team of transit advocates and full-stack software engineers with the vision of solving last-mile fragments and scheduling anomalies across Indian public transport.
          </p>
          <p>
            By integrating open GTFS feeds, real-time WebSocket trackers, and structured payment gateways, Moon consolidates trains, state-run buses, auto-rickshaws, metro lines, and flights into a single seamless screen.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media Contact</CardTitle>
          <CardDescription>Get in touch for inquiries or interviews.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
          <div className="flex gap-2 items-center text-slate-600 dark:text-slate-400">
            <Mail className="h-4 w-4 text-brand-600" />
            <span>press@moon.in</span>
          </div>
          <div className="flex gap-2 items-center text-slate-600 dark:text-slate-400">
            <Phone className="h-4 w-4 text-brand-600" />
            <span>+91-120-4567891</span>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
