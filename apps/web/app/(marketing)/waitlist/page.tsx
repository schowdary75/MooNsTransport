'use client';

import { useState } from 'react';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@moon/ui';
import { Sparkles, MapPin, CheckCircle, Mail } from 'lucide-react';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && city) {
      setSubmitted(true);
    }
  };

  return (
    <main className="relative min-h-[85vh] overflow-hidden flex flex-col justify-center items-center py-10 px-4">
      {/* Background blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-10rem] top-[-8rem] h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute right-[-10rem] top-24 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md space-y-6 text-center animate-fade-in">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-700 shadow-md">
          <Sparkles className="h-7 w-7 text-brand-600 animate-pulse" />
        </div>

        <div className="space-y-2">
          <Badge variant="success">Beta Waitlist</Badge>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Bring Moon to Your City
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Currently active in 5 major hubs (Delhi, Mumbai, Bengaluru, Chennai, Hyderabad). Sign up to vote for expanding coverage to your city!
          </p>
        </div>

        {submitted ? (
          <Card className="border-brand-500/20 bg-slate-900 text-white shadow-2xl p-6">
            <CardContent className="space-y-4 pt-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-500">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Successfully Registered!</h3>
              <p className="text-xs text-slate-400">
                Thank you for signing up. We've added your vote for **{city}** and will notify you at **{email}** as soon as live data coverage rolls out.
              </p>
              <Button href="/" className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 rounded-xl h-10 mt-2">
                Back to Home
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-slate-200/80 bg-white/70 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/60 text-left">
            <CardHeader>
              <CardTitle className="text-lg">Waitlist Form</CardTitle>
              <CardDescription>Enter details to request coverage.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                    />
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Your City</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pune, Kolkata, Ahmedabad"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                    />
                    <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-brand-500 hover:bg-brand-600 text-white border-0 h-11 rounded-xl">
                  Register Interest
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
