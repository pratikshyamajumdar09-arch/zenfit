import React, { useState } from 'react';
import {
  X,
  User,
  Settings,
  Bell,
  Volume2,
  VolumeX,
  Award,
  Check,
  Target,
  Sparkles,
} from 'lucide-react';
import { UserProfile, FitnessGoal, Difficulty } from '../types';

interface ProfileModalProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  onUpdateUser,
  soundEnabled,
  onToggleSound,
  onClose,
}) => {
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [goal, setGoal] = useState<FitnessGoal>(
    user.fitnessGoal || user.preferences?.goal || 'Flexibility & Posture'
  );
  const [level, setLevel] = useState<Difficulty>(
    user.experienceLevel || user.preferences?.experienceLevel || 'Intermediate'
  );
  const [waterGoal, setWaterGoal] = useState<number>(user.dailyWaterGoalMl || 2500);
  const [calorieGoal, setCalorieGoal] = useState<number>(user.dailyCaloriesGoal || 450);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const goalsList: FitnessGoal[] = [
    'Flexibility & Posture',
    'Core & Strength',
    'Weight Management',
    'Stress Reduction & Mind',
    'Endurance & Cardio',
  ];

  const levelsList: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      email,
      fitnessGoal: goal,
      experienceLevel: level,
      dailyWaterGoalMl: Number(waterGoal),
      dailyCaloriesGoal: Number(calorieGoal),
      preferences: {
        ...(user.preferences || {}),
        goal,
        experienceLevel: level,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-stone-200 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 pb-4 border-b border-stone-100">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-display">
              Profile & App Settings
            </h2>
            <p className="text-xs text-stone-500">Manage your wellness targets and experience</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-4 text-xs">
          {/* Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                required
              />
            </div>
          </div>

          {/* Fitness Goal */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Primary Fitness Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as FitnessGoal)}
              className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              {goalsList.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Current Experience Level</label>
            <div className="grid grid-cols-3 gap-2">
              {levelsList.map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`py-2 rounded-xl text-center border font-semibold ${
                    level === lvl
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Goals */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Daily Calorie Target (kcal)</label>
              <input
                type="number"
                min="100"
                max="2000"
                step="50"
                value={calorieGoal}
                onChange={(e) => setCalorieGoal(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Daily Hydration Target (ml)</label>
              <input
                type="number"
                min="500"
                max="5000"
                step="250"
                value={waterGoal}
                onChange={(e) => setWaterGoal(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Sound toggle preference */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2.5">
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-700" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
              <div>
                <p className="font-semibold text-stone-900">Sound Effects & Acoustic Bells</p>
                <p className="text-[11px] text-stone-500">Tibetan bowls and interval beeps during sessions</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleSound}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                soundEnabled ? 'bg-emerald-700' : 'bg-stone-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-semibold hover:bg-emerald-900 shadow-sm flex items-center space-x-1.5 transition-all"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-emerald-200" /> : null}
              <span>{savedSuccess ? 'Preferences Saved!' : 'Save Preferences'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
