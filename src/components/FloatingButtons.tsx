import { Plus, X, Pill, HeartCrack } from 'lucide-react';
import { useState } from 'react';

interface FloatingButtonsProps {
  onAddSupplementClick: () => void;
  onAddPainPointClick: () => void;
  onSettingsClick: () => void;
}

export const FloatingButtons = ({ 
  onAddSupplementClick, 
  onAddPainPointClick, 
  onSettingsClick 
}: FloatingButtonsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 items-end">
      {isExpanded && (
        <div className="flex flex-col gap-2 mb-2">
          <button
            onClick={() => {
              onAddSupplementClick();
              setIsExpanded(false);
            }}
            className="p-3 bg-neon-blue/10 hover:bg-neon-blue/20 rounded-full border border-neon-blue/30
                     text-neon-blue transition-all duration-200 flex items-center gap-2"
          >
            <Pill className="w-5 h-5" />
            <span className="text-sm">Add Supplement</span>
          </button>
          <button
            onClick={() => {
              onAddPainPointClick();
              setIsExpanded(false);
            }}
            className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-full border border-red-500/30
                     text-red-500 transition-all duration-200 flex items-center gap-2"
          >
            <HeartCrack className="w-5 h-5" />
            <span className="text-sm">Add Pain Point</span>
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-3 bg-neon-blue/10 hover:bg-neon-blue/20 rounded-full border border-neon-blue/30
                   text-neon-blue transition-all duration-200"
        >
          {isExpanded ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>
        <button
          onClick={onSettingsClick}
          className="p-3 bg-neon-blue/10 hover:bg-neon-blue/20 rounded-full border border-neon-blue/30
                   text-neon-blue transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}; 