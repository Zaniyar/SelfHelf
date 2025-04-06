import { useState } from 'react';
import { HealthGoals, HealthGoal } from './HealthGoals';
import { Mars, Venus, User } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface OnboardingProps {
  onComplete: (userData: UserData) => void;
}

export interface UserData {
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'moderate' | 'active';
  healthGoals: HealthGoal[];
}

export const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [userData, setUserData] = useState<UserData>({
    gender: 'male',
    age: 30,
    weight: 70,
    height: 170,
    activityLevel: 'moderate',
    healthGoals: []
  });

  const [mainGoal, setMainGoal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mainGoal.trim()) {
      onComplete({
        ...userData,
        healthGoals: [{
          id: uuidv4(),
          text: mainGoal,
          status: 'not-started',
          createdAt: new Date(),
        }]
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-xl border border-neon-blue/20 shadow-lg">
        <h2 className="text-2xl font-bold text-neon-blue text-center">Tell us about yourself</h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <label className="text-foreground/70">Gender</label>
            <div className="flex gap-4">
              <label className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-all duration-200
                ${userData.gender === 'male' 
                  ? 'bg-neon-blue/20 text-neon-blue border-2 border-neon-blue shadow-[0_0_10px_rgba(0,128,255,0.3)]' 
                  : 'hover:bg-neon-blue/10 border border-neon-blue/10'}`}
              >
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={userData.gender === 'male'}
                  onChange={(e) => setUserData({ ...userData, gender: e.target.value as UserData['gender'] })}
                  className="sr-only"
                />
                <Mars className={`transition-all duration-200 ${
                  userData.gender === 'male' ? 'w-6 h-6' : 'w-5 h-5'
                }`} />
                <span>Male</span>
              </label>

              <label className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-all duration-200
                ${userData.gender === 'female' 
                  ? 'bg-neon-blue/20 text-neon-blue border-2 border-neon-blue shadow-[0_0_10px_rgba(0,128,255,0.3)]' 
                  : 'hover:bg-neon-blue/10 border border-neon-blue/10'}`}
              >
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={userData.gender === 'female'}
                  onChange={(e) => setUserData({ ...userData, gender: e.target.value as UserData['gender'] })}
                  className="sr-only"
                />
                <Venus className={`transition-all duration-200 ${
                  userData.gender === 'female' ? 'w-6 h-6' : 'w-5 h-5'
                }`} />
                <span>Female</span>
              </label>

              <label className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-all duration-200
                ${userData.gender === 'other' 
                  ? 'bg-neon-blue/20 text-neon-blue border-2 border-neon-blue shadow-[0_0_10px_rgba(0,128,255,0.3)]' 
                  : 'hover:bg-neon-blue/10 border border-neon-blue/10'}`}
              >
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={userData.gender === 'other'}
                  onChange={(e) => setUserData({ ...userData, gender: e.target.value as UserData['gender'] })}
                  className="sr-only"
                />
                <User className={`transition-all duration-200 ${
                  userData.gender === 'other' ? 'w-6 h-6' : 'w-5 h-5'
                }`} />
                <span>Other</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-foreground/70">Age: {userData.age} years</label>
            <input
              type="range"
              value={userData.age}
              onChange={(e) => setUserData({ ...userData, age: parseInt(e.target.value) })}
              min={16}
              max={100}
              step={1}
              className="w-full accent-neon-blue"
            />
          </div>

          <div className="space-y-2">
            <label className="text-foreground/70">Weight: {userData.weight} kg</label>
            <input
              type="range"
              value={userData.weight}
              onChange={(e) => setUserData({ ...userData, weight: parseInt(e.target.value) })}
              min={30}
              max={200}
              step={1}
              className="w-full accent-neon-blue"
            />
          </div>

          <div className="space-y-2">
            <label className="text-foreground/70">Height: {userData.height} cm</label>
            <input
              type="range"
              value={userData.height}
              onChange={(e) => setUserData({ ...userData, height: parseInt(e.target.value) })}
              min={120}
              max={220}
              step={1}
              className="w-full accent-neon-blue"
            />
          </div>

          <div>
            <label className="text-foreground/70">Activity Level</label>
            <select
              value={userData.activityLevel}
              onChange={(e) => setUserData({ ...userData, activityLevel: e.target.value as UserData['activityLevel'] })}
              className="mt-1 block w-full rounded-md border border-neon-blue/20 
                       bg-neon-darker text-foreground shadow-sm
                       focus:border-neon-blue focus:ring focus:ring-neon-blue/20"
            >
              <option value="sedentary">Sedentary (Office job, Little exercise)</option>
              <option value="moderate">Moderate (Light exercise/sports 1-3 days/week)</option>
              <option value="active">Very Active (Exercise/sports 4-5 days/week)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-neon-blue mb-2">
              Main Health Goal
            </label>
            <input
              type="text"
              value={mainGoal}
              onChange={(e) => setMainGoal(e.target.value)}
              placeholder="What's your primary health goal? (e.g., Improve sleep quality)"
              className="w-full px-3 py-2 rounded-md bg-neon-darker text-foreground 
                       border border-neon-blue/20 
                       focus:border-neon-blue focus:ring focus:ring-neon-blue/20"
            />
            <p className="text-xs text-foreground/50 mt-1">
              You can add more goals later in the settings
            </p>
          </div>

          <button
            type="submit"
            disabled={!mainGoal.trim()}
            className="w-full py-3 px-4 bg-neon-blue/10 text-neon-blue border border-neon-blue/30 
                     rounded-md hover:bg-neon-blue/20 focus:outline-none focus:ring-2 
                     focus:ring-neon-blue/50 transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}; 