'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell,
  BusFront,
  Building2,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  PlaneTakeoff,
  Route,
  ShieldCheck,
  Ticket,
  TrainFront,
  UserCircle2,
  Utensils,
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLocalAuth } from '@/hooks/use-local-auth';

const navLinks = [
  { href: '/routes', label: 'Routes', icon: Route },
  { href: '/tracking', label: 'Tracking' },
  { href: '/trains', label: 'Trains', icon: TrainFront },
  { href: '/buses', label: 'Buses', icon: BusFront },
  { href: '/flights', label: 'Flights', icon: PlaneTakeoff },
  { href: '/metro', label: 'Metro' },
  { href: '/cabs', label: 'Cabs' },
  { href: '/food', label: 'Food', icon: Utensils },
];

export function Header() {
  const { isSignedIn, isLoaded, role, user, signOut } = useLocalAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isSignedIn) return;
    fetch('/api/notifications')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        const count = (data.notifications || []).filter((n: any) => !n.read).length;
        setUnreadCount(count);
      })
      .catch((e) => console.error(e));
  }, [isSignedIn, pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Moon className="h-5 w-5 text-white" />
          </div>
          <span className="hidden text-lg font-bold sm:inline">Moon</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 text-sm font-semibold lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 transition ${
                isActive(link.href)
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {role === 'ADMIN' && (
            <Link href="/admin" className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 transition ${isActive('/admin') ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100'}`}>
              <ShieldCheck className="h-4 w-4" />
              Admin
            </Link>
          )}
          {role === 'OPERATOR' && (
            <Link href="/operator" className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 transition ${isActive('/operator') ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100'}`}>
              <Building2 className="h-4 w-4" />
              Operator
            </Link>
          )}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          {isSignedIn && (
            <Link href="/notifications" className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-950 transition">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}

          {isLoaded && isSignedIn ? (
            <>
              <Link
                href="/bookings"
                className={`hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold sm:flex transition ${
                  isActive('/bookings') ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Ticket className="h-4 w-4" />
                Bookings
              </Link>
              <Link
                href="/profile"
                className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold sm:flex hover:bg-slate-50 transition"
              >
                <UserCircle2 className="h-4 w-4" />
                {user?.name}
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  signOut();
                  router.push('/login');
                }}
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>
                Sign in
              </Button>
              <Button size="sm" className="hidden sm:inline-flex" onClick={() => router.push('/login')}>
                Demo users
              </Button>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t bg-white p-4 shadow-lg lg:hidden">
          <nav className="grid gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  isActive(link.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isSignedIn && (
              <>
                <Link href="/bookings" onClick={() => setIsMobileMenuOpen(false)} className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100">
                  My Bookings
                </Link>
                <Link href="/support" onClick={() => setIsMobileMenuOpen(false)} className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100">
                  Support
                </Link>
              </>
            )}
            {role === 'ADMIN' && (
              <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100">
                Admin Portal
              </Link>
            )}
            {role === 'OPERATOR' && (
              <Link href="/operator" onClick={() => setIsMobileMenuOpen(false)} className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100">
                Operator Portal
              </Link>
            )}
            <Link href="/rentals/bikes" onClick={() => setIsMobileMenuOpen(false)} className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100">
              Bike Rentals
            </Link>
            <Link href="/rentals/cars" onClick={() => setIsMobileMenuOpen(false)} className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100">
              Car Rentals
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
