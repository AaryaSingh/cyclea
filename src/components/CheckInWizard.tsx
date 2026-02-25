import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, ChevronRight, ChevronLeft, Apple, Heart, Droplets, Activity, Sparkles, Trophy, Moon, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';
import { CheckInData } from './DailyCheckIn';

interface CheckInWizardProps {
  categories: string[];
  onComplete: (data: CheckInData) => void;
  onCancel: () => void;
  onTrackFood: () => void;
  onTrackPeriod?: () => void;
  lastCheckIn?: CheckInData;
  isEditing?: boolean;
  isPregnant?: boolean;
  cyclePhase?: string | null;
  onXPGain?: (amount: number, reason: string) => void;
  selectedDate?: Date;
}

const STEPS = [
  { id: 'quick', title: 'Quick Check', icon: Heart, xp: 10 },
  { id: 'period', title: 'Period Tracking', icon: Calendar, xp: 10 },
  { id: 'digestive', title: 'Digestive Health', icon: Apple, xp: 10 },
  { id: 'lifestyle', title: 'Lifestyle & Wellness', icon: Moon, xp: 10 },
];

export function CheckInWizard({
  categories,
  onComplete,
  onCancel,
  onTrackFood,
  onTrackPeriod,
  lastCheckIn,
  isEditing = false,
  isPregnant = false,
  cyclePhase,
  onXPGain,
  selectedDate,
}: CheckInWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showStepReward, setShowStepReward] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date>(selectedDate || new Date());

  // Quick Check - Essential daily tracking
  const [pain, setPain] = useState<number | undefined>(lastCheckIn?.pain);
  const [painLocation, setPainLocation] = useState<string[]>(lastCheckIn?.painLocation ?? []);
  const [energy, setEnergy] = useState<number | undefined>(lastCheckIn?.energy);
  const [mood, setMood] = useState<number | undefined>(lastCheckIn?.mood);

  // Period Tracking
  const [bleedingType, setBleedingType] = useState<'none' | 'spotting' | 'light' | 'normal' | 'heavy' | 'very-heavy' | undefined>(lastCheckIn?.bleeding?.type);
  const [hasClots, setHasClots] = useState(lastCheckIn?.bleeding?.clots ?? false);
  const [discharge, setDischarge] = useState<string | undefined>(lastCheckIn?.discharge);
  const [cramps, setCramps] = useState<number | undefined>(lastCheckIn?.cramps);
  const [periodSymptoms, setPeriodSymptoms] = useState<string[]>(lastCheckIn?.periodSymptoms ?? []);
  
  // Digestive
  const [bloating, setBloating] = useState<'none' | 'low' | 'medium' | 'high' | undefined>(lastCheckIn?.bloating);
  const [bmFrequency, setBmFrequency] = useState<number | undefined>(lastCheckIn?.bowelMovement?.frequency);
  const [bristolScale, setBristolScale] = useState<number | undefined>(lastCheckIn?.bowelMovement?.bristol);
  const [hasBlood, setHasBlood] = useState(lastCheckIn?.bowelMovement?.hasBlood ?? false);
  const [hasMucus, setHasMucus] = useState(lastCheckIn?.bowelMovement?.hasMucus ?? false);
  const [nausea, setNausea] = useState<number | undefined>(lastCheckIn?.nausea);
  const [appetite, setAppetite] = useState<'increased' | 'normal' | 'decreased' | 'none' | undefined>(lastCheckIn?.appetite);
  
  // Lifestyle & Wellness
  const [sleepQuality, setSleepQuality] = useState<number | undefined>(lastCheckIn?.sleepQuality);
  const [sleepHours, setSleepHours] = useState<number | undefined>(lastCheckIn?.sleepHours);
  const [stress, setStress] = useState<number | undefined>(lastCheckIn?.stressLevel);
  const [exerciseMinutes, setExerciseMinutes] = useState(lastCheckIn?.exerciseMinutes ?? 0);
  const [waterIntake, setWaterIntake] = useState(lastCheckIn?.waterIntake ?? 4);

  // Advanced diagnostic fields (optional, shown conditionally)
  const [painQuality, setPainQuality] = useState<string[]>(lastCheckIn?.painQuality ?? []);
  const [painTriggers, setPainTriggers] = useState<string[]>(lastCheckIn?.painTriggers ?? []);
  const [mentalClarity, setMentalClarity] = useState<number | undefined>(lastCheckIn?.mentalClarity);
  const [urinaryFrequency, setUrinaryFrequency] = useState<string | undefined>(lastCheckIn?.urinarySymptoms?.frequency);
  const [urinaryUrgency, setUrinaryUrgency] = useState(lastCheckIn?.urinarySymptoms?.urgency ?? false);
  const [urinaryPain, setUrinaryPain] = useState(lastCheckIn?.urinarySymptoms?.pain ?? false);
  const [painWithSex, setPainWithSex] = useState(lastCheckIn?.urinarySymptoms?.painDuringSex ?? false);
  
  // Rome IV, EHP-30, MEDI-Q, PCOSQ
  const [painRelatedToDefecation, setPainRelatedToDefecation] = useState<'better' | 'worse' | 'no-change' | 'none' | undefined>(lastCheckIn?.painRelatedToDefecation);
  const [painWithFrequencyChange, setPainWithFrequencyChange] = useState(lastCheckIn?.painWithFrequencyChange ?? false);
  const [painWithFormChange, setPainWithFormChange] = useState(lastCheckIn?.painWithFormChange ?? false);
  const [rectalStabbingPain, setRectalStabbingPain] = useState<'never' | 'rarely' | 'sometimes' | 'often' | 'always' | undefined>(lastCheckIn?.rectalStabbingPain);
  const [painfulBowelMovement, setPainfulBowelMovement] = useState<'never' | 'rarely' | 'sometimes' | 'often' | 'always' | undefined>(lastCheckIn?.painfulBowelMovement);
  const [wipedOutByPain, setWipedOutByPain] = useState<'never' | 'rarely' | 'sometimes' | 'often' | 'always' | undefined>(lastCheckIn?.wipedOutByPain);
  const [bloatingConcernLevel, setBloatingConcernLevel] = useState<number | undefined>(lastCheckIn?.bloatingConcernLevel);
  const [symptomFunctionalImpact, setSymptomFunctionalImpact] = useState<'none' | 'mild' | 'moderate' | 'severe' | undefined>(lastCheckIn?.symptomFunctionalImpact);

  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const currentStepData = STEPS[currentStep];

  // Validation for each step
  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Quick Check
        return pain !== undefined && energy !== undefined && mood !== undefined;
      case 1: // Period Tracking
        return bleedingType !== undefined && discharge !== undefined;
      case 2: // Digestive
        return bloating !== undefined && bmFrequency !== undefined && appetite !== undefined;
      case 3: // Lifestyle
        return sleepQuality !== undefined && stress !== undefined;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!isStepValid()) {
      return;
    }

    if (!completedSteps.has(currentStep)) {
      setCompletedSteps(new Set([...completedSteps, currentStep]));
      
      setShowStepReward(true);
      if (onXPGain) {
        onXPGain(currentStepData.xp, `Completed ${currentStepData.title}`);
      }
      
      setTimeout(() => {
        setShowStepReward(false);
        if (currentStep < STEPS.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          handleComplete();
        }
      }, 1500);
    } else {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const checkInData: CheckInData = {
      timestamp: checkInDate.toISOString(),
      pain,
      painLocation,
      painQuality,
      painTriggers,
      energy,
      sleepQuality,
      sleepHours,
      bloating,
      bowelMovement: {
        frequency: bmFrequency,
        bristol: bristolScale,
        hasBlood,
        hasMucus,
      },
      nausea,
      appetite,
      urinarySymptoms: {
        frequency: urinaryFrequency,
        urgency: urinaryUrgency,
        pain: urinaryPain,
        painDuringSex: painWithSex,
      },
      bleeding: {
        type: bleedingType,
        clots: hasClots,
      },
      discharge,
      cramps,
      periodSymptoms,
      mood,
      stressLevel: stress,
      mentalClarity,
      exerciseMinutes,
      waterIntake,
      symptoms: [],
      notes: '',
      painRelatedToDefecation,
      painWithFrequencyChange,
      painWithFormChange,
      rectalStabbingPain,
      painfulBowelMovement,
      wipedOutByPain,
      bloatingConcernLevel,
      symptomFunctionalImpact,
    };

    onComplete(checkInData);
  };

  const toggleArrayItem = (arr: string[], item: string, setter: (val: string[]) => void) => {
    if (arr.includes(item)) {
      setter(arr.filter(i => i !== item));
    } else {
      setter([...arr, item]);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#FFF0F5] to-white z-50 overflow-y-auto">
      {/* Header with Progress */}
      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <Button onClick={onCancel} variant="ghost" size="sm" className="p-2">
              <X className="w-5 h-5" />
            </Button>
            <div className="text-center flex-1">
              <p className="text-xs sm:text-sm text-gray-600">Step {currentStep + 1} of {STEPS.length}</p>
              <h2 className="text-sm sm:text-base font-semibold text-gray-900">{currentStepData.title}</h2>
            </div>
            <div className="w-10" />
          </div>
          
          {/* Progress Bar */}
          <div className="relative">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2">
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = completedSteps.has(idx);
                const isCurrent = idx === currentStep;
                
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-[#69C9C0] text-white'
                          : isCurrent
                          ? 'bg-[#F487B6] text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <Icon className="w-3 h-3 sm:w-4 sm:h-4" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="p-4 sm:p-6 pb-24 sm:pb-32"
        >
          {/* STEP 1: Quick Check - Essential Daily Tracking */}
          {currentStep === 0 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600">Track your essentials in 30 seconds</p>
              </div>

              {/* Pain Level */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-base">Pain Level</Label>
                      <Badge className="bg-[#F487B6] text-white text-lg px-4 py-1">
                        {pain ?? 0}/10
                      </Badge>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={pain ?? 0}
                      onChange={(e) => setPain(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>No pain</span>
                      <span>Worst pain</span>
                    </div>
                  </div>

                  {/* Conditional: Show location if pain > 0 */}
                  {pain !== undefined && pain > 0 && (
                    <>
                      <div>
                        <Label className="text-sm text-gray-700 mb-2">Where does it hurt?</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {['Lower abdomen', 'Upper abdomen', 'Back', 'Pelvis', 'Legs', 'Head'].map((loc) => (
                            <button
                              key={loc}
                              onClick={() => toggleArrayItem(painLocation, loc, setPainLocation)}
                              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                                painLocation.includes(loc)
                                  ? 'bg-[#F487B6] text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {loc}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <Label className="text-sm text-gray-700 mb-2">What does the pain feel like?</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {['Sharp', 'Dull', 'Cramping', 'Burning', 'Stabbing', 'Aching', 'Throbbing'].map((quality) => (
                            <button
                              key={quality}
                              onClick={() => toggleArrayItem(painQuality, quality, setPainQuality)}
                              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                                painQuality.includes(quality)
                                  ? 'bg-[#F487B6] text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {quality}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <Label className="text-sm text-gray-700 mb-2">When does the pain happen?</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {['With eating', 'Before period', 'During period', 'After body movement', 'During sex', 'Random/Constant'].map((trigger) => (
                            <button
                              key={trigger}
                              onClick={() => toggleArrayItem(painTriggers, trigger, setPainTriggers)}
                              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                                painTriggers.includes(trigger)
                                  ? 'bg-[#F487B6] text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {trigger}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Energy & Mood */}
              <Card>
                <CardContent className="p-6 space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-base">Energy Level</Label>
                      <Badge className="bg-[#69C9C0] text-white px-3 py-1">
                        {energy ?? 50}%
                      </Badge>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={energy ?? 50}
                      onChange={(e) => setEnergy(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Exhausted</span>
                      <span>Energized</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base mb-3">Overall Mood</Label>
                    <div className="grid grid-cols-5 gap-2 mt-3">
                      {[
                        { value: 0, emoji: '😢', label: 'Very Low' },
                        { value: 1, emoji: '😟', label: 'Low' },
                        { value: 2, emoji: '😐', label: 'Okay' },
                        { value: 3, emoji: '🙂', label: 'Good' },
                        { value: 4, emoji: '😊', label: 'Great' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setMood(option.value)}
                          className={`p-3 rounded-lg transition-all border-2 ${
                            mood === option.value
                              ? 'border-[#F487B6] bg-[#FFF0F5]'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl sm:text-3xl mb-1">{option.emoji}</div>
                          <div className="text-xs">{option.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* STEP 2: Period Tracking */}
          {currentStep === 1 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600">Track your cycle and symptoms</p>
              </div>

              {/* Bleeding */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label className="text-base mb-3">Bleeding Today</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                      {[
                        { value: 'none', label: 'None', color: 'bg-gray-100', textColor: 'text-gray-800' },
                        { value: 'spotting', label: 'Spotting', color: 'bg-pink-100', textColor: 'text-pink-800' },
                        { value: 'light', label: 'Light', color: 'bg-pink-200', textColor: 'text-pink-900' },
                        { value: 'normal', label: 'Normal Flow', color: 'bg-[#F487B6]', textColor: 'text-white' },
                        { value: 'heavy', label: 'Heavy', color: 'bg-red-400', textColor: 'text-white' },
                        { value: 'very-heavy', label: 'Very Heavy', color: 'bg-red-600', textColor: 'text-white' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setBleedingType(option.value as any)}
                          className={`p-3 rounded-lg text-sm transition-all border-2 ${
                            bleedingType === option.value
                              ? `${option.color} ${option.textColor} border-gray-800`
                              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Conditional: Clots checkbox if bleeding */}
                  {bleedingType && bleedingType !== 'none' && (
                    <label className="flex items-center gap-2 p-3 bg-pink-50 rounded-lg">
                      <Checkbox 
                        checked={hasClots} 
                        onCheckedChange={(checked) => setHasClots(!!checked)} 
                      />
                      <span className="text-sm">Blood clots present</span>
                    </label>
                  )}
                </CardContent>
              </Card>

              {/* Discharge */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label className="text-base mb-3">Vaginal Discharge</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                      {[
                        { value: 'none', label: 'None' },
                        { value: 'clear', label: 'Clear/White' },
                        { value: 'creamy', label: 'Creamy' },
                        { value: 'egg-white', label: 'Egg White (Fertile)', icon: '💧' },
                        { value: 'yellow', label: 'Yellow' },
                        { value: 'green', label: 'Green' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setDischarge(option.value)}
                          className={`p-2.5 rounded text-sm transition-all ${
                            discharge === option.value
                              ? 'bg-[#69C9C0] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {option.icon && <span className="mr-1">{option.icon}</span>}
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Period Symptoms */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label className="text-base mb-3">Period Symptoms (optional)</Label>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[
                        'Cramps',
                        'Breast tenderness',
                        'Headache',
                        'Fatigue',
                        'Mood swings',
                        'Acne',
                        'Back pain',
                        'Food cravings',
                      ].map((symptom) => (
                        <button
                          key={symptom}
                          onClick={() => toggleArrayItem(periodSymptoms, symptom, setPeriodSymptoms)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            periodSymptoms.includes(symptom)
                              ? 'bg-[#F487B6] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {symptom}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cramps intensity if selected */}
                  {periodSymptoms.includes('Cramps') && (
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm">Cramp Intensity</Label>
                        <Badge className="bg-[#F487B6] text-white px-3 py-1">
                          {cramps ?? 0}/10
                        </Badge>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={cramps ?? 0}
                        onChange={(e) => setCramps(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Additional Period Questions - only show if bleeding or symptoms */}
              {((bleedingType && bleedingType !== 'none') || periodSymptoms.length > 0) && (
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <Label className="text-base mb-3">Additional Questions (optional)</Label>
                    
                    {/* Rectal/pelvic pain during period */}
                    <div>
                      <Label className="text-sm text-gray-700 mb-2">
                        Stabbing pains in rectum/pelvis during period?
                      </Label>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {[
                          { value: 'never', label: 'Never' },
                          { value: 'rarely', label: 'Rarely' },
                          { value: 'sometimes', label: 'Sometimes' },
                          { value: 'often', label: 'Often' },
                          { value: 'always', label: 'Always' },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setRectalStabbingPain(option.value as any)}
                            className={`p-2 rounded text-xs transition-all border ${
                              rectalStabbingPain === option.value
                                ? 'bg-[#F487B6] text-white border-[#F487B6]'
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Painful bowel movements during period */}
                    <div>
                      <Label className="text-sm text-gray-700 mb-2">
                        Painful to pass gas/stool during period?
                      </Label>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {[
                          { value: 'never', label: 'Never' },
                          { value: 'rarely', label: 'Rarely' },
                          { value: 'sometimes', label: 'Sometimes' },
                          { value: 'often', label: 'Often' },
                          { value: 'always', label: 'Always' },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setPainfulBowelMovement(option.value as any)}
                            className={`p-2 rounded text-xs transition-all border ${
                              painfulBowelMovement === option.value
                                ? 'bg-[#F487B6] text-white border-[#F487B6]'
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Period Tracker Link */}
              {onTrackPeriod && (
                <Card className="bg-gradient-to-r from-[#F487B6]/10 to-[#C59FA8]/10 border-[#F487B6]/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 mb-2">
                          <strong>💡 Track your full cycle?</strong> Select all your period days for better insights.
                        </p>
                      </div>
                      <Button onClick={onTrackPeriod} size="sm" variant="outline" className="border-[#F487B6] text-[#F487B6]">
                        <Calendar className="w-4 h-4 mr-2" />
                        Track Period Days
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* STEP 3: Digestive Health */}
          {currentStep === 2 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600">Track gut health and digestion</p>
              </div>

              {/* Bloating & Nausea */}
              <Card>
                <CardContent className="p-6 space-y-5">
                  <div>
                    <Label className="text-base mb-3">Bloating Level</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                      {[
                        { value: 'none', label: 'None', emoji: '😊' },
                        { value: 'low', label: 'Mild', emoji: '😐' },
                        { value: 'medium', label: 'Moderate', emoji: '😣' },
                        { value: 'high', label: 'Severe', emoji: '😫' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setBloating(option.value as any)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            bloating === option.value
                              ? 'border-[#F487B6] bg-[#FFF0F5]'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">{option.emoji}</div>
                          <div className="text-xs font-medium">{option.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-base">Nausea Level</Label>
                      <Badge className="bg-[#F487B6] text-white px-3 py-1">
                        {nausea ?? 0}/10
                      </Badge>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={nausea ?? 0}
                      onChange={(e) => setNausea(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Bowel Movements */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label className="text-base mb-3">Bowel Movements Today</Label>
                    <div className="flex items-center justify-center gap-4 mt-3">
                      <Button
                        onClick={() => setBmFrequency(Math.max(0, (bmFrequency ?? 0) - 1))}
                        variant="outline"
                        size="lg"
                        className="w-12 h-12"
                      >
                        -
                      </Button>
                      <Badge className="bg-[#F487B6] text-white text-2xl px-8 py-3">
                        {bmFrequency ?? 0}
                      </Badge>
                      <Button
                        onClick={() => setBmFrequency((bmFrequency ?? 0) + 1)}
                        variant="outline"
                        size="lg"
                        className="w-12 h-12"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Conditional: Show Bristol Scale if BM > 0 */}
                  {bmFrequency !== undefined && bmFrequency > 0 && (
                    <div className="pt-4 border-t">
                      <Label className="text-sm text-gray-700 mb-2">Stool Type (Bristol Scale)</Label>
                      <div className="space-y-2 mt-3">
                        {[
                          { num: 1, desc: 'Hard lumps', icon: '●●●' },
                          { num: 2, desc: 'Lumpy sausage', icon: '●—●' },
                          { num: 3, desc: 'Cracked sausage', icon: '—||—' },
                          { num: 4, desc: 'Smooth (Normal)', icon: '———', highlight: true },
                          { num: 5, desc: 'Soft blobs', icon: '~~~' },
                          { num: 6, desc: 'Mushy', icon: '≈≈≈' },
                          { num: 7, desc: 'Liquid', icon: '∿∿∿' },
                        ].map((option) => (
                          <button
                            key={option.num}
                            onClick={() => setBristolScale(option.num)}
                            className={`w-full p-3 rounded-lg text-left transition-all border-2 flex items-center gap-3 ${
                              bristolScale === option.num
                                ? 'bg-[#FFF0F5] border-[#F487B6]'
                                : option.highlight
                                ? 'bg-green-50 border-green-200 hover:border-green-300'
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <span className="text-lg font-mono text-gray-600">{option.icon}</span>
                            <span className="text-sm">
                              <span className="font-semibold">Type {option.num}:</span> {option.desc}
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-4 mt-4">
                        <label className="flex items-center gap-2">
                          <Checkbox checked={hasBlood} onCheckedChange={(checked) => setHasBlood(!!checked)} />
                          <span className="text-sm">Blood in stool</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <Checkbox checked={hasMucus} onCheckedChange={(checked) => setHasMucus(!!checked)} />
                          <span className="text-sm">Mucus present</span>
                        </label>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Appetite */}
              <Card>
                <CardContent className="p-6">
                  <div>
                    <Label className="text-base mb-3">Appetite Today</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                      {[
                        { value: 'increased', label: '↑ Increased', emoji: '🍽️' },
                        { value: 'normal', label: 'Normal', emoji: '😊' },
                        { value: 'decreased', label: '↓ Decreased', emoji: '🥄' },
                        { value: 'none', label: 'No appetite', emoji: '😶' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setAppetite(option.value as any)}
                          className={`p-3 rounded text-sm transition-all ${
                            appetite === option.value
                              ? 'bg-[#F487B6] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <div className="text-xl mb-1">{option.emoji}</div>
                          <div>{option.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pain-related digestive questions - only show if pain > 0 */}
              {pain !== undefined && pain > 0 && (
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <Label className="text-base mb-3">Pain & Digestion (optional)</Label>

                    {/* Pain related to defecation */}
                    <div>
                      <Label className="text-sm text-gray-700 mb-2">
                        Does your pain change after a bowel movement?
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                        {[
                          { value: 'better', label: 'Better' },
                          { value: 'worse', label: 'Worse' },
                          { value: 'no-change', label: 'No change' },
                          { value: 'none', label: 'N/A' },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setPainRelatedToDefecation(option.value as any)}
                            className={`p-2.5 rounded text-xs transition-all border ${
                              painRelatedToDefecation === option.value
                                ? 'bg-[#F487B6] text-white border-[#F487B6]'
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Pain with frequency/form changes */}
                    <div className="space-y-2">
                      <label className="flex items-start gap-3 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-gray-300 transition-all">
                        <Checkbox
                          checked={painWithFrequencyChange}
                          onCheckedChange={(checked) => setPainWithFrequencyChange(!!checked)}
                          className="mt-1"
                        />
                        <span className="text-sm">
                          Pain linked to more/fewer bowel movements than usual
                        </span>
                      </label>

                      <label className="flex items-start gap-3 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-gray-300 transition-all">
                        <Checkbox
                          checked={painWithFormChange}
                          onCheckedChange={(checked) => setPainWithFormChange(!!checked)}
                          className="mt-1"
                        />
                        <span className="text-sm">
                          Pain linked to change in stool appearance
                        </span>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Bloating concern - only show if bloating > none */}
              {bloating !== undefined && bloating !== 'none' && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm">
                        How much of a problem is bloating for you?
                      </Label>
                      <Badge className="bg-[#F487B6] text-white px-3 py-1">
                        {bloatingConcernLevel ?? 0}/7
                      </Badge>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="7"
                      value={bloatingConcernLevel ?? 0}
                      onChange={(e) => setBloatingConcernLevel(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Not a problem</span>
                      <span>Extreme problem</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button onClick={onTrackFood} variant="outline" className="w-full">
                <Apple className="w-4 h-4 mr-2" />
                Track Foods Eaten Today
              </Button>
            </div>
          )}

          {/* STEP 4: Lifestyle & Wellness */}
          {currentStep === 3 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600">Track sleep, stress, and daily habits</p>
              </div>

              {/* Sleep */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-base">Sleep Quality</Label>
                      <Badge className="bg-[#C59FA8] text-white px-3 py-1">
                        {sleepQuality ?? 0}/10
                      </Badge>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={sleepQuality ?? 0}
                      onChange={(e) => setSleepQuality(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Poor</span>
                      <span>Excellent</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-700 mb-2">Hours Slept</Label>
                    <input
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      value={sleepHours ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSleepHours(val === '' ? undefined : parseFloat(val));
                      }}
                      className="max-w-[140px] px-3 py-2 border border-gray-300 rounded-lg text-center"
                      placeholder="7.5"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Stress */}
              <Card>
                <CardContent className="p-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-base">Stress Level</Label>
                      <Badge className="bg-[#F487B6] text-white px-3 py-1">
                        {stress ?? 0}/10
                      </Badge>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={stress ?? 0}
                      onChange={(e) => setStress(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Calm</span>
                      <span>Very stressed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Exercise & Water */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label className="text-base mb-2">Exercise Today</Label>
                    <div className="flex items-center gap-3 mt-2">
                      <input
                        type="number"
                        min="0"
                        max="300"
                        value={exerciseMinutes ?? ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setExerciseMinutes(val === '' ? 0 : Math.max(0, parseInt(val)));
                        }}
                        className="max-w-[140px] px-3 py-2 border border-gray-300 rounded-lg text-center"
                        placeholder="0"
                      />
                      <span className="text-sm text-gray-600">minutes</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base mb-2">Water Intake</Label>
                    <div className="space-y-3 mt-2">
                      <div className="text-center">
                        <span className="text-2xl font-bold text-[#4FB0AE]">{waterIntake * 8}</span>
                        <span className="text-gray-600 ml-1">/ 120 oz</span>
                      </div>
                      <Slider
                        value={[waterIntake]}
                        onValueChange={(value) => setWaterIntake(value[0])}
                        min={0}
                        max={15}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0 glasses</span>
                        <span>{waterIntake} glasses (8oz each)</span>
                        <span>15 glasses</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mental Health Alert */}
              {((mood !== undefined && mood <= 1) || (stress !== undefined && stress >= 8)) && (
                <Card className="border-2 border-[#C59FA8]/30 bg-[#FFF0F5]">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-[#F487B6] mt-0.5" />
                      <div>
                        <Label className="text-base">Wellness Check</Label>
                        <p className="text-sm text-gray-600 mt-1">
                          {mood !== undefined && mood <= 1 && 'Your mood seems low today. '}
                          {stress !== undefined && stress >= 8 && 'You seem quite stressed. '}
                          Consider sharing this data with your healthcare provider.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Functional Impact - only show if symptoms present */}
              {((pain !== undefined && pain > 0) || (mood !== undefined && mood <= 2) || (bloating && bloating !== 'none')) && (
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <Label className="text-sm text-gray-700 mb-2">
                      Do symptoms interfere with work, exercise, or daily activities?
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                      {[
                        { value: 'none', label: 'Not at all' },
                        { value: 'mild', label: 'Mild' },
                        { value: 'moderate', label: 'Moderate' },
                        { value: 'severe', label: 'Severe' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSymptomFunctionalImpact(option.value as any)}
                          className={`p-2.5 rounded text-xs transition-all border ${
                            symptomFunctionalImpact === option.value
                              ? 'bg-[#F487B6] text-white border-[#F487B6]'
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>

                    {/* EHP-30: Wiped out by pain - only if pain present */}
                    {pain !== undefined && pain >= 5 && (
                      <div className="pt-3 border-t">
                        <Label className="text-sm text-gray-700 mb-2">
                          How often do you feel "wiped out" by pain?
                        </Label>
                        <div className="grid grid-cols-5 gap-2 mt-2">
                          {[
                            { value: 'never', label: 'Never' },
                            { value: 'rarely', label: 'Rarely' },
                            { value: 'sometimes', label: 'Sometimes' },
                            { value: 'often', label: 'Often' },
                            { value: 'always', label: 'Always' },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => setWipedOutByPain(option.value as any)}
                              className={`p-2 rounded text-xs transition-all border ${
                                wipedOutByPain === option.value
                                  ? 'bg-[#F487B6] text-white border-[#F487B6]'
                                  : 'bg-white border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Urinary & Sexual Health - only show if pain > 0 */}
              {pain !== undefined && pain > 0 && (
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <Label className="text-base mb-3">Urinary Symptoms (optional)</Label>
                    
                    <div>
                      <Label className="text-sm text-gray-700 mb-2">Urinary frequency today</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {[
                          { value: 'normal', label: 'Normal' },
                          { value: 'increased', label: 'Increased' },
                          { value: 'decreased', label: 'Decreased' },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setUrinaryFrequency(option.value)}
                            className={`p-2.5 rounded text-sm transition-all border ${
                              urinaryFrequency === option.value
                                ? 'bg-[#F487B6] text-white border-[#F487B6]'
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-start gap-3 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-gray-300 transition-all">
                        <Checkbox
                          checked={urinaryUrgency}
                          onCheckedChange={(checked) => setUrinaryUrgency(!!checked)}
                          className="mt-1"
                        />
                        <span className="text-sm">Sudden urge to urinate (urgency)</span>
                      </label>

                      <label className="flex items-start gap-3 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-gray-300 transition-all">
                        <Checkbox
                          checked={urinaryPain}
                          onCheckedChange={(checked) => setUrinaryPain(!!checked)}
                          className="mt-1"
                        />
                        <span className="text-sm">Pain or burning when urinating</span>
                      </label>

                      <label className="flex items-start gap-3 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-gray-300 transition-all">
                        <Checkbox
                          checked={painWithSex}
                          onCheckedChange={(checked) => setPainWithSex(!!checked)}
                          className="mt-1"
                        />
                        <span className="text-sm">Pain during or after sex</span>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex gap-3">
          {currentStep > 0 && (
            <Button onClick={handleBack} variant="outline" className="flex-1">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`flex-1 ${
              isStepValid()
                ? 'bg-[#F487B6] hover:bg-[#F487B6]/90 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentStep === STEPS.length - 1 ? 'Complete Check-In' : 'Continue'}
            {currentStep < STEPS.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </div>

      {/* Step Completion Reward Animation */}
      <AnimatePresence>
        {showStepReward && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-20 right-4 z-50"
          >
            <div className="bg-white rounded-xl shadow-2xl p-4 border-2 border-[#F487B6]">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <Trophy className="w-8 h-8 text-[#F487B6]" />
                </motion.div>
                <div>
                  <p className="font-bold text-gray-900">+{currentStepData.xp} XP</p>
                  <p className="text-xs text-gray-600">Section Complete!</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}