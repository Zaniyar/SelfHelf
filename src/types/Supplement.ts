export interface Supplement {
  id: string;
  name: string;
  description: string;
  dosage: string;
  frequency: string;
  position: [number, number, number];
  targetArea: string;
  type?: 'Brain' | 'Heart' | 'Joint' | 'Vitamin' | 'Energy' | 'Muscle' | 'default';
}

export interface UserData {
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'moderate' | 'active';
} 