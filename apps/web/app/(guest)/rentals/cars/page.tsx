'use client';

import { useState, useMemo, useEffect } from 'react';
import { 
  Badge, 
  Button, 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@moon/ui';
import { Container } from '@/components/ui/container';
import { 
  Car, 
  Star, 
  Key, 
  Calendar, 
  Fuel, 
  Shield, 
  Users, 
  ArrowRight, 
  Check, 
  MapPin, 
  Sparkles,
  Award,
  AlertCircle,
  QrCode
} from 'lucide-react';
import { formatPrice } from '@moon/utils';

const CARS_LIST = [
  {
    model: 'Maruti Swift',
    type: 'Hatchback',
    seats: 5,
    transmission: 'Manual',
    pricePerHour: 120,
    pricePerDay: 1800,
    rating: 4.8,
    fuel: 'Petrol',
    fuelLevel: '85% tank',
    color: 'Red Metallic'
  },
  {
    model: 'Hyundai Creta',
    type: 'SUV',
    seats: 5,
    transmission: 'Automatic',
    pricePerHour: 220,
    pricePerDay: 3200,
    rating: 4.9,
    fuel: 'Diesel',
    fuelLevel: 'Full tank',
    color: 'Phantom Black'
  },
  {
    model: 'Mahindra XUV700',
    type: 'SUV (Luxury)',
    seats: 7,
    transmission: 'Automatic',
    pricePerHour: 350,
    pricePerDay: 4800,
    rating: 4.95,
    fuel: 'Diesel',
    fuelLevel: '90% tank',
    color: 'Everest White'
  },
  {
    model: 'Tata Nexon EV',
    type: 'Electric SUV',
    seats: 5,
    transmission: 'Automatic',
    pricePerHour: 250,
    pricePerDay: 3500,
    rating: 4.85,
    fuel: 'Electric',
    fuelLevel: '94% battery',
    color: 'Teal Blue'
  }
];

const PACKAGES = [
  { route: 'Delhi to Agra', distance: '230 km', estimatedCost: '₹3,500', note: 'Yamuna Expressway speedway package' },
  { route: 'Mumbai to Lonavala', distance: '85 km', estimatedCost: '₹1,500', note: 'Western Ghats weekend drive' },
  { route: 'Bengaluru to Mysore', distance: '145 km', estimatedCost: '₹2,200', note: 'Mysore Expressway outstation special' },
];

export default function CarRentalsPage() {
  const [selectedCar, setSelectedCar] = useState(CARS_LIST[0]!);
  
  // Date scheduling states
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('Delhi NCR');
  
  // Insurance option: 0 = None, 1 = Basic, 2 = Premium Zero-Dep
  const [insuranceOption, setInsuranceOption] = useState<number>(1);
  
  // Booking states
  const [bookingState, setBookingState] = useState<'idle' | 'checkout' | 'processing' | 'confirmed'>('idle');
  const [processStep, setProcessStep] = useState<number>(0);
  
  // Default values
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]!;
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]!;
    setStartDate(today);
    setEndDate(tomorrow);
  }, []);

  // Duration calculations
  const rentalDays = useMemo(() => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [startDate, endDate]);

  const durationHours = useMemo(() => {
    return rentalDays * 24;
  }, [rentalDays]);

  // Pricing calculations
  const baseCost = useMemo(() => {
    return selectedCar.pricePerDay * rentalDays;
  }, [selectedCar, rentalDays]);

  const insuranceCost = useMemo(() => {
    if (insuranceOption === 1) return 150 * rentalDays;
    if (insuranceOption === 2) return 350 * rentalDays;
    return 0;
  }, [insuranceOption, rentalDays]);

  const securityDeposit = 2000;
  
  const gstCost = useMemo(() => {
    return Math.round((baseCost + insuranceCost) * 0.18);
  }, [baseCost, insuranceCost]);

  const totalCost = useMemo(() => {
    return baseCost + insuranceCost + gstCost;
  }, [baseCost, insuranceCost, gstCost]);

  // Loading simulation step interval
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (bookingState === 'processing') {
      if (processStep < 3) {
        timeout = setTimeout(() => {
          setProcessStep(prev => prev + 1);
        }, 1200);
      } else {
        setBookingState('confirmed');
      }
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [bookingState, processStep]);

  const processTexts = [
    'Verifying active driving license credentials...',
    'Locking fleet vehicle availability schedule...',
    'Routing secure payment order to bank gateway...',
    'Generating encrypted smart keyless entry code...'
  ];

  const handleOpenCheckout = () => {
    setBookingState('checkout');
  };

  const handleStartBooking = () => {
    setProcessStep(0);
    setBookingState('processing');
  };

  const handleReset = () => {
    setBookingState('idle');
  };

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden pb-20 pt-16">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-brand-500/5 blur-[130px] -z-10" />
      <div className="absolute bottom-0 left-[10%] h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px] -z-10" />

      <Container className="max-w-6xl py-8 space-y-8">
        
        {/* Header branding */}
        <section className="space-y-4 border-b border-white/5 pb-6">
          <Badge className="bg-brand-500/10 text-brand-400 border-brand-500/20 font-bold px-3 py-1 rounded-xl">
            Self-Drive Car Station
          </Badge>
          <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
            Premium Car Rentals
          </h1>
          <p className="max-w-2xl text-base text-slate-400 sm:text-lg">
            Rent verified self-drive vehicles. Includes state-wide road trip insurance options, digital keyless unlocks, and transparent outstation packages.
          </p>
        </section>

        {/* Dynamic Simulator Pane */}
        {bookingState !== 'idle' && (
          <Card className="border-brand-500/30 bg-slate-900/40 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden border-2 animate-in zoom-in-95 duration-200">
            <CardHeader className="bg-gradient-to-r from-brand-500/10 to-blue-500/10 border-b border-white/5 p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-brand-400 animate-pulse shrink-0" />
                  <CardTitle className="text-white text-lg font-bold">
                    {bookingState === 'checkout' && 'Confirm Rental Details'}
                    {bookingState === 'processing' && 'Booking Dispatch Simulator'}
                    {bookingState === 'confirmed' && 'Vehicle Dispatch Receipt'}
                  </CardTitle>
                </div>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={handleReset}
                  className="border-white/10 text-slate-400 hover:text-white rounded-xl"
                  disabled={bookingState === 'processing'}
                >
                  Cancel
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Checkout breakdown page */}
              {bookingState === 'checkout' && (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-5">
                    <div className="bg-slate-950/60 border border-white/5 p-5 rounded-2xl space-y-4">
                      <h4 className="font-bold text-white text-sm flex items-center gap-2 border-b border-white/5 pb-2">
                        <Car className="h-5 w-5 text-brand-400" />
                        {selectedCar.model} &bull; {selectedCar.type}
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-xs text-slate-400 font-mono">
                        <div>Transmission: <span className="text-white font-bold">{selectedCar.transmission}</span></div>
                        <div>Fuel Level: <span className="text-white font-bold">{selectedCar.fuelLevel}</span></div>
                        <div>Capacity: <span className="text-white font-bold">{selectedCar.seats} Seats</span></div>
                        <div>Color: <span className="text-white font-bold">{selectedCar.color}</span></div>
                      </div>
                      <div className="pt-2 flex items-center gap-2 text-xs bg-brand-500/10 border border-brand-500/20 p-3 rounded-xl text-brand-400 font-semibold">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span>Pickup Location: CP Block C Hub, {selectedCity}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Damage Protection Plan</label>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <button
                          onClick={() => setInsuranceOption(0)}
                          className={`p-3 border rounded-xl text-left transition ${
                            insuranceOption === 0 ? 'border-brand-500 bg-brand-500/10 text-white' : 'border-white/5 bg-slate-950/40 text-slate-400'
                          }`}
                        >
                          <p className="font-bold text-xs">No Cover</p>
                          <p className="text-[9px] mt-1 text-slate-500">₹0/day</p>
                          <p className="text-[8px] mt-1 text-red-400">High liability</p>
                        </button>

                        <button
                          onClick={() => setInsuranceOption(1)}
                          className={`p-3 border rounded-xl text-left transition ${
                            insuranceOption === 1 ? 'border-brand-500 bg-brand-500/10 text-white' : 'border-white/5 bg-slate-950/40 text-slate-400'
                          }`}
                        >
                          <p className="font-bold text-xs flex items-center gap-1">
                            Basic
                            <Shield className="h-3 w-3 text-brand-400" />
                          </p>
                          <p className="text-[9px] mt-1 text-slate-500">₹150/day</p>
                          <p className="text-[8px] mt-1 text-emerald-400">Covers damage</p>
                        </button>

                        <button
                          onClick={() => setInsuranceOption(2)}
                          className={`p-3 border rounded-xl text-left transition ${
                            insuranceOption === 2 ? 'border-brand-500 bg-brand-500/10 text-white' : 'border-white/5 bg-slate-950/40 text-slate-400'
                          }`}
                        >
                          <p className="font-bold text-xs flex items-center gap-1">
                            Zero-Dep
                            <Award className="h-3 w-3 text-yellow-400" />
                          </p>
                          <p className="text-[9px] mt-1 text-slate-500">₹350/day</p>
                          <p className="text-[8px] mt-1 text-yellow-400">100% cover</p>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between space-y-6">
                    <div className="bg-slate-950/60 border border-white/5 p-5 rounded-2xl space-y-3.5 text-sm font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Duration Scheduled</span>
                        <span className="text-white font-bold">{rentalDays} Days ({durationHours} hrs)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Daily Fleet Rate</span>
                        <span className="text-white">₹{selectedCar.pricePerDay}/day</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Base Rental Fare</span>
                        <span className="text-white">{formatPrice(baseCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Damage Protection</span>
                        <span className="text-white">{formatPrice(insuranceCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Refundable Deposit</span>
                        <span className="text-white">{formatPrice(securityDeposit)}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-3">
                        <span className="text-slate-400">GST (18%)</span>
                        <span className="text-white">{formatPrice(gstCost)}</span>
                      </div>
                      <div className="flex justify-between pt-1 text-base text-white font-bold">
                        <span className="text-slate-300">Total Booking Price</span>
                        <span className="text-brand-400 font-extrabold">{formatPrice(totalCost + securityDeposit)}</span>
                      </div>
                    </div>

                    <Button 
                      onClick={handleStartBooking}
                      className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-2xl py-3.5 font-bold shadow-lg shadow-brand-500/20"
                    >
                      Confirm Payment &amp; Book
                    </Button>
                  </div>
                </div>
              )}

              {/* Processing simulator state */}
              {bookingState === 'processing' && (
                <div className="py-10 text-center space-y-6 max-w-md mx-auto">
                  <div className="relative flex justify-center items-center">
                    <div className="h-16 w-16 rounded-full border-4 border-slate-800 border-t-brand-400 animate-spin" />
                    <Key className="h-6 w-6 text-brand-400 absolute animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-white font-semibold text-sm">Synchronizing fleet nodes...</p>
                    <div className="h-1.5 w-full bg-slate-850 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-500 transition-all duration-1000" 
                        style={{ width: `${((processStep + 1) / 4) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 font-mono h-6 overflow-hidden">
                      {processTexts[processStep] || 'Finalizing telemetry...'}
                    </p>
                  </div>
                </div>
              )}

              {/* Confirmed invoice details */}
              {bookingState === 'confirmed' && (
                <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto py-4">
                  <div className="text-center space-y-4 flex flex-col justify-center items-center">
                    <div className="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                      <Check className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-white font-extrabold text-xl">Booking Confirmed!</h3>
                      <p className="text-xs text-slate-400">Your vehicle is reserved and prepped.</p>
                    </div>

                    <div className="bg-slate-950/60 border border-white/5 p-4 rounded-2xl w-full text-left space-y-2 text-xs font-mono">
                      <div className="text-brand-400 font-bold flex items-center gap-1.5 mb-1.5">
                        <Sparkles className="h-4 w-4" /> Live Dispatch Console Log
                      </div>
                      <div className="text-slate-400">&bull; [09:12] Fleet node reserved. ID: ZM-{selectedCar.model.replace(/\s+/g, '-').toUpperCase()}</div>
                      <div className="text-slate-400">&bull; [09:14] Valet verification and vacuum wash complete.</div>
                      <div className="text-emerald-400 font-semibold">&bull; [09:15] Ready for keyless Bluetooth pickup.</div>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-white/10 rounded-3xl p-6 space-y-5 text-sm font-mono relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-16 w-16 bg-brand-500/10 rounded-bl-full flex items-center justify-center">
                      <Key className="h-5 w-5 text-brand-400 mr-2 mb-2" />
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest font-sans">Digital Key Ticket</p>
                      <p className="text-lg font-bold text-white font-sans">{selectedCar.model}</p>
                      <Badge className="bg-white/5 border-white/10 text-slate-300 text-[10px] px-2">
                        ZM-BOOK-{Math.floor(100000 + Math.random() * 900000)}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-xs border-t border-white/5 pt-4">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Pickup Date</span>
                        <span className="text-white">{startDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Return Date</span>
                        <span className="text-white">{endDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Smart Unlock Code</span>
                        <span className="text-emerald-400 font-bold font-mono">KEY-{Math.floor(1000 + Math.random() * 9000)}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 pt-1 border-t border-white/5">
                        <span>Total Paid</span>
                        <span className="text-white font-bold">{formatPrice(totalCost + securityDeposit)}</span>
                      </div>
                    </div>

                    {/* Barcode scanner graphic */}
                    <div className="flex flex-col items-center justify-center pt-3 gap-2">
                      <div className="bg-white p-3 rounded-2xl flex items-center justify-center">
                        <QrCode className="h-20 w-20 text-slate-900" />
                      </div>
                      <span className="text-[10px] text-slate-500">Scan at CP Hub parking terminal to exit gate</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          
          <div className="space-y-6">
            {/* Car catalogs */}
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
              <CardHeader className="border-b border-white/5 px-6 py-5">
                <CardTitle className="text-white text-lg font-bold">Select Self-Drive Vehicle</CardTitle>
                <CardDescription className="text-slate-400">All rentals include damage protection cover waivers and roadside breakdown assistance</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {CARS_LIST.map((car) => {
                  const isSelected = selectedCar.model === car.model;
                  return (
                    <div
                      key={car.model}
                      onClick={() => setSelectedCar(car)}
                      className={`flex flex-col sm:flex-row justify-between items-start sm:items-center border rounded-2xl p-5 cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/5' 
                          : 'border-white/5 bg-slate-950/20 hover:border-white/10 hover:bg-slate-950/40'
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className="h-16 w-16 bg-slate-900/80 border border-white/5 rounded-2xl flex items-center justify-center text-brand-400 shrink-0">
                          <Car className="h-8 w-8" />
                        </div>
                        <div className="space-y-1">
                          <div className="font-bold text-white text-base flex items-center gap-2">
                            {car.model}
                            <Badge className="bg-white/5 border-none text-slate-400 text-[10px] px-1.5 py-0">
                              {car.type}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {car.seats} Seats</span>
                            <span>&bull;</span>
                            <span>{car.transmission}</span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1">
                              <Fuel className="h-3.5 w-3.5" /> {car.fuel} ({car.fuelLevel})
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-amber-500 text-xs">
                            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                            <span className="font-bold text-slate-300">{car.rating} rating</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-left sm:text-right mt-4 sm:mt-0 shrink-0 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0 w-full sm:w-auto">
                        <div className="text-xl font-extrabold text-white">₹{car.pricePerDay}/day</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">or ₹{car.pricePerHour}/hr</div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Popular packages */}
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
              <CardHeader className="border-b border-white/5 px-6 py-5">
                <CardTitle className="text-white text-lg font-bold">Popular Outstation Routes</CardTitle>
                <CardDescription className="text-slate-400">Flat rate packages including state highway toll taxes</CardDescription>
              </CardHeader>
              <CardContent className="p-6 grid gap-4 sm:grid-cols-3">
                {PACKAGES.map((pkg) => (
                  <div key={pkg.route} className="rounded-2xl border border-white/5 p-4 bg-slate-950/40 hover:border-brand-500/30 transition">
                    <div className="font-bold text-white text-sm">{pkg.route}</div>
                    <div className="text-[10px] text-slate-500 mt-1">{pkg.distance} &bull; {pkg.note}</div>
                    <div className="text-lg font-extrabold text-brand-400 mt-3">{pkg.estimatedCost}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Cost Calculator / Scheduler Sidebar */}
            <Card className="border-brand-600/30 bg-white/[0.03] backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
              <CardHeader className="border-b border-white/5 px-6 py-5">
                <CardTitle className="text-white text-lg font-bold">Booking Details</CardTitle>
                <CardDescription className="text-slate-400">Specify dates and dispatch rental orders</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pickup City</label>
                  <select 
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-2xl text-sm text-slate-200 focus:border-brand-500 focus:outline-none transition appearance-none"
                  >
                    <option value="Delhi NCR">Delhi NCR Hub</option>
                    <option value="Mumbai">Mumbai Airport Zone</option>
                    <option value="Bengaluru">Bengaluru Tech Hub</option>
                    <option value="Pune">Pune Central Hub</option>
                  </select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Start Date</label>
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-xs text-white focus:border-brand-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">End Date</label>
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-xs text-white focus:border-brand-500 outline-none"
                    />
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 space-y-3 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Selected Car</span>
                    <span className="text-white font-bold">{selectedCar.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rental Days</span>
                    <span className="text-white font-bold">{rentalDays} days ({durationHours} hrs)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Refundable Deposit</span>
                    <span className="text-white font-semibold">₹2,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total (Excl. Deposit)</span>
                    <span className="text-brand-400 font-extrabold text-sm">{formatPrice(totalCost)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleOpenCheckout}
                  disabled={bookingState !== 'idle'}
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-2xl py-3 font-bold shadow-md shadow-brand-500/10"
                >
                  Book Self-Drive Car
                </Button>
              </CardContent>
            </Card>

            {/* Safety & Compliance info */}
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-3xl shadow-2xl">
              <CardHeader className="border-b border-white/5 px-6 py-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-brand-400" />
                  <CardTitle className="text-white text-base font-bold">Rental Policies</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-3 text-xs text-slate-400">
                <div className="flex gap-2">
                  <Check className="h-4 w-4 text-brand-400 shrink-0 mt-0.5" />
                  <p>Must be at least 21 years of age with a valid LMV Driving License to rent self-drive vehicles.</p>
                </div>
                <div className="flex gap-2">
                  <Check className="h-4 w-4 text-brand-400 shrink-0 mt-0.5" />
                  <p>Speed limit capped at 120 km/hr. Over-speeding penalties are levied in accordance with national highway regulations.</p>
                </div>
                <div className="flex gap-2 text-slate-500">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>Fuel levels must match initial dispatch percentage at the time of return to avoid refueling surcharge fees.</p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </Container>
    </main>
  );
}
