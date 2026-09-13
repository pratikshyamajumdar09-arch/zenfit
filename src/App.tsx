import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { YogaSection } from './components/YogaSection';
import { WorkoutLibrary } from './components/WorkoutLibrary';
import { PlanManager } from './components/PlanManager';
import { MeditationWellness } from './components/MeditationWellness';
import { ProgressAnalytics } from './components/ProgressAnalytics';
import { TrainerProfiles } from './components/TrainerProfiles';
import { AiCoachChat } from './components/AiCoachChat';
import { WorkoutPlayer } from './components/WorkoutPlayer';
import { ProfileModal } from './components/ProfileModal';
import {
  NavigationTab,
  UserProfile,
  PersonalizedPlan,
  YogaSession,
  WorkoutItem,
  CompletedSessionRecord,
} from './types';
import {
  INITIAL_USER,
  INITIAL_PLAN,
  YOGA_SESSIONS,
  WORKOUT_LIBRARY,
  MEDITATION_SESSIONS,
  TRAINERS,
  RECENT_SESSIONS_HISTORY,
} from './data/mockData';
import { sound } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('zenfit_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_USER,
          ...parsed,
          preferences: {
            ...INITIAL_USER.preferences,
            ...(parsed.preferences || {}),
          },
        };
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_USER;
  });

  const [plan, setPlan] = useState<PersonalizedPlan>(() => {
    try {
      const saved = localStorage.getItem('zenfit_plan');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_PLAN,
          ...parsed,
        };
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PLAN;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('zenfit_favs');
    return saved ? JSON.parse(saved) : ['yoga-1', 'workout-2'];
  });

  const [waterCount, setWaterCount] = useState<number>(() => {
    const saved = localStorage.getItem('zenfit_water');
    return saved ? Number(saved) : 1750;
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem('zenfit_streak');
    return saved ? Number(saved) : 7;
  });

  const [todayCalories, setTodayCalories] = useState<number>(() => {
    const saved = localStorage.getItem('zenfit_today_cal');
    return saved ? Number(saved) : 310;
  });

  const [todayMinutes, setTodayMinutes] = useState<number>(() => {
    const saved = localStorage.getItem('zenfit_today_min');
    return saved ? Number(saved) : 40;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activePlayerSession, setActivePlayerSession] = useState<
    (YogaSession | WorkoutItem) | null
  >(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [completedRecords, setCompletedRecords] = useState<CompletedSessionRecord[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to local persistence
  useEffect(() => {
    localStorage.setItem('zenfit_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('zenfit_plan', JSON.stringify(plan));
  }, [plan]);

  useEffect(() => {
    localStorage.setItem('zenfit_favs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('zenfit_water', String(waterCount));
  }, [waterCount]);

  useEffect(() => {
    localStorage.setItem('zenfit_today_cal', String(todayCalories));
  }, [todayCalories]);

  useEffect(() => {
    localStorage.setItem('zenfit_today_min', String(todayMinutes));
  }, [todayMinutes]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddWater = (amountMl: number) => {
    setWaterCount((prev) => prev + amountMl);
    sound.playCountdownBeep(soundEnabled, false);
    showToast(`Hydration logged: +${amountMl}ml💧`);
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from favorites');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Saved to your favorites ⭐');
        return [...prev, id];
      }
    });
  };

  const handleStartSession = (session: YogaSession | WorkoutItem) => {
    setActivePlayerSession(session);
  };

  const handleStartSessionByName = (workoutTitle: string, category: string) => {
    // Find matching yoga or workout or default
    const matched =
      YOGA_SESSIONS.find((y) => y.title.toLowerCase() === workoutTitle.toLowerCase()) ||
      WORKOUT_LIBRARY.find((w) => w.title.toLowerCase() === workoutTitle.toLowerCase()) ||
      YOGA_SESSIONS[0];
    setActivePlayerSession(matched);
  };

  const handleFinishSession = (stats: {
    calories: number;
    minutes: number;
    title: string;
    category: string;
  }) => {
    setTodayCalories((c) => c + stats.calories);
    setTodayMinutes((m) => m + stats.minutes);

    const newRecord: CompletedSessionRecord = {
      id: `record-${Date.now()}`,
      title: stats.title,
      category: stats.category,
      durationMinutes: stats.minutes,
      caloriesBurned: stats.calories,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      instructorName: activePlayerSession?.instructorName || 'ZenFit Coach',
    };

    setCompletedRecords((prev) => [newRecord, ...prev]);
    showToast(`Session recorded! +${stats.calories} kcal burned 🔥`);
  };

  const handleFinishMeditation = (title: string, minutes: number) => {
    setTodayMinutes((m) => m + minutes);
    showToast(`Meditation complete: "${title}" (${minutes}m) 🧘`);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-stone-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        user={user}
        onOpenAuth={(type) => {
          setUser((prev) => ({ ...prev, isLoggedIn: true }));
          showToast(type === 'login' ? `Welcome back, ${user.name}!` : `Welcome to ZenFit, ${user.name}! 🌿`);
        }}
        onLogout={() => {
          setUser((prev) => ({ ...prev, isLoggedIn: false }));
          showToast('Signed out of ZenFit. Your workout history remains saved locally.');
        }}
        waterCount={waterCount}
        onAddWater={handleAddWater}
        onQuickWaterAdd={() => handleAddWater(250)}
        streakDays={streakDays}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        favoriteCount={favorites.length}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            user={user}
            plan={plan}
            recommendedYoga={YOGA_SESSIONS[0]}
            recommendedWorkout={WORKOUT_LIBRARY[1]}
            waterCount={waterCount}
            onAddWater={handleAddWater}
            streakDays={streakDays}
            onSelectTab={setActiveTab}
            onStartSession={handleStartSession}
            todayCalories={todayCalories}
            todayMinutes={todayMinutes}
          />
        )}

        {activeTab === 'yoga' && (
          <YogaSection
            sessions={YOGA_SESSIONS}
            onStartSession={handleStartSession}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'workouts' && (
          <WorkoutLibrary
            workouts={WORKOUT_LIBRARY}
            onStartSession={handleStartSession}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'plans' && (
          <PlanManager
            plan={plan}
            onUpdatePlan={setPlan}
            onStartSessionById={handleStartSessionByName}
            userPreferences={user.preferences}
          />
        )}

        {activeTab === 'meditation' && (
          <MeditationWellness
            sessions={MEDITATION_SESSIONS}
            soundEnabled={soundEnabled}
            onFinishMeditation={handleFinishMeditation}
          />
        )}

        {activeTab === 'analytics' && (
          <ProgressAnalytics
            streakDays={streakDays}
            totalCalories={todayCalories}
            totalMinutes={todayMinutes}
            sessionRecords={completedRecords}
          />
        )}

        {activeTab === 'trainers' && (
          <TrainerProfiles
            trainers={TRAINERS}
            yogaSessions={YOGA_SESSIONS}
            workoutItems={WORKOUT_LIBRARY}
            onStartSession={handleStartSession}
          />
        )}

        {activeTab === 'coach' && (
          <AiCoachChat
            user={user}
            onOpenSessionByName={handleStartSessionByName}
          />
        )}

        {activeTab === 'profile' && (
          <div className="py-6 max-w-2xl mx-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 mb-4 inline-flex items-center space-x-1"
            >
              <span>← Back to Dashboard</span>
            </button>
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
              <div className="flex items-center space-x-4 pb-6 border-b border-stone-100">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-emerald-100"
                />
                <div>
                  <h2 className="text-xl font-bold text-stone-900 font-display">{user.name}</h2>
                  <p className="text-xs text-stone-500">{user.email}</p>
                  <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {user.tier}
                  </span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
                  <p className="text-stone-500 font-medium">Daily Calorie Target</p>
                  <p className="text-base font-bold text-stone-900 mt-1">{user.dailyCaloriesGoal} kcal</p>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
                  <p className="text-stone-500 font-medium">Daily Hydration Goal</p>
                  <p className="text-base font-bold text-stone-900 mt-1">{(user.dailyWaterGoalMl / 1000).toFixed(1)} L</p>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
                  <p className="text-stone-500 font-medium">Primary Goal</p>
                  <p className="text-base font-bold text-stone-900 mt-1">{user.preferences?.goal || user.fitnessGoal}</p>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
                  <p className="text-stone-500 font-medium">Experience Level</p>
                  <p className="text-base font-bold text-stone-900 mt-1">{user.preferences?.experienceLevel || user.experienceLevel}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 shadow-sm transition-all"
                >
                  Edit Profile & Targets
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Interactive Fullscreen Workout Player */}
      {activePlayerSession && (
        <WorkoutPlayer
          title={activePlayerSession.title}
          category={activePlayerSession.category}
          instructorName={activePlayerSession.instructorName}
          estimatedCalories={
            'estimatedCalories' in activePlayerSession
              ? activePlayerSession.estimatedCalories
              : activePlayerSession.caloriesBurned
          }
          exercises={activePlayerSession.exercises}
          soundEnabled={soundEnabled}
          onClose={() => setActivePlayerSession(null)}
          onFinishSession={handleFinishSession}
        />
      )}

      {/* User Profile & Settings Modal */}
      {isProfileModalOpen && (
        <ProfileModal
          user={user}
          onUpdateUser={setUser}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-stone-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
