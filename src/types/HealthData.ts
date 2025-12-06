// ================================
// Health Data Type System
// ================================

// ===== HEALTH PILLARS =====
export type HealthPillarType =
  | 'sleep'
  | 'nutrition'
  | 'movement'
  | 'mentalHealth'
  | 'recovery'
  | 'medical';

export interface HealthPillar {
  type: HealthPillarType;
  label: string;
  score: number; // 0-100
  minRecommended: number; // Baseline threshold
  icon: string; // Lucide icon name
  color: string; // Hex color for visualization
  trend: 'improving' | 'stable' | 'declining';
  lastUpdated: Date;
}

// ===== SYSTEM STATE (Organ Happiness) =====
export type OrganSystemType =
  | 'cardiac'
  | 'metabolic'
  | 'sleep'
  | 'hormonal'
  | 'stress'
  | 'gut';

export type HappinessLevel = 'thriving' | 'good' | 'neutral' | 'stressed' | 'critical';

export interface OrganSystem {
  type: OrganSystemType;
  label: string;
  happiness: HappinessLevel;
  score: number; // 0-100
  forecast: 'improving' | 'stable' | 'declining';
  suggestedAction?: string;
  position?: { x: number; y: number; z: number }; // For 3D overlay
}

export interface SystemState {
  pillars: HealthPillar[];
  organSystems: OrganSystem[];
  overallScore: number;
  lastCalculated: Date;
}

// ===== DATA SOURCES =====
export type DataSourceCategory = 'manual' | 'device' | 'medical' | 'lifestyle';

export interface DataSource {
  id: string;
  name: string;
  category: DataSourceCategory;
  enabled: boolean;
  connected: boolean;
  icon: string;
  description: string;
}

export const AVAILABLE_DATA_SOURCES: DataSource[] = [
  // Manual
  { id: 'sleep-log', name: 'Sleep Log', category: 'manual', enabled: false, connected: false, icon: 'Moon', description: 'Track sleep duration and quality' },
  { id: 'meal-log', name: 'Meal Log', category: 'manual', enabled: false, connected: false, icon: 'UtensilsCrossed', description: 'Log meals and nutrition' },
  { id: 'symptom-log', name: 'Symptoms', category: 'manual', enabled: false, connected: false, icon: 'Thermometer', description: 'Track symptoms and discomfort' },
  { id: 'mood-log', name: 'Mood', category: 'manual', enabled: false, connected: false, icon: 'Smile', description: 'Daily mood tracking' },
  { id: 'stress-log', name: 'Stress', category: 'manual', enabled: false, connected: false, icon: 'Brain', description: 'Stress level tracking' },
  { id: 'menstrual-log', name: 'Menstrual Cycle', category: 'manual', enabled: false, connected: false, icon: 'Calendar', description: 'Cycle tracking' },

  // Devices
  { id: 'apple-health', name: 'Apple Health', category: 'device', enabled: false, connected: false, icon: 'Apple', description: 'Steps, heart rate, sleep' },
  { id: 'google-fit', name: 'Google Fit', category: 'device', enabled: false, connected: false, icon: 'Activity', description: 'Activity and fitness data' },
  { id: 'oura', name: 'Oura Ring', category: 'device', enabled: false, connected: false, icon: 'Circle', description: 'Sleep, readiness, activity' },
  { id: 'whoop', name: 'Whoop', category: 'device', enabled: false, connected: false, icon: 'Zap', description: 'Strain, recovery, sleep' },
  { id: 'garmin', name: 'Garmin', category: 'device', enabled: false, connected: false, icon: 'Watch', description: 'Fitness tracking' },
  { id: 'fitbit', name: 'Fitbit', category: 'device', enabled: false, connected: false, icon: 'Heart', description: 'Activity and health' },
  { id: 'cgm', name: 'CGM (Glucose)', category: 'device', enabled: false, connected: false, icon: 'TrendingUp', description: 'Continuous glucose monitoring' },

  // Medical
  { id: 'lab-results', name: 'Lab Results', category: 'medical', enabled: false, connected: false, icon: 'TestTube', description: 'Blood work and tests' },
  { id: 'medications', name: 'Medications', category: 'medical', enabled: false, connected: false, icon: 'Pill', description: 'Current medications' },
  { id: 'diagnoses', name: 'Diagnoses', category: 'medical', enabled: false, connected: false, icon: 'FileText', description: 'Medical conditions' },
  { id: 'allergies', name: 'Allergies', category: 'medical', enabled: false, connected: false, icon: 'AlertTriangle', description: 'Known allergies' },

  // Lifestyle
  { id: 'exercise', name: 'Exercise', category: 'lifestyle', enabled: false, connected: false, icon: 'Dumbbell', description: 'Workout routines' },
  { id: 'diet-pattern', name: 'Diet Pattern', category: 'lifestyle', enabled: false, connected: false, icon: 'Salad', description: 'Eating habits' },
  { id: 'caffeine', name: 'Caffeine', category: 'lifestyle', enabled: false, connected: false, icon: 'Coffee', description: 'Caffeine intake' },
  { id: 'alcohol', name: 'Alcohol', category: 'lifestyle', enabled: false, connected: false, icon: 'Wine', description: 'Alcohol consumption' },
];

