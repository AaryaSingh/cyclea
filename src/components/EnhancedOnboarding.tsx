import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, Heart, Brain, Zap, Pill, ChevronRight, ChevronLeft,
  Bell, Eye, EyeOff, Type, Smartphone, Shield, FileText
} from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';

interface OnboardingProps {
  onComplete: (data: {
    categories: string[];
    ageRange?: string;
    cycleStatus?: string;
    birthControl?: string;
    diagnosedConditions?: string[];
    medications?: string;
    giPriorities?: string[];
    mentalHealthFocus?: string[];
    goals?: string[];
    educationPreference?: 'quick' | 'deep';
    accessibilityPrefs?: {
      textSize?: 'normal' | 'large' | 'xlarge';
      reduceMotion?: boolean;
      dyslexiaFont?: boolean;
    };
    consentAnalytics?: boolean;
    consentResearch?: boolean;
  }) => void;
}

const TRACKING_OPTIONS = [
  {
    id: 'cycle',
    label: 'Menstrual Cycle',
    description: 'Track your period, symptoms, and cycle phases',
    icon: Heart,
    color: '#C59FA8'
  },
  {
    id: 'gut',
    label: 'Gut Health',
    description: 'Monitor digestion, bloating, and GI symptoms',
    icon: Activity,
    color: '#F487B6'
  },
  {
    id: 'mood',
    label: 'Mood & Mental Health',
    description: 'Track your emotional wellbeing and patterns',
    icon: Brain,
    color: '#9E6B8E'
  },
  {
    id: 'energy',
    label: 'Energy Levels',
    description: 'Log your daily energy and fatigue',
    icon: Zap,
    color: '#FFC0D3'
  },
  {
    id: 'symptoms',
    label: 'General Symptoms',
    description: 'Track pain, headaches, and other health markers',
    icon: Pill,
    color: '#C59FA8'
  }
];

const AGE_RANGES = ['18-24', '25-34', '35-44', '45-54', '55+'];
const CYCLE_STATUSES = ['Menstruating', 'Pregnant', 'Postpartum', 'Perimenopause', 'Postmenopause', 'Not applicable'];
const DIAGNOSED_CONDITIONS = ['PCOS', 'Endometriosis', 'IBS', 'IBD', 'GERD', 'None'];
const GI_PRIORITIES = ['Bloating', 'Constipation', 'Diarrhea', 'Pain', 'Reflux'];
const MENTAL_HEALTH_FOCUS = ['Stress management', 'Sleep quality', 'Mood stability', 'Anxiety'];
const GOALS = ['Reduce bloating', 'Better regularity', 'More energy', 'Understand patterns', 'Improve sleep'];

