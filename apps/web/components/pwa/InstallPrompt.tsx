'use client';

import { useEffect, useState } from 'react';
import { Button, Card, CardContent } from '@moon/ui';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Delay showing the banner by 30 seconds to avoid annoying the user immediately
      const timer = setTimeout(() => {
        // Only show if the user hasn't already dismissed it in this session
        const dismissed = sessionStorage.getItem('pwa-install-dismissed');
        if (!dismissed) {
          setShowPrompt(true);
        }
      }, 30000);

      return () => clearTimeout(timer);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem('pwa-install-dismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:bottom-6 md:right-6 md:left-auto md:w-96 animate-bounce-short">
      <Card className="border-brand-500/20 bg-slate-900 text-white shadow-2xl">
        <CardContent className="p-4 relative">
          <button 
            onClick={handleDismiss} 
            className="absolute top-2 right-2 text-slate-400 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex gap-3 items-start pr-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-white">Install Moon Super-App</p>
              <p className="text-xs text-slate-400 mt-1">
                Install Moon on your home screen for quick offline routing and booking updates.
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="primary" onClick={handleInstallClick} className="bg-brand-500 hover:bg-brand-600 text-white border-0 text-xs py-1.5 h-auto">
                  Install Now
                </Button>
                <Button size="sm" variant="secondary" onClick={handleDismiss} className="bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 text-xs py-1.5 h-auto">
                  Later
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
