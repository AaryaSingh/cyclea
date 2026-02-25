import { useState, useEffect } from 'react';
import { Calendar } from './ui/calendar';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { AlertCircle, Calendar as CalendarIcon, Droplet } from 'lucide-react';
import { format, isSameDay } from 'date-fns';

export interface PeriodData {
  lastPeriodStart: string;
  averageCycleLength: number;
  periodLength: number;
  isIrregular?: boolean;
  cycleVariability?: string;
  periodDays?: string[]; // Array of ISO date strings for selected period days
}

interface PeriodTrackerProps {
  onClose: () => void;
  onSave: (data: PeriodData) => void;
  existingData?: PeriodData | null;
}

export function PeriodTracker({ onClose, onSave, existingData }: PeriodTrackerProps) {
  const [selectedPeriodDays, setSelectedPeriodDays] = useState<Date[]>(
    existingData?.periodDays?.map(d => new Date(d)) ?? []
  );
  const [averageCycleLength, setAverageCycleLength] = useState<number>(
    existingData?.averageCycleLength ?? 28
  );
  const [isIrregular, setIsIrregular] = useState<boolean>(
    existingData?.isIrregular ?? false
  );

  const [showLateNotification, setShowLateNotification] = useState(false);

  // Calculate period stats from selected days
  const getLastPeriodStart = () => {
    if (selectedPeriodDays.length === 0) return null;
    // Sort dates and return the earliest
    const sorted = [...selectedPeriodDays].sort((a, b) => a.getTime() - b.getTime());
    return sorted[0];
  };

  const getPeriodLength = () => {
    if (selectedPeriodDays.length === 0) return 0;
    // Find consecutive days to calculate actual period length
    const sorted = [...selectedPeriodDays].sort((a, b) => a.getTime() - b.getTime());
    return sorted.length;
  };

  useEffect(() => {
    const lastPeriodStart = getLastPeriodStart();
    if (lastPeriodStart) {
      const today = new Date();
      const daysSinceLastPeriod = Math.floor(
        (today.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      // Show notification if period is late by 7+ days beyond average cycle
      const expectedCycleEnd = averageCycleLength + 7;
      if (daysSinceLastPeriod >= expectedCycleEnd) {
        setShowLateNotification(true);
      } else {
        setShowLateNotification(false);
      }
    } else {
      setShowLateNotification(false);
    }
  }, [selectedPeriodDays, averageCycleLength]);

  const handleDayClick = (day: Date | undefined) => {
    if (!day) return;
    
    // Don't allow future dates
    if (day > new Date()) return;

    // Check if day is already selected
    const isSelected = selectedPeriodDays.some(d => isSameDay(d, day));
    
    if (isSelected) {
      // Remove the day
      setSelectedPeriodDays(prev => prev.filter(d => !isSameDay(d, day)));
    } else {
      // Add the day
      setSelectedPeriodDays(prev => [...prev, day]);
    }
  };

  const handleSave = () => {
    const lastPeriodStart = getLastPeriodStart();
    if (!lastPeriodStart) {
      return;
    }

    onSave({
      lastPeriodStart: lastPeriodStart.toISOString(),
      averageCycleLength,
      periodLength: getPeriodLength(),
      isIrregular,
      periodDays: selectedPeriodDays.map(d => d.toISOString()),
    });
  };

  const getDaysSinceLastPeriod = () => {
    const lastPeriodStart = getLastPeriodStart();
    if (!lastPeriodStart) return null;
    const today = new Date();
    return Math.floor((today.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24));
  };

  const daysSince = getDaysSinceLastPeriod();
  const lastPeriodStart = getLastPeriodStart();
  const periodLength = getPeriodLength();

  // Custom day content to show selected period days
  const modifiers = {
    selected: selectedPeriodDays,
  };

  const modifiersClassNames = {
    selected: 'bg-[#F487B6] text-white hover:bg-[#F487B6] hover:text-white',
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 my-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {existingData ? 'Edit Period Data' : 'Period Tracker'}
          </h2>
          <p className="text-gray-600 mt-1">Select all your period days to track your cycle</p>
        </div>

        {/* Late Period Notification */}
        {showLateNotification && (
          <Card className="mb-6 border-2 border-[#F487B6] bg-[#FFF0F5]">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#F487B6] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Period May Be Late</p>
                  <p className="text-sm text-gray-700 mt-1">
                    Based on your average cycle of {averageCycleLength} days, you're {daysSince! - averageCycleLength} days late. 
                    This could be normal variation, but consider taking a pregnancy test or consulting your healthcare provider if concerned.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {/* Period Days Selection */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base">Select Your Period Days</Label>
                <Badge variant="outline" className="gap-1">
                  <Droplet className="w-3 h-3" />
                  {selectedPeriodDays.length} day{selectedPeriodDays.length !== 1 ? 's' : ''} selected
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Click on the calendar to select/deselect days when you had your period
              </p>

              {/* Inline Calendar */}
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={undefined}
                  onSelect={handleDayClick}
                  disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                  modifiers={modifiers}
                  modifiersClassNames={modifiersClassNames}
                  className="rounded-md border"
                />
              </div>
              
              {selectedPeriodDays.length > 0 && (
                <div className="mt-4 p-4 bg-pink-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Period started:</p>
                      <p className="font-semibold text-gray-900">
                        {lastPeriodStart && format(lastPeriodStart, 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Period length:</p>
                      <p className="font-semibold text-gray-900">
                        {periodLength} day{periodLength !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {daysSince !== null && (
                <div className="mt-3 flex items-center justify-center gap-2">
                  <Badge className="bg-[#69C9C0] text-white">
                    Day {daysSince + 1} of cycle
                  </Badge>
                  {daysSince >= averageCycleLength && (
                    <Badge className="bg-amber-100 text-amber-800">
                      Cycle longer than average
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cycle Information */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label className="text-base mb-3 block">Average Cycle Length (days)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    min="21"
                    max="45"
                    value={averageCycleLength}
                    onChange={(e) => setAverageCycleLength(parseInt(e.target.value) || 28)}
                    className="max-w-[120px]"
                  />
                  <span className="text-sm text-gray-600">Typical range: 21-35 days</span>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isIrregular}
                    onChange={(e) => setIsIrregular(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm">My cycles are irregular (vary by more than 7-9 days)</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Expected Next Period */}
          {lastPeriodStart && !isIrregular && (
            <Card className="border-2 border-[#69C9C0]/30 bg-gradient-to-br from-[#69C9C0]/10 to-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-[#69C9C0] mt-0.5" />
                  <div>
                    <Label className="text-base">Expected Next Period</Label>
                    <p className="text-sm text-gray-700 mt-1">
                      {(() => {
                        const nextPeriod = new Date(lastPeriodStart);
                        nextPeriod.setDate(nextPeriod.getDate() + averageCycleLength);
                        const daysUntil = Math.ceil((nextPeriod.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                        
                        if (daysUntil < 0) {
                          return `Expected around ${format(nextPeriod, 'MMM d, yyyy')} (may be late)`;
                        } else if (daysUntil === 0) {
                          return `Expected today`;
                        } else if (daysUntil === 1) {
                          return `Expected tomorrow (${format(nextPeriod, 'MMM d')})`;
                        } else {
                          return `Expected in ${daysUntil} days (${format(nextPeriod, 'MMM d, yyyy')})`;
                        }
                      })()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={selectedPeriodDays.length === 0}
            className="flex-1 bg-[#F487B6] hover:bg-[#F487B6]/90"
          >
            Save Period Data
          </Button>
        </div>
      </div>
    </div>
  );
}
