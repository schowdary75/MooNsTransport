'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export function BusSearch() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
    passengers: '1',
  });
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!formData.from || !formData.to) {
      toast({
        title: 'Error',
        description: 'Please select origin and destination',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/buses/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      setResults(data.data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to search buses',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="from">From City</Label>
              <Input
                id="from"
                placeholder="e.g., Delhi"
                value={formData.from}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="to">To City</Label>
              <Input
                id="to"
                placeholder="e.g., Mumbai"
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="passengers">Passengers</Label>
              <Input
                id="passengers"
                type="number"
                min="1"
                max="9"
                value={formData.passengers}
                onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
              />
            </div>
          </div>

          <Button onClick={handleSearch} disabled={isLoading} className="w-full" size="lg">
            {isLoading ? 'Searching...' : 'Search Buses'}
          </Button>
        </div>
      </Card>

      {results.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Available Buses ({results.length})</h3>
          {results.map((bus, idx) => (
            <BusCard key={idx} bus={bus} />
          ))}
        </div>
      )}
    </div>
  );
}

function BusCard({ bus }: { bus: any }) {
  return (
    <Card className="p-4 hover:bg-gray-50 cursor-pointer transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-semibold">{bus.operator}</div>
          <div className="text-sm text-gray-600">{bus.type} • {bus.seats} seats</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">₹{bus.fare}</div>
          <div className="text-sm text-green-600">{bus.availableSeats} left</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <div className="text-gray-600">Departs</div>
          <div className="font-semibold">{bus.departure}</div>
        </div>
        <div>
          <div className="text-gray-600">Arrives</div>
          <div className="font-semibold">{bus.arrival}</div>
        </div>
      </div>

      <Button className="w-full" size="sm">
        View & Book
      </Button>
    </Card>
  );
}
