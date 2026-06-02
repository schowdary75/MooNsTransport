'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Home, MapPinned, Route, ShieldCheck, Ticket, UserCircle2 } from 'lucide-react';
import { useLocalAuth } from '@/hooks/use-local-auth';

export function BottomNav() {
  const pathname = usePathname();
  const { isSignedIn, role } = useLocalAuth();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/routes', label: 'Routes', icon: Route },
    { href: '/tracking', label: 'Track', icon: MapPinned },
    ...(isSignedIn
      ? [
          { href: '/bookings', label: 'Bookings', icon: Ticket },
          { href: '/profile', label: 'Profile', icon: UserCircle2 },
        ]
      : [{ href: '/profile', label: 'Profile', icon: UserCircle2 }]),
    ...(role === 'ADMIN' ? [{ href: '/admin', label: 'Admin', icon: ShieldCheck }] : []),
    ...(role === 'OPERATOR' ? [{ href: '/operator', label: 'Ops', icon: Building2 }] : []),
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background md:hidden">
      <div className="flex justify-around">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-center px-2 py-3 text-xs font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="mb-1 h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
