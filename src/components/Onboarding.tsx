import { useState } from 'react';

interface OnboardingProps {
  onComplete: (userData: UserData) => void;
}

export interface UserData {
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'moderate' | 'active';
}

export const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<UserData>({
    age: 30,
    weight: 70,
    height: 170,
    gender: 'male',
    activityLevel: 'moderate'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(userData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-xl border border-neon-blue/20 shadow-lg">
        <h2 className="text-2xl font-bold text-neon-blue text-center">Tell us about yourself</h2>
        
        <form className="space-y-6">
          <div>
            <label className="text-foreground/70">Gender</label>
            <select
              value={userData.gender}
              onChange={(e) => setUserData({ ...userData, gender: e.target.value as UserData['gender'] })}
              className="mt-1 block w-full rounded-md border border-neon-blue/20 
                       bg-neon-darker text-foreground shadow-sm
                       focus:border-neon-blue focus:ring focus:ring-neon-blue/20"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-foreground/70">Age</label>
            <input
              type="number"
              value={userData.age}
              onChange={(e) => setUserData({ ...userData, age: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border border-neon-blue/20 
                       bg-neon-darker text-foreground shadow-sm
                       focus:border-neon-blue focus:ring focus:ring-neon-blue/20"
            />
          </div>

          <div>
            <label className="text-foreground/70">Weight (kg)</label>
            <input
              type="number"
              value={userData.weight}
              onChange={(e) => setUserData({ ...userData, weight: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border border-neon-blue/20 
                       bg-neon-darker text-foreground shadow-sm
                       focus:border-neon-blue focus:ring focus:ring-neon-blue/20"
            />
          </div>

          <div>
            <label className="text-foreground/70">Height (cm)</label>
            <input
              type="number"
              value={userData.height}
              onChange={(e) => setUserData({ ...userData, height: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border border-neon-blue/20 
                       bg-neon-darker text-foreground shadow-sm
                       focus:border-neon-blue focus:ring focus:ring-neon-blue/20"
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
              <option value="sedentary">Sedentary</option>
              <option value="moderate">Moderate</option>
              <option value="active">Very Active</option>
            </select>
          </div>

          <div>
            <label className="text-foreground/70">Health Goals</label>
            <textarea
              value={userData.healthGoals}
              onChange={(e) => setUserData({ ...userData, healthGoals: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border border-neon-blue/20 
                       bg-neon-darker text-foreground shadow-sm
                       focus:border-neon-blue focus:ring focus:ring-neon-blue/20"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-2 px-4 bg-neon-darker text-neon-blue border border-neon-blue/30 
                     rounded-md hover:bg-neon-blue/10 focus:outline-none focus:ring-2 
                     focus:ring-neon-blue/50 transition-all duration-200"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}; 