import { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { EnhancedOnboarding } from './components/EnhancedOnboarding';
import { HomeScreen } from './components/HomeScreen';
import { CheckInData } from './components/DailyCheckIn';
import { CheckInWizard } from './components/CheckInWizard';
import { InsightsScreen } from './components/InsightsScreen';
import { ExploreScreen } from './components/ExploreScreen';
import { CommunityScreen } from './components/CommunityScreen';
import { MilestonesScreen } from './components/MilestonesScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { PrivacyScreen } from './components/PrivacyScreen';
import { LogHistoryScreen } from './components/LogHistoryScreen';
import { FoodTracker, FoodEntry } from './components/FoodTracker';
import { PeriodTracker, PeriodData } from './components/PeriodTracker';
import { ClinicianDashboard } from './components/ClinicianDashboard';
import { BottomNav } from './components/BottomNav';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { calculateCyclePhase } from './utils/cycleCalculations';
import { UserData, INITIAL_USER_DATA } from './types';
import { useAuth } from './lib/supabase/auth';
import { isSupabaseConfigured } from './lib/supabase';
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  fetchProfile,
  upsertProfile,
} from './lib/supabase/profile';

type Screen = 'splash' | 'educational' | 'onboarding' | 'main';
type MainTab = 'home' | 'milestones' | 'circles' | 'learn' | 'trends' | 'settings' | 'privacy' | 'log-history' | 'clinician-dashboard';

