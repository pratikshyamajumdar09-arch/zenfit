export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type WorkoutCategory =
  | 'Full Body'
  | 'Strength'
  | 'Cardio'
  | 'HIIT'
  | 'Core'
  | 'Upper Body'
  | 'Lower Body'
  | 'Stretching'
  | 'Mobility';

export type YogaCategory =
  | 'Morning Yoga'
  | 'Flexibility'
  | 'Strength Yoga'
  | 'Stress Relief'
  | 'Back & Neck Relief'
  | 'Sleep Yoga'
  | 'Weight Management';

export type MeditationCategory =
  | 'Guided Meditation'
  | 'Breathing Exercises'
  | 'Relaxation'
  | 'Stress Relief'
  | 'Sleep Programs';

export type Equipment =
  | 'None (Bodyweight)'
  | 'Yoga Mat'
  | 'Dumbbells'
  | 'Resistance Bands'
  | 'Kettlebell'
  | 'Yoga Block & Strap';

export type FitnessGoal =
  | 'Weight Management'
  | 'Flexibility & Posture'
  | 'Core & Strength'
  | 'Stress Reduction & Mind'
  | 'Endurance & Cardio';

export interface ExerciseStep {
  name: string;
  durationSeconds: number; // e.g. 45s work or hold
  restSeconds: number; // e.g. 15s rest
  instructions: string;
  targetMuscles: string[];
  breathingCue?: string;
  illustrationType?: 'yoga' | 'strength' | 'cardio' | 'stretch';
}

export interface WorkoutItem {
  id: string;
  title: string;
  category: WorkoutCategory;
  subcategory?: string;
  durationMinutes: number;
  difficulty: Difficulty;
  caloriesBurned: number;
  instructorName: string;
  instructorId: string;
  instructorAvatar: string;
  imageUrl: string;
  description: string;
  equipment: Equipment[];
  goal: FitnessGoal;
  rating: number;
  reviewCount: number;
  exercises: ExerciseStep[];
  featured?: boolean;
}

export interface YogaSession {
  id: string;
  title: string;
  category: YogaCategory;
  durationMinutes: number;
  difficulty: Difficulty;
  estimatedCalories: number;
  instructorName: string;
  instructorId: string;
  instructorAvatar: string;
  imageUrl: string;
  description: string;
  benefits: string[];
  equipment: Equipment[];
  exercises: ExerciseStep[];
  featured?: boolean;
}

export interface MeditationSession {
  id: string;
  title: string;
  category: MeditationCategory;
  durationMinutes: number;
  instructorName: string;
  instructorAvatar: string;
  imageUrl: string;
  description: string;
  audioTrackTitle?: string;
  technique?: string;
  ambientSound?: 'rain' | 'forest' | 'waves' | 'bowl' | 'silent';
}

export interface Trainer {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  experienceYears: number;
  rating: number;
  studentsCount: number;
  imageUrl: string;
  bio: string;
  certifications: string[];
  quote: string;
}

export interface PlanDay {
  dayName: string; // e.g. "Monday"
  workoutTitle: string;
  category: string;
  durationMinutes: number;
  calories: number;
  intensity: 'Gentle' | 'Moderate' | 'Challenging';
  description: string;
  exercises: string[];
  completed: boolean;
  linkedWorkoutId?: string;
}

export interface UserPreferences {
  goal: FitnessGoal;
  experienceLevel: Difficulty;
  preferredWorkoutTypes: string[];
  availableTimeMinutes: number;
  weeklyDaysCount: number;
  equipment: Equipment[];
}

export interface PersonalizedPlan {
  id: string;
  title: string;
  createdAt: string;
  summary: string;
  weeklyFocus: string;
  days: PlanDay[];
  preferences: UserPreferences;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  isLoggedIn: boolean;
  memberSince: string;
  tier: 'Free' | 'Pro Member';
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  dailyWaterGoalMl: number;
  dailyCaloriesGoal: number;
  notificationsEnabled: boolean;
  soundEffectsEnabled: boolean;
  fitnessGoal?: FitnessGoal;
  experienceLevel?: Difficulty;
  preferences: UserPreferences;
}

export interface DailyActivity {
  date: string;
  caloriesBurned: number;
  durationMinutes: number;
  waterIntakeMl: number;
  streakDays: number;
  completedWorkoutsCount: number;
}

export interface CompletedSessionRecord {
  id: string;
  date: string;
  time: string;
  title: string;
  category: string;
  durationMinutes: number;
  caloriesBurned: number;
  instructorName: string;
  rating?: number;
}

export type NavigationTab =
  | 'dashboard'
  | 'yoga'
  | 'workouts'
  | 'plans'
  | 'meditation'
  | 'trainers'
  | 'analytics'
  | 'coach'
  | 'profile';
