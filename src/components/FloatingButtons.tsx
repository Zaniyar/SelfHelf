import { Plus, Settings } from 'lucide-react';

interface FloatingButtonsProps {
  onAddClick: () => void;
  onSettingsClick: () => void;
}

export const FloatingButtons = ({ onAddClick, onSettingsClick }: FloatingButtonsProps) => {
  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-4">
      <button
        onClick={onSettingsClick}
        className="w-12 h-12 bg-[#001830] border border-[#00ffff]/30 text-[#00ffff] rounded-full shadow-lg hover:bg-[#002040] focus:outline-none focus:ring-2 focus:ring-[#00ffff]/50 focus:ring-offset-2 focus:ring-offset-[#000814] flex items-center justify-center transition-all duration-200 hover:shadow-[#00ffff]/20 hover:shadow-xl"
      >
        <Settings className="h-5 w-5" />
      </button>
      <button
        onClick={onAddClick}
        className="w-16 h-16 bg-[#001830] border border-[#00ffff]/30 text-[#00ffff] rounded-full shadow-lg hover:bg-[#002040] focus:outline-none focus:ring-2 focus:ring-[#00ffff]/50 focus:ring-offset-2 focus:ring-offset-[#000814] flex items-center justify-center text-3xl transition-all duration-200 hover:shadow-[#00ffff]/20 hover:shadow-xl"
      >
        <Plus className="h-8 w-8" />
      </button>
    </div>
  );
}; 