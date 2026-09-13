import React, { useState } from 'react';
import {
  Dumbbell,
  Clock,
  Flame,
  Play,
  Heart,
  Search,
  Filter,
  Star,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { WorkoutItem, WorkoutCategory, Difficulty, FitnessGoal, Equipment } from '../types';

interface WorkoutLibraryProps {
  workouts: WorkoutItem[];
  onStartSession: (workout: WorkoutItem) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const WorkoutLibrary: React.FC<WorkoutLibraryProps> = ({
  workouts,
  onStartSession,
  favorites,
  onToggleFavorite,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDuration, setSelectedDuration] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedGoal, setSelectedGoal] = useState<string>('All');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const categories = [
    'All',
    'Full Body',
    'Strength',
    'Cardio',
    'HIIT',
    'Core',
    'Upper Body',
    'Lower Body',
    'Stretching',
    'Mobility',
  ];

  const durations = ['All', '< 20 mins', '20-30 mins', '30+ mins'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const goals = [
    'All',
    'Weight Management',
    'Flexibility & Posture',
    'Core & Strength',
    'Stress Reduction & Mind',
    'Endurance & Cardio',
  ];
  const equipmentOptions = [
    'All',
    'None (Bodyweight)',
    'Dumbbells',
    'Yoga Mat',
    'Resistance Bands',
    'Kettlebell',
  ];

  const filteredWorkouts = workouts.filter((workout) => {
    const matchesCategory =
      selectedCategory === 'All' || workout.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === 'All' || workout.difficulty === selectedDifficulty;
    const matchesGoal = selectedGoal === 'All' || workout.goal === selectedGoal;

    let matchesDuration = true;
    if (selectedDuration === '< 20 mins') {
      matchesDuration = workout.durationMinutes < 20;
    } else if (selectedDuration === '20-30 mins') {
      matchesDuration = workout.durationMinutes >= 20 && workout.durationMinutes <= 30;
    } else if (selectedDuration === '30+ mins') {
      matchesDuration = workout.durationMinutes > 30;
    }

    const matchesEquipment =
      selectedEquipment === 'All' ||
      workout.equipment.some((eq) => eq.includes(selectedEquipment) || selectedEquipment.includes(eq));

    const matchesSearch =
      searchQuery.trim() === '' ||
      workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.instructorName.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      matchesCategory &&
      matchesDifficulty &&
      matchesGoal &&
      matchesDuration &&
      matchesEquipment &&
      matchesSearch
    );
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-teal-900 via-emerald-900 to-stone-900 text-white p-6 sm:p-10 shadow-xl overflow-hidden border border-teal-800/40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold mb-3">
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Athletic Conditioning & Hypertrophy</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-white">
            Workout Library
          </h1>
          <p className="mt-2 text-sm sm:text-base text-stone-300 leading-relaxed">
            Science-backed strength protocols, high-energy HIIT, joint-friendly mobility, and core sculpting led by elite conditioning coaches.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200/80 shadow-sm space-y-4">
        {/* Search input + Advanced Filters Toggle */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by workout name, exercise, or muscle group..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
            />
          </div>

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="px-4 py-2.5 rounded-2xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
          >
            <Filter className="w-3.5 h-3.5 text-stone-500" />
            <span>Filters ({selectedGoal !== 'All' || selectedEquipment !== 'All' || selectedDuration !== 'All' ? 'Active' : 'All'})</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-stone-400 transition-transform ${
                showAdvancedFilters ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Category Pills (horizontal scrollable) */}
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-sm font-semibold'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Advanced Filters Expandable Panel */}
        {showAdvancedFilters && (
          <div className="pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Duration */}
            <div>
              <label className="block text-stone-600 font-semibold mb-1">Duration</label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full p-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                {durations.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Equipment */}
            <div>
              <label className="block text-stone-600 font-semibold mb-1">Equipment</label>
              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                className="w-full p-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                {equipmentOptions.map((eq) => (
                  <option key={eq} value={eq}>{eq}</option>
                ))}
              </select>
            </div>

            {/* Goal */}
            <div>
              <label className="block text-stone-600 font-semibold mb-1">Fitness Goal</label>
              <select
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
                className="w-full p-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                {goals.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Workout Grid */}
      {filteredWorkouts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout) => {
            const isFav = favorites.includes(workout.id);
            return (
              <div
                key={workout.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                {/* Image & Header tags */}
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={workout.imageUrl}
                    alt={workout.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 flex items-center space-x-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-800/90 text-white backdrop-blur-md">
                      {workout.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-stone-900/70 text-stone-200 backdrop-blur-md">
                      {workout.difficulty}
                    </span>
                  </div>

                  {/* Favorite Toggle */}
                  <button
                    onClick={() => onToggleFavorite(workout.id)}
                    className="absolute top-3.5 right-3.5 p-2 rounded-full bg-stone-900/60 hover:bg-stone-900/80 text-white backdrop-blur-md transition-colors"
                    title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFav ? 'fill-rose-500 text-rose-500' : 'text-white'
                      }`}
                    />
                  </button>

                  {/* Bottom Stats Overlay */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-stone-200 font-medium">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-teal-400" />
                      <span>{workout.durationMinutes} mins</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>{workout.caloriesBurned} kcal</span>
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-1 text-amber-500 text-xs mb-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-stone-800">{workout.rating}</span>
                      <span className="text-stone-400">({workout.reviewCount})</span>
                    </div>

                    <h3 className="font-bold text-stone-900 text-base font-display group-hover:text-teal-700 transition-colors">
                      {workout.title}
                    </h3>
                    <p className="text-xs text-stone-600 mt-1.5 line-clamp-2 leading-relaxed">
                      {workout.description}
                    </p>

                    {/* Equipment badges */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {workout.equipment.map((eq, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-lg bg-stone-100 text-stone-600 text-[10px] font-medium"
                        >
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Bar */}
                  <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={workout.instructorAvatar}
                        alt={workout.instructorName}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-teal-500/20"
                      />
                      <span className="text-xs text-stone-700 font-medium truncate max-w-[120px]">
                        {workout.instructorName}
                      </span>
                    </div>

                    <button
                      onClick={() => onStartSession(workout)}
                      className="px-4 py-2 rounded-xl bg-teal-800 text-white font-semibold text-xs hover:bg-teal-900 shadow-sm flex items-center space-x-1.5 transition-all active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Start</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
          <p className="text-stone-500 text-sm">No workouts found matching your filter criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedDuration('All');
              setSelectedDifficulty('All');
              setSelectedGoal('All');
              setSelectedEquipment('All');
              setSearchQuery('');
            }}
            className="mt-3 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
