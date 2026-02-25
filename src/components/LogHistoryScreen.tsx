import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { CheckInData } from './DailyCheckIn';
import { Badge } from './ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Droplets, AlertCircle, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export interface FoodEntry {
  name: string;
  time: string;
  category: string;
}

interface LogHistoryScreenProps {
  onBack: () => void;
  checkIns: CheckInData[];
  foodEntries?: FoodEntry[];
  onSelectDate?: (date: Date) => void;
  periodData?: any;
}

export function LogHistoryScreen({ onBack, checkIns, periodData, onSelectDate }: LogHistoryScreenProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get check-in for a specific date
  const getCheckInForDate = (date: Date) => {
    return checkIns.find((checkIn) => {
      const checkInDate = new Date(checkIn.timestamp);
      return (
        checkInDate.getDate() === date.getDate() &&
        checkInDate.getMonth() === date.getMonth() &&
        checkInDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Check if date has period bleeding
  const hasBleedingOnDate = (date: Date) => {
    const checkIn = getCheckInForDate(date);
    return checkIn?.bleeding?.type && checkIn.bleeding.type !== 'none';
  };

  // Get cycle phase for a date
  const getCyclePhase = (date: Date) => {
    if (!periodData?.lastPeriodStart) return null;
    
    const lastPeriodStart = new Date(periodData.lastPeriodStart);
    const daysSinceLastPeriod = Math.floor((date.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24));
    const cycleDay = ((daysSinceLastPeriod % (periodData.averageCycleLength || 28)) + 1);
    
    if (cycleDay >= 1 && cycleDay <= 5) return 'menstrual';
    if (cycleDay >= 6 && cycleDay <= 13) return 'follicular';
    if (cycleDay >= 14 && cycleDay <= 16) return 'ovulation';
    if (cycleDay >= 17) return 'luteal';
    
    return null;
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    if (onSelectDate) {
      onSelectDate(date);
    }
  };

  const selectedCheckIn = selectedDate ? getCheckInForDate(selectedDate) : null;

  return (
    <div className="min-h-screen bg-[#FFF0F5] pb-20">
      <div className="bg-gradient-to-r from-[#F487B6] to-[#FFC0D3] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <Button onClick={onBack} variant="ghost" className="text-white hover:bg-white/10 mb-4">
            ← Back
          </Button>
          <h1 className="text-white mb-2">Check-In History</h1>
          <p className="text-white/80">{checkIns.length} entries logged</p>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Calendar Card */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <Button onClick={goToPreviousMonth} variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-lg font-semibold">{monthYear}</h2>
              <Button onClick={goToNextMonth} variant="outline" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {calendarDays.map((date, idx) => {
                if (!date) {
                  return <div key={`empty-${idx}`} className="aspect-square" />;
                }

                const checkIn = getCheckInForDate(date);
                const hasBleeding = hasBleedingOnDate(date);
                const cyclePhase = getCyclePhase(date);
                const isToday =
                  date.toDateString() === new Date().toDateString();
                const isSelected =
                  selectedDate?.toDateString() === date.toDateString();

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => handleDateClick(date)}
                    className={`aspect-square p-1 rounded-lg border-2 transition-all relative ${
                      isSelected
                        ? 'border-[#F487B6] bg-[#FFF0F5]'
                        : isToday
                        ? 'border-[#69C9C0] bg-[#69C9C0]/10'
                        : checkIn
                        ? 'border-gray-200 bg-white hover:border-gray-300'
                        : 'border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-sm font-medium">{date.getDate()}</div>
                    
                    {/* Indicators */}
                    <div className="flex flex-wrap gap-0.5 justify-center mt-1">
                      {hasBleeding && (
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" title="Period" />
                      )}
                      {checkIn && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#69C9C0]" title="Check-in logged" />
                      )}
                      {cyclePhase === 'ovulation' && !hasBleeding && (
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400" title="Ovulation" />
                      )}
                    </div>

                    {/* Cycle phase background */}
                    {cyclePhase && !hasBleeding && (
                      <div
                        className={`absolute inset-0 rounded-lg opacity-10 pointer-events-none ${
                          cyclePhase === 'follicular'
                            ? 'bg-blue-300'
                            : cyclePhase === 'ovulation'
                            ? 'bg-purple-300'
                            : cyclePhase === 'luteal'
                            ? 'bg-yellow-300'
                            : ''
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>Period</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#69C9C0]" />
                <span>Check-in</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-400" />
                <span>Ovulation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-[#69C9C0]" />
                <span>Today</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Details */}
        {selectedDate && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h3>
                {getCyclePhase(selectedDate) && (
                  <Badge className="capitalize">
                    {getCyclePhase(selectedDate)} Phase
                  </Badge>
                )}
              </div>

              {selectedCheckIn ? (
                <div className="space-y-4">
                  {/* Pain */}
                  {selectedCheckIn.pain !== undefined && (
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm text-gray-600">Pain Level</span>
                      <Badge variant="outline">{selectedCheckIn.pain}/10</Badge>
                    </div>
                  )}

                  {/* Energy */}
                  {selectedCheckIn.energy !== undefined && (
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm text-gray-600">Energy</span>
                      <Badge variant="outline">{selectedCheckIn.energy}%</Badge>
                    </div>
                  )}

                  {/* Mood */}
                  {selectedCheckIn.mood !== undefined && (
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm text-gray-600">Mood</span>
                      <Badge variant="outline">
                        {['Very Low', 'Low', 'Okay', 'Good', 'Great'][selectedCheckIn.mood]}
                      </Badge>
                    </div>
                  )}

                  {/* Bleeding */}
                  {selectedCheckIn.bleeding?.type && selectedCheckIn.bleeding.type !== 'none' && (
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-red-500" />
                        Bleeding
                      </span>
                      <Badge className="bg-red-100 text-red-800 capitalize">
                        {selectedCheckIn.bleeding.type}
                      </Badge>
                    </div>
                  )}

                  {/* Discharge */}
                  {selectedCheckIn.discharge && selectedCheckIn.discharge !== 'none' && (
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm text-gray-600">Discharge</span>
                      <Badge variant="outline" className="capitalize">
                        {typeof selectedCheckIn.discharge === 'string' 
                          ? selectedCheckIn.discharge 
                          : selectedCheckIn.discharge.present ? 'Present' : 'None'}
                      </Badge>
                    </div>
                  )}

                  {/* Bloating */}
                  {selectedCheckIn.bloating && selectedCheckIn.bloating !== 'none' && (
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm text-gray-600">Bloating</span>
                      <Badge variant="outline" className="capitalize">
                        {selectedCheckIn.bloating}
                      </Badge>
                    </div>
                  )}

                  {/* Bowel Movements */}
                  {selectedCheckIn.bowelMovement?.frequency !== undefined && (
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm text-gray-600">Bowel Movements</span>
                      <Badge variant="outline">
                        {selectedCheckIn.bowelMovement.frequency}x
                        {selectedCheckIn.bowelMovement.bristol && ` (Type ${selectedCheckIn.bowelMovement.bristol})`}
                      </Badge>
                    </div>
                  )}

                  {/* Sleep */}
                  {selectedCheckIn.sleepHours !== undefined && (
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm text-gray-600">Sleep</span>
                      <Badge variant="outline">
                        {selectedCheckIn.sleepHours}h 
                        {selectedCheckIn.sleepQuality && ` (${selectedCheckIn.sleepQuality}/10)`}
                      </Badge>
                    </div>
                  )}

                  {/* Exercise */}
                  {selectedCheckIn.exerciseMinutes !== undefined && selectedCheckIn.exerciseMinutes > 0 && (
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm text-gray-600">Exercise</span>
                      <Badge variant="outline">{selectedCheckIn.exerciseMinutes} min</Badge>
                    </div>
                  )}

                  {/* Period Symptoms */}
                  {selectedCheckIn.periodSymptoms && selectedCheckIn.periodSymptoms.length > 0 && (
                    <div className="py-2 border-b">
                      <span className="text-sm text-gray-600 block mb-2">Period Symptoms</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedCheckIn.periodSymptoms.map((symptom) => (
                          <Badge key={symptom} variant="outline" className="text-xs">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clinical Alerts */}
                  {(selectedCheckIn.pain >= 7 || 
                    selectedCheckIn.bowelMovement?.hasBlood || 
                    selectedCheckIn.bleeding?.type === 'very-heavy') && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-amber-900">Clinical Note</p>
                          <p className="text-xs text-amber-800 mt-1">
                            Severe symptoms logged. Consider discussing with your healthcare provider.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No check-in logged for this date</p>
                  <Button 
                    onClick={() => onSelectDate && onSelectDate(selectedDate)}
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                  >
                    Add Check-In
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Monthly Summary Stats */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#F487B6]" />
              Monthly Overview
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-[#FFF0F5] rounded-lg">
                <div className="text-2xl font-bold text-[#F487B6]">
                  {checkIns.filter((ci) => {
                    const date = new Date(ci.timestamp);
                    return (
                      date.getMonth() === currentMonth.getMonth() &&
                      date.getFullYear() === currentMonth.getFullYear()
                    );
                  }).length}
                </div>
                <div className="text-xs text-gray-600 mt-1">Check-ins</div>
              </div>

              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {checkIns.filter((ci) => {
                    const date = new Date(ci.timestamp);
                    return (
                      date.getMonth() === currentMonth.getMonth() &&
                      date.getFullYear() === currentMonth.getFullYear() &&
                      ci.bleeding?.type && ci.bleeding.type !== 'none'
                    );
                  }).length}
                </div>
                <div className="text-xs text-gray-600 mt-1">Period Days</div>
              </div>

              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {(() => {
                    const monthCheckIns = checkIns.filter((ci) => {
                      const date = new Date(ci.timestamp);
                      return (
                        date.getMonth() === currentMonth.getMonth() &&
                        date.getFullYear() === currentMonth.getFullYear() &&
                        ci.pain !== undefined
                      );
                    });
                    if (monthCheckIns.length === 0) return '0';
                    const avgPain = monthCheckIns.reduce((sum, ci) => sum + (ci.pain || 0), 0) / monthCheckIns.length;
                    return avgPain.toFixed(1);
                  })()}
                </div>
                <div className="text-xs text-gray-600 mt-1">Avg Pain</div>
              </div>

              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {(() => {
                    const monthCheckIns = checkIns.filter((ci) => {
                      const date = new Date(ci.timestamp);
                      return (
                        date.getMonth() === currentMonth.getMonth() &&
                        date.getFullYear() === currentMonth.getFullYear() &&
                        ci.energy !== undefined
                      );
                    });
                    if (monthCheckIns.length === 0) return '0';
                    const avgEnergy = monthCheckIns.reduce((sum, ci) => sum + (ci.energy || 0), 0) / monthCheckIns.length;
                    return Math.round(avgEnergy) + '%';
                  })()}
                </div>
                <div className="text-xs text-gray-600 mt-1">Avg Energy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}