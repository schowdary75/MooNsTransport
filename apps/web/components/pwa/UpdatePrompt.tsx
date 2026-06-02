'use client';

import { useEffect, useState } from 'react';
import { Button, Card, CardContent } from '@moon/ui';
import { RefreshCw, X } from 'lucide-react';

export function UpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);
        
        // Listen for new service worker waiting
        const checkUpdate = () => {
          if (reg.waiting) {
            setShowPrompt(true);
          }
        };

        checkUpdate();

        // Listen for updates found
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setShowPrompt(true);
            }
          });
        });
      });
    }
  }, []);

  const handleUpdateClick = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      setShowPrompt(false);
      window.location.reload();
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:bottom-6 md:right-6 md:left-auto md:w-96">
      <Card className="border-brand-500/20 bg-slate-900 text-white shadow-2xl">
        <CardContent className="p-4 relative">
          <button 
            onClick={() => setShowPrompt(false)} 
            className="absolute top-2 right-2 text-slate-400 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex gap-3 items-start pr-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white">
              <RefreshCw className="h-5 w-5 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <div>
              <p className="font-semibold text-white">New Version Available</p>
              <p className="text-xs text-slate-400 mt-1">
                A new version of Moon is available. Update now to get the latest transit info.
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="primary" onClick={handleUpdateClick} className="bg-brand-500 hover:bg-brand-600 text-white border-0 text-xs py-1.5 h-auto">
                  Refresh App
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setShowPrompt(false)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 text-xs py-1.5 h-auto">
                  Ignore
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
