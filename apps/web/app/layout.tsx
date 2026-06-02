import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { CookieBanner } from '@/components/CookieBanner';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import { UpdatePrompt } from '@/components/pwa/UpdatePrompt';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Moon',
    template: '%s - Moon',
  },
  description:
    'Moon is a Citymapper-style transit app for India with route planning, live tracking, and commuter tools.',
  applicationName: 'Moon',
  keywords: [
    'India transit',
    'route planner',
    'metro',
    'bus',
    'train',
    'flight',
    'cab booking',
    'live tracking',
    'commuter app',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-slate-50/50 py-8 px-6 dark:border-slate-800 dark:bg-slate-900/30 pb-24 md:pb-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-500">
          © {new Date().getFullYear()} Moon Transit. All rights reserved.
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
          <Link href="/legal/privacy" className="hover:text-slate-950 transition dark:hover:text-white">Privacy Policy</Link>
          <Link href="/legal/terms" className="hover:text-slate-950 transition dark:hover:text-white">Terms of Service</Link>
          <Link href="/legal/refunds" className="hover:text-slate-950 transition dark:hover:text-white">Refund Policy</Link>
          <Link href="/legal/cookies" className="hover:text-slate-950 transition dark:hover:text-white">Cookie Policy</Link>
          <Link href="/legal/grievance" className="hover:text-slate-950 transition dark:hover:text-white">Grievance Officer</Link>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <Footer />
            <BottomNav />
            <CookieBanner />
            <InstallPrompt />
            <UpdatePrompt />
            <OnboardingFlow />
          </div>
        </Providers>
      </body>
    </html>
  );
}
