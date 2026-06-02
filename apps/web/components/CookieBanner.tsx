'use client';

import { useEffect, useState } from 'react';
import { Button, Card, CardContent } from '@moon/ui';
import { ShieldAlert, X } from 'lucide-react';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('moon-cookie-consent');
    if (!consent) {
      // Show banner after 2 seconds
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('moon-cookie-consent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('moon-cookie-consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:bottom-6 md:left-6 md:right-auto md:w-96 animate-slide-up">
      <Card className="border-brand-500/20 bg-slate-900 text-white shadow-2xl">
        <CardContent className="p-4 relative">
          <button 
            onClick={() => setShowBanner(false)} 
            className="absolute top-2 right-2 text-slate-400 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex gap-3 items-start pr-6">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-white">Cookie Consent</p>
              <p className="text-xs text-slate-400 mt-1">
                We use cookies to save preferences, authenticate user sessions, and analyze traffic metrics under the DPDP Act 2023 guidelines.
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="primary" onClick={handleAccept} className="bg-brand-500 hover:bg-brand-600 text-white border-0 text-xs py-1.5 h-auto">
                  Accept All
                </Button>
                <Button size="sm" variant="secondary" onClick={handleDecline} className="bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 text-xs py-1.5 h-auto">
                  Decline
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
