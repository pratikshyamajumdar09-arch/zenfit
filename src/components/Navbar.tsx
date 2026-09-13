import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Droplets,
  Bell,
  User,
  Compass,
  Heart,
  Dumbbell,
  Calendar,
  Activity,
  MessageSquare,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { NavigationTab, UserProfile } from '../types';

interface NavbarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  user?: UserProfile;
  onOpenAuth?: (type: 'login' | 'signup') => void;
  onLogout?: () => void;
  waterCount?: number;
  streakDays?: number;
  onQuickWaterAdd?: () => void;
  onAddWater?: (amountMl: number) => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  favoriteCount?: number;
  onOpenProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  user,
  onOpenAuth,
  onLogout,
  waterCount = 1750,
  streakDays = 7,
  onQuickWaterAdd,
  onAddWater,
  soundEnabled = true,
  onToggleSound = () => {},
  favoriteCount = 0,
  onOpenProfile,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const handleWaterClick = () => {
    if (onQuickWaterAdd) {
      onQuickWaterAdd();
    } else if (onAddWater) {
      onAddWater(250);
    }
  };

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Compass className="w-4 h-4" /> },
    { id: 'yoga', label: 'Yoga Studio', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'workouts', label: 'Workouts', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'plans', label: 'My Plan', icon: <Calendar className="w-4 h-4" /> },
    { id: 'meditation', label: 'Meditation', icon: <Heart className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <Activity className="w-4 h-4" /> },
    { id: 'trainers', label: 'Trainers', icon: <User className="w-4 h-4" /> },
    { id: 'coach', label: 'AI Coach', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-50/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 to-teal-600 flex items-center justify-center text-white shadow-sm ring-2 ring-emerald-600/20">
              {/* Zen Lotus Geometric Emblem */}
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C12 2 14.5 7.5 17 9.5C19.5 11.5 22 13 22 15C22 18.5 17.5 21 12 21C6.5 21 2 18.5 2 15C2 13 4.5 11.5 7 9.5C9.5 7.5 12 2 12 2Z" />
                <path d="M12 7C12 7 13.5 11 15 12.5C16.5 14 18 15 18 16.5C18 19 15.5 20.5 12 20.5C8.5 20.5 6 19 6 16.5C6 15 7.5 14 9 12.5C10.5 11 12 7 12 7Z" opacity="0.6"/>
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-stone-900 font-display">
                Zen<span className="text-emerald-700">Fit</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs uppercase tracking-widest text-stone-700 font-medium border-l border-stone-300 pl-2">
                Mindful Fitness
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.id === 'coach' && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-200 text-emerald-950 rounded-full">
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Metrics & User Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Mute Zen Chimes' : 'Enable Zen Chimes'}
              className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-700" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
            </button>

            {/* Streak Counter Pill */}
            <div
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold cursor-pointer hover:bg-amber-100/70 transition-colors"
              onClick={() => onSelectTab('analytics')}
              title={`${streakDays}-day streak! Click to view analytics.`}
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{streakDays}d Streak</span>
            </div>

            {/* Water logger pill */}
            <button
              onClick={handleWaterClick}
              className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium hover:bg-teal-100 transition-colors"
              title="Click to log 250ml water"
            >
              <Droplets className="w-3.5 h-3.5 text-teal-600" />
              <span>{(waterCount / 1000).toFixed(1)}L</span>
              <span className="text-[10px] bg-teal-200/80 text-teal-900 px-1 rounded font-bold">+250</span>
            </button>

            {/* Notifications toggle */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-700 rounded-full ring-2 ring-stone-50" />
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white shadow-xl border border-stone-200 p-3 z-50 text-sm">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-2">
                    <span className="font-semibold text-stone-900 text-xs tracking-wider uppercase">Zen Notifications</span>
                    <span className="text-[11px] text-emerald-800 font-medium cursor-pointer" onClick={() => setNotificationOpen(false)}>Clear</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-100">
                      <p className="text-xs font-medium text-emerald-950">Daily Plan Ready 🌿</p>
                      <p className="text-[11px] text-emerald-800 mt-0.5">Your 25-min Vinyasa Sunrise Flow is waiting for you today.</p>
                    </div>
                    <div className="p-2 rounded-xl bg-stone-50 border border-stone-100">
                      <p className="text-xs font-medium text-stone-800">Hydration Check 💧</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">You're at {(waterCount / 1000).toFixed(1)}L of your 2.5L daily goal.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Auth */}
            {user?.isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-stone-200/60 transition-colors"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'}
                    alt={user.name || 'User'}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-600/30"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500 hidden sm:block" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-stone-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-sm font-semibold text-stone-900">{user.name || 'Wellness Explorer'}</p>
                      <p className="text-xs text-stone-500 truncate">{user.email || 'user@zenfit.io'}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {user.tier || 'Pro Member'}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          if (onOpenProfile) {
                            onOpenProfile();
                          } else {
                            onSelectTab('profile');
                          }
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 flex items-center space-x-2"
                      >
                        <User className="w-4 h-4 text-stone-400" />
                        <span>Profile & Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          onSelectTab('yoga');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 flex items-center space-x-2"
                      >
                        <Heart className="w-4 h-4 text-rose-400" />
                        <span>Favorites ({favoriteCount})</span>
                      </button>
                      <button
                        onClick={() => {
                          onSelectTab('plans');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 flex items-center space-x-2"
                      >
                        <Calendar className="w-4 h-4 text-stone-400" />
                        <span>Personalized Schedule</span>
                      </button>
                    </div>

                    <div className="border-t border-stone-100 pt-1">
                      <button
                        onClick={() => {
                          onLogout?.();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenAuth ? onOpenAuth('login') : onOpenProfile?.()}
                  className="text-xs font-semibold px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-200/60"
                >
                  Log In
                </button>
                <button
                  onClick={() => onOpenAuth ? onOpenAuth('signup') : onOpenProfile?.()}
                  className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-emerald-800 text-white hover:bg-emerald-900 shadow-sm"
                >
                  Join ZenFit
                </button>
              </div>
            )}

            {/* Mobile Nav Toggle */}
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
            >
              {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileNavOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-1 shadow-lg">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setIsMobileNavOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-xs font-medium flex items-center space-x-2 ${
                    isActive
                      ? 'bg-emerald-800 text-white font-semibold'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500">
            <span className="flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Streak: {streakDays} days</span>
            </span>
            <span className="flex items-center space-x-1">
              <Droplets className="w-3.5 h-3.5 text-teal-600" />
              <span>Water: {(waterCount / 1000).toFixed(1)}L / 2.5L</span>
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
