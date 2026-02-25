import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Clock, Scale, X } from 'lucide-react';

interface FoodDetailsModalProps {
  foodName: string;
  onConfirm: (time: string, amount: string) => void;
  onCancel: () => void;
}

export function FoodDetailsModal({ foodName, onConfirm, onCancel }: FoodDetailsModalProps) {
  const [time, setTime] = useState('');
  const [amount, setAmount] = useState('');

  // Set default time to now
  useEffect(() => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    setTime(timeString);
  }, []);

  const handleConfirm = () => {
    onConfirm(time, amount);
  };

  const portionSuggestions = [
    '1 cup',
    '1/2 cup',
    '1 plate',
    'Small portion',
    'Medium portion',
    'Large portion',
    '1 serving',
    '2 servings',
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Add Food Details</h3>
            <Button onClick={onCancel} variant="ghost" size="icon">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="bg-[#FFF0F5] p-3 rounded-lg">
            <p className="font-semibold text-gray-900">{foodName}</p>
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700">
              <Clock className="w-4 h-4" />
              Time Consumed
            </Label>
            <Input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g., 8:30 AM"
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              This helps correlate symptoms with when you ate
            </p>
          </div>

          {/* Amount/Portion */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700">
              <Scale className="w-4 h-4" />
              Portion Size (optional)
            </Label>
            <Input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 1 cup, small portion"
              className="w-full"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {portionSuggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  onClick={() => setAmount(suggestion)}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-[#F487B6] hover:bg-[#F487B6]/90"
            >
              Add Food
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
