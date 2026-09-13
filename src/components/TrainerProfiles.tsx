import React, { useState } from 'react';
import {
  Award,
  Users,
  Play,
  Heart,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  Star,
} from 'lucide-react';
import { Trainer, YogaSession, WorkoutItem } from '../types';

interface TrainerProfilesProps {
  trainers: Trainer[];
  yogaSessions: YogaSession[];
  workoutItems: WorkoutItem[];
  onStartSession: (session: YogaSession | WorkoutItem) => void;
}

export const TrainerProfiles: React.FC<TrainerProfilesProps> = ({
  trainers,
  yogaSessions,
  workoutItems,
  onStartSession,
}) => {
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer>(trainers[0]);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  const toggleFollow = (id: string) => {
    setFollowingMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Find workouts and yoga classes taught by selected trainer
  const trainerYoga = yogaSessions.filter(
    (y) => y.instructorName.toLowerCase() === selectedTrainer.name.toLowerCase()
  );
  const trainerWorkouts = workoutItems.filter(
    (w) => w.instructorName.toLowerCase() === selectedTrainer.name.toLowerCase()
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-stone-900 via-emerald-950 to-teal-950 text-white p-6 sm:p-10 shadow-xl overflow-hidden border border-emerald-900/40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>World-Class Instructors</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-white">
            Master Coaches & Practitioners
          </h1>
          <p className="mt-2 text-sm sm:text-base text-stone-300 leading-relaxed">
            Learn from internationally certified Ashtanga masters, Olympic strength conditioning coaches, and neurological breathwork experts dedicated to sustainable progression.
          </p>
        </div>
      </div>

      {/* Trainers Grid Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {trainers.map((trainer) => {
          const isSelected = selectedTrainer.id === trainer.id;
          const isFollowing = followingMap[trainer.id];
          return (
            <div
              key={trainer.id}
              onClick={() => setSelectedTrainer(trainer)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-600/20'
                  : 'bg-white border-stone-200/80 hover:border-emerald-300 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden ring-4 ring-emerald-500/10 mb-3">
                  <img
                    src={trainer.avatar}
                    alt={trainer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-stone-900 text-base font-display">
                    {trainer.name}
                  </h3>
                  <p className="text-xs text-emerald-700 font-semibold">{trainer.title}</p>
                  <p className="text-[11px] text-stone-500 mt-1">{trainer.experienceYears} Years Experience</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500">{trainer.totalWorkouts} classes</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFollow(trainer.id);
                  }}
                  className={`px-3 py-1 rounded-xl font-semibold transition-colors ${
                    isFollowing
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Trainer In-Depth Profile */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar & Key Stats */}
          <div className="w-full md:w-64 flex-shrink-0 flex flex-col items-center text-center p-6 bg-stone-50 rounded-3xl border border-stone-200/70">
            <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-emerald-500/20 shadow-md">
              <img
                src={selectedTrainer.avatar}
                alt={selectedTrainer.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="font-bold text-stone-900 text-lg font-display mt-3">
              {selectedTrainer.name}
            </h3>
            <p className="text-xs font-semibold text-emerald-700">{selectedTrainer.title}</p>

            <div className="grid grid-cols-2 gap-2 w-full mt-4 pt-4 border-t border-stone-200 text-xs">
              <div className="p-2 bg-white rounded-xl">
                <p className="font-bold text-stone-900">{(selectedTrainer.followers / 1000).toFixed(1)}k</p>
                <p className="text-[10px] text-stone-500">Students</p>
              </div>
              <div className="p-2 bg-white rounded-xl">
                <p className="font-bold text-stone-900">{selectedTrainer.totalWorkouts}</p>
                <p className="text-[10px] text-stone-500">Classes</p>
              </div>
            </div>

            <button
              onClick={() => toggleFollow(selectedTrainer.id)}
              className={`w-full mt-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                followingMap[selectedTrainer.id]
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-emerald-800 text-white hover:bg-emerald-900 shadow-sm'
              }`}
            >
              {followingMap[selectedTrainer.id] ? 'Following Coach' : 'Follow Coach'}
            </button>
          </div>

          {/* Bio & Philosophy Details */}
          <div className="flex-1 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Instruction Philosophy
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-stone-900 mt-1">
                "{selectedTrainer.philosophy}"
              </h2>
              <p className="text-sm text-stone-600 mt-3 leading-relaxed">
                {selectedTrainer.bio}
              </p>
            </div>

            {/* Specialties & Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
                <h4 className="text-xs uppercase font-bold text-stone-500 mb-2">
                  Specialties & Modalities
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTrainer.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
                <h4 className="text-xs uppercase font-bold text-stone-500 mb-2">
                  Official Certifications
                </h4>
                <div className="space-y-1">
                  {selectedTrainer.certifications.map((cert, i) => (
                    <div key={i} className="flex items-center space-x-1.5 text-xs text-stone-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Classes Led By This Coach */}
            <div>
              <h4 className="text-sm font-bold text-stone-900 font-display mb-3">
                Featured Programs Led By {selectedTrainer.name}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trainerYoga.concat(trainerWorkouts as any).slice(0, 4).map((session: any) => (
                  <div
                    key={session.id}
                    className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 hover:bg-stone-100 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase text-emerald-700">
                        {session.category}
                      </span>
                      <h5 className="font-bold text-stone-900 text-xs mt-0.5">{session.title}</h5>
                      <p className="text-[11px] text-stone-500">{session.durationMinutes} mins • {session.difficulty}</p>
                    </div>

                    <button
                      onClick={() => onStartSession(session)}
                      className="p-2 rounded-xl bg-emerald-800 text-white hover:bg-emerald-900 shadow-sm flex items-center justify-center transition-colors"
                      title="Start routine"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