function App() {
  const { userId, isLoading: authLoading, signInAnonymously } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [isEditingCheckIn, setIsEditingCheckIn] = useState(false);
  const [showFoodTracker, setShowFoodTracker] = useState(false);
  const [showPeriodTracker, setShowPeriodTracker] = useState(false);
  const [userData, setUserData] = useState<UserData>(INITIAL_USER_DATA);
  const [selectedCheckInDate, setSelectedCheckInDate] = useState<Date | undefined>(undefined);

  // Ensure anonymous session when Supabase is configured
  useEffect(() => {
    if (isSupabaseConfigured() && !authLoading && !userId) {
      signInAnonymously();
    }
  }, [isSupabaseConfigured(), authLoading, userId, signInAnonymously]);

  // Load user data (Supabase or localStorage)
  useEffect(() => {
    if (isSupabaseConfigured() && authLoading) return;

    const load = async () => {
      if (isSupabaseConfigured() && userId) {
        const profile = await fetchProfile(userId);
        const local = loadFromLocalStorage();
        if (profile) {
          const isEmpty =
            profile.checkIns.length === 0 &&
            profile.xp === 0 &&
            profile.foodEntries.length === 0;
          const hasLocalData =
            local &&
            (local.checkIns?.length > 0 || local.xp > 0 || local.foodEntries?.length > 0);
          if (isEmpty && hasLocalData) {
            const merged = { ...INITIAL_USER_DATA, ...local };
            setUserData(merged);
            setCurrentScreen('main');
            upsertProfile(userId, merged);
          } else {
            setUserData({ ...INITIAL_USER_DATA, ...profile });
            setCurrentScreen('main');
          }
        } else if (local) {
          const merged = { ...INITIAL_USER_DATA, ...local };
          setUserData(merged);
          setCurrentScreen('main');
          upsertProfile(userId, merged);
        }
      } else {
        const local = loadFromLocalStorage();
        if (local) {
          setUserData({ ...INITIAL_USER_DATA, ...local });
          setCurrentScreen('main');
        }
      }
    };
    load();
  }, [userId, authLoading]);

  // Persist user data when it changes
  useEffect(() => {
    if (currentScreen !== 'main') return;

    if (isSupabaseConfigured() && userId) {
      upsertProfile(userId, userData);
    } else {
      saveToLocalStorage(userData);
    }
  }, [userData, currentScreen, userId]);

  const handleSplashContinue = () => {
    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = (data: Partial<UserData>) => {
    setUserData((prev) => ({
      ...prev,
      ...data,
    }));
    setCurrentScreen('main');
    toast.success('Welcome! Your personalized dashboard is ready 🎉', {
      description: 'Start logging to unlock personalized insights',
    });
  };

  const handleCheckInComplete = (data: CheckInData) => {
    const today = new Date().toDateString();
    const lastCheckInDate = userData.lastCheckIn ? new Date(userData.lastCheckIn).toDateString() : null;
    
    // Check if we're editing today's check-in
    if (isEditingCheckIn && lastCheckInDate === today) {
      // Update existing check-in for today
      const updatedCheckIns = userData.checkIns.map((checkIn) => {
        const checkInDate = new Date(checkIn.timestamp).toDateString();
        if (checkInDate === today) {
          return { ...data, timestamp: new Date() };
        }
        return checkIn;
      });

      setUserData((prev) => ({
        ...prev,
        checkIns: updatedCheckIns,
      }));

      setShowCheckInModal(false);
      setIsEditingCheckIn(false);
      toast.success('Check-in updated! 📝', {
        description: 'Your daily health data has been updated',
      });
      return;
    }
    
    // Check if this is a new day
    const isNewDay = lastCheckInDate !== today;
    const newStreak = isNewDay ? userData.streak + 1 : userData.streak;
    const xpEarned = 15;
    const newXp = userData.xp + xpEarned;

    // Check for new badges
    const newBadges = [...userData.badges];
    if (newStreak === 10 && !newBadges.includes('10-day streak')) {
      newBadges.push('10-day streak');
      toast.success('New badge unlocked: 10-day streak! 🏆');
    }
    if (newStreak === 30 && !newBadges.includes('Month Strong')) {
      newBadges.push('Month Strong');
      toast.success('New badge unlocked: Month Strong! 💪');
    }
    if (userData.checkIns.length + 1 === 50 && !newBadges.includes('50 Check-Ins')) {
      newBadges.push('50 Check-Ins');
      toast.success('New badge unlocked: 50 Check-Ins! ⭐');
    }

    // Check for league promotion
    let newLeague = userData.currentLeague;
    const oldLeague = userData.currentLeague;
    if (!userData.hasLeftLeague && userData.currentLeague) {
      if (newXp >= 1000 && userData.currentLeague !== 'diamond') {
        newLeague = 'diamond';
      } else if (newXp >= 750 && userData.currentLeague === 'gold') {
        newLeague = 'platinum';
      } else if (newXp >= 500 && userData.currentLeague === 'silver') {
        newLeague = 'gold';
      } else if (newXp >= 250 && userData.currentLeague === 'bronze') {
        newLeague = 'silver';
      }
      
      if (newLeague !== oldLeague) {
        toast.success(`🎉 Promoted to ${newLeague.charAt(0).toUpperCase() + newLeague.slice(1)} League!`, {
          description: 'You\'re climbing the ranks! Keep up the great work!',
        });
      }
    }

    setUserData((prev) => ({
      ...prev,
      streak: newStreak,
      xp: newXp,
      badges: newBadges,
      checkIns: [...prev.checkIns, data],
      lastCheckIn: today,
      currentLeague: newLeague,
      leagueXP: newXp,
    }));

    setShowCheckInModal(false);
    setIsEditingCheckIn(false);
    toast.success(`Check-in complete! +${xpEarned} XP 🌟`, {
      description: isNewDay ? `${newStreak} day streak! Keep it up! 🔥` : 'Great job logging your health!',
    });
  };

  const handleCheckInCancel = () => {
    setShowCheckInModal(false);
    setIsEditingCheckIn(false);
  };

  const handleStartCheckIn = () => {
    setIsEditingCheckIn(false);
    setSelectedCheckInDate(undefined);
    setShowCheckInModal(true);
  };

  const handleEditCheckIn = () => {
    setIsEditingCheckIn(true);
    setSelectedCheckInDate(undefined);
    setShowCheckInModal(true);
  };

  const handleSelectDateForCheckIn = (date: Date) => {
    // Check if there's already a check-in for this date
    const checkInForDate = userData.checkIns.find((checkIn) => {
      const checkInDate = new Date(checkIn.timestamp);
      return (
        checkInDate.getDate() === date.getDate() &&
        checkInDate.getMonth() === date.getMonth() &&
        checkInDate.getFullYear() === date.getFullYear()
      );
    });

    setSelectedCheckInDate(date);
    setIsEditingCheckIn(!!checkInForDate);
    setShowCheckInModal(true);
  };

  const handleFoodTrackerOpen = () => {
    setShowFoodTracker(true);
  };

  const handleFoodTrackerSave = (foods: FoodEntry[]) => {
    const xpEarned = 10;
    const newXp = userData.xp + xpEarned;
    
    // Check for league promotion
    let newLeague = userData.currentLeague;
    const oldLeague = userData.currentLeague;
    if (!userData.hasLeftLeague && userData.currentLeague) {
      if (newXp >= 1000 && userData.currentLeague !== 'diamond') {
        newLeague = 'diamond';
      } else if (newXp >= 750 && userData.currentLeague === 'gold') {
        newLeague = 'platinum';
      } else if (newXp >= 500 && userData.currentLeague === 'silver') {
        newLeague = 'gold';
      } else if (newXp >= 250 && userData.currentLeague === 'bronze') {
        newLeague = 'silver';
      }
      
      if (newLeague !== oldLeague) {
        toast.success(`🎉 Promoted to ${newLeague.charAt(0).toUpperCase() + newLeague.slice(1)} League!`, {
          description: 'You\'re climbing the ranks! Keep up the great work!',
        });
      }
    }
    
    setUserData((prev) => ({
      ...prev,
      foodEntries: [...prev.foodEntries, ...foods],
      xp: newXp,
      currentLeague: newLeague,
      leagueXP: newXp,
    }));
    
    toast.success(`Food logged! +${xpEarned} XP 🍎`, {
      description: 'Tracking helps you identify patterns',
    });
    
    setShowFoodTracker(false);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as MainTab);
  };

  const handleBackToHome = () => {
    setActiveTab('home');
  };

  const handlePeriodTrackerSave = (data: PeriodData) => {
    const isEditing = userData.periodData !== null;
    setUserData((prev) => ({
      ...prev,
      periodData: data,
    }));
    
    setShowPeriodTracker(false);
    toast.success(isEditing ? 'Period data updated! 🌸' : 'Period data saved! 🌸', {
      description: 'Your recommendations will be personalized to your cycle',
    });
  };

  const handleLeaveLeague = () => {
    setUserData((prev) => ({
      ...prev,
      currentLeague: null,
      hasLeftLeague: true,
    }));
    
    toast.success('Left league successfully', {
      description: 'You can rejoin anytime from Settings',
    });
  };

  const handleRejoinLeague = () => {
    // Determine league based on XP
    let newLeague: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' = 'bronze';
    if (userData.xp >= 1000) newLeague = 'diamond';
    else if (userData.xp >= 750) newLeague = 'platinum';
    else if (userData.xp >= 500) newLeague = 'gold';
    else if (userData.xp >= 250) newLeague = 'silver';
    
    setUserData((prev) => ({
      ...prev,
      currentLeague: newLeague,
      hasLeftLeague: false,
      leagueXP: prev.xp,
    }));
    
    toast.success(`Joined ${newLeague.charAt(0).toUpperCase() + newLeague.slice(1)} League!`, {
      description: 'Compete with others to climb the ranks',
    });
  };

  // Calculate cycle phase from period data
  const cyclePhase = calculateCyclePhase(userData.periodData);

  // Get recent symptoms from check-ins
  const recentSymptoms = userData.checkIns.length > 0 
    ? userData.checkIns[userData.checkIns.length - 1].symptoms 
    : [];
  
  // Get most recent check-in data
  const recentCheckIn = userData.checkIns.length > 0 
    ? userData.checkIns[userData.checkIns.length - 1]
    : null;

  // Check if there's a check-in for today
  const today = new Date().toDateString();
  const todayCheckIn = userData.checkIns.find((checkIn) => {
    const checkInDate = new Date(checkIn.timestamp).toDateString();
    return checkInDate === today;
  });

  // Calculate current cycle phase for contextual features
  const currentCyclePhase = userData.periodData?.lastPeriodStart 
    ? calculateCyclePhase(userData.periodData)
    : null;

  // Render splash screen
  if (currentScreen === 'splash') {
    return <SplashScreen onContinue={handleSplashContinue} />;
  }

  // Render onboarding
  if (currentScreen === 'onboarding') {
    return <EnhancedOnboarding onComplete={handleOnboardingComplete} />;
  }

  // Render main app
  return (
    <div className={`min-h-screen bg-[#F8F4ED] ${userData.adaptiveMode ? 'adaptive-mode' : ''}`}>
      <Toaster position="top-center" />
      
      <>
          {activeTab === 'home' && (
            <HomeScreen
              streak={userData.streak}
              xp={userData.xp}
              badges={userData.badges}
              recentSymptoms={recentSymptoms}
              cyclePhase={cyclePhase}
              userCategories={userData.categories}
              hasPeriodData={userData.periodData !== null}
              onOpenPeriodTracker={() => setShowPeriodTracker(true)}
              recentCheckIn={recentCheckIn}
              currentLeague={userData.currentLeague}
              hasLeftLeague={userData.hasLeftLeague}
              unlockedLessons={userData.unlockedLessons || []}
              completedLessons={userData.completedLessons || []}
              userData={userData}
              onCheckIn={handleStartCheckIn}
              onEditCheckIn={handleEditCheckIn}
              hasTodayCheckIn={!!todayCheckIn}
              onViewHistory={() => setActiveTab('log-history')}
              onViewInsights={() => setActiveTab('log-history')}
              onTrackFood={() => setShowFoodTracker(true)}
              onOpenSettings={() => setActiveTab('settings')}
              checkIns={userData.checkIns}
              periodData={userData.periodData}
              categories={userData.categories}
            />
          )}

          {activeTab === 'log-history' && (
            <LogHistoryScreen 
              onBack={handleBackToHome}
              checkIns={userData.checkIns}
              foodEntries={userData.foodEntries}
              periodData={userData.periodData}
              onSelectDate={handleSelectDateForCheckIn}
            />
          )}

          {activeTab === 'milestones' && (
            <MilestonesScreen 
              onBack={handleBackToHome}
              userXP={userData.leagueXP}
              currentLeague={userData.currentLeague}
              hasLeftLeague={userData.hasLeftLeague}
              onLeaveLeague={handleLeaveLeague}
              onRejoinLeague={handleRejoinLeague}
            />
          )}

          {activeTab === 'circles' && (
            <CommunityScreen onBack={handleBackToHome} userId={userId} />
          )}

          {activeTab === 'learn' && (
            <ExploreScreen 
              onBack={handleBackToHome}
              unlockedLessons={userData.unlockedLessons || []}
              completedLessons={userData.completedLessons || []}
              onCompleteLesson={(lessonId) => {
                setUserData(prev => ({
                  ...prev,
                  completedLessons: [...(prev.completedLessons || []), lessonId],
                  xp: prev.xp + 10,
                }));
                toast.success('Lesson completed! +10 XP 📚');
              }}
            />
          )}

          {activeTab === 'trends' && (
            <InsightsScreen 
              onBack={handleBackToHome}
              checkIns={userData.checkIns}
              periodData={userData.periodData}
              categories={userData.categories}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsScreen 
              onBack={handleBackToHome}
              onViewPrivacy={() => setActiveTab('privacy')}
              currentLeague={userData.currentLeague}
              hasLeftLeague={userData.hasLeftLeague}
              onLeaveLeague={handleLeaveLeague}
              onRejoinLeague={handleRejoinLeague}
              onOpenPeriodTracker={() => setShowPeriodTracker(true)}
              userData={userData}
              onUpdateUserData={(updates) => setUserData(prev => ({ ...prev, ...updates }))}
              onViewClinicianDashboard={() => setActiveTab('clinician-dashboard')}
            />
          )}

          {activeTab === 'privacy' && (
            <PrivacyScreen 
              onBack={() => setActiveTab('settings')}
              userData={userData}
              onUpdateConsent={(key, value) => {
                setUserData(prev => ({ ...prev, [key]: value }));
              }}
            />
          )}

          {activeTab === 'clinician-dashboard' && (
            <ClinicianDashboard 
              onBack={handleBackToHome}
              userData={userData}
            />
          )}

          {/* Bottom Navigation - hidden when check-in modal is open or on log history */}
          {!showCheckInModal && activeTab !== 'log-history' && activeTab !== 'privacy' && activeTab !== 'clinician-dashboard' && (
            <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
          )}
        </>

      {/* Daily Check-in Modal */}
      {showCheckInModal && (
        <CheckInWizard
          categories={userData.categories}
          onComplete={handleCheckInComplete}
          onCancel={handleCheckInCancel}
          onTrackFood={handleFoodTrackerOpen}
          onTrackPeriod={() => setShowPeriodTracker(true)}
          lastCheckIn={isEditingCheckIn ? todayCheckIn : undefined}
          isEditing={isEditingCheckIn}
          isPregnant={userData.isPregnant}
          cyclePhase={currentCyclePhase}
          selectedDate={selectedCheckInDate}
          onXPGain={(amount, reason) => {
            // Award XP for completing each section (no toast, just update state)
            const newXp = userData.xp + amount;
            setUserData(prev => ({
              ...prev,
              xp: newXp,
            }));
          }}
        />
      )}

      {/* Food Tracker Modal */}
      {showFoodTracker && (
        <FoodTracker
          onClose={() => setShowFoodTracker(false)}
          onSave={handleFoodTrackerSave}
          symptom="bloating"
        />
      )}

      {/* Period Tracker Modal */}
      {showPeriodTracker && (
        <PeriodTracker
          onClose={() => setShowPeriodTracker(false)}
          onSave={handlePeriodTrackerSave}
          existingData={userData.periodData}
        />
      )}
    </div>
  );
}

export default App;