import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  Flame,
  Play,
  Heart,
  Search,
  Filter,
  CheckCircle2,
  Lightbulb,
  ChevronRight,
} from 'lucide-react';
import { YogaSession, YogaCategory, Difficulty } from '../types';

interface YogaSectionProps {
  sessions: YogaSession[];
  onStartSession: (session: YogaSession) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const YogaSection: React.FC<YogaSectionProps> = ({
  sessions,
  onStartSession,
  favorites,
  onToggleFavorite,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Morning Yoga',
    'Flexibility',
    'Strength Yoga',
    'Stress Relief',
    'Back & Neck Relief',
    'Sleep Yoga',
    'Weight Management',
  ];

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredSessions = sessions.filter((session) => {
    const matchesCategory =
      selectedCategory === 'All' || session.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === 'All' || session.difficulty === selectedDifficulty;
    const matchesSearch =
      searchQuery.trim() === '' ||
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.instructorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white p-6 sm:p-10 shadow-xl overflow-hidden border border-emerald-800/40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sacred Movement & Asana</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-white">
            Yoga Sanctuary
          </h1>
          <p className="mt-2 text-sm sm:text-base text-stone-300 leading-relaxed">
            From rejuvenating morning sun salutations to restorative yin holds and posture-correcting spine therapy. Experience ancient wisdom crafted for modern lifestyles.
          </p>
        </div>
      </div>

      {/* Daily Alignment Spotlight Card */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-5 sm:p-6 border border-emerald-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Pose Alignment Tip of the Day
            </span>
            <h3 className="font-bold text-stone-900 text-base mt-0.5">
              Downward-Facing Dog (Adho Mukha Svanasana)
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Spread all ten fingers wide like starfishes and press firmly into the knuckles of the index finger and thumb. Soften your knees if your hamstrings feel tight—lengthening your spine takes precedence over heels touching the floor!
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Search Controls */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200/80 shadow-sm space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search flows by name, instructor, or focus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
          />
        </div>

        {/* Categories scrollable pills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Filter by Category:</span>
            <span>{filteredSessions.length} sessions available</span>
          </div>
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

        {/* Difficulty filter buttons */}
        <div className="flex items-center space-x-2 pt-2 border-t border-stone-100 text-xs">
          <span className="text-stone-500 font-medium mr-1">Difficulty:</span>
          {difficulties.map((diff) => {
            const isSelected = selectedDifficulty === diff;
            return (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1 rounded-xl font-medium transition-colors ${
                  isSelected
                    ? 'bg-stone-800 text-white font-semibold'
                    : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200/80'
                }`}
              >
                {diff}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Yoga Sessions */}
      {filteredSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => {
            const isFav = favorites.includes(session.id);
            return (
              <div
                key={session.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                {/* Image & Badges */}
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={session.imageUrl}
                    alt={session.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 flex items-center space-x-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-800/90 text-white backdrop-blur-md">
                      {session.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-stone-900/70 text-stone-200 backdrop-blur-md">
                      {session.difficulty}
                    </span>
                  </div>

                  {/* Favorite button */}
                  <button
                    onClick={() => onToggleFavorite(session.id)}
                    className="absolute top-3.5 right-3.5 p-2 rounded-full bg-stone-900/60 hover:bg-stone-900/80 text-white backdrop-blur-md transition-colors"
                    title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFav ? 'fill-rose-500 text-rose-500' : 'text-white'
                      }`}
                    />
                  </button>

                  {/* Bottom Stats on image */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-stone-200 font-medium">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{session.durationMinutes} mins</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>{session.estimatedCalories} kcal</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-stone-900 text-base font-display group-hover:text-emerald-700 transition-colors">
                      {session.title}
                    </h3>
                    <p className="text-xs text-stone-600 mt-1.5 line-clamp-2 leading-relaxed">
                      {session.description}
                    </p>

                    {/* Benefits tags */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {session.benefits.slice(0, 2).map((benefit, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-lg bg-stone-100 text-stone-600 text-[10px] font-medium"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer with Instructor & Start Button */}
                  <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={session.instructorAvatar}
                        alt={session.instructorName}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500/20"
                      />
                      <span className="text-xs text-stone-700 font-medium truncate max-w-[120px]">
                        {session.instructorName}
                      </span>
                    </div>

                    <button
                      onClick={() => onStartSession(session)}
                      className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-semibold text-xs hover:bg-emerald-900 shadow-sm flex items-center space-x-1.5 transition-all active:scale-95"
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
          <p className="text-stone-500 text-sm">No yoga flows match your active filters.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedDifficulty('All');
              setSearchQuery('');
            }}
            className="mt-3 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