// ===== HEALTH GOALS =====
export type GoalCategory =
  | 'sleep'
  | 'metabolic'
  | 'mental'
  | 'cardiovascular'
  | 'weight'
  | 'inflammation'
  | 'chronic'
  | 'resilience';

export interface HealthGoalOption {
  id: string;
  category: GoalCategory;
  title: string;
  description: string;
  icon: string;
  shortTermSignals: string[];
  longTermOutcomes: string[];
}

export const HEALTH_GOAL_OPTIONS: HealthGoalOption[] = [
  {
    id: 'improve-sleep',
    category: 'sleep',
    title: 'Improve Sleep',
    description: 'Better sleep quality, duration, and consistency',
    icon: 'Moon',
    shortTermSignals: ['Faster sleep onset', 'Fewer wake-ups', 'More refreshed mornings'],
    longTermOutcomes: ['Improved HRV', 'Better cognitive function', 'Enhanced recovery'],
  },
  {
    id: 'metabolic-health',
    category: 'metabolic',
    title: 'Improve Metabolic Health',
    description: 'Better glucose control, insulin sensitivity, HbA1c',
    icon: 'TrendingUp',
    shortTermSignals: ['Stable energy levels', 'Reduced cravings', 'Better glucose after meals'],
    longTermOutcomes: ['Lower HbA1c', 'Improved insulin sensitivity', 'Reduced metabolic disease risk'],
  },
  {
    id: 'mental-wellbeing',
    category: 'mental',
    title: 'Improve Mental Well-being',
    description: 'Reduce stress, anxiety, and improve mood',
    icon: 'Brain',
    shortTermSignals: ['Lower stress perception', 'Better mood stability', 'Improved focus'],
    longTermOutcomes: ['Reduced anxiety symptoms', 'Better emotional resilience', 'Improved life satisfaction'],
  },
  {
    id: 'cardiovascular',
    category: 'cardiovascular',
    title: 'Improve Cardiovascular Fitness',
    description: 'Better heart health, endurance, and VO2max',
    icon: 'Heart',
    shortTermSignals: ['Improved resting HR', 'Better exercise tolerance', 'Higher HRV'],
    longTermOutcomes: ['Lower blood pressure', 'Improved VO2max', 'Reduced cardiovascular risk'],
  },
  {
    id: 'weight-management',
    category: 'weight',
    title: 'Manage Weight',
    description: 'Achieve and maintain a healthy body composition',
    icon: 'Scale',
    shortTermSignals: ['Stable weight', 'Better satiety', 'Reduced cravings'],
    longTermOutcomes: ['Healthy BMI', 'Improved body composition', 'Sustainable eating habits'],
  },
  {
    id: 'reduce-inflammation',
    category: 'inflammation',
    title: 'Reduce Inflammation',
    description: 'Lower chronic inflammation markers',
    icon: 'Flame',
    shortTermSignals: ['Less joint stiffness', 'Reduced bloating', 'Better digestion'],
    longTermOutcomes: ['Lower CRP levels', 'Reduced pain', 'Better immune function'],
  },
  {
    id: 'chronic-conditions',
    category: 'chronic',
    title: 'Manage Chronic Conditions',
    description: 'PCOS, endometriosis, migraine, IBS, ADHD, etc.',
    icon: 'Stethoscope',
    shortTermSignals: ['Fewer symptom flares', 'Better symptom predictability', 'Improved daily function'],
    longTermOutcomes: ['Reduced medication needs', 'Better quality of life', 'Improved condition management'],
  },
  {
    id: 'resilience',
    category: 'resilience',
    title: 'Improve Resilience & Recovery',
    description: 'Better stress response and faster recovery',
    icon: 'Shield',
    shortTermSignals: ['Faster recovery from workouts', 'Better stress tolerance', 'Improved adaptability'],
    longTermOutcomes: ['Higher HRV baseline', 'Reduced burnout risk', 'Better performance under pressure'],
  },
];

// ===== TRACKING PREFERENCES =====
export type BurdenTolerance = 'minimal' | 'moderate' | 'detailed';
export type TrackingFrequency = 'never' | 'daily' | 'weekly' | 'event-triggered';

