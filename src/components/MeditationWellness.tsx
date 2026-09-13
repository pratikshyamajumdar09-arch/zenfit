import React, { useState, useEffect } from 'react';
import {
  Heart,
  Wind,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Headphones,
  Waves,
  CloudRain,
  Trees,
  Circle,
} from 'lucide-react';
import { MeditationSession, MeditationCategory } from '../types';
import { sound } from '../utils/audio';

interface MeditationWellnessProps {
  sessions: MeditationSession[];
  soundEnabled: boolean;
  onFinishMeditation: (title: string, minutes: number) => void;
}

export const MeditationWellness: React.FC<MeditationWellnessProps> = ({
  sessions,
  soundEnabled,
  onFinishMeditation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSession, setActiveSession] = useState<MeditationSession | null>(null);

  // Breathwork Studio state
  const [selectedTechnique, setSelectedTechnique] = useState<'box' | '478' | 'calm'>('box');
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Hold (Empty)'>('Inhale');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [breathCyclesDone, setBreathCyclesDone] = useState(0);

  // Ambient sound player state
  const [ambientType, setAmbientType] = useState<'rain' | 'waves' | 'bowl' | 'silent'>('rain');
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);

  // Meditation player modal state
  const [modalTimer, setModalTimer] = useState<number>(0);
  const [isModalPlaying, setIsModalPlaying] = useState(false);

  const categories = [
    'All',
    'Breathing Exercises',
    'Guided Meditation',
    'Stress Relief',
    'Sleep Programs',
    'Relaxation',
  ];

  // Technique timing rules
  const techniqueConfig = {
    box: { name: 'Box Breathing (4-4-4-4)', inhale: 4, hold1: 4, exhale: 4, hold2: 4, purpose: 'Reset acute stress & sharpen focus' },
    '478': { name: '4-7-8 Relaxing Breath', inhale: 4, hold1: 7, exhale: 8, hold2: 0, purpose: 'Deep parasympathetic sleep induction' },
    calm: { name: 'Deep Coherence (5-5)', inhale: 5, hold1: 0, exhale: 5, hold2: 0, purpose: 'Heart-rate variability & anxiety melt' },
  };

  const currentTech = techniqueConfig[selectedTechnique];

  // Breathwork Studio ticker
  useEffect(() => {
    if (!isBreathingActive) return;

    const timer = setInterval(() => {
      setPhaseSecondsLeft((prev) => {
        if (prev <= 1) {
          // Transition to next phase
          if (selectedTechnique === 'box') {
            if (breathPhase === 'Inhale') {
              setBreathPhase('Hold');
              sound.playBreathBell(soundEnabled);
              return currentTech.hold1;
            } else if (breathPhase === 'Hold') {
              setBreathPhase('Exhale');
              sound.playBreathBell(soundEnabled);
              return currentTech.exhale;
            } else if (breathPhase === 'Exhale') {
              setBreathPhase('Hold (Empty)');
              sound.playBreathBell(soundEnabled);
              return currentTech.hold2;
            } else {
              setBreathPhase('Inhale');
              setBreathCyclesDone((c) => c + 1);
              sound.playBreathBell(soundEnabled);
              return currentTech.inhale;
            }
          } else if (selectedTechnique === '478') {
            if (breathPhase === 'Inhale') {
              setBreathPhase('Hold');
              sound.playBreathBell(soundEnabled);
              return currentTech.hold1;
            } else if (breathPhase === 'Hold') {
              setBreathPhase('Exhale');
              sound.playBreathBell(soundEnabled);
              return currentTech.exhale;
            } else {
              setBreathPhase('Inhale');
              setBreathCyclesDone((c) => c + 1);
              sound.playBreathBell(soundEnabled);
              return currentTech.inhale;
            }
          } else {
            // Calm 5-5
            if (breathPhase === 'Inhale') {
              setBreathPhase('Exhale');
              sound.playBreathBell(soundEnabled);
              return currentTech.exhale;
            } else {
              setBreathPhase('Inhale');
              setBreathCyclesDone((c) => c + 1);
              sound.playBreathBell(soundEnabled);
              return currentTech.inhale;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isBreathingActive, breathPhase, selectedTechnique, soundEnabled, currentTech]);

  // Ambient sound toggle handler
  const handleToggleAmbient = (type: 'rain' | 'waves' | 'bowl' | 'silent') => {
    if (isAmbientPlaying && ambientType === type) {
      sound.stopAmbient();
      setIsAmbientPlaying(false);
    } else {
      setAmbientType(type);
      if (type === 'bowl') {
        sound.playSingingBowl(true);
        setIsAmbientPlaying(true);
      } else if (type === 'silent') {
        sound.stopAmbient();
        setIsAmbientPlaying(false);
      } else {
        sound.startAmbient(type);
        setIsAmbientPlaying(true);
      }
    }
  };

  const handleStartSessionModal = (session: MeditationSession) => {
    setActiveSession(session);
    setModalTimer(session.durationMinutes * 60);
    setIsModalPlaying(true);
    sound.playSingingBowl(soundEnabled);
  };

  // Modal session ticker
  useEffect(() => {
    if (!isModalPlaying || !activeSession) return;
    const timer = setInterval(() => {
      setModalTimer((prev) => {
        if (prev <= 1) {
          setIsModalPlaying(false);
          sound.playSingingBowl(soundEnabled);
          onFinishMeditation(activeSession.title, activeSession.durationMinutes);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isModalPlaying, activeSession, soundEnabled, onFinishMeditation]);

  const filteredSessions = sessions.filter((s) => {
    return selectedCategory === 'All' || s.category === selectedCategory;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-stone-900 via-teal-950 to-emerald-950 text-white p-6 sm:p-10 shadow-xl overflow-hidden border border-teal-900/40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold mb-3">
            <Heart className="w-3.5 h-3.5" />
            <span>Stillness, Pranayama & Rest</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-white">
            Meditation & Mindful Wellness
          </h1>
          <p className="mt-2 text-sm sm:text-base text-stone-300 leading-relaxed">
            Regulate your autonomic nervous system, decrease evening cortisol, and cultivate unshakable mental serenity through guided breathing and restorative auditory landscapes.
          </p>
        </div>
      </div>

      {/* Interactive Breathwork Studio */}
      <div className="bg-gradient-to-br from-teal-900/90 via-stone-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 border border-teal-700/40 shadow-xl">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold mb-4">
            <Wind className="w-3.5 h-3.5" />
            <span>Interactive Breathwork Studio</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-bold font-display text-white">
            {currentTech.name}
          </h2>
          <p className="text-xs sm:text-sm text-teal-200/80 mt-1 max-w-md">
            {currentTech.purpose}
          </p>

          {/* Technique Selectors */}
          <div className="flex flex-wrap items-center justify-center gap-2 my-6">
            <button
              onClick={() => {
                setSelectedTechnique('box');
                setBreathPhase('Inhale');
                setPhaseSecondsLeft(4);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedTechnique === 'box'
                  ? 'bg-teal-400 text-stone-950 shadow-md font-bold'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800'
              }`}
            >
              Box Breathing (4-4-4-4)
            </button>
            <button
              onClick={() => {
                setSelectedTechnique('478');
                setBreathPhase('Inhale');
                setPhaseSecondsLeft(4);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedTechnique === '478'
                  ? 'bg-teal-400 text-stone-950 shadow-md font-bold'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800'
              }`}
            >
              4-7-8 Sleep Breath
            </button>
            <button
              onClick={() => {
                setSelectedTechnique('calm');
                setBreathPhase('Inhale');
                setPhaseSecondsLeft(5);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedTechnique === 'calm'
                  ? 'bg-teal-400 text-stone-950 shadow-md font-bold'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800'
              }`}
            >
              Coherent 5-5 Breath
            </button>
          </div>

          {/* Dynamic Animated Visualizer Circle */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 my-4 flex items-center justify-center">
            {/* Outer pulsating wave ring */}
            <div
              className={`absolute inset-0 rounded-full border border-teal-500/30 transition-all duration-1000 ${
                isBreathingActive && breathPhase === 'Inhale'
                  ? 'scale-110 opacity-70'
                  : 'scale-95 opacity-20'
              }`}
            />

            {/* Inner pulsing orb */}
            <div
              className={`w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all duration-1000 shadow-2xl border-2 ${
                breathPhase === 'Inhale'
                  ? 'scale-125 bg-teal-500/30 border-teal-400 text-teal-100'
                  : breathPhase === 'Hold' || breathPhase === 'Hold (Empty)'
                  ? 'scale-115 bg-emerald-500/30 border-emerald-400 text-emerald-100'
                  : 'scale-90 bg-cyan-500/20 border-cyan-400 text-cyan-100'
              }`}
            >
              <span className="text-sm font-bold tracking-widest uppercase">
                {breathPhase}
              </span>
              <span className="text-3xl font-mono font-extrabold mt-1">
                {phaseSecondsLeft}s
              </span>
            </div>
          </div>

          {/* Control row */}
          <div className="flex items-center space-x-4 mt-6">
            <button
              onClick={() => {
                setIsBreathingActive(!isBreathingActive);
                if (!isBreathingActive) sound.playBreathBell(soundEnabled);
              }}
              className="px-6 py-3 rounded-2xl bg-teal-400 hover:bg-teal-300 text-stone-950 font-bold text-sm shadow-lg flex items-center space-x-2 transition-transform active:scale-95"
            >
              {isBreathingActive ? <Pause className="w-4 h-4 fill-stone-950" /> : <Play className="w-4 h-4 fill-stone-950" />}
              <span>{isBreathingActive ? 'Pause Session' : 'Begin Breathing Cycle'}</span>
            </button>

            <button
              onClick={() => {
                setIsBreathingActive(false);
                setBreathPhase('Inhale');
                setPhaseSecondsLeft(currentTech.inhale);
                setBreathCyclesDone(0);
              }}
              className="p-3 rounded-2xl bg-stone-800/80 hover:bg-stone-800 text-stone-300 transition-colors"
              title="Reset Cycles"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-teal-300/80 mt-4">
            Completed Cycles: <span className="font-bold text-white">{breathCyclesDone}</span>
          </p>
        </div>
      </div>

      {/* Calming Ambient Sound Generator Panel */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Headphones className="w-4 h-4 text-teal-600" />
            <h3 className="font-bold text-stone-900 text-base font-display">
              Calming Auditory Sanctuary
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Synthetic pink/brown noise & resonant acoustic frequencies to block out environmental distractions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleToggleAmbient('rain')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              isAmbientPlaying && ambientType === 'rain'
                ? 'bg-teal-800 text-white shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Gentle Rain</span>
          </button>

          <button
            onClick={() => handleToggleAmbient('waves')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              isAmbientPlaying && ambientType === 'waves'
                ? 'bg-teal-800 text-white shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Ocean Waves</span>
          </button>

          <button
            onClick={() => handleToggleAmbient('bowl')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              isAmbientPlaying && ambientType === 'bowl'
                ? 'bg-teal-800 text-white shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tibetan Bowl</span>
          </button>

          {isAmbientPlaying && (
            <button
              onClick={() => handleToggleAmbient('silent')}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
            >
              Mute Sound
            </button>
          )}
        </div>
      </div>

      {/* Guided Meditation Program Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900 font-display">Guided Audio Sessions</h2>
          <div className="flex items-center space-x-1 overflow-x-auto text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-stone-900 text-white font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={session.imageUrl}
                  alt={session.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-transparent" />

                <div className="absolute top-3.5 left-3.5">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-800/90 text-white backdrop-blur-md">
                    {session.category}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-stone-200">
                  <span>{session.durationMinutes} mins</span>
                  <span className="text-[11px] text-teal-300">{session.technique}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 text-base font-display group-hover:text-teal-700 transition-colors">
                    {session.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {session.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={session.instructorAvatar}
                      alt={session.instructorName}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-teal-500/20"
                    />
                    <span className="text-xs text-stone-700 font-medium">
                      {session.instructorName}
                    </span>
                  </div>

                  <button
                    onClick={() => handleStartSessionModal(session)}
                    className="px-4 py-2 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 shadow-sm flex items-center space-x-1.5 transition-all active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Begin</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen / Focus Session Modal */}
      {activeSession && (
        <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-10 max-w-md w-full text-center border border-stone-800 shadow-2xl relative">
            <button
              onClick={() => setActiveSession(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white"
            >
              ✕
            </button>

            <div className="w-20 h-20 mx-auto rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center mb-4 ring-2 ring-teal-500/30">
              <Sparkles className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">
              {activeSession.category}
            </span>
            <h3 className="text-xl font-bold font-display text-white mt-1">
              {activeSession.title}
            </h3>
            <p className="text-xs text-stone-400 mt-1">Guided by {activeSession.instructorName}</p>

            {/* Countdown timer */}
            <div className="my-8">
              <span className="text-5xl font-mono font-bold text-teal-200">
                {Math.floor(modalTimer / 60)}:{(modalTimer % 60).toString().padStart(2, '0')}
              </span>
              <p className="text-xs text-stone-400 mt-1">Minutes Remaining</p>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setIsModalPlaying(!isModalPlaying)}
                className="px-6 py-3 rounded-2xl bg-teal-400 text-stone-950 font-bold text-sm hover:bg-teal-300 transition-colors flex items-center space-x-2"
              >
                {isModalPlaying ? <Pause className="w-4 h-4 fill-stone-950" /> : <Play className="w-4 h-4 fill-stone-950" />}
                <span>{isModalPlaying ? 'Pause' : 'Resume'}</span>
              </button>

              <button
                onClick={() => {
                  onFinishMeditation(activeSession.title, activeSession.durationMinutes);
                  setActiveSession(null);
                }}
                className="px-4 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-300"
              >
                Complete Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
