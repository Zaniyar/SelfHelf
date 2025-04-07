import { Toggle } from "./ui/toggle";
import { Pill, HeartCrack } from "lucide-react";

interface FilterBoxProps {
  showSupplements: boolean;
  showPainPoints: boolean;
  onToggleSupplements: () => void;
  onTogglePainPoints: () => void;
}

export const FilterBox = ({ 
  showSupplements, 
  showPainPoints, 
  onToggleSupplements, 
  onTogglePainPoints 
}: FilterBoxProps) => {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-10 flex gap-2 bg-background/90 backdrop-blur-sm 
                    p-3 rounded-full border border-neon-blue/30 shadow-lg shadow-neon-blue/20">
      <Toggle 
        pressed={showSupplements} 
        onPressedChange={onToggleSupplements}
        className="flex items-center gap-2 px-3 py-2 rounded-full data-[state=on]:bg-blue-500/20 
                 data-[state=on]:text-blue-500 hover:bg-blue-500/10"
        aria-label="Toggle supplements visibility"
      >
        <Pill className="w-4 h-4" />
        <span className="text-sm font-medium">Supplements</span>
      </Toggle>

      <div className="w-px h-6 my-auto bg-neon-blue/20" />

      <Toggle 
        pressed={showPainPoints} 
        onPressedChange={onTogglePainPoints}
        className="flex items-center gap-2 px-3 py-2 rounded-full data-[state=on]:bg-red-500/20 
                 data-[state=on]:text-red-500 hover:bg-red-500/10"
        aria-label="Toggle pain points visibility"
      >
        <HeartCrack className="w-4 h-4" />
        <span className="text-sm font-medium">Pain Points</span>
      </Toggle>
    </div>
  );
}; 