import React from 'react';
import {
  Flame,
  Clock,
  Droplets,
  Award,
  Play,
  Calendar,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Plus,
  Compass,
  Heart,
  Dumbbell,
  CheckCircle2,
  Quote,
} from 'lucide-react';
import {
  UserProfile,
  YogaSession,
  WorkoutItem,
  PersonalizedPlan,
  NavigationTab,
} from '../types';
import { MOTIVATIONAL_QUOTES } from '../data/mockData';

interface DashboardProps {
  user: UserProfile;
  plan: PersonalizedPlan;
  recommendedYoga: YogaSession;
  recommendedWorkout: WorkoutItem;
  waterCount: number;
  onAddWater: (amountMl: number) => void;
  streakDays: number;
  onSelectTab: (tab: NavigationTab) => void;
  onStartSession: (session: YogaSession | WorkoutItem) => void;
  todayCalories: number;
  todayMinutes: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  plan,
  recommendedYoga,
  recommendedWorkout,
  waterCount,
  onAddWater,
  streakDays,
  onSelectTab,
  onStartSession,
  todayCalories,
  todayMinutes,
}) => {
  const quote = MOTIVATIONAL_QUOTES[0];
  const waterGoal = user.dailyWaterGoalMl || 2500;
  const waterPercent = Math.min(100, Math.round((waterCount / waterGoal) * 100));

  const caloriesGoal = user.dailyCaloriesGoal || 450;
  const caloriesPercent = Math.min(100, Math.round((todayCalories / caloriesGoal) * 100));

  // Circular ring dash calculation (circumference for radius 32 is ~201)
  const ringCircumference = 201;
  const ringDashOffset = ringCircumference - (ringCircumference * caloriesPercent) / 100;

  // Find today's plan day
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayPlanItem = plan.days.find((d) => d.dayName === todayName) || plan.days[0];

  // Weekly data bars for chart
  const weekDays = [
    { day: 'Mon', minutes: 35, calories: 240, completed: true },
    { day: 'Tue', minutes: 45, calories: 310, completed: true },
    { day: 'Wed', minutes: 25, calories: 180, completed: true },
    { day: 'Thu', minutes: todayMinutes, calories: todayCalories, isToday: true, completed: todayMinutes > 0 },
    { day: 'Fri', minutes: 30, calories: 210, completed: false },
    { day: 'Sat', minutes: 40, calories: 290, completed: false },
    { day: 'Sun', minutes: 20, calories: 140, completed: false },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome & Motivational Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-stone-900 text-white p-6 sm:p-10 shadow-xl border border-emerald-800/40">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-60 h-60 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Daily Mindful Flow</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-white">
            Welcome to your sanctuary, {user.name.split(' ')[0]}.
          </h1>

          <p className="mt-2 text-sm sm:text-base text-stone-300 max-w-2xl leading-relaxed">
            "{quote.text}"
            <span className="block mt-1 text-xs text-emerald-400 font-medium">— {quote.author}</span>
          </p>

          {/* Action Row */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onStartSession(recommendedYoga)}
              className="px-5 py-3 rounded-2xl bg-white text-stone-900 font-semibold text-sm hover:bg-stone-100 shadow-md flex items-center space-x-2 transition-transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-stone-900" />
              <span>Start Today's Flow ({recommendedYoga.durationMinutes}m)</span>
            </button>
            <button
              onClick={() => onSelectTab('coach')}
              className="px-4 py-3 rounded-2xl bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 text-sm font-medium border border-emerald-700/50 flex items-center space-x-1.5 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Ask AI Coach</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Calories Burned with Circular Progress */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-700">Calories Burned</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-2xl font-bold text-stone-900">{todayCalories}</span>
              <span className="text-xs text-stone-600">/ {caloriesGoal} kcal</span>
            </div>
            <p className="text-xs text-emerald-800 font-medium mt-1 flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{caloriesPercent}% of daily goal</span>
            </p>
          </div>
          {/* Mini circular progress */}
          <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 76 76">
              <circle cx="38" cy="38" r="32" fill="none" stroke="#f5f5f4" strokeWidth="6" />
              <circle
                cx="38"
                cy="38"
                r="32"
                fill="none"
                stroke="#059669"
                strokeWidth="6"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringDashOffset}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <Flame className="w-5 h-5 text-amber-500 absolute" />
          </div>
        </div>

        {/* Stat 2: Active Workout Minutes */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-700">Workout Duration</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-2xl font-bold text-stone-900">{todayMinutes}</span>
              <span className="text-xs text-stone-600">mins today</span>
            </div>
            <p className="text-xs text-stone-600 mt-1">Target: {user.preferences.availableTimeMinutes}m session</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center flex-shrink-0 border border-emerald-100">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 3: Streak Tracker */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-700">Active Streak</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-2xl font-bold text-stone-900">{streakDays}</span>
              <span className="text-xs text-stone-600">days in a row</span>
            </div>
            <p className="text-xs text-amber-800 font-medium mt-1">Personal Best: 14 days 🔥</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center flex-shrink-0 border border-amber-100">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 4: Water Intake Tracker with quick logging */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-700">Hydration</span>
            <button
              onClick={() => onAddWater(250)}
              className="text-xs font-semibold px-2 py-1 rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 flex items-center space-x-1 transition-colors"
              title="Add 250ml glass of water"
            >
              <Plus className="w-3 h-3" />
              <span>250ml</span>
            </button>
          </div>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-2xl font-bold text-stone-900">{(waterCount / 1000).toFixed(1)}</span>
            <span className="text-xs text-stone-600">/ {(waterGoal / 1000).toFixed(1)} Liters</span>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${waterPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Recommended for Today & Weekly Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Today's Curated Routine */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <h2 className="text-lg font-bold text-stone-900 font-display">Recommended For You Today</h2>
            </div>
            <button
              onClick={() => onSelectTab('yoga')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center space-x-1"
            >
              <span>Explore Studio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Highlight Card */}
          <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow group">
            <div className="relative h-56 sm:h-64 w-full overflow-hidden">
              <img
                src={recommendedYoga.imageUrl}
                alt={recommendedYoga.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />

              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-800/90 text-white backdrop-blur-md">
                  {recommendedYoga.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-900/70 text-stone-200 backdrop-blur-md">
                  {recommendedYoga.difficulty}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs text-stone-300">Curated by {recommendedYoga.instructorName}</p>
                <h3 className="text-xl sm:text-2xl font-bold font-display mt-0.5">{recommendedYoga.title}</h3>
                <div className="flex items-center space-x-4 text-xs text-stone-300 mt-2">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{recommendedYoga.durationMinutes} mins</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>{recommendedYoga.estimatedCalories} kcal</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed">
                {recommendedYoga.description}
              </p>

              <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={recommendedYoga.instructorAvatar}
                    alt={recommendedYoga.instructorName}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/20"
                  />
                  <div>
                    <p className="text-xs font-semibold text-stone-900">{recommendedYoga.instructorName}</p>
                    <p className="text-[11px] text-stone-500">Master Instructor</p>
                  </div>
                </div>

                <button
                  onClick={() => onStartSession(recommendedYoga)}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-800 text-white font-semibold text-xs sm:text-sm hover:bg-emerald-900 shadow-sm flex items-center space-x-2 transition-all active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start Flow</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Weekly Progress & Upcoming Scheduled */}
        <div className="lg:col-span-5 space-y-6">
          {/* Weekly Activity Bar Chart */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-bold text-stone-900 text-sm font-display">Weekly Consistency</h3>
                <p className="text-xs text-stone-500">Total this week: 195 mins</p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">
                On Track
              </span>
            </div>

            {/* Custom Bar Graph */}
            <div className="mt-5 flex items-end justify-between h-36 pt-4 px-2">
              {weekDays.map((item, idx) => {
                const heightPercent = Math.min(100, Math.max(15, (item.minutes / 50) * 100));
                return (
                  <div key={idx} className="flex flex-col items-center flex-1">
                    <span className="text-[10px] text-stone-400 font-mono mb-1.5">
                      {item.minutes}m
                    </span>
                    <div className="w-6 sm:w-8 bg-stone-100 rounded-xl h-24 flex items-end p-0.5">
                      <div
                        className={`w-full rounded-lg transition-all duration-500 ${
                          item.isToday
                            ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-sm ring-2 ring-emerald-400/40'
                            : item.completed
                            ? 'bg-emerald-700/80'
                            : 'bg-stone-300/80'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium ${
                        item.isToday ? 'text-emerald-700 font-bold' : 'text-stone-500'
                      }`}
                    >
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's Personalized Plan Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-stone-900 text-sm font-display">Personalized Plan: {todayPlanItem.dayName}</h3>
              </div>
              <button
                onClick={() => onSelectTab('plans')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                View Week
              </button>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {todayPlanItem.category}
                </span>
                <span className="text-xs text-stone-500">{todayPlanItem.durationMinutes} mins</span>
              </div>
              <h4 className="font-bold text-stone-900 text-sm mt-2">{todayPlanItem.workoutTitle}</h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">{todayPlanItem.description}</p>

              <div className="mt-3 flex items-center justify-between pt-3 border-t border-stone-200/60">
                <span className="text-xs text-stone-500 font-medium">Est. {todayPlanItem.calories} kcal</span>
                <button
                  onClick={() => onStartSession(recommendedWorkout)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition-colors shadow-sm"
                >
                  Start Workout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation / Explore Pillars */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-stone-900 font-display">Explore Mindful Movement</h2>
          <span className="text-xs text-stone-500">Pick your practice</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div
            onClick={() => onSelectTab('yoga')}
            className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 text-sm">Yoga Studio</h3>
            <p className="text-xs text-stone-500 mt-0.5">Vinyasa, Yin, & Spine Relief</p>
          </div>

          <div
            onClick={() => onSelectTab('workouts')}
            className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-sm hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Dumbbell className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 text-sm">Workout Library</h3>
            <p className="text-xs text-stone-500 mt-0.5">Strength, HIIT, & Core</p>
          </div>

          <div
            onClick={() => onSelectTab('meditation')}
            className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-sm hover:border-cyan-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 text-sm">Meditation & Breath</h3>
            <p className="text-xs text-stone-500 mt-0.5">Box breathing & Soundscapes</p>
          </div>

          <div
            onClick={() => onSelectTab('coach')}
            className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-sm hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 text-sm">AI Coach</h3>
            <p className="text-xs text-stone-500 mt-0.5">Personalized cues & recovery</p>
          </div>
        </div>
      </div>
    </div>
  );
};
