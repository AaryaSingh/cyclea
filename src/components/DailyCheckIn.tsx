import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, X, AlertCircle, ChevronDown, ChevronUp, Apple } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';

interface DailyCheckInProps {
  categories: string[];
  onComplete: (data: CheckInData) => void;
  onCancel: () => void;
  onTrackFood: () => void;
  lastCheckIn?: CheckInData;
  isEditing?: boolean;
  isPregnant?: boolean;
  cyclePhase?: string | null;
}

export interface CheckInData {
  // Pain Assessment (clinical diagnostic)
  pain: number;
  painLocation?: string[];
  painQuality?: string[];
  painTriggers?: string[];
  painReliefFactors?: string[];
  
  // GI Symptoms (for IBS, IBD, celiac diagnosis)
  bloating?: 'none' | 'low' | 'medium' | 'high';
  bowelMovement?: {
    frequency: number;
    bristol: number; // Bristol stool scale 1-7
    hasBlood?: boolean;
    hasMucus?: boolean;
    color?: string;
    urgency?: boolean;
  };
  nausea?: number; // 0-10
  appetite?: 'increased' | 'normal' | 'decreased' | 'none';
  
  // Gynecological (for endo, PCOS, adenomyosis diagnosis)
  bleeding?: {
    type: 'none' | 'spotting' | 'light' | 'normal' | 'heavy' | 'very-heavy';
    clots?: boolean;
    clotSize?: string;
    flooding?: boolean; // soaking through pad/tampon hourly
  };
  discharge?: {
    present: boolean;
    color?: string;
    odor?: boolean;
    texture?: string;
  } | string; // Can be a simple string or object
  breastTenderness?: number; // 0-10
  cramps?: number; // 0-10 period cramp intensity
  periodSymptoms?: string[]; // Array of period symptoms
  
  // Pelvic/Sexual Health (for interstitial cystitis, vulvodynia, pelvic floor)
  urinarySymptoms?: {
    frequency?: string | boolean; // >8 times/day or 'low'|'normal'|'high'
    urgency?: boolean;
    pain?: boolean; // dysuria
    incomplete?: boolean;
    painDuringSex?: boolean;
  };
  sexualHealth?: {
    pain?: boolean; // dyspareunia
    painType?: string;
    bleeding?: boolean;
  };
  
  // General Symptoms
  mood: number; // 0-4
  energy: number; // 0-100
  sleepQuality?: number; // 0-10
  sleepHours?: number;
  stressLevel?: number; // 0-10
  waterIntake: number;
  mentalClarity?: number; // 0-10
  exerciseMinutes?: number;
  
  // Rome IV Criteria for IBS
  painRelatedToDefecation?: 'better' | 'worse' | 'no-change' | 'none';
  painWithFrequencyChange?: boolean;
  painWithFormChange?: boolean;
  
  // EHP-30 Endometriosis screening
  rectalStabbingPain?: 'never' | 'rarely' | 'sometimes' | 'often' | 'always';
  painfulBowelMovement?: 'never' | 'rarely' | 'sometimes' | 'often' | 'always';
  wipedOutByPain?: 'never' | 'rarely' | 'sometimes' | 'often' | 'always';
  
  // MEDI-Q & PCOSQ functional impact
  bloatingConcernLevel?: number; // 0-7
  symptomFunctionalImpact?: 'none' | 'mild' | 'moderate' | 'severe';
  
  // Tracking
  symptoms: string[];
  medications?: string[];
  vitamins?: string[];
  notes: string;
  timestamp: Date | string;
}

// Clinical diagnostic symptom categories
const PAIN_LOCATIONS = [
  'Lower abdomen (center)',
  'Lower abdomen (left side)',
  'Lower abdomen (right side)',
  'Upper abdomen',
  'Lower back',
  'Rectum/anus',
  'Vagina/vulva',
  'Bladder/urethra',
  'Radiating to legs',
];

const PAIN_QUALITY = [
  'Cramping',
  'Sharp/stabbing',
  'Dull/aching',
  'Burning',
  'Throbbing',
  'Pressure/heaviness',
  'Shooting',
];

const PAIN_TRIGGERS = [
  'Eating',
  'Before bowel movement',
  'During bowel movement',
  'Before urination',
  'During urination',
  'Sexual activity',
  'Movement/exercise',
  'Sitting',
  'Standing',
];

