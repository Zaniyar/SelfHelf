import { Settings as SettingsIcon, Moon, Sun, Monitor, Palette } from 'lucide-react';
import { UserData } from './Onboarding';
import { HealthGoals, HealthGoal } from './HealthGoals';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData;
  onUpdateUserData: (data: UserData) => void;
  currentTheme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  bgColor: string;
  onBgColorChange: (color: string) => void;
}

export const SettingsDrawer = ({ 
  isOpen, 
  onClose, 
  userData, 
  onUpdateUserData,
  currentTheme,
  onThemeChange,
  bgColor,
  onBgColorChange
}: SettingsDrawerProps) => {
  const backgroundPresets = [
    { name: 'Blood', color: '#ff0000' },
    { name: 'Matrix', color: '#20701f' },
    { name: 'Black', color: '#000000' },
    { name: 'White', color: '#ffffff' },
    { name: 'Deep Blue', color: '#780aff' },
    { name: 'Custom', color: bgColor },
  ];

  const handleGoalsChange = (newGoals: HealthGoal[]) => {
    onUpdateUserData({
      ...userData,
      healthGoals: newGoals,
    });
  };

  return (
    <div 
      className={`drawer fixed right-0 top-0 h-full w-96 
        bg-background border-l border-primary/20 shadow-lg 
        transform transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">Settings</h2>
          <button onClick={onClose} className="text-primary/70 hover:text-primary">
            ✕
          </button>
        </div>

        {/* Theme Settings */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-primary mb-4">Theme</h3>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => onThemeChange('light')}
              className={`flex flex-col items-center p-4 rounded-lg border 
                ${currentTheme === 'light' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-primary/20 hover:border-primary/50'}`}
            >
              <Sun className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm text-primary">Light</span>
            </button>
            <button
              onClick={() => onThemeChange('dark')}
              className={`flex flex-col items-center p-4 rounded-lg border ${
                currentTheme === 'dark' 
                  ? 'border-[#00ffff] bg-[#001830]' 
                  : 'border-[#00ffff]/20 hover:border-[#00ffff]/50'
              }`}
            >
              <Moon className="h-6 w-6 text-[#00ffff] mb-2" />
              <span className="text-sm text-[#00ffff]">Dark</span>
            </button>
            <button
              onClick={() => onThemeChange('system')}
              className={`flex flex-col items-center p-4 rounded-lg border ${
                currentTheme === 'system' 
                  ? 'border-[#00ffff] bg-[#001830]' 
                  : 'border-[#00ffff]/20 hover:border-[#00ffff]/50'
              }`}
            >
              <Monitor className="h-6 w-6 text-[#00ffff] mb-2" />
              <span className="text-sm text-[#00ffff]">System</span>
            </button>
          </div>
        </div>

        {/* Background Color Settings */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-primary">Background Color</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {backgroundPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => onBgColorChange(preset.color)}
                className={`group relative flex flex-col items-center p-3 rounded-lg border
                  ${preset.color === bgColor 
                    ? 'border-primary' 
                    : 'border-primary/20 hover:border-primary/50'}`}
              >
                <div 
                  className="w-8 h-8 rounded-full mb-2 border border-primary/20"
                  style={{ backgroundColor: preset.color }}
                />
                <span className="text-xs text-primary">{preset.name}</span>
              </button>
            ))}
          </div>

          {/* Custom color picker */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-primary/70 mb-2">
              Custom Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => onBgColorChange(e.target.value)}
                className="h-10 w-20"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => onBgColorChange(e.target.value)}
                className="flex-1 px-3 py-1 rounded-md border border-primary/20 
                  bg-background text-foreground text-sm
                  focus:border-primary focus:ring focus:ring-primary/20"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>

        {/* User Settings */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-primary/70">Gender</label>
            <select
              value={userData.gender}
              onChange={(e) => onUpdateUserData({ ...userData, gender: e.target.value })}
              className="mt-1 block w-full rounded-md 
                border border-primary/20 
                bg-background text-foreground
                focus:border-primary focus:ring focus:ring-primary/20"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary/70">Age</label>
            <input
              type="number"
              value={userData.age}
              onChange={(e) => onUpdateUserData({ ...userData, age: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md 
                border border-primary/20 
                bg-background text-foreground
                focus:border-primary focus:ring focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary/70 mb-2">
              Health Goals
            </label>
            <HealthGoals
              goals={userData.healthGoals}
              onChange={handleGoalsChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 