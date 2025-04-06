import { Settings as SettingsIcon, Moon, Sun, Monitor, Palette, Mars, Venus, User, ImageIcon, Sliders, UserCircle } from 'lucide-react';
import { UserData } from './Onboarding';
import { HealthGoals, HealthGoal } from './HealthGoals';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData;
  onUpdateUserData: (data: UserData) => void;
  currentTheme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  bgColor: string;
  onBgColorChange: (color: string) => void;
  currentEnv: string;
  onEnvChange: (env: string) => void;
}

const environments = [
  'chrome.jpg',
  'fluid.jpg',
  'giraff.jpg',
  'gold.jpg',
  'leo.jpg',
  'matrix.jpg',
  'metalic.jpg',
  'pinkdark.jpg',
  'pinkgold.jpg',
  'poison.jpg',
  'zebra.jpg',
  'sand.jpg'
];

export function SettingsDrawer({ 
  isOpen, 
  onClose, 
  userData, 
  onUpdateUserData,
  currentTheme,
  onThemeChange,
  bgColor,
  onBgColorChange,
  currentEnv,
  onEnvChange
}: SettingsDrawerProps) {
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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            Settings
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="ux" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ux" className="flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              UX Settings
            </TabsTrigger>
            <TabsTrigger value="user" className="flex items-center gap-2">
              <UserCircle className="w-4 h-4" />
              User Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ux" className="space-y-6 py-4">
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

            {/* Environment Textures */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Environment Texture
              </label>
              <div className="grid grid-cols-3 gap-2">
                {environments.map((env) => (
                  <button
                    key={env}
                    onClick={() => onEnvChange(env)}
                    className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all
                      ${currentEnv === env 
                        ? 'border-primary shadow-[0_0_10px_rgba(0,128,255,0.3)]' 
                        : 'border-primary/20 hover:border-primary/50'}`}
                  >
                    <img
                      src={env}
                      alt={env.replace('.jpg', '')}
                      className="w-full h-full object-cover"
                    />
                    {currentEnv === env && (
                      <div className="absolute inset-0 bg-primary/20" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="user" className="space-y-6 py-4">
            {/* Gender Selection */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-foreground/70">Gender</label>
              <div className="flex gap-4">
                <label className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors
                  ${userData.gender === 'male' 
                    ? 'bg-primary/20 text-primary border border-primary/30' 
                    : 'hover:bg-primary/10 border border-primary/10'}`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={userData.gender === 'male'}
                    onChange={(e) => onUpdateUserData({ ...userData, gender: e.target.value })}
                    className="sr-only"
                  />
                  <Mars className="w-5 h-5" />
                  <span>Male</span>
                </label>

                <label className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors
                  ${userData.gender === 'female' 
                    ? 'bg-primary/20 text-primary border border-primary/30' 
                    : 'hover:bg-primary/10 border border-primary/10'}`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={userData.gender === 'female'}
                    onChange={(e) => onUpdateUserData({ ...userData, gender: e.target.value })}
                    className="sr-only"
                  />
                  <Venus className="w-5 h-5" />
                  <span>Female</span>
                </label>

                <label className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors
                  ${userData.gender === 'other' 
                    ? 'bg-primary/20 text-primary border border-primary/30' 
                    : 'hover:bg-primary/10 border border-primary/10'}`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={userData.gender === 'other'}
                    onChange={(e) => onUpdateUserData({ ...userData, gender: e.target.value })}
                    className="sr-only"
                  />
                  <User className="w-5 h-5" />
                  <span>Other</span>
                </label>
              </div>
            </div>

            {/* Age Input */}
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

            {/* Weight Input */}
            <div>
              <label className="block text-sm font-medium text-primary/70">Weight (kg)</label>
              <input
                type="number"
                value={userData.weight}
                onChange={(e) => onUpdateUserData({ ...userData, weight: parseInt(e.target.value) })}
                min={30}
                max={200}
                className="mt-1 block w-full rounded-md 
                  border border-primary/20 
                  bg-background text-foreground
                  focus:border-primary focus:ring focus:ring-primary/20"
              />
            </div>

            {/* Height Input */}
            <div>
              <label className="block text-sm font-medium text-primary/70">Height (cm)</label>
              <input
                type="number"
                value={userData.height}
                onChange={(e) => onUpdateUserData({ ...userData, height: parseInt(e.target.value) })}
                min={120}
                max={220}
                className="mt-1 block w-full rounded-md 
                  border border-primary/20 
                  bg-background text-foreground
                  focus:border-primary focus:ring focus:ring-primary/20"
              />
            </div>

            {/* Health Goals */}
            <div>
              <label className="block text-sm font-medium text-primary/70 mb-2">
                Health Goals
              </label>
              <HealthGoals
                goals={userData.healthGoals}
                onChange={handleGoalsChange}
              />
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
} 