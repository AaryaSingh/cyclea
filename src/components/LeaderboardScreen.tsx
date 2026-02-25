import { useState } from 'react';
import { Trophy, Target, Users, TrendingUp, Award, Flame, ChevronLeft, Plus, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface LeaderboardScreenProps {
  onBack: () => void;
  userXP: number;
  currentLeague: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | null;
  hasLeftLeague: boolean;
  onLeaveLeague?: () => void;
  onRejoinLeague?: () => void;
}

const DAILY_GOALS = [
  { id: 'checkin', name: 'Daily Check-In', xp: 15, icon: Check },
  { id: 'water', name: 'Drink 64oz Water', xp: 10, icon: TrendingUp },
  { id: 'sleep', name: 'Log Sleep Quality', xp: 10, icon: Check },
  { id: 'symptoms', name: 'Track Symptoms', xp: 10, icon: Check },
];

const WEEKLY_CHALLENGES = [
  { id: 'streak-7', name: '7-Day Streak', goal: 7, current: 3, xp: 50 },
  { id: 'water-week', name: 'Hit Water Goal 5 Days', goal: 5, current: 2, xp: 40 },
  { id: 'complete-profile', name: 'Complete Health Profile', goal: 1, current: 0, xp: 30 },
];

// Mock friend data
const MOCK_FRIENDS = [
  { rank: 1, name: 'Sarah M.', xp: 1250, streak: 28, badge: 'diamond' },
  { rank: 2, name: 'You', xp: 890, streak: 12, badge: 'gold' },
  { rank: 3, name: 'Emma K.', xp: 720, streak: 15, badge: 'silver' },
  { rank: 4, name: 'Lisa P.', xp: 580, streak: 8, badge: 'bronze' },
  { rank: 5, name: 'Mia R.', xp: 420, streak: 6, badge: 'bronze' },
];

const LEAGUE_INFO = {
  bronze: { name: 'Bronze', color: '#CD7F32', minXP: 0 },
  silver: { name: 'Silver', color: '#C0C0C0', minXP: 250 },
  gold: { name: 'Gold', color: '#FFD700', minXP: 500 },
  platinum: { name: 'Platinum', color: '#E5E4E2', minXP: 750 },
  diamond: { name: 'Diamond', color: '#B9F2FF', minXP: 1000 },
};

export function LeaderboardScreen({ 
  onBack, 
  userXP, 
  currentLeague, 
  hasLeftLeague,
  onRejoinLeague 
}: LeaderboardScreenProps) {
  const [activeTab, setActiveTab] = useState('goals');

  const currentLeagueInfo = currentLeague ? LEAGUE_INFO[currentLeague] : null;
  const nextLeague = currentLeague === 'bronze' ? 'silver' 
    : currentLeague === 'silver' ? 'gold'
    : currentLeague === 'gold' ? 'platinum'
    : currentLeague === 'platinum' ? 'diamond'
    : null;
  
  const nextLeagueInfo = nextLeague ? LEAGUE_INFO[nextLeague] : null;
  const xpToNextLeague = nextLeagueInfo ? nextLeagueInfo.minXP - userXP : 0;
  const progressToNext = nextLeagueInfo 
    ? ((userXP - (currentLeagueInfo?.minXP || 0)) / (nextLeagueInfo.minXP - (currentLeagueInfo?.minXP || 0))) * 100
    : 100;

  return (
    <div className="min-h-screen bg-[#FFF0F5] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4FB0AE] to-[#69C9C0] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-white/10 mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white mb-2">Your Progress</h1>
              <p className="text-white/80">Track habits and compete with friends</p>
            </div>
            {currentLeague && (
              <div className="text-center">
                <Trophy 
                  className="w-12 h-12 mx-auto mb-2" 
                  style={{ color: currentLeagueInfo?.color }} 
                />
                <p className="text-sm">{currentLeagueInfo?.name} League</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* League Progress */}
        {currentLeague && nextLeague && (
          <Card className="border-2" style={{ borderColor: currentLeagueInfo?.color }}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>League Progress</span>
                <Badge style={{ backgroundColor: currentLeagueInfo?.color }}>
                  {userXP} XP
                </Badge>
              </CardTitle>
              <CardDescription>
                {xpToNextLeague > 0 
                  ? `${xpToNextLeague} XP to ${LEAGUE_INFO[nextLeague].name} League`
                  : 'Top League Achieved! 🎉'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progressToNext} className="h-3" />
            </CardContent>
          </Card>
        )}

        {hasLeftLeague && onRejoinLeague && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <p className="text-sm text-gray-700 mb-4">
                Join the competition to earn XP and climb the leagues!
              </p>
              <Button onClick={onRejoinLeague} className="bg-[#4FB0AE]">
                <Trophy className="w-4 h-4 mr-2" />
                Join Competition
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="goals">Daily Goals</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
          </TabsList>

          {/* Daily Goals */}
          <TabsContent value="goals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#4FB0AE]" />
                  Today's Goals
                </CardTitle>
                <CardDescription>
                  Complete daily goals to earn XP and maintain your streak
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {DAILY_GOALS.map((goal) => {
                  const Icon = goal.icon;
                  const completed = Math.random() > 0.5; // Mock completion

                  return (
                    <div
                      key={goal.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                        completed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            completed ? 'bg-green-500' : 'bg-gray-200'
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 ${
                              completed ? 'text-white' : 'text-gray-500'
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{goal.name}</p>
                          <p className="text-sm text-gray-600">+{goal.xp} XP</p>
                        </div>
                      </div>
                      {completed && (
                        <Badge className="bg-green-500">Completed ✓</Badge>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Tip */}
            <Card className="bg-[#FFC0D3]/10 border-[#F487B6]/20">
              <CardContent className="p-4">
                <p className="text-sm text-gray-700">
                  <strong>💡 Tip:</strong> Consistent daily tracking helps your OBGYN identify patterns and make better diagnoses. Your streak = better health insights!
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weekly Challenges */}
          <TabsContent value="challenges" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#F487B6]" />
                  This Week's Challenges
                </CardTitle>
                <CardDescription>
                  Complete challenges for bonus XP
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {WEEKLY_CHALLENGES.map((challenge) => {
                  const progress = (challenge.current / challenge.goal) * 100;

                  return (
                    <div key={challenge.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {challenge.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {challenge.current} / {challenge.goal} completed
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-[#F487B6]/10 text-[#F487B6]">
                          +{challenge.xp} XP
                        </Badge>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Monthly Challenge */}
            <Card className="bg-gradient-to-br from-[#F487B6]/20 to-[#FFC0D3]/20 border-2 border-[#F487B6]/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  Monthly Challenge: 30-Day Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-3">
                  Check in every day for 30 days straight to earn a special badge and 200 XP bonus!
                </p>
                <div className="flex items-center gap-2">
                  <Progress value={40} className="flex-1 h-3" />
                  <span className="text-sm font-medium">12/30</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Friends Leaderboard */}
          <TabsContent value="friends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#4FB0AE]" />
                  Friends Leaderboard
                </CardTitle>
                <CardDescription>
                  See how you rank among your friends
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {MOCK_FRIENDS.map((friend) => {
                  const isUser = friend.name === 'You';
                  const badgeColor = LEAGUE_INFO[friend.badge as keyof typeof LEAGUE_INFO]?.color;

                  return (
                    <div
                      key={friend.rank}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        isUser
                          ? 'bg-[#4FB0AE]/10 border-2 border-[#4FB0AE]'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            friend.rank === 1
                              ? 'bg-yellow-400 text-yellow-900'
                              : friend.rank === 2
                              ? 'bg-gray-300 text-gray-700'
                              : friend.rank === 3
                              ? 'bg-orange-400 text-orange-900'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {friend.rank}
                        </div>
                        <div>
                          <p className={`font-medium ${isUser ? 'text-[#4FB0AE]' : 'text-gray-900'}`}>
                            {friend.name}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{friend.xp} XP</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Flame className="w-3 h-3 text-orange-500" />
                              {friend.streak}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Trophy className="w-6 h-6" style={{ color: badgeColor }} />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Invite Friends */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Users className="w-10 h-10 text-[#4FB0AE] flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Invite Friends for Accountability
                    </h3>
                    <p className="text-sm text-gray-700 mb-4">
                      Studies show you're 3x more likely to stick to health tracking when you have accountability partners!
                    </p>
                    <Button className="bg-[#4FB0AE] hover:bg-[#4FB0AE]/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Invite Friends
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Clinical Note */}
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <p className="text-sm text-purple-900">
                  <strong>📊 For Your Doctor:</strong> Your tracking consistency is shared with your OBGYN. Higher engagement = more reliable diagnostic data for your appointments.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
