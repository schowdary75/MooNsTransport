'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@moon/ui';
import { Search, Utensils, Clock, Star, Landmark, ArrowRight, ExternalLink, X, Plus, ShoppingBag } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTimeMins: number;
  costForTwo: number;
  famousFor: string;
  image: string;
  zomatoLink: string;
  swiggyLink: string;
}

export default function FoodDeliveryPage() {
  const [query, setQuery] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Menu Modal / Cart simulation state
  const [selectedRestForMenu, setSelectedRestForMenu] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<Array<{ name: string; price: number; quantity: number }>>([]);

  const fetchRestaurants = async (searchQuery = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/food/search?query=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setRestaurants(data.data || []);
      }
    } catch (e) {
      console.error('Error fetching food delivery options:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRestaurants(query);
  };

  const addToCart = (itemName: string, price: number) => {
    const existing = cart.find((item) => item.name === itemName);
    if (existing) {
      setCart(cart.map((item) => item.name === itemName ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { name: itemName, price, quantity: 1 }]);
    }
    toast({
      title: 'Item Added',
      description: `${itemName} added to your transit food basket.`,
    });
  };

  const checkoutCart = () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    alert(`Order Confirmed! Your hot food is scheduled for delivery at your next stop. Total Bill: ₹${total}`);
    setCart([]);
    setSelectedRestForMenu(null);
  };

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden pb-16 pt-16">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-brand-500/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-[10%] h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-[100px] -z-10" />

      <Container className="py-8 max-w-6xl space-y-8 pt-24">
        {/* Header Section */}
        <div className="space-y-4 border-b border-white/5 pb-6">
          <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 font-bold px-3 py-1 rounded-xl">
            Hot Food Transit Delivery
          </Badge>
          <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
            Food Delivery On-The-Go.
          </h1>
          <p className="max-w-2xl text-base text-slate-400 sm:text-lg">
            Order fresh meals to your transit stops, metro platforms, or coordinates. Instantly compare Swiggy & Zomato link APIs.
          </p>
        </div>

        {/* Search & Platforms Column layout */}
        <div className="grid gap-6 md:grid-cols-[1fr_0.4fr]">
          <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2rem] p-6">
            <CardContent className="p-0">
              <form onSubmit={handleSearchSubmit} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-500" />
                  <input
                    placeholder="Search Biryani, Dosa, Burgers, or Restaurant..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/5 rounded-2xl text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/25 outline-none transition"
                  />
                </div>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl px-6 font-bold">
                  Search
                </Button>
              </form>

              {/* Quick cuisine options */}
              <div className="mt-4 flex flex-wrap gap-2 items-center text-xs">
                <span className="text-slate-400 font-semibold">Quick Cuisines:</span>
                {['Biryani', 'South Indian', 'North Indian', 'Street Food', 'Momo'].map((cuisine) => (
                  <button
                    key={cuisine}
                    onClick={() => {
                      setQuery(cuisine);
                      fetchRestaurants(cuisine);
                    }}
                    className="rounded-full bg-white/[0.04] border border-white/5 hover:bg-white/10 text-slate-300 px-3 py-1 font-semibold transition"
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2rem] p-5 flex flex-col justify-between">
            <CardContent className="p-0 space-y-3">
              <h3 className="font-bold text-white flex items-center gap-2 text-base">
                <Utensils className="h-5 w-5 text-orange-400" />
                Partner Portals
              </h3>
              <p className="text-[10px] text-slate-400">Directly redirect checkout order nodes to Indian delivery portals.</p>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a href="https://www.zomato.com" target="_blank" rel="noopener noreferrer" className="block text-center bg-[#cb202d] hover:bg-[#b01c27] text-white py-3 rounded-xl font-bold text-xs shadow-sm transition">
                  Zomato
                </a>
                <a href="https://www.swiggy.com" target="_blank" rel="noopener noreferrer" className="block text-center bg-[#fc8019] hover:bg-[#e06f12] text-white py-3 rounded-xl font-bold text-xs shadow-sm transition">
                  Swiggy
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Nearby Restaurants Grid */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white text-left">Nearby Transit-Friendly Kitchens</h3>
          {loading ? (
            <div className="py-16 text-center text-slate-400 font-medium animate-pulse flex flex-col items-center justify-center gap-3">
              <Clock className="h-6 w-6 text-orange-400 animate-spin" />
              <span>Scanning kitchens near coordinates...</span>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="py-16 text-center text-slate-400 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
              <p className="font-semibold text-white">No food establishments matched your query.</p>
              <button onClick={() => { setQuery(''); fetchRestaurants(); }} className="text-orange-400 underline font-semibold text-xs mt-1.5">Reset filters</button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {restaurants.map((r) => (
                <Card 
                  key={r.id} 
                  className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-3xl overflow-hidden group hover:border-orange-500/30 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="h-44 w-full relative overflow-hidden bg-slate-900 shadow-inner">
                      <Image
                        src={r.image}
                        alt={r.name}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-500 opacity-80"
                      />
                      <div className="absolute top-3 right-3 bg-slate-950/90 backdrop-blur-sm rounded-xl px-2.5 py-1 flex items-center gap-1 shadow-sm text-xs font-bold text-white">
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        {r.rating}
                      </div>
                    </div>
                    
                    <div className="p-5 space-y-2 text-left">
                      <h4 className="font-extrabold text-white text-base leading-tight">{r.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{r.cuisine}</p>
                      
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-slate-500" />
                          {r.deliveryTimeMins} mins
                        </span>
                        <span>•</span>
                        <span>₹{r.costForTwo} for two</span>
                      </div>
                      
                      <div className="bg-slate-950/40 rounded-xl p-3 text-[11px] text-slate-400 border border-white/5 font-medium italic mt-3">
                        Signature: "{r.famousFor}"
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 mt-auto flex gap-2">
                    <Button 
                      onClick={() => setSelectedRestForMenu(r)}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold py-2 px-3"
                    >
                      View Menu & Order
                    </Button>
                    <a href={r.zomatoLink} target="_blank" rel="noopener noreferrer" className="shrink-0 flex items-center justify-center p-2 rounded-xl border border-white/10 hover:bg-white/5 transition text-slate-400 hover:text-white">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Container>

      {/* Menu / Order drawer Modal */}
      {selectedRestForMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-opacity">
          <Card className="w-full max-w-lg border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="relative border-b border-white/5 pb-5">
              <button 
                onClick={() => { setSelectedRestForMenu(null); setCart([]); }} 
                className="absolute right-6 top-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-xl font-extrabold text-white mt-2">{selectedRestForMenu.name}</h3>
              <p className="text-xs text-slate-400 mt-1 font-semibold">{selectedRestForMenu.cuisine} · ★ {selectedRestForMenu.rating}</p>
            </CardHeader>
            <CardContent className="p-6 space-y-6 text-sm">
              
              {/* Menu items list */}
              <div className="space-y-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">Popular Dishes Menu</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {[
                    { name: 'Special Masala Dosa', price: 120, desc: 'Served with signature coconut chutney & piping hot sambar.' },
                    { name: 'Paneer Tikka Roll', price: 160, desc: 'Grilled cottage cheese wrapped in fresh flatbread with mint sauce.' },
                    { name: 'Dum Claypot Biryani', price: 240, desc: 'Aromatic long grain basmati rice layered with mild spices & herbs.' },
                    { name: 'Tandoori Garlic Naan', price: 60, desc: 'Soft leavened flatbread topped with minced garlic cloves.' },
                  ].map((item) => (
                    <div key={item.name} className="flex justify-between items-start border border-white/5 rounded-2xl p-4 bg-slate-950/30 hover:bg-white/5 transition text-left">
                      <div className="space-y-1">
                        <p className="font-bold text-white text-xs">{item.name}</p>
                        <p className="text-[10px] text-slate-400 leading-relaxed max-w-[260px]">{item.desc}</p>
                        <p className="text-xs font-extrabold text-orange-400 mt-1">₹{item.price}</p>
                      </div>
                      <Button
                        onClick={() => addToCart(item.name, item.price)}
                        className="bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold py-1.5 px-3 border border-white/10 flex items-center gap-1 shrink-0"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Basket list summary */}
              {cart.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-white/5 animate-in fade-in duration-200">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <ShoppingBag className="h-4 w-4 text-orange-400" />
                    Delivery Cart Basket
                  </h4>
                  
                  <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-4 space-y-2 text-xs">
                    {cart.map((item) => (
                      <div key={item.name} className="flex justify-between text-slate-300 font-medium">
                        <span>{item.name} (x{item.quantity})</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-white font-bold text-sm border-t border-white/5 pt-3">
                      <span>Grand Total Bill</span>
                      <span className="text-orange-400">₹{cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={checkoutCart}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-2xl py-3 font-bold shadow-lg shadow-orange-500/20"
                  >
                    Confirm Transit Station Delivery
                  </Button>
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
