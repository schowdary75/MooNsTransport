'use client';

import { useLocalAuth } from './use-local-auth';

export function useAuth() {
  const auth = useLocalAuth();

  return {
    user: auth.user,
    isLoaded: auth.isLoaded,
    isGuest: !auth.isSignedIn,
    isLocalGuest: !auth.isSignedIn,
    userId: auth.userId,
    sessionId: auth.userId,
    setGuestMode: () => undefined,
    exitGuestMode: () => undefined,
    signOut: auth.signOut,
    signIn: auth.signIn,
  };
}
