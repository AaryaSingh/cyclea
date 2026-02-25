import { useState } from 'react';
import { 
  Trophy, Target, Users, TrendingUp, Award, Flame, ChevronLeft, Plus, Check,
  ChevronDown, ChevronUp, Medal, UserPlus, Search, Star, Shield, Zap
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface MilestonesScreenProps {
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
  { rank: 1, name: 'Sarah M.', xp: 1250, streak: 28, badge: 'diamond', status: 'online' },
  { rank: 2, name: 'You', xp: 890, streak: 12, badge: 'gold', status: 'online' },
  { rank: 3, name: 'Emma K.', xp: 720, streak: 15, badge: 'silver', status: 'offline' },
  { rank: 4, name: 'Lisa P.', xp: 580, streak: 8, badge: 'bronze', status: 'online' },
  { rank: 5, name: 'Mia R.', xp: 420, streak: 6, badge: 'bronze', status: 'offline' },
];

// Mock league data - weekly competition groups of ~12 users
const BRONZE_LEAGUE_USERS = [
  { rank: 1, name: 'HealthWarrior23', weeklyXP: 245, totalXP: 180, trend: 'up' },
  { rank: 2, name: 'CycleQueen', weeklyXP: 230, totalXP: 210, trend: 'up' },
  { rank: 3, name: 'You', weeklyXP: 215, totalXP: 150, trend: 'same' },
  { rank: 4, name: 'TrackerPro', weeklyXP: 200, totalXP: 190, trend: 'down' },
  { rank: 5, name: 'WellnessJourney', weeklyXP: 185, totalXP: 170, trend: 'up' },
  { rank: 6, name: 'HealthFirst', weeklyXP: 170, totalXP: 160, trend: 'same' },
  { rank: 7, name: 'DailyLogger', weeklyXP: 155, totalXP: 140, trend: 'down' },
  { rank: 8, name: 'PCOSWarrior', weeklyXP: 140, totalXP: 130, trend: 'up' },
  { rank: 9, name: 'MindfulTracker', weeklyXP: 125, totalXP: 120, trend: 'same' },
  { rank: 10, name: 'EndoFighter', weeklyXP: 110, totalXP: 100, trend: 'down' },
  { rank: 11, name: 'GutHealthPro', weeklyXP: 95, totalXP: 90, trend: 'down' },
  { rank: 12, name: 'NewStart2024', weeklyXP: 80, totalXP: 75, trend: 'down' },
];

const LEAGUE_INFO = {
  bronze: { name: 'Bronze', color: '#CD7F32', minXP: 0, emoji: '🥉' },
  silver: { name: 'Silver', color: '#C0C0C0', minXP: 250, emoji: '🥈' },
  gold: { name: 'Gold', color: '#FFD700', minXP: 500, emoji: '🥇' },
  platinum: { name: 'Platinum', color: '#E5E4E2', minXP: 750, emoji: '💎' },
  diamond: { name: 'Diamond', color: '#B9F2FF', minXP: 1000, emoji: '👑' },
};

export function MilestonesScreen({ 
  onBack, 
  userXP, 
  currentLeague, 
  hasLeftLeague,
  onRejoinLeague 
}: MilestonesScreenProps) {
  const [activeTab, setActiveTab] = useState('goals');
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
      <div className="bg-gradient-to-r from-[#4FB0AE] to-[#69C9C0] text-white p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-white/10 mb-3 sm:mb-4 -ml-2"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white text-xl sm:text-2xl mb-1 sm:mb-2">Milestones</h1>
              <p className="text-white/80 text-sm">Track progress and compete</p>
            </div>
            {currentLeague && (
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-1">{currentLeagueInfo?.emoji}</div>
                <p className="text-xs sm:text-sm">{currentLeagueInfo?.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        {hasLeftLeague && onRejoinLeague && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <p className="text-sm text-gray-700 mb-4">
                Join leagues to earn XP and compete with others in weekly challenges!
              </p>
              <Button onClick={onRejoinLeague} className="bg-[#4FB0AE]">
                <Trophy className="w-4 h-4 mr-2" />
                Join Leagues
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm">
            <TabsTrigger value="goals" className="text-xs sm:text-sm">Goals</TabsTrigger>
            <TabsTrigger value="leagues" className="text-xs sm:text-sm">Leagues</TabsTrigger>
            <TabsTrigger value="friends" className="text-xs sm:text-sm">Friends</TabsTrigger>
          </TabsList>

          {/* Combined Goals & Challenges Tab */}
          <TabsContent value="goals" className="space-y-4">
            {/* Daily Goals Section */}
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

            {/* Weekly Challenges Section */}
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

            {/* Quick Tip */}
            <Card className="bg-[#FFC0D3]/10 border-[#F487B6]/20">
              <CardContent className="p-4">
                <p className="text-sm text-gray-700">
                  <strong>💡 Tip:</strong> Consistent daily tracking helps your OBGYN identify patterns and make better diagnoses. Your streak = better health insights!
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leagues Tab */}
          <TabsContent value="leagues" className="space-y-4">
            {currentLeague && (
              <>
                {/* League Progress */}
                <Card className="border-2" style={{ borderColor: currentLeagueInfo?.color }}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="text-2xl">{currentLeagueInfo?.emoji}</span>
                        {currentLeagueInfo?.name} League
                      </span>
                      <Badge style={{ backgroundColor: currentLeagueInfo?.color }}>
                        {userXP} XP
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {nextLeague 
                        ? `${xpToNextLeague} XP to ${LEAGUE_INFO[nextLeague].name} League`
                        : 'Top League Achieved! 🎉'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Progress value={progressToNext} className="h-3" />
                  </CardContent>
                </Card>

                {/* Weekly Leaderboard */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Medal className="w-5 h-5 text-[#FFD700]" />
                      Weekly League Competition
                    </CardTitle>
                    <CardDescription>
                      Resets every Monday • Top 3 get promoted, Bottom 3 get demoted
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {/* Promotion Zone */}
                      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 mb-2">
                        <div className="flex items-center gap-2 text-green-700 mb-2">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm font-medium">Promotion Zone (Top 3)</span>
                        </div>
                        {BRONZE_LEAGUE_USERS.slice(0, 3).map((user) => {
                          const isUser = user.name === 'You';
                          return (
                            <div
                              key={user.rank}
                              className={`flex items-center justify-between p-3 rounded-lg mb-1 ${
                                isUser
                                  ? 'bg-[#4FB0AE]/20 border-2 border-[#4FB0AE]'
                                  : 'bg-white'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                    user.rank === 1
                                      ? 'bg-yellow-400 text-yellow-900'
                                      : user.rank === 2
                                      ? 'bg-gray-300 text-gray-700'
                                      : 'bg-orange-400 text-orange-900'
                                  }`}
                                >
                                  {user.rank}
                                </div>
                                <div>
                                  <p className={`font-medium text-sm ${isUser ? 'text-[#4FB0AE]' : 'text-gray-900'}`}>
                                    {user.name}
                                  </p>
                                  <p className="text-xs text-gray-600">{user.totalXP} total XP</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-sm text-green-600">
                                  {user.weeklyXP} XP
                                </p>
                                <p className="text-xs text-gray-500">this week</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Safe Zone */}
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 mb-2">
                        <div className="flex items-center gap-2 text-blue-700 mb-2">
                          <Shield className="w-4 h-4" />
                          <span className="text-sm font-medium">Safe Zone</span>
                        </div>
                        {BRONZE_LEAGUE_USERS.slice(3, 9).map((user) => {
                          const isUser = user.name === 'You';
                          return (
                            <div
                              key={user.rank}
                              className={`flex items-center justify-between p-3 rounded-lg mb-1 ${
                                isUser
                                  ? 'bg-[#4FB0AE]/20 border-2 border-[#4FB0AE]'
                                  : 'bg-white'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm text-gray-600">
                                  {user.rank}
                                </div>
                                <div>
                                  <p className={`font-medium text-sm ${isUser ? 'text-[#4FB0AE]' : 'text-gray-900'}`}>
                                    {user.name}
                                  </p>
                                  <p className="text-xs text-gray-600">{user.totalXP} total XP</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-sm">
                                  {user.weeklyXP} XP
                                </p>
                                <p className="text-xs text-gray-500">this week</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Demotion Zone */}
                      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-red-700 mb-2">
                          <TrendingUp className="w-4 h-4 rotate-180" />
                          <span className="text-sm font-medium">Demotion Zone (Bottom 3)</span>
                        </div>
                        {BRONZE_LEAGUE_USERS.slice(9, 12).map((user) => {
                          const isUser = user.name === 'You';
                          return (
                            <div
                              key={user.rank}
                              className={`flex items-center justify-between p-3 rounded-lg mb-1 ${
                                isUser
                                  ? 'bg-[#4FB0AE]/20 border-2 border-[#4FB0AE]'
                                  : 'bg-white'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm text-gray-600">
                                  {user.rank}
                                </div>
                                <div>
                                  <p className={`font-medium text-sm ${isUser ? 'text-[#4FB0AE]' : 'text-gray-900'}`}>
                                    {user.name}
                                  </p>
                                  <p className="text-xs text-gray-600">{user.totalXP} total XP</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-sm text-red-600">
                                  {user.weeklyXP} XP
                                </p>
                                <p className="text-xs text-gray-500">this week</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* How Leagues Work */}
                <Card className="bg-purple-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-sm text-purple-900">How Leagues Work</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-purple-900 space-y-2">
                    <p>• <strong>Weekly Competition:</strong> Compete with ~12 users in your league level</p>
                    <p>• <strong>Earn XP:</strong> Complete daily goals, challenges, and check-ins</p>
                    <p>• <strong>Get Promoted:</strong> Finish in top 3 to move up a league</p>
                    <p>• <strong>Avoid Demotion:</strong> Don't finish in bottom 3</p>
                    <p>• <strong>Resets Monday:</strong> New week, new competition group</p>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Friends Tab */}
          <TabsContent value="friends" className="space-y-4">
            {/* Add Friends Card */}
            <Card className="bg-gradient-to-br from-[#4FB0AE]/10 to-[#69C9C0]/10 border-2 border-[#4FB0AE]/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <UserPlus className="w-10 h-10 text-[#4FB0AE] flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Add Friends for Accountability
                    </h3>
                    <p className="text-sm text-gray-700 mb-4">
                      Studies show you're 3x more likely to stick to health tracking when you have accountability partners!
                    </p>
                  </div>
                </div>
                
                {/* Search for friends */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by username or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1 bg-[#4FB0AE] hover:bg-[#4FB0AE]/90">
                    <Search className="w-4 h-4 mr-2" />
                    Find Friends
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    Invite by Link
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Friend Requests (if any) */}
            <Card className="border-[#F487B6]/30 bg-[#FFF0F5]">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#F487B6]" />
                  Friend Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F487B6] to-[#FFC0D3] flex items-center justify-center text-white font-bold">
                      JD
                    </div>
                    <div>
                      <p className="font-medium text-sm">Jane Doe</p>
                      <p className="text-xs text-gray-500">@janedoe_health</p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button size="sm" className="flex-1 sm:flex-none bg-[#4FB0AE] hover:bg-[#4FB0AE]/90">
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                      Decline
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Collapsible Friends Leaderboard */}
            <Collapsible open={isLeaderboardOpen} onOpenChange={setIsLeaderboardOpen}>
              <Card>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-[#4FB0AE]" />
                        <CardTitle>Friends Leaderboard</CardTitle>
                      </div>
                      {isLeaderboardOpen ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <CardDescription>
                      See how you rank among your friends
                    </CardDescription>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-3 pt-0">
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
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Your Friends List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#4FB0AE]" />
                  Your Friends ({MOCK_FRIENDS.length - 1})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {MOCK_FRIENDS.filter(f => f.name !== 'You').map((friend) => {
                  const badgeColor = LEAGUE_INFO[friend.badge as keyof typeof LEAGUE_INFO]?.color;
                  return (
                    <div
                      key={friend.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-200 hover:border-[#4FB0AE] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4FB0AE] to-[#69C9C0] flex items-center justify-center text-white font-bold">
                          {friend.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{friend.name}</p>
                            {friend.status === 'online' && (
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{friend.xp} XP</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Flame className="w-3 h-3 text-orange-500" />
                              {friend.streak} day streak
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5" style={{ color: badgeColor }} />
                        <Button size="sm" variant="ghost">
                          <Zap className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
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