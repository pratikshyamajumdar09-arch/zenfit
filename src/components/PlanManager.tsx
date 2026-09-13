import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  Circle,
  Play,
  Clock,
  Flame,
  Settings2,
  RefreshCw,
  Award,
  ChevronRight,
  Sliders,
  Check,
} from 'lucide-react';
import {
  PersonalizedPlan,
  PlanDay,
  UserPreferences,
  FitnessGoal,
  Difficulty,
  Equipment,
  YogaSession,
  WorkoutItem,
} from '../types';

interface PlanManagerProps {
  plan: PersonalizedPlan;
  onUpdatePlan: (updatedPlan: PersonalizedPlan) => void;
  onStartSessionById: (workoutTitle: string, category: string) => void;
  userPreferences: UserPreferences;
}

export const PlanManager: React.FC<PlanManagerProps> = ({
  plan,
  onUpdatePlan,
  onStartSessionById,
  userPreferences,
}) => {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);

  // Wizard state for customization
  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal>(plan.preferences?.goal || 'Flexibility & Posture');
  const [selectedLevel, setSelectedLevel] = useState<Difficulty>(plan.preferences?.experienceLevel || 'Intermediate');
  const [selectedTime, setSelectedTime] = useState<number>(plan.preferences?.availableTimeMinutes || 30);
  const [selectedDaysCount, setSelectedDaysCount] = useState<number>(plan.preferences?.weeklyDaysCount || 5);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    plan.preferences?.preferredWorkoutTypes || ['Morning Yoga', 'Core & Strength', 'Mobility']
  );
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>(
    plan.preferences?.equipment || ['Yoga Mat', 'Dumbbells']
  );

  const goalsList: FitnessGoal[] = [
    'Flexibility & Posture',
    'Core & Strength',
    'Weight Management',
    'Stress Reduction & Mind',
    'Endurance & Cardio',
  ];

  const levelsList: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];
  const timesList = [15, 20, 30, 45, 60];
  const workoutTypeOptions = [
    'Morning Yoga',
    'Strength Yoga',
    'HIIT Conditioning',
    'Core & Pilates',
    'Full Body Strength',
    'Mobility & Spine',
    'Breath & Meditation',
  ];
  const equipmentOptions: Equipment[] = [
    'None (Bodyweight)',
    'Yoga Mat',
    'Dumbbells',
    'Resistance Bands',
    'Kettlebell',
    'Yoga Block & Strap',
  ];

  const toggleDayCompletion = (dayIndex: number) => {
    const newDays = [...plan.days];
    newDays[dayIndex].completed = !newDays[dayIndex].completed;
    onUpdatePlan({
      ...plan,
      days: newDays,
    });
  };

  const handleGeneratePlan = async () => {
    setIsGeneratingWithAI(true);
    try {
      const response = await fetch('/api/coach/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: selectedGoal,
          experienceLevel: selectedLevel,
          preferredTypes: selectedTypes,
          availableTime: selectedTime,
          weeklySchedule: Array(selectedDaysCount).fill('Day'),
          equipment: selectedEquipment,
        }),
      });

      const data = await response.json();
      if (data.plan && data.plan.days) {
        onUpdatePlan({
          ...plan,
          title: data.plan.planTitle || `${selectedLevel} ${selectedGoal} Flow`,
          summary: data.plan.summary || plan.summary,
          weeklyFocus: data.plan.weeklyFocus || plan.weeklyFocus,
          days: data.plan.days.map((d: any) => ({
            ...d,
            durationMinutes: d.duration || selectedTime,
            calories: d.calories || Math.round(selectedTime * 7),
            completed: false,
          })),
          preferences: {
            goal: selectedGoal,
            experienceLevel: selectedLevel,
            preferredWorkoutTypes: selectedTypes,
            availableTimeMinutes: selectedTime,
            weeklyDaysCount: selectedDaysCount,
            equipment: selectedEquipment,
          },
        });
      }
    } catch (err) {
      console.error('Plan generation failed, fallback to local:', err);
    } finally {
      setIsGeneratingWithAI(false);
      setIsCustomizing(false);
    }
  };

  const completedCount = plan.days.filter((d) => d.completed).length;
  const progressPercent = Math.round((completedCount / plan.days.length) * 100);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-stone-900 text-white p-6 sm:p-10 shadow-xl overflow-hidden border border-emerald-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-3">
              <Calendar className="w-3.5 h-3.5" />
              <span>Personalized Training Matrix</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-white">
              {plan.title}
            </h1>
            <p className="mt-2 text-sm text-stone-300 leading-relaxed">
              {plan.summary}
            </p>
            <p className="mt-2 text-xs text-emerald-300 font-medium">
              🎯 Weekly Focus: {plan.weeklyFocus}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="px-4 py-2.5 rounded-2xl bg-white text-stone-900 text-xs font-semibold hover:bg-stone-100 shadow-sm flex items-center space-x-2 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isCustomizing ? 'Hide Preferences' : 'Customize Preferences'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customization / Onboarding Wizard Drawer */}
      {isCustomizing && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-stone-900 text-base font-display">
                Fine-Tune Your Training Program
              </h3>
              <p className="text-xs text-stone-500">
                ZenFit adapts exercise sequences, rest intervals, and volume directly to your schedule.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              AI Optimized
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            {/* Goal */}
            <div>
              <label className="block text-stone-700 font-bold mb-2">Primary Goal</label>
              <div className="space-y-1.5">
                {goalsList.map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGoal(g)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between border ${
                      selectedGoal === g
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-semibold'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>{g}</span>
                    {selectedGoal === g && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience & Time */}
            <div className="space-y-4">
              <div>
                <label className="block text-stone-700 font-bold mb-2">Experience Level</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {levelsList.map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setSelectedLevel(lvl)}
                      className={`py-2 rounded-xl text-center border font-medium ${
                        selectedLevel === lvl
                          ? 'bg-emerald-800 text-white border-emerald-800 font-semibold'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-2">Available Daily Time</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {timesList.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`py-2 rounded-xl text-center border font-medium ${
                        selectedTime === t
                          ? 'bg-teal-800 text-white border-teal-800 font-semibold'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {t}m
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-2">
                  Weekly Frequency: {selectedDaysCount} Days / Week
                </label>
                <input
                  type="range"
                  min="3"
                  max="7"
                  value={selectedDaysCount}
                  onChange={(e) => setSelectedDaysCount(Number(e.target.value))}
                  className="w-full accent-emerald-700"
                />
              </div>
            </div>

            {/* Equipment & Types */}
            <div>
              <label className="block text-stone-700 font-bold mb-2">Available Equipment</label>
              <div className="space-y-1.5">
                {equipmentOptions.map((eq) => {
                  const hasEq = selectedEquipment.includes(eq);
                  return (
                    <button
                      key={eq}
                      onClick={() => {
                        if (hasEq) {
                          setSelectedEquipment(selectedEquipment.filter((x) => x !== eq));
                        } else {
                          setSelectedEquipment([...selectedEquipment, eq]);
                        }
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl border flex items-center justify-between ${
                        hasEq
                          ? 'bg-teal-50 border-teal-500 text-teal-900 font-medium'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <span>{eq}</span>
                      {hasEq && <Check className="w-3.5 h-3.5 text-teal-700" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-end space-x-3">
            <button
              onClick={() => setIsCustomizing(false)}
              className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleGeneratePlan}
              disabled={isGeneratingWithAI}
              className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-semibold hover:bg-emerald-900 shadow-sm flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingWithAI ? 'animate-spin' : ''}`} />
              <span>{isGeneratingWithAI ? 'Regenerating with AI...' : 'Apply & Regenerate Plan'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Week Progress Status Pill */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
            {completedCount}/{plan.days.length}
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">Current Week Completion</h3>
            <p className="text-xs text-stone-500">{completedCount} of {plan.days.length} workouts completed</p>
          </div>
        </div>

        <div className="w-full sm:w-64 bg-stone-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 7-Day Interactive Plan Schedule */}
      <div className="space-y-3">
        {plan.days.map((day, idx) => {
          return (
            <div
              key={idx}
              className={`p-5 rounded-3xl border transition-all ${
                day.completed
                  ? 'bg-emerald-50/50 border-emerald-200/70 text-stone-800'
                  : 'bg-white border-stone-200/80 hover:border-emerald-300 hover:shadow-sm'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left details */}
                <div className="flex items-start space-x-4">
                  {/* Checkbox toggle */}
                  <button
                    onClick={() => toggleDayCompletion(idx)}
                    className="mt-0.5 text-stone-400 hover:text-emerald-700 transition-colors"
                    title={day.completed ? 'Mark as incomplete' : 'Mark as done'}
                  >
                    {day.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-700 fill-emerald-100" />
                    ) : (
                      <Circle className="w-6 h-6 text-stone-300 hover:text-stone-400" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                        {day.dayName}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                        {day.category}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700">
                        {day.intensity}
                      </span>
                    </div>

                    <h3 className={`text-base font-bold font-display mt-1 ${day.completed ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                      {day.workoutTitle}
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5 leading-relaxed max-w-xl">
                      {day.description}
                    </p>

                    {/* Exercises sequence preview */}
                    {day.exercises && day.exercises.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {day.exercises.map((ex, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px]"
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex items-center justify-between md:justify-end space-x-4 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
                  <div className="text-right text-xs text-stone-500">
                    <div className="flex items-center space-x-1 justify-end">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{day.durationMinutes}m</span>
                    </div>
                    <div className="flex items-center space-x-1 justify-end mt-0.5">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span>{day.calories} kcal</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onStartSessionById(day.workoutTitle, day.category)}
                    className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-semibold text-xs hover:bg-emerald-900 shadow-sm flex items-center space-x-1.5 transition-all active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Start Session</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
