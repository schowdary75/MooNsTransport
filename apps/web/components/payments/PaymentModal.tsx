'use client';

import { useState, useCallback } from 'react';
import { CheckCircle2, CreditCard, Loader2, Shield, X } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentId: string) => void;
  amount: number;
  description: string;
  bookingId?: string;
}

type PaymentStep = 'selecting' | 'processing' | 'success' | 'failed';

const PAYMENT_METHODS = [
  { id: 'upi', name: 'UPI', description: 'Google Pay, PhonePe, Paytm', icon: '📱' },
  { id: 'card', name: 'Card', description: 'Visa, Mastercard, RuPay', icon: '💳' },
  { id: 'netbanking', name: 'Net Banking', description: 'SBI, HDFC, ICICI & more', icon: '🏦' },
  { id: 'wallet', name: 'Wallet', description: 'Paytm, Amazon Pay', icon: '👛' },
];

export function PaymentModal({ isOpen, onClose, onSuccess, amount, description, bookingId }: PaymentModalProps) {
  const [step, setStep] = useState<PaymentStep>('selecting');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [upiId, setUpiId] = useState('');

  const handlePay = useCallback(async () => {
    if (!selectedMethod) return;
    setStep('processing');

    // Check if Razorpay is available (real keys configured)
    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const isRealRazorpay = razorpayKey && !razorpayKey.includes('your_') && !razorpayKey.includes('rzp_test_your');

    if (isRealRazorpay && typeof window !== 'undefined' && (window as any).Razorpay) {
      // Real Razorpay flow
      try {
        const res = await fetch('/api/payments/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, description, bookingId }),
        });
        const order = await res.json();

        const options = {
          key: razorpayKey,
          amount: order.amount,
          currency: 'INR',
          name: 'Moon Transit',
          description,
          order_id: order.id,
          handler: function (response: any) {
            setStep('success');
            setTimeout(() => onSuccess(response.razorpay_payment_id), 1500);
          },
          prefill: { email: 'demo@moon.local' },
          theme: { color: '#2563eb' },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        rzp.on('payment.failed', () => setStep('failed'));
      } catch {
        setStep('failed');
      }
    } else {
      // Demo payment flow — simulates payment with delay
      setTimeout(() => {
        const demoPaymentId = `demo_pay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        setStep('success');
        setTimeout(() => onSuccess(demoPaymentId), 2000);
      }, 2000);
    }
  }, [selectedMethod, amount, description, bookingId, onSuccess]);

  const resetAndClose = () => {
    setStep('selecting');
    setSelectedMethod(null);
    setUpiId('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={resetAndClose}>
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">Payment</h3>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
          <button onClick={resetAndClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Amount */}
        <div className="border-b border-slate-100 px-6 py-4 text-center">
          <p className="text-sm text-slate-500">Total Amount</p>
          <p className="text-3xl font-bold text-slate-950">₹{amount.toLocaleString()}</p>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {step === 'selecting' && (
            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                    selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-950">{method.name}</p>
                    <p className="text-xs text-slate-500">{method.description}</p>
                  </div>
                </button>
              ))}

              {selectedMethod === 'upi' && (
                <input
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="Enter UPI ID (e.g. name@upi)"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                />
              )}

              <button
                onClick={handlePay}
                disabled={!selectedMethod}
                className="w-full rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                Pay ₹{amount.toLocaleString()}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <Shield className="h-3.5 w-3.5" />
                Secured by Razorpay · 256-bit SSL encryption
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center gap-4 py-10">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <p className="text-lg font-semibold text-slate-950">Processing payment...</p>
              <p className="text-sm text-slate-500">Please don't close this window</p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center gap-4 py-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>
              <p className="text-lg font-semibold text-slate-950">Payment Successful!</p>
              <p className="text-sm text-slate-500">Your booking has been confirmed</p>
            </div>
          )}

          {step === 'failed' && (
            <div className="flex flex-col items-center gap-4 py-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <X className="h-10 w-10 text-red-600" />
              </div>
              <p className="text-lg font-semibold text-slate-950">Payment Failed</p>
              <p className="text-sm text-slate-500">Please try again or use a different method</p>
              <button
                onClick={() => setStep('selecting')}
                className="rounded-xl bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