const GI_SYMPTOMS = [
  'Bloating',
  'Gas',
  'Nausea',
  'Vomiting',
  'Heartburn/reflux',
  'Early satiety (feel full quickly)',
  'Loss of appetite',
  'Excessive hunger',
];

const MOOD_SYMPTOMS = [
  'Anxiety',
  'Depression/sadness',
  'Irritability',
  'Mood swings',
  'Panic attacks',
  'Crying spells',
  'Anger/rage',
  'Apathy',
];

const DISCHARGE_COLORS = [
  'Clear/white (normal)',
  'Yellow',
  'Green',
  'Gray',
  'Brown',
  'Pink/bloody',
];

export function DailyCheckIn({ 
  categories, 
  onComplete, 
  onCancel,
  onTrackFood,
  lastCheckIn, 
  isEditing = false,
  isPregnant = false,
  cyclePhase,
}: DailyCheckInProps) {
  // Pain assessment
  const [pain, setPain] = useState(lastCheckIn?.pain ?? 0);
  const [painLocations, setPainLocations] = useState<string[]>(lastCheckIn?.painLocation ?? []);
  const [painQuality, setPainQuality] = useState<string[]>(lastCheckIn?.painQuality ?? []);
  const [painTriggers, setPainTriggers] = useState<string[]>(lastCheckIn?.painTriggers ?? []);
  
  // GI symptoms
  const [bloating, setBloating] = useState<'none' | 'low' | 'medium' | 'high'>(lastCheckIn?.bloating ?? 'none');
  const [bowelFrequency, setBowelFrequency] = useState(lastCheckIn?.bowelMovement?.frequency ?? 1);
  const [bristolScale, setBristolScale] = useState(lastCheckIn?.bowelMovement?.bristol ?? 4);
  const [hasBlood, setHasBlood] = useState(lastCheckIn?.bowelMovement?.hasBlood ?? false);
  const [hasMucus, setHasMucus] = useState(lastCheckIn?.bowelMovement?.hasMucus ?? false);
  const [nausea, setNausea] = useState(lastCheckIn?.nausea ?? 0);
  
  // Bleeding/period
  const [bleedingType, setBleedingType] = useState<'none' | 'spotting' | 'light' | 'normal' | 'heavy' | 'very-heavy'>(
    lastCheckIn?.bleeding?.type ?? 'none'
  );
  const [hasClots, setHasClots] = useState(lastCheckIn?.bleeding?.clots ?? false);
  const [hasFlooding, setHasFlooding] = useState(lastCheckIn?.bleeding?.flooding ?? false);
  
  // Discharge
  const [hasDischarge, setHasDischarge] = useState(lastCheckIn?.discharge?.present ?? false);
  const [dischargeColor, setDischargeColor] = useState(lastCheckIn?.discharge?.color ?? 'Clear/white (normal)');
  const [hasOdor, setHasOdor] = useState(lastCheckIn?.discharge?.odor ?? false);
  
  // Urinary
  const [urinaryFrequency, setUrinaryFrequency] = useState(lastCheckIn?.urinarySymptoms?.frequency ?? false);
  const [urinaryUrgency, setUrinaryUrgency] = useState(lastCheckIn?.urinarySymptoms?.urgency ?? false);
  const [urinaryPain, setUrinaryPain] = useState(lastCheckIn?.urinarySymptoms?.pain ?? false);
  
  // Sexual health
  const [sexualPain, setSexualPain] = useState(lastCheckIn?.sexualHealth?.pain ?? false);
  
  // General
  const [mood, setMood] = useState(lastCheckIn?.mood ?? 2);
  const [energy, setEnergy] = useState(lastCheckIn?.energy ?? 70);
  const [sleepQuality, setSleepQuality] = useState(lastCheckIn?.sleepQuality ?? 7);
  const [sleepHours, setSleepHours] = useState(lastCheckIn?.sleepHours ?? 7);
  const [waterIntake, setWaterIntake] = useState(lastCheckIn?.waterIntake ?? 64);
  const [mentalClarity, setMentalClarity] = useState(lastCheckIn?.mentalClarity ?? 7);
  const [exerciseMinutes, setExerciseMinutes] = useState(lastCheckIn?.exerciseMinutes ?? 0);
  
  // Rome IV Criteria for IBS
  const [painRelatedToDefecation, setPainRelatedToDefecation] = useState(lastCheckIn?.painRelatedToDefecation ?? 'none');
  const [painWithFrequencyChange, setPainWithFrequencyChange] = useState(lastCheckIn?.painWithFrequencyChange ?? false);
  const [painWithFormChange, setPainWithFormChange] = useState(lastCheckIn?.painWithFormChange ?? false);
  
  // EHP-30 Endometriosis screening
  const [rectalStabbingPain, setRectalStabbingPain] = useState(lastCheckIn?.rectalStabbingPain ?? 'never');
  const [painfulBowelMovement, setPainfulBowelMovement] = useState(lastCheckIn?.painfulBowelMovement ?? 'never');
  const [wipedOutByPain, setWipedOutByPain] = useState(lastCheckIn?.wipedOutByPain ?? 'never');
  
  // MEDI-Q & PCOSQ functional impact
  const [bloatingConcernLevel, setBloatingConcernLevel] = useState(lastCheckIn?.bloatingConcernLevel ?? 0);
  const [symptomFunctionalImpact, setSymptomFunctionalImpact] = useState(lastCheckIn?.symptomFunctionalImpact ?? 'none');
  
  // Symptom checklist
  const [symptoms, setSymptoms] = useState<string[]>(lastCheckIn?.symptoms ?? []);
  const [notes, setNotes] = useState(lastCheckIn?.notes ?? '');
  
  // UI state
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['pain', 'general']));
  const [currentStep, setCurrentStep] = useState(0);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const toggleSymptom = (symptom: string) => {
    setSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const togglePainLocation = (location: string) => {
    setPainLocations(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const togglePainQuality = (quality: string) => {
    setPainQuality(prev => 
      prev.includes(quality) 
        ? prev.filter(q => q !== quality)
        : [...prev, quality]
    );
  };

  const togglePainTrigger = (trigger: string) => {
    setPainTriggers(prev => 
      prev.includes(trigger) 
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleSubmit = () => {
    const data: CheckInData = {
      // Pain
      pain,
      painLocation: painLocations,
      painQuality,
      painTriggers,
      
      // GI
      bloating,
      bowelMovement: {
        frequency: bowelFrequency,
        bristol: bristolScale,
        hasBlood,
        hasMucus,
      },
      nausea,
      
      // Bleeding
      bleeding: {
        type: bleedingType,
        clots: hasClots,
        flooding: hasFlooding,
      },
      
      // Discharge
      discharge: {
        present: hasDischarge,
        color: dischargeColor,
        odor: hasOdor,
      },
      
      // Urinary
      urinarySymptoms: {
        frequency: urinaryFrequency,
        urgency: urinaryUrgency,
        pain: urinaryPain,
        painDuringSex: sexualPain,
      },
      
      // Sexual
      sexualHealth: {
        pain: sexualPain,
      },
      
      // General
      mood,
      energy,
      sleepQuality,
      sleepHours,
      waterIntake,
      mentalClarity,
      exerciseMinutes,
      
      // Rome IV Criteria for IBS
      painRelatedToDefecation,
      painWithFrequencyChange,
      painWithFormChange,
      
      // EHP-30 Endometriosis screening
      rectalStabbingPain,
      painfulBowelMovement,
      wipedOutByPain,
      
      // MEDI-Q & PCOSQ functional impact
      bloatingConcernLevel,
      symptomFunctionalImpact,
      
      symptoms,
      notes,
      timestamp: new Date(),
    };
    onComplete(data);
  };

  // Check for red flags
  const redFlags = [];
  if (pain >= 7) redFlags.push('Severe pain');
  if (hasFlooding) redFlags.push('Flooding (heavy bleeding)');
  if (hasBlood && bowelFrequency > 3) redFlags.push('Blood in stool + frequent BMs');
  if (fever) redFlags.push('Fever');
  if (urinaryPain && urinaryFrequency) redFlags.push('Painful frequent urination');

  return (
    <div className="fixed inset-0 bg-[#FFF0F5] z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto p-6 pb-32"
      >
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[#4A3541] mb-1">
                {isEditing ? 'Update Today\'s Check-In' : 'Daily Health Check-In'}
              </h2>
              <p className="text-sm text-[#4A3541]/60">
                Track your patterns to understand your body better
              </p>
            </div>
            <Button onClick={onCancel} variant="ghost" size="icon">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Red Flags Alert */}
          {redFlags.length > 0 && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900 mb-1">⚠️ Concerning Symptoms Detected</p>
                    <ul className="text-sm text-red-800 space-y-1">
                      {redFlags.map((flag, idx) => (
                        <li key={idx}>• {flag}</li>
                      ))}
                    </ul>
                    <p className="text-sm text-red-900 mt-2">
                      <strong>Consider contacting your OBGYN if these symptoms persist or worsen.</strong>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Food Tracker CTA */}
          <Card className="bg-gradient-to-r from-[#4FB0AE]/10 to-[#69C9C0]/10 border-[#4FB0AE]/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-900 mb-2">
                    <strong>💡 Track food too?</strong> Food logs help identify GI triggers.
                  </p>
                </div>
                <Button onClick={onTrackFood} size="sm" variant="outline" className="border-[#4FB0AE] text-[#4FB0AE]">
                  <Apple className="w-4 h-4 mr-2" />
                  Log Food
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 1: Pain Assessment (Critical for endo/adenom diagnosis) */}
          <Card>
            <button
              onClick={() => toggleSection('pain')}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">1. Pain Assessment</h3>
              {expandedSections.has('pain') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections.has('pain') && (
              <CardContent className="space-y-4 pt-0">
                {/* Pain Level */}
                <div>
                  <Label className="mb-3 block">Pain Level (0-10 scale)</Label>
                  <div className="grid grid-cols-11 gap-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                      <button
                        key={level}
                        onClick={() => setPain(level)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          pain === level
                            ? level >= 7
                              ? 'bg-red-500 text-white border-red-600'
                              : level >= 4
                              ? 'bg-amber-500 text-white border-amber-600'
                              : 'bg-green-500 text-white border-green-600'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    0=No pain, 1-3=Mild, 4-6=Moderate, 7-9=Severe, 10=Worst possible
                  </p>
                </div>

                {pain > 0 && (
                  <>
                    {/* Pain Location */}
                    <div>
                      <Label className="mb-3 block">Where is the pain? (Select all that apply)</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {PAIN_LOCATIONS.map((location) => (
                          <button
                            key={location}
                            onClick={() => togglePainLocation(location)}
                            className={`p-3 text-sm rounded-lg border-2 transition-all text-left ${
                              painLocations.includes(location)
                                ? 'bg-[#F487B6] text-white border-[#F487B6]'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {location}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Pain Quality */}
                    <div>
                      <Label className="mb-3 block">What does the pain feel like?</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {PAIN_QUALITY.map((quality) => (
                          <button
                            key={quality}
                            onClick={() => togglePainQuality(quality)}
                            className={`p-3 text-sm rounded-lg border-2 transition-all ${
                              painQuality.includes(quality)
                                ? 'bg-[#C59FA8] text-white border-[#C59FA8]'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {quality}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Pain Triggers */}
                    <div>
                      <Label className="mb-3 block">What triggers or worsens the pain?</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {PAIN_TRIGGERS.map((trigger) => (
                          <button
                            key={trigger}
                            onClick={() => togglePainTrigger(trigger)}
                            className={`p-3 text-sm rounded-lg border-2 transition-all text-left ${
                              painTriggers.includes(trigger)
                                ? 'bg-[#9E6B8E] text-white border-[#9E6B8E]'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {trigger}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-900">
                    <strong>Clinical Note:</strong> Pain location + quality + triggers help differentiate: endometriosis (cycle-dependent, deep pelvic), IBS (eating-related, cramping), interstitial cystitis (bladder pain with urination).
                  </p>
                </div>
              </CardContent>
            )}
          </Card>

          {/* SECTION 2: Digestive Symptoms */}
          <Card>
            <button
              onClick={() => toggleSection('gi')}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">2. Digestive Symptoms</h3>
              {expandedSections.has('gi') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections.has('gi') && (
              <CardContent className="space-y-4 pt-0">
                {/* Bloating */}
                <div>
                  <Label className="mb-3 block">Bloating Level</Label>
                  <RadioGroup value={bloating} onValueChange={(val) => setBloating(val as any)}>
                    <div className="grid grid-cols-4 gap-2">
                      {(['none', 'low', 'medium', 'high'] as const).map((level) => (
                        <label
                          key={level}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            bloating === level
                              ? 'bg-[#4FB0AE] text-white border-[#4FB0AE]'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <RadioGroupItem value={level} className="sr-only" />
                          <span className="capitalize">{level}</span>
                        </label>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Bowel Movement Frequency */}
                <div>
                  <Label className="mb-3 block">Bowel Movements Today</Label>
                  <div className="grid grid-cols-8 gap-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((freq) => (
                      <button
                        key={freq}
                        onClick={() => setBowelFrequency(freq)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          bowelFrequency === freq
                            ? 'bg-[#4FB0AE] text-white border-[#4FB0AE]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Normal: 3/week to 3/day. &lt;3/week = constipation. &gt;3/day = diarrhea.
                  </p>
                </div>

                {/* Bristol Stool Scale */}
                <div>
                  <Label className="mb-3 block">Stool Consistency (Bristol Scale)</Label>
                  <div className="grid grid-cols-7 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((type) => (
                      <button
                        key={type}
                        onClick={() => setBristolScale(type)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          bristolScale === type
                            ? 'bg-[#4FB0AE] text-white border-[#4FB0AE]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    1-2=Hard/constipated, 3-4=Normal, 5-7=Loose/diarrhea
                  </p>
                </div>

                {/* Blood/Mucus in Stool */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <Checkbox checked={hasBlood} onCheckedChange={(checked) => setHasBlood(!!checked)} />
                    <span className="text-sm">Blood in stool 🚨</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <Checkbox checked={hasMucus} onCheckedChange={(checked) => setHasMucus(!!checked)} />
                    <span className="text-sm">Mucus in stool</span>
                  </label>
                </div>

                {/* Nausea */}
                <div>
                  <Label className="mb-3 block">Nausea Level (0-10)</Label>
                  <div className="grid grid-cols-11 gap-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                      <button
                        key={level}
                        onClick={() => setNausea(level)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          nausea === level
                            ? 'bg-[#69C9C0] text-white border-[#69C9C0]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* GI Symptom Checklist */}
                <div>
                  <Label className="mb-3 block">Other GI Symptoms</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {GI_SYMPTOMS.map((symptom) => (
                      <button
                        key={symptom}
                        onClick={() => toggleSymptom(symptom)}
                        className={`p-3 text-sm rounded-lg border-2 transition-all text-left ${
                          symptoms.includes(symptom)
                            ? 'bg-[#4FB0AE] text-white border-[#4FB0AE]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs text-purple-900">
                    <strong>Clinical Note:</strong> Chronic bloating + alternating BMs = IBS. Blood + mucus = IBD screen needed. Cycle-related GI symptoms = progesterone effect on gut motility.
                  </p>
                </div>
              </CardContent>
            )}
          </Card>

          {/* SECTION 3: Bleeding & Period */}
          <Card>
            <button
              onClick={() => toggleSection('bleeding')}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">3. Bleeding & Menstruation</h3>
              {expandedSections.has('bleeding') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections.has('bleeding') && (
              <CardContent className="space-y-4 pt-0">
                {/* Bleeding Type */}
                <div>
                  <Label className="mb-3 block">Bleeding Today</Label>
                  <RadioGroup value={bleedingType} onValueChange={(val) => setBleedingType(val as any)}>
                    <div className="grid grid-cols-2 gap-2">
                      {(['none', 'spotting', 'light', 'normal', 'heavy', 'very-heavy'] as const).map((type) => (
                        <label
                          key={type}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            bleedingType === type
                              ? 'bg-[#F487B6] text-white border-[#F487B6]'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <RadioGroupItem value={type} className="sr-only" />
                          <span className="capitalize">{type.replace('-', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {bleedingType !== 'none' && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <Checkbox checked={hasClots} onCheckedChange={(checked) => setHasClots(!!checked)} />
                      <span className="text-sm">Passing clots</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border-2 border-red-200 rounded-lg hover:bg-red-50 cursor-pointer bg-red-50">
                      <Checkbox checked={hasFlooding} onCheckedChange={(checked) => setHasFlooding(!!checked)} />
                      <span className="text-sm font-semibold text-red-900">Flooding (soaking pad/tampon hourly) 🚨</span>
                    </label>
                  </div>
                )}

                <div className="bg-amber-50 p-3 rounded-lg">
                  <p className="text-xs text-amber-900">
                    <strong>⚠️ Heavy bleeding:</strong> If flooding for 2+ hours, contact your OBGYN or go to urgent care. This can lead to anemia.
                  </p>
                </div>
              </CardContent>
            )}
          </Card>

          {/* SECTION 4: Discharge & Gynecological */}
          <Card>
            <button
              onClick={() => toggleSection('discharge')}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">4. Vaginal Health</h3>
              {expandedSections.has('discharge') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections.has('discharge') && (
              <CardContent className="space-y-4 pt-0">
                <label className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <Checkbox checked={hasDischarge} onCheckedChange={(checked) => setHasDischarge(!!checked)} />
                  <span className="text-sm">Noticeable discharge today</span>
                </label>

                {hasDischarge && (
                  <>
                    <div>
                      <Label className="mb-3 block">Discharge Color</Label>
                      <RadioGroup value={dischargeColor} onValueChange={setDischargeColor}>
                        <div className="grid grid-cols-2 gap-2">
                          {DISCHARGE_COLORS.map((color) => (
                            <label
                              key={color}
                              className={`p-3 text-sm rounded-lg border-2 cursor-pointer transition-all ${
                                dischargeColor === color
                                  ? 'bg-[#C59FA8] text-white border-[#C59FA8]'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <RadioGroupItem value={color} className="sr-only" />
                              {color}
                            </label>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    <label className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <Checkbox checked={hasOdor} onCheckedChange={(checked) => setHasOdor(!!checked)} />
                      <span className="text-sm">Has unusual odor 🚨</span>
                    </label>
                  </>
                )}

                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-green-900">
                    <strong>Normal:</strong> Clear/white, no odor. <strong>See doctor if:</strong> Yellow/green + odor (infection), gray + fishy odor (BV).
                  </p>
                </div>
              </CardContent>
            )}
          </Card>

          {/* SECTION 5: Urinary & Pelvic */}
          <Card>
            <button
              onClick={() => toggleSection('urinary')}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">5. Urinary & Pelvic Symptoms</h3>
              {expandedSections.has('urinary') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections.has('urinary') && (
              <CardContent className="space-y-2 pt-0">
                <label className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <Checkbox checked={urinaryFrequency} onCheckedChange={(checked) => setUrinaryFrequency(!!checked)} />
                  <span className="text-sm">Urinating frequently (&gt;8 times/day)</span>
                </label>
                <label className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <Checkbox checked={urinaryUrgency} onCheckedChange={(checked) => setUrinaryUrgency(!!checked)} />
                  <span className="text-sm">Sudden urgent need to urinate</span>
                </label>
                <label className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <Checkbox checked={urinaryPain} onCheckedChange={(checked) => setUrinaryPain(!!checked)} />
                  <span className="text-sm">Pain/burning when urinating 🚨</span>
                </label>
                <label className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <Checkbox checked={sexualPain} onCheckedChange={(checked) => setSexualPain(!!checked)} />
                  <span className="text-sm">Pain during sex</span>
                </label>

                <div className="bg-blue-50 p-3 rounded-lg mt-4">
                  <p className="text-xs text-blue-900">
                    <strong>Clinical Note:</strong> Frequency + urgency + pain = possible UTI or interstitial cystitis. Pain with sex = possible endometriosis, pelvic floor dysfunction, or vulvodynia.
                  </p>
                </div>
              </CardContent>
            )}
          </Card>

          {/* SECTION 6: General Wellbeing */}
          <Card>
            <button
              onClick={() => toggleSection('general')}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">6. General Wellbeing</h3>
              {expandedSections.has('general') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections.has('general') && (
              <CardContent className="space-y-4 pt-0">
                {/* Mood */}
                <div>
                  <Label className="mb-3 block">Overall Mood</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 1, label: '😔 Low', color: '#C48AAF' },
                      { value: 2, label: '😐 Okay', color: '#E5B8D1' },
                      { value: 3, label: '😊 Good', color: '#69C9C0' },
                      { value: 4, label: '😃 Great', color: '#4FB0AE' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setMood(option.value)}
                        style={{
                          backgroundColor: mood === option.value ? option.color : 'white',
                          borderColor: mood === option.value ? option.color : '#e5e7eb',
                          color: mood === option.value ? 'white' : '#3c3c3c',
                        }}
                        className="p-4 rounded-lg border-2 transition-all hover:shadow-md"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mood Symptoms */}
                <div>
                  <Label className="mb-3 block">Mood/Mental Health Symptoms</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {MOOD_SYMPTOMS.map((symptom) => (
                      <button
                        key={symptom}
                        onClick={() => toggleSymptom(symptom)}
                        className={`p-3 text-sm rounded-lg border-2 transition-all text-left ${
                          symptoms.includes(symptom)
                            ? 'bg-[#9E6B8E] text-white border-[#9E6B8E]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Energy */}
                <div>
                  <Label className="mb-3 block">Energy Level: {energy}%</Label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={energy}
                    onChange={(e) => setEnergy(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4FB0AE]"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Exhausted</span>
                    <span>Energized</span>
                  </div>
                </div>

                {/* Sleep */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-3 block">Sleep Quality (0-10)</Label>
                    <div className="grid grid-cols-6 gap-2">
                      {[0, 2, 4, 6, 8, 10].map((level) => (
                        <button
                          key={level}
                          onClick={() => setSleepQuality(level)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            sleepQuality === level
                              ? 'bg-[#69C9C0] text-white border-[#69C9C0]'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="mb-3 block">Hours Slept</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {[4, 6, 7, 8, 9, 10].map((hours) => (
                        <button
                          key={hours}
                          onClick={() => setSleepHours(hours)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            sleepHours === hours
                              ? 'bg-[#69C9C0] text-white border-[#69C9C0]'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {hours}h
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Water */}
                <div>
                  <Label className="mb-3 block">Water Intake: {waterIntake} oz</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {[0, 32, 48, 64, 80, 96].map((oz) => (
                      <button
                        key={oz}
                        onClick={() => setWaterIntake(oz)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          waterIntake === oz
                            ? 'bg-[#4FB0AE] text-white border-[#4FB0AE]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {oz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mental Clarity */}
                <div>
                  <Label className="mb-3 block">Mental Clarity: {mentalClarity}/10</Label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={mentalClarity}
                    onChange={(e) => setMentalClarity(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#C59FA8]"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Brain fog</span>
                    <span>Crystal clear</span>
                  </div>
                </div>

                {/* Exercise */}
                <div>
                  <Label className="mb-3 block">Exercise Minutes Today</Label>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    value={exerciseMinutes}
                    onChange={(e) => setExerciseMinutes(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4FB0AE]"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>None</span>
                    <span>2 hours+</span>
                  </div>
                </div>

                {/* Associated Symptoms */}
                <div className="space-y-2">
                  <Label>Other Symptoms Today</Label>
                  <label className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <Checkbox checked={fever} onCheckedChange={(checked) => setFever(!!checked)} />
                    <span className="text-sm">Fever/chills 🚨</span>
                  </label>
                </div>

                {/* Headache & Back Pain */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block text-sm">Headache (0-10)</Label>
                    <div className="grid grid-cols-6 gap-1">
                      {[0, 2, 4, 6, 8, 10].map((level) => (
                        <button
                          key={level}
                          onClick={() => setHeadache(level)}
                          className={`p-2 text-sm rounded border-2 transition-all ${
                            headache === level
                              ? 'bg-[#F487B6] text-white border-[#F487B6]'
                              : 'border-gray-200'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="mb-2 block text-sm">Back Pain (0-10)</Label>
                    <div className="grid grid-cols-6 gap-1">
                      {[0, 2, 4, 6, 8, 10].map((level) => (
                        <button
                          key={level}
                          onClick={() => setBackPain(level)}
                          className={`p-2 text-sm rounded border-2 transition-all ${
                            backPain === level
                              ? 'bg-[#F487B6] text-white border-[#F487B6]'
                              : 'border-gray-200'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Notes */}
          <div>
            <Label className="mb-3 block">Additional Notes (Optional)</Label>
            <Textarea
              placeholder="Any other symptoms, context, or observations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Clinical Context */}
          {cyclePhase && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-900">
                <strong>📊 You're in {cyclePhase} phase:</strong> This context helps your OBGYN determine if symptoms are cycle-dependent (hormonal) or independent (structural/other).
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white">
            <Button onClick={onCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1 bg-[#F487B6] hover:bg-[#F487B6]/90">
              <Check className="w-5 h-5 mr-2" />
              {isEditing ? 'Update Check-In' : 'Complete Check-In'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}