export interface TrackingPreferences {
  burdenTolerance: BurdenTolerance;
  passiveTracking: boolean;
  activeReportFrequency: TrackingFrequency;
  eventTriggeredReports: boolean;
  reminderFrequency: 'low' | 'normal' | 'high';
}

// ===== INTERVENTIONS =====
export type InterventionCategory =
  | 'movement'
  | 'sleep'
  | 'nutrition'
  | 'supplement'
  | 'mindfulness'
  | 'lifestyle'
  | 'medical';

export type UrgencyLevel = 'acute' | 'strong' | 'optional';

export interface InterventionCost {
  effort: number; // 1-5
  timeMinutes: number;
  monetaryCost?: number;
  potentialSideEffects?: string[];
  psychologicalFriction: number; // 1-5
}

export interface InterventionBenefit {
  expectedImprovement: number; // percentage
  affectedPillars: HealthPillarType[];
  timeToBenefit: 'immediate' | 'hours' | 'days' | 'weeks';
  confidence: number; // 0-100 based on evidence and personal history
}

export interface Intervention {
  id: string;
  title: string;
  description: string;
  category: InterventionCategory;
  icon: string;
  cost: InterventionCost;
  benefit: InterventionBenefit;
  urgency: UrgencyLevel;
  adherenceLikelihood?: number; // 0-100 based on user history
  isCompleted?: boolean;
  completedAt?: Date;
  feedback?: InterventionFeedback;
}

export interface InterventionFeedback {
  difficulty: number; // 1-5
  helpfulness: number; // 1-5
  wouldRepeat: boolean;
  notes?: string;
  submittedAt: Date;
}

// ===== REMINDERS =====
export interface Reminder {
  id: string;
  type: 'intervention' | 'logging' | 'medication' | 'custom';
  title: string;
  message: string;
  scheduledFor: Date;
  isAdaptive: boolean;
  urgency: UrgencyLevel;
  relatedInterventionId?: string;
  dismissed?: boolean;
  snoozedUntil?: Date;
}

// ===== DEFAULT PILLAR CONFIGURATION =====
export const DEFAULT_PILLARS: HealthPillar[] = [
  { type: 'sleep', label: 'Sleep', score: 75, minRecommended: 70, icon: 'Moon', color: '#6366f1', trend: 'stable', lastUpdated: new Date() },
  { type: 'nutrition', label: 'Nutrition', score: 65, minRecommended: 70, icon: 'Apple', color: '#22c55e', trend: 'stable', lastUpdated: new Date() },
  { type: 'movement', label: 'Movement', score: 55, minRecommended: 60, icon: 'Footprints', color: '#f59e0b', trend: 'stable', lastUpdated: new Date() },
  { type: 'mentalHealth', label: 'Mental Health', score: 70, minRecommended: 65, icon: 'Brain', color: '#ec4899', trend: 'stable', lastUpdated: new Date() },
  { type: 'recovery', label: 'Recovery', score: 60, minRecommended: 65, icon: 'Zap', color: '#06b6d4', trend: 'stable', lastUpdated: new Date() },
  { type: 'medical', label: 'Medical', score: 85, minRecommended: 75, icon: 'Stethoscope', color: '#8b5cf6', trend: 'stable', lastUpdated: new Date() },
];

export const DEFAULT_ORGAN_SYSTEMS: OrganSystem[] = [
  { type: 'cardiac', label: 'Heart', happiness: 'good', score: 78, forecast: 'stable', position: { x: 0, y: 1.3, z: 0.15 } },
  { type: 'metabolic', label: 'Metabolism', happiness: 'neutral', score: 65, forecast: 'stable', position: { x: 0.1, y: 1.0, z: 0.12 } },
  { type: 'sleep', label: 'Sleep System', happiness: 'good', score: 75, forecast: 'improving', position: { x: 0, y: 1.65, z: 0.1 } },
  { type: 'hormonal', label: 'Hormones', happiness: 'neutral', score: 68, forecast: 'stable', position: { x: -0.1, y: 1.0, z: 0.08 } },
  { type: 'stress', label: 'Stress/ANS', happiness: 'stressed', score: 55, forecast: 'declining', position: { x: 0, y: 1.5, z: 0.08 } },
  { type: 'gut', label: 'Gut Health', happiness: 'good', score: 72, forecast: 'stable', position: { x: 0, y: 0.9, z: 0.15 } },
];

// ===== USER DATA =====
export interface ExtendedUserData {
  // Basic info
  gender: 'male' | 'female' | 'other';
  age: number;
  weight: number;
  height: number;
  activityLevel: 'sedentary' | 'moderate' | 'active';

  // New fields
  dataSources: DataSource[];
  primaryGoals: string[]; // Goal IDs
  secondaryGoals: string[]; // Goal IDs
  trackingPreferences: TrackingPreferences;
  onboardingCompleted: boolean;
  onboardingStep: number;
}
