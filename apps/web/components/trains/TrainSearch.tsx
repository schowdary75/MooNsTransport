'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const CLASSES = [
  { id: 'sl', label: 'Sleeper (SL)' },
  { id: '3a', label: '3A' },
  { id: '2a', label: '2A' },
  { id: '1a', label: '1A' },
  { id: 'cc', label: 'Chair Car (CC)' },
];

export function TrainSearch() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
    class: '3a',
    passengers: '1',
  });
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!formData.from || !formData.to) {
      toast({
        title: 'Error',
        description: 'Please select from and to stations',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/trains/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      setResults(data.data || []);

      if (!data.data || data.data.length === 0) {
        toast({
          title: 'No trains found',
          description: 'Try adjusting your search',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to search trains',
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
              <Label htmlFor="from">From Station</Label>
              <Input
                id="from"
                placeholder="e.g., Delhi Central"
                value={formData.from}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="to">To Station</Label>
              <Input
                id="to"
                placeholder="e.g., Mumbai Central"
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
              <Label htmlFor="class">Class</Label>
              <Select value={formData.class} onValueChange={(value) => setFormData({ ...formData, class: value })}>
                <SelectTrigger id="class">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLASSES.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleSearch} disabled={isLoading} className="w-full" size="lg">
            {isLoading ? 'Searching...' : 'Search Trains'}
          </Button>
        </div>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Available Trains</h3>
          {results.map((train, idx) => (
            <TrainCard key={idx} train={train} />
          ))}
        </div>
      )}
    </div>
  );
}

function TrainCard({ train }: { train: any }) {
  return (
    <Card className="p-4 hover:bg-gray-50 cursor-pointer transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-semibold">{train.trainName}</div>
          <div className="text-sm text-gray-600">Train #{train.trainNumber}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">₹{train.fare}</div>
          <div className="text-sm text-green-600 font-medium">Seats: {train.seats}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-600">Departs</div>
          <div className="font-semibold">{train.departure}</div>
        </div>
        <div>
          <div className="text-gray-600">Arrives</div>
          <div className="font-semibold">{train.arrival}</div>
        </div>
      </div>

      <Button className="w-full mt-4" size="sm">
        Select & Book
      </Button>
    </Card>
  );
}
