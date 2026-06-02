'use client';

import { useState, useEffect } from 'react';
import { Badge, Button, Card, CardContent } from '@moon/ui';
import { Navigation, Bell, MapPin, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { CityPicker } from './CityPicker';

export function OnboardingFlow() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedCity, setSelectedCity] = useState('delhi');

  useEffect(() => {
    const onboarded = localStorage.getItem('moon-onboarded');
    if (!onboarded) {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('moon-onboarded', 'true');
    setIsOpen(false);
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg overflow-hidden border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 animate-scale-up">
        <CardContent className="p-6 relative">
          <button 
            onClick={handleSkip} 
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Stepper indicator */}
          <div className="flex gap-1.5 mb-6 justify-center">
            {[1, 2, 3, 4].map((s) => (
              <div 
                key={s} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? 'w-8 bg-brand-500' : 'w-2 bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>

          <div className="space-y-6">
            {step === 1 && (
              <div className="space-y-4 text-center animate-fade-in">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-700">
                  <Navigation className="h-8 w-8 animate-bounce" />
                </div>
                <div className="space-y-2">
                  <Badge variant="success">Welcome to Moon</Badge>
                  <h2 className="text-2xl font-bold text-slate-950 dark:text-white">India's Transit Super-App</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Find the fastest routes, track buses and metro rail, book tickets, and manage commuter profiles all from one single application.
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="text-center">
                  <Badge variant="neutral">Step 2 of 4</Badge>
                  <h2 className="text-2xl font-bold text-slate-950 dark:text-white mt-2">Select Your Primary City</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Choose the city where you commute most frequently to customize your transit suggestions.
                  </p>
                </div>
                <div className="border border-slate-100 rounded-2xl p-2 dark:border-slate-800">
                  <CityPicker value={selectedCity} onChange={setSelectedCity} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 text-center animate-fade-in">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-700">
                  <MapPin className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <Badge variant="neutral">Step 3 of 4</Badge>
                  <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Enable Location Services</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    We use your location coordinates to determine nearby transit stations, stops, and live vehicle ETAs.
                  </p>
                </div>
                <Button 
                  onClick={() => navigator.geolocation.getCurrentPosition(() => {}, () => {})} 
                  className="mx-auto bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 border-0 rounded-2xl px-6"
                >
                  Authorize Location ACCESS
                </Button>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 text-center animate-fade-in">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">
                  <Bell className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <Badge variant="neutral">Step 4 of 4</Badge>
                  <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Enable Notifications</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Get real-time delay alerts, PNR updates, booking confirmations, and commuter alerts sent directly to your screen.
                  </p>
                </div>
                <Button 
                  onClick={() => Notification.requestPermission()} 
                  className="mx-auto bg-brand-500 hover:bg-brand-600 text-white border-0 rounded-2xl px-6"
                >
                  Enable Notifications
                </Button>
              </div>
            )}

            <div className="pt-4 flex justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
              <Button 
                variant="ghost" 
                onClick={handleSkip} 
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl"
              >
                Skip Onboarding
              </Button>
              <Button 
                onClick={handleNext} 
                className="bg-brand-500 hover:bg-brand-600 text-white border-0 gap-1.5 rounded-xl px-5"
              >
                {step === 4 ? 'Let\'s Go!' : 'Continue'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