export function EnhancedOnboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    categories: [] as string[],
    ageRange: '',
    cycleStatus: '',
    birthControl: '',
    diagnosedConditions: [] as string[],
    medications: '',
    giPriorities: [] as string[],
    mentalHealthFocus: [] as string[],
    goals: [] as string[],
    educationPreference: 'quick' as 'quick' | 'deep',
    accessibilityPrefs: {
      textSize: 'normal' as 'normal' | 'large' | 'xlarge',
      reduceMotion: false,
      dyslexiaFont: false,
    },
    consentAnalytics: true,
    consentResearch: false,
  });

  const toggleArrayItem = (key: string, item: string) => {
    setData(prev => {
      const array = prev[key as keyof typeof prev] as string[];
      return {
        ...prev,
        [key]: array.includes(item) 
          ? array.filter(i => i !== item) 
          : [...array, item]
      };
    });
  };

  const canProceed = () => {
    switch (step) {
      case 1: return true; // Welcome/consent
      case 2: return data.ageRange && data.cycleStatus;
      case 3: return data.goals.length > 0;
      case 4: return true; // Final review
      default: return false;
    }
  };

  const handleNext = () => {
    if (step === 4) {
      // Auto-select all tracking categories since we track everything
      onComplete({
        ...data,
        categories: ['cycle', 'gut', 'mood', 'energy', 'symptoms']
      });
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-[#FFF0F5] flex items-center justify-center p-4 md:p-6">
      <div className="max-w-2xl w-full">
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-[#3C3C3C]/60">Step {step} of 4</span>
            <span className="text-sm text-[#3C3C3C]/60">{Math.round((step / 4) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#F487B6]"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Welcome & Consent */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-6 md:p-8">
                  <div className="text-center mb-6">
                    <h1 className="text-[#3C3C3C] mb-3">Welcome to Your Health Journey</h1>
                    <p className="text-[#3C3C3C]/70">
                      We help you understand the connections between your hormones, gut health, and mental wellbeing through simple daily tracking.
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="bg-[#F487B6]/10 rounded-lg p-4">
                      <h3 className="text-[#3C3C3C] mb-2 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-[#F487B6]" />
                        Privacy First
                      </h3>
                      <p className="text-sm text-[#3C3C3C]/70 mb-3">
                        Your data stays on your device unless you choose to sync or export. We never share your health information with third parties.
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="analytics"
                          checked={data.consentAnalytics}
                          onCheckedChange={(checked) => setData(prev => ({ ...prev, consentAnalytics: !!checked }))}
                        />
                        <div className="flex-1">
                          <Label htmlFor="analytics" className="cursor-pointer">
                            <span className="text-[#3C3C3C]">Anonymous analytics</span>
                          </Label>
                          <p className="text-sm text-[#3C3C3C]/60 mt-1">
                            Help us improve the app with anonymized usage data. You can change this anytime.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="research"
                          checked={data.consentResearch}
                          onCheckedChange={(checked) => setData(prev => ({ ...prev, consentResearch: !!checked }))}
                        />
                        <div className="flex-1">
                          <Label htmlFor="research" className="cursor-pointer">
                            <span className="text-[#3C3C3C]">Research participation (optional)</span>
                          </Label>
                          <p className="text-sm text-[#3C3C3C]/60 mt-1">
                            Contribute de-identified data to women's health research. Always optional.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#3C3C3C]/50 mb-6 text-center">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Health Basics */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-6 md:p-8">
                  <div className="mb-6">
                    <h1 className="text-[#3C3C3C] mb-3">Tell us about yourself</h1>
                    <p className="text-[#3C3C3C]/70">
                      This helps us personalize your experience and insights.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Age Range */}
                    <div>
                      <Label className="mb-3 block">Age range</Label>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                        {AGE_RANGES.map(range => (
                          <Button
                            key={range}
                            variant={data.ageRange === range ? 'default' : 'outline'}
                            className={data.ageRange === range ? 'bg-[#4FB0AE]' : ''}
                            onClick={() => setData(prev => ({ ...prev, ageRange: range }))}
                          >
                            {range}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Cycle Status */}
                    <div>
                      <Label className="mb-3 block">Cycle status</Label>
                      <div className="grid gap-2">
                        {CYCLE_STATUSES.map(status => (
                          <Button
                            key={status}
                            variant={data.cycleStatus === status ? 'default' : 'outline'}
                            className={`justify-start ${data.cycleStatus === status ? 'bg-[#4FB0AE]' : ''}`}
                            onClick={() => setData(prev => ({ ...prev, cycleStatus: status }))}
                          >
                            {status}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Birth Control (optional) */}
                    <div>
                      <Label htmlFor="birthControl" className="mb-2 block">
                        Birth control method (optional)
                      </Label>
                      <Input
                        id="birthControl"
                        placeholder="e.g., IUD, pill, none"
                        value={data.birthControl}
                        onChange={(e) => setData(prev => ({ ...prev, birthControl: e.target.value }))}
                      />
                    </div>

                    {/* Diagnosed Conditions */}
                    <div>
                      <Label className="mb-3 block">Any diagnosed conditions?</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {DIAGNOSED_CONDITIONS.map(condition => (
                          <Button
                            key={condition}
                            variant={data.diagnosedConditions.includes(condition) ? 'default' : 'outline'}
                            className={data.diagnosedConditions.includes(condition) ? 'bg-[#4FB0AE]' : ''}
                            onClick={() => toggleArrayItem('diagnosedConditions', condition)}
                            size="sm"
                          >
                            {condition}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Medications (optional) */}
                    <div>
                      <Label htmlFor="medications" className="mb-2 block">
                        Current medications (optional)
                      </Label>
                      <Textarea
                        id="medications"
                        placeholder="List any medications or supplements you're taking"
                        value={data.medications}
                        onChange={(e) => setData(prev => ({ ...prev, medications: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    {/* GI Priorities */}
                    <div>
                      <Label className="mb-3 block">GI health priorities (select all that apply)</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {GI_PRIORITIES.map(priority => (
                          <Button
                            key={priority}
                            variant={data.giPriorities.includes(priority) ? 'default' : 'outline'}
                            className={data.giPriorities.includes(priority) ? 'bg-[#4FB0AE]' : ''}
                            onClick={() => toggleArrayItem('giPriorities', priority)}
                            size="sm"
                          >
                            {priority}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Mental Health Focus */}
                    <div>
                      <Label className="mb-3 block">Mental health focus areas</Label>
                      <div className="grid gap-2">
                        {MENTAL_HEALTH_FOCUS.map(focus => (
                          <Button
                            key={focus}
                            variant={data.mentalHealthFocus.includes(focus) ? 'default' : 'outline'}
                            className={`justify-start ${data.mentalHealthFocus.includes(focus) ? 'bg-[#4FB0AE]' : ''}`}
                            onClick={() => toggleArrayItem('mentalHealthFocus', focus)}
                            size="sm"
                          >
                            {focus}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Goals */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-6 md:p-8">
                  <div className="mb-6">
                    <h1 className="text-[#3C3C3C] mb-3">What are your goals?</h1>
                    <p className="text-[#3C3C3C]/70">
                      Pick 1-2 main goals. We'll help you work toward them.
                    </p>
                  </div>

                  <div className="grid gap-3 mb-6">
                    {GOALS.map((goal, index) => (
                      <motion.div
                        key={goal}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Button
                          variant={data.goals.includes(goal) ? 'default' : 'outline'}
                          className={`w-full justify-start h-auto py-4 ${data.goals.includes(goal) ? 'bg-[#4FB0AE]' : ''}`}
                          onClick={() => toggleArrayItem('goals', goal)}
                        >
                          <div className="text-left">
                            <p className="font-medium">{goal}</p>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  {/* Removed Learning Preference section */}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-6 md:p-8">
                  <div className="text-center mb-6">
                    <h1 className="text-[#3C3C3C] mb-3">You're all set!</h1>
                    <p className="text-[#3C3C3C]/70">
                      Your personalized dashboard is ready. Start logging today to unlock insights.
                    </p>
                  </div>

                  <div className="bg-[#4FB0AE]/10 rounded-lg p-4 mb-6">
                    <h3 className="text-[#3C3C3C] mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#4FB0AE]" />
                      Your preferences
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-[#3C3C3C]/60">Tracking:</span> <span className="text-[#3C3C3C]">Period, Gut Health, Mood, Energy & Symptoms</span></p>
                      <p><span className="text-[#3C3C3C]/60">Goals:</span> <span className="text-[#3C3C3C]">{data.goals.join(', ')}</span></p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border-2 border-[#4FB0AE]/20">
                    <p className="text-sm text-[#3C3C3C] text-center">
                      🌟 Log your first check-in to start seeing personalized insights about your health patterns
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-[#4FB0AE] hover:bg-[#4FB0AE]/90 gap-2"
          >
            {step === 4 ? 'Get Started' : 'Continue'}
            {step < 4 && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}