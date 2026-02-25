import { motion } from 'motion/react';
import { Flame, Trophy, Plus, Settings, Info, TrendingUp, Calendar, Apple } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CheckInData } from './DailyCheckIn';
import { PeriodData } from './PeriodTracker';

interface HomeScreenProps {
  streak: number;
  xp: number;
  badges: string[];
  onCheckIn: () => void;
  onEditCheckIn?: () => void;
  hasTodayCheckIn?: boolean;
  onViewHistory: () => void;
  onViewInsights?: () => void;
  onTrackFood?: () => void;
  onOpenSettings?: () => void;
  recentSymptoms?: string[];
  cyclePhase?: string | null;
  userCategories?: string[];
  checkIns?: CheckInData[];
  periodData?: PeriodData | null;
  categories?: string[];
  hasPeriodData?: boolean;
  onOpenPeriodTracker?: () => void;
  recentCheckIn?: CheckInData | null;
  currentLeague?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | null;
  hasLeftLeague?: boolean;
  unlockedLessons?: string[];
  completedLessons?: string[];
  userData?: any;
}

const LEVEL_THRESHOLD = 100;

export function HomeScreen({
  streak,
  xp,
  badges,
  onCheckIn,
  onEditCheckIn,
  hasTodayCheckIn = false,
  onViewHistory,
  onOpenSettings,
  onTrackFood,
  recentSymptoms = [],
  cyclePhase = null,
  userCategories = [],
  hasPeriodData = false,
  onOpenPeriodTracker,
  recentCheckIn = null,
  checkIns = [],
}: HomeScreenProps) {
  const currentLevel = Math.floor(xp / LEVEL_THRESHOLD) + 1;
  const xpInLevel = xp % LEVEL_THRESHOLD;
  const progressPercentage = (xpInLevel / LEVEL_THRESHOLD) * 100;

  return (
    <div className="min-h-screen bg-[#FFF0F5] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F487B6] to-[#FFC0D3] text-white p-6 rounded-b-3xl shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white mb-1">Welcome back!</h2>
              <p className="text-white/80">Ready for today's check-in?</p>
            </div>
            <div className="flex items-center gap-2">
              {onOpenSettings && (
                <Button
                  onClick={onOpenSettings}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              )}
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-6 h-6 text-orange-300" />
                    <span className="text-2xl">{streak}</span>
                  </div>
                  <p className="text-xs text-white/70">day streak</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-6 h-6 text-yellow-300" />
                    <span className="text-2xl">{currentLevel}</span>
                  </div>
                  <p className="text-xs text-white/70">level</p>
                </div>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/80">Level {currentLevel}</span>
              <span className="text-white/80">{xpInLevel} / {LEVEL_THRESHOLD} XP</span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-white/20" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Daily Check-In CTA */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white border-2 border-[#F487B6]/20 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-[#3C3C3C] mb-2">Today's Check-In</h3>
                  <p className="text-[#3C3C3C]/60 text-sm mb-4">
                    {hasTodayCheckIn 
                      ? 'You\'ve completed today\'s check-in! You can edit it anytime today.'
                      : 'Track how you\'re feeling and keep your streak alive 🔥'
                    }
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {hasTodayCheckIn ? (
                      <Button
                        onClick={onEditCheckIn}
                        size="lg"
                        className="bg-[#E5B8D1] hover:bg-[#E5B8D1]/90"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Edit Today's Check-In
                      </Button>
                    ) : (
                      <Button
                        onClick={onCheckIn}
                        size="lg"
                        className="bg-[#F487B6] hover:bg-[#F487B6]/90"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Start Check-In
                      </Button>
                    )}
                    <Button
                      onClick={onViewHistory}
                      size="lg"
                      variant="outline"
                      className="border-[#F487B6]/30 text-[#F487B6] hover:bg-[#F487B6]/10"
                    >
                      View History
                    </Button>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#FFC0D3]/20 to-[#E5B8D1]/20 rounded-full flex items-center justify-center">
                    <Plus className="w-12 h-12 text-[#F487B6]" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Period Tracker */}
        {userCategories.includes('cycle') && onOpenPeriodTracker && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-[#C59FA8]/10 to-[#9E6B8E]/10 border-2 border-[#C59FA8]/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-[#9E6B8E]" />
                      <h3 className="text-[#3C3C3C]">Period Tracker</h3>
                    </div>
                    <p className="text-[#3C3C3C]/60 text-sm mb-4">
                      {hasPeriodData 
                        ? 'Update your period days and get cycle-based insights'
                        : 'Get personalized recommendations based on your cycle phase'
                      }
                    </p>
                    <Button
                      onClick={onOpenPeriodTracker}
                      size="lg"
                      className="bg-[#9E6B8E] hover:bg-[#9E6B8E]/90"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      {hasPeriodData ? 'Update Period Data' : 'Add Period Data'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Food Tracker CTA */}
        {onTrackFood && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: (userCategories.includes('cycle') && onOpenPeriodTracker) ? 0.25 : 0.15 }}
          >
            <Card className="bg-gradient-to-br from-[#4FB0AE]/10 to-[#69C9C0]/10 border-2 border-[#4FB0AE]/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Apple className="w-5 h-5 text-[#4FB0AE]" />
                      <h3 className="text-[#3C3C3C]">Track Your Food</h3>
                    </div>
                    <p className="text-[#3C3C3C]/60 text-sm mb-4">
                      Log meals to identify food-symptom patterns. Culturally inclusive database with 100+ cuisines.
                    </p>
                    <Button
                      onClick={onTrackFood}
                      size="lg"
                      className="bg-[#4FB0AE] hover:bg-[#4FB0AE]/90"
                    >
                      <Apple className="w-5 h-5 mr-2" />
                      Log Food
                    </Button>
                  </div>
                  <div className="hidden sm:block">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#4FB0AE]/20 to-[#69C9C0]/20 rounded-full flex items-center justify-center">
                      <Apple className="w-12 h-12 text-[#4FB0AE]" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Stats */}
        {checkIns && checkIns.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: userCategories.includes('cycle') && !hasPeriodData ? 0.3 : 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#F487B6]" />
                    Your Progress
                  </CardTitle>
                  {onViewHistory && (
                    <Button
                      onClick={onViewHistory}
                      variant="ghost"
                      size="sm"
                      className="text-[#F487B6]"
                    >
                      View All
                    </Button>
                  )}
                </div>
                <CardDescription>Last 7 days overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl mb-1">{checkIns.length}</div>
                    <p className="text-xs text-[#3C3C3C]/60">Check-ins</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">
                      {checkIns.length > 0 
                        ? Math.round(checkIns.reduce((sum, c) => sum + c.energy, 0) / checkIns.length)
                        : 0}%
                    </div>
                    <p className="text-xs text-[#3C3C3C]/60">Avg Energy</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">
                      {checkIns.length > 0 
                        ? Math.round(checkIns.reduce((sum, c) => sum + c.waterIntake, 0) / checkIns.length)
                        : 0} oz
                    </div>
                    <p className="text-xs text-[#3C3C3C]/60">Avg Water</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">
                      {checkIns.length > 0 
                        ? (checkIns.reduce((sum, c) => sum + c.mentalClarity, 0) / checkIns.length).toFixed(1)
                        : 0}/10
                    </div>
                    <p className="text-xs text-[#3C3C3C]/60">Mental Clarity</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: userCategories.includes('cycle') && !hasPeriodData ? 0.35 : 0.25 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#C59FA8]" />
                  Your Badges
                </CardTitle>
                <CardDescription>Achievements unlocked on your health journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {badges.map((badge, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-[#C59FA8]/10 text-[#9E6B8E] border-[#C59FA8]/20"
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}