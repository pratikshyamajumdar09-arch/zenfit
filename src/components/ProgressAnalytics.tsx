import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  Clock,
  Flame,
  Calendar,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Star,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import { CompletedSessionRecord } from '../types';
import { RECENT_SESSIONS_HISTORY } from '../data/mockData';

interface ProgressAnalyticsProps {
  streakDays: number;
  totalCalories: number;
  totalMinutes: number;
  sessionRecords: CompletedSessionRecord[];
}

export const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({
  streakDays,
  totalCalories,
  totalMinutes,
  sessionRecords,
}) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  // Combine default history with any newly logged sessions in this session
  const allRecords = [...sessionRecords, ...RECENT_SESSIONS_HISTORY];

  // 28-day activity heatmap mock
  const heatmapDays = Array.from({ length: 28 }, (_, i) => {
    // Generate realistic activity intensity 0 to 4
    const intensities = [1, 2, 3, 0, 2, 4, 3, 2, 0, 3, 4, 2, 3, 1, 0, 2, 3, 4, 3, 2, 0, 1, 3, 4, 3, 2, 3, 4];
    return {
      day: i + 1,
      intensity: intensities[i % intensities.length],
      minutes: intensities[i % intensities.length] * 15,
    };
  });

  // Category distribution
  const categories = [
    { name: 'Vinyasa & Yin Yoga', percent: 45, color: 'bg-emerald-600', minutes: 420 },
    { name: 'Strength & Hypertrophy', percent: 25, color: 'bg-teal-600', minutes: 230 },
    { name: 'Cardio & HIIT', percent: 20, color: 'bg-amber-500', minutes: 185 },
    { name: 'Meditation & Breath', percent: 10, color: 'bg-cyan-500', minutes: 95 },
  ];

  // Weekly calorie trend bars
  const weeklyData = [
    { day: 'Mon', calories: 340, target: 400 },
    { day: 'Tue', calories: 420, target: 400 },
    { day: 'Wed', calories: 290, target: 400 },
    { day: 'Thu', calories: 480, target: 400 },
    { day: 'Fri', calories: 310, target: 400 },
    { day: 'Sat', calories: 520, target: 400 },
    { day: 'Sun', calories: 240, target: 400 },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Biometric & Consistency Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
            Progress & Insights
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Tracking your holistic transformation, caloric burn, and nervous system discipline.
          </p>
        </div>

        {/* Timeframe switch */}
        <div className="flex items-center space-x-1 p-1 bg-stone-200/80 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setTimeframe('week')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              timeframe === 'week' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              timeframe === 'month' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeframe('year')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              timeframe === 'year' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All-Time
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
              Total Workouts
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-bold font-display text-stone-900">
              {allRecords.length + 18}
            </span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center">
              +14% <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Sessions logged to date</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
              Total Active Time
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-bold font-display text-stone-900">
              {(totalMinutes / 60 + 16.5).toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-stone-600">Hours</span>
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Average 34 mins / session</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
              Energy Expended
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-bold font-display text-stone-900">
              {(totalCalories + 8420).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-stone-600">kcal</span>
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Surpassing monthly target</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
              Discipline Streak
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-bold font-display text-stone-900">{streakDays}</span>
            <span className="text-xs font-semibold text-stone-600">Days</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">Longest record: 14 days</p>
        </div>
      </div>

      {/* Main Charts: Caloric Output & Category Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Calorie Trend (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-stone-900 text-sm font-display">
                Weekly Calorie Expenditure
              </h3>
              <p className="text-xs text-stone-500">Daily burn against 400 kcal target</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1 text-stone-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span>Burn</span>
              </span>
              <span className="flex items-center space-x-1 text-stone-400">
                <span className="w-2.5 h-0.5 bg-stone-300" />
                <span>Target</span>
              </span>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="mt-6 flex items-end justify-between h-48 px-2">
            {weeklyData.map((d, i) => {
              const maxCal = 550;
              const barHeight = Math.round((d.calories / maxCal) * 100);
              return (
                <div key={i} className="flex flex-col items-center flex-1">
                  <span className="text-[10px] text-stone-400 font-mono mb-2">
                    {d.calories}
                  </span>
                  <div className="relative w-8 bg-stone-100 rounded-xl h-36 flex items-end justify-center p-1">
                    {/* Target line indicator */}
                    <div
                      className="absolute w-full border-b border-dashed border-stone-300 pointer-events-none"
                      style={{ bottom: `${(d.target / maxCal) * 100}%` }}
                    />
                    <div
                      className="w-full bg-gradient-to-t from-emerald-700 to-teal-500 rounded-lg transition-all duration-500"
                      style={{ height: `${barHeight}%` }}
                    />
                  </div>
                  <span className="text-xs mt-2 font-medium text-stone-600">
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-stone-900 text-sm font-display pb-3 border-b border-stone-100">
              Modality Distribution
            </h3>

            <div className="space-y-4 mt-4">
              {categories.map((cat, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-stone-800">{cat.name}</span>
                    <span className="text-stone-500 font-medium">{cat.percent}% ({cat.minutes}m)</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`${cat.color} h-full rounded-full transition-all duration-700`}
                      style={{ width: `${cat.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs text-stone-600">
            <p className="font-semibold text-stone-900 mb-0.5">Coach's Insight 🌿</p>
            Your current ratio of 45% yoga to 25% strength provides optimal muscle repair and joint lubrication.
          </div>
        </div>
      </div>

      {/* 28-Day Consistency Heatmap */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h3 className="font-bold text-stone-900 text-sm font-display">
              28-Day Practice Heatmap
            </h3>
            <p className="text-xs text-stone-500">Every square represents a mindful workout session</p>
          </div>
          <div className="flex items-center space-x-1.5 text-[11px] text-stone-500">
            <span>Less</span>
            <span className="w-3 h-3 rounded bg-stone-100" />
            <span className="w-3 h-3 rounded bg-emerald-200" />
            <span className="w-3 h-3 rounded bg-emerald-400" />
            <span className="w-3 h-3 rounded bg-emerald-600" />
            <span className="w-3 h-3 rounded bg-emerald-800" />
            <span>More</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 sm:grid-cols-14 gap-2">
          {heatmapDays.map((d, i) => {
            const colors = [
              'bg-stone-100 border-stone-200/50',
              'bg-emerald-200 border-emerald-300',
              'bg-emerald-400 border-emerald-500',
              'bg-emerald-600 border-emerald-700',
              'bg-emerald-800 border-emerald-900',
            ];
            return (
              <div
                key={i}
                className={`h-10 rounded-xl border flex flex-col items-center justify-center text-[10px] font-mono transition-transform hover:scale-105 cursor-pointer ${
                  colors[d.intensity]
                } ${d.intensity > 2 ? 'text-white' : 'text-stone-700'}`}
                title={`Day ${d.day}: ${d.minutes} mins completed`}
              >
                <span>{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Session Logs Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-sm">
        <h3 className="font-bold text-stone-900 text-sm font-display pb-3 border-b border-stone-100">
          Recent Completed Sessions
        </h3>

        <div className="divide-y divide-stone-100 mt-2">
          {allRecords.slice(0, 5).map((rec) => (
            <div key={rec.id} className="py-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900">{rec.title}</h4>
                  <p className="text-[11px] text-stone-500">
                    {rec.date} • {rec.category} • Instructor: {rec.instructorName}
                  </p>
                </div>
              </div>

              <div className="text-right text-xs">
                <p className="font-semibold text-stone-900">{rec.durationMinutes} mins</p>
                <p className="text-amber-600 font-medium">{rec.caloriesBurned} kcal</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
