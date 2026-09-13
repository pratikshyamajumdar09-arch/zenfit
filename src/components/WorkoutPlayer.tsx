import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  X,
  Volume2,
  VolumeX,
  CheckCircle2,
  Clock,
  Flame,
  Wind,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ExerciseStep } from '../types';
import { sound } from '../utils/audio';

interface WorkoutPlayerProps {
  title: string;
  category: string;
  instructorName: string;
  estimatedCalories: number;
  exercises: ExerciseStep[];
  soundEnabled: boolean;
  onClose: () => void;
  onFinishSession: (stats: { calories: number; minutes: number; title: string; category: string }) => void;
}

export const WorkoutPlayer: React.FC<WorkoutPlayerProps> = ({
  title,
  category,
  instructorName,
  estimatedCalories,
  exercises,
  soundEnabled,
  onClose,
  onFinishSession,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(exercises[0]?.durationSeconds || 45);
  const [isActive, setIsActive] = useState(true);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isBreathingMode, setIsBreathingMode] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

  const currentExercise = exercises[currentIdx] || exercises[0];
  const maxTime = isResting ? (currentExercise?.restSeconds || 15) : (currentExercise?.durationSeconds || 45);

  // Breathing cycle simulation (4s in, 4s hold, 4s out)
  useEffect(() => {
    if (!isBreathingMode) return;
    const interval = setInterval(() => {
      setBreathPhase((prev) => {
        if (prev === 'Inhale') return 'Hold';
        if (prev === 'Hold') return 'Exhale';
        return 'Inhale';
      });
      if (soundEnabled) sound.playBreathBell(true);
    }, 4000);
    return () => clearInterval(interval);
  }, [isBreathingMode, soundEnabled]);

  // Main countdown timer effect
  useEffect(() => {
    if (!isActive || isCompleted) return;

    const timer = setInterval(() => {
      setTotalSecondsElapsed((prev) => prev + 1);

      setTimeLeft((prevTime) => {
        if (prevTime <= 4 && prevTime > 1) {
          sound.playCountdownBeep(soundEnabled, false);
        } else if (prevTime === 1) {
          sound.playCountdownBeep(soundEnabled, true);
        }

        if (prevTime <= 1) {
          // Time expired for this phase
          if (!isResting && (currentExercise?.restSeconds || 0) > 0) {
            // Transition to Rest period
            setIsResting(true);
            return currentExercise.restSeconds;
          } else {
            // Transition to next exercise or finish
            if (currentIdx < exercises.length - 1) {
              const nextIdx = currentIdx + 1;
              setCurrentIdx(nextIdx);
              setIsResting(false);
              return exercises[nextIdx].durationSeconds;
            } else {
              // Workout complete!
              handleCompleteWorkout();
              return 0;
            }
          }
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, isCompleted, isResting, currentIdx, exercises, soundEnabled, currentExercise]);

  const handleCompleteWorkout = () => {
    setIsCompleted(true);
    setIsActive(false);
    sound.playSingingBowl(soundEnabled);
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#0d9488', '#f59e0b', '#10b981'],
      });
    } catch (e) {
      // Confetti fallback safe
    }
  };

  const handleNext = () => {
    if (currentIdx < exercises.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setIsResting(false);
      setTimeLeft(exercises[nextIdx].durationSeconds);
    } else {
      handleCompleteWorkout();
    }
  };

  const handlePrevious = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      setIsResting(false);
      setTimeLeft(exercises[prevIdx].durationSeconds);
    } else {
      setTimeLeft(currentExercise.durationSeconds);
    }
  };

  const handleRestartCurrent = () => {
    setTimeLeft(isResting ? currentExercise.restSeconds : currentExercise.durationSeconds);
    setIsActive(true);
  };

  // Progress percentage calculation
  const progressPercent = Math.round(((currentIdx + (isResting ? 0.8 : 0.2)) / exercises.length) * 100);
  const ringDashOffset = 283 - (283 * timeLeft) / Math.max(1, maxTime);

  // Completed Screen
  if (isCompleted) {
    const elapsedMinutes = Math.max(1, Math.round(totalSecondsElapsed / 60));
    return (
      <div className="fixed inset-0 z-50 bg-stone-900/90 backdrop-blur-xl flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 sm:p-10 max-w-lg w-full text-center shadow-2xl border border-stone-200">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-6 text-emerald-600 shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <span className="text-xs uppercase tracking-widest font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Session Completed
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900 mt-3">
            Namaste & Great Work!
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            You completed <span className="font-semibold text-stone-800">{title}</span> with {instructorName}.
          </p>

          <div className="grid grid-cols-3 gap-3 my-6">
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
              <Clock className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-stone-900">{elapsedMinutes}m</p>
              <p className="text-[11px] text-stone-500 font-medium">Duration</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
              <Flame className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-stone-900">{estimatedCalories}</p>
              <p className="text-[11px] text-stone-500 font-medium">Est. Calories</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
              <Sparkles className="w-5 h-5 text-teal-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-stone-900">{exercises.length}/{exercises.length}</p>
              <p className="text-[11px] text-stone-500 font-medium">Poses Done</p>
            </div>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => {
                onFinishSession({
                  calories: estimatedCalories,
                  minutes: elapsedMinutes,
                  title,
                  category,
                });
                onClose();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-800 text-white font-semibold text-sm hover:bg-emerald-900 transition-colors shadow-md flex items-center justify-center space-x-2"
            >
              <span>Log Session to Dashboard</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 px-6 rounded-2xl text-stone-600 hover:text-stone-900 text-sm font-medium hover:bg-stone-100 transition-colors"
            >
              Close without saving
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/95 text-stone-100 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 overflow-y-auto">
      {/* Top Header Bar */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wide">
              {category}
            </span>
            <span className="text-xs text-stone-400">
              {instructorName}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
            {title}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsBreathingMode(!isBreathingMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-colors ${
              isBreathingMode
                ? 'bg-teal-500/30 text-teal-300 border border-teal-500/50'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
            title="Toggle Mindful Breathing Guide"
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Breathing Guide</span>
          </button>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
            title="Exit Session"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="max-w-4xl w-full mx-auto my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left / Center: Circular Timer & Visual Guidance */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center text-center">
          {/* Phase Badge */}
          <div className="mb-4">
            <span
              className={`text-xs uppercase tracking-widest font-bold px-4 py-1.5 rounded-full border ${
                isResting
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 animate-pulse'
              }`}
            >
              {isResting ? 'Recovery & Rest' : 'Active Movement'}
            </span>
          </div>

          {/* Circular Countdown Ring */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background track */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                className="text-stone-800"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeDasharray="283"
                strokeDashoffset={ringDashOffset}
                strokeLinecap="round"
                className={`transition-all duration-1000 ${
                  isResting ? 'text-amber-400' : 'text-emerald-400'
                }`}
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              {isBreathingMode ? (
                <div className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-1000 ${
                      breathPhase === 'Inhale'
                        ? 'scale-125 bg-teal-400/20 border-2 border-teal-300'
                        : breathPhase === 'Hold'
                        ? 'scale-110 bg-emerald-400/20 border-2 border-emerald-300'
                        : 'scale-90 bg-sky-400/20 border-2 border-sky-300'
                    }`}
                  >
                    <Wind className="w-6 h-6 text-teal-200" />
                  </div>
                  <span className="text-lg font-bold text-teal-200 mt-2 tracking-wide uppercase">
                    {breathPhase}
                  </span>
                  <span className="text-2xl font-mono font-bold text-white mt-1">
                    {timeLeft}s
                  </span>
                </div>
              ) : (
                <>
                  <span className="text-5xl sm:text-6xl font-mono font-extrabold tracking-tight text-white">
                    {timeLeft}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-stone-400 mt-1 font-semibold">
                    Seconds Remaining
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick controls beneath ring */}
          <div className="flex items-center space-x-4 mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentIdx === 0}
              className="p-3 rounded-2xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-white disabled:opacity-40 hover:bg-stone-800 transition-colors"
              title="Previous Exercise"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsActive(!isActive)}
              className="p-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg transition-transform active:scale-95"
              title={isActive ? 'Pause' : 'Resume'}
            >
              {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white" />}
            </button>

            <button
              onClick={handleNext}
              className="p-3 rounded-2xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title="Next Exercise"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            <button
              onClick={handleRestartCurrent}
              className="p-3 rounded-2xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title="Restart Interval"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right: Current Exercise Details & Instructions */}
        <div className="lg:col-span-6 bg-stone-900/80 rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div>
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                Movement {currentIdx + 1} of {exercises.length}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-0.5">
                {currentExercise.name}
              </h2>
            </div>
            <div className="text-right text-xs text-stone-400">
              <p className="font-semibold text-stone-200">
                {currentExercise.durationSeconds}s Work
              </p>
              <p>{currentExercise.restSeconds}s Rest</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="py-4 space-y-4">
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-400 mb-1.5">
                Alignment & Coaching Cues
              </h4>
              <p className="text-sm text-stone-300 leading-relaxed">
                {currentExercise.instructions}
              </p>
            </div>

            {currentExercise.breathingCue && (
              <div className="p-3 rounded-2xl bg-teal-950/40 border border-teal-800/40 flex items-start space-x-2.5">
                <Wind className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-teal-300">Breathwork Instruction</p>
                  <p className="text-xs text-teal-200/80 mt-0.5">{currentExercise.breathingCue}</p>
                </div>
              </div>
            )}

            {/* Target Muscles */}
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-400 mb-2">
                Target Muscle Groups
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {currentExercise.targetMuscles.map((muscle, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-xl bg-stone-800 text-stone-300 text-xs font-medium border border-stone-700/60"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Up Next Preview */}
          {currentIdx < exercises.length - 1 && (
            <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span className="font-medium">Up next:</span>
              <span className="text-stone-300 font-semibold truncate max-w-[200px]">
                {exercises[currentIdx + 1].name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="max-w-4xl w-full mx-auto pt-4 border-t border-stone-800">
        <div className="flex items-center justify-between text-xs text-stone-400 mb-2 font-medium">
          <span>Overall Session Progress: {progressPercent}%</span>
          <span>Elapsed: {Math.floor(totalSecondsElapsed / 60)}m {totalSecondsElapsed % 60}s</span>
        </div>
        <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
