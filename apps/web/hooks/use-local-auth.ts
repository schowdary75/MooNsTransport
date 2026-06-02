'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { demoAuthCookie, demoUsers, getDemoUserByRole, type DemoRole } from '@/lib/demo-auth';

function readCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${encodeURIComponent(name)}=`));
  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null;
}

function writeCookie(name: string, value: string) {
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; max-age=2592000; samesite=lax`;
}

function clearCookie(name: string) {
  document.cookie = `${encodeURIComponent(name)}=; path=/; max-age=0; samesite=lax`;
}

export function useLocalAuth() {
  const [role, setRole] = useState<DemoRole | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const cookieRole = readCookie(demoAuthCookie) as DemoRole | null;
    setRole(getDemoUserByRole(cookieRole)?.role ?? null);
    setIsLoaded(true);
  }, []);

  const signIn = useCallback((nextRole: DemoRole) => {
    writeCookie(demoAuthCookie, nextRole);
    setRole(nextRole);
  }, []);

  const signOut = useCallback(() => {
    clearCookie(demoAuthCookie);
    setRole(null);
  }, []);

  const user = useMemo(() => getDemoUserByRole(role), [role]);

  return {
    demoUsers,
    user,
    role,
    isLoaded,
    isSignedIn: Boolean(user),
    userId: user?.id ?? null,
    signIn,
    signOut,
  };
}
