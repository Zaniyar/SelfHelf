import { Supplement } from '../types/Supplement';
import { useState, useEffect } from 'react';
import { bodyRegions, getBoneRegion, getReadableBoneName } from '../utils/bodyParts';
import { 
  Brain, 
  Heart, 
  Bone, 
  Pill, 
  Activity,
  Dumbbell
} from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command"
import { Badge } from "./ui/badge"
import { X } from "lucide-react"

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (supplement: Omit<Supplement, 'id' | 'position'>) => void;
  supplement?: Supplement;
  mode: 'add' | 'view';
  selectedBone?: string;
}

// Add icon mapping for different supplement types
const supplementIcons = {
  'Brain': Brain,
  'Heart': Heart,
  'Joint': Bone,
  'Vitamin': Pill,
  'Energy': Activity,
  'Muscle': Dumbbell,
  'default': Pill
};

interface BodyPart {
  value: string;
  label: string;
  region?: string;
}

export const SideDrawer = ({ isOpen, onClose, onSave, supplement, mode, selectedBone }: SideDrawerProps) => {
  const [formData, setFormData] = useState({
    name: supplement?.name || '',
    description: supplement?.description || '',
    dosage: supplement?.dosage || '',
    frequency: supplement?.frequency || '',
    targetArea: selectedBone || supplement?.targetArea || '',
    bodyParts: selectedBone ? [selectedBone] : []
  });

  const [selectedBodyParts, setSelectedBodyParts] = useState<string[]>(
    selectedBone ? [selectedBone] : []
  );

  const bodyParts: BodyPart[] = [
    // Head & Face Region
    { value: 'Brain', label: 'Brain', region: 'Head' },
    { value: 'Eyes', label: 'Eyes', region: 'Head' },
    { value: 'Ears', label: 'Ears', region: 'Head' },
    { value: 'Nose', label: 'Nose', region: 'Head' },
    { value: 'Mouth', label: 'Mouth', region: 'Head' },
    { value: 'Teeth', label: 'Teeth', region: 'Head' },
    { value: 'Tongue', label: 'Tongue', region: 'Head' },
    { value: 'Throat', label: 'Throat', region: 'Head' },
    { value: 'Sinuses', label: 'Sinuses', region: 'Head' },

    // Neck Region
    { value: 'Neck', label: 'Neck', region: 'Neck' },
    { value: 'Thyroid', label: 'Thyroid', region: 'Neck' },
    { value: 'Larynx', label: 'Larynx', region: 'Neck' },

    // Torso - Upper
    { value: 'Heart', label: 'Heart', region: 'Chest' },
    { value: 'Lungs', label: 'Lungs', region: 'Chest' },
    { value: 'UpperSpine', label: 'Upper Spine', region: 'Back' },
    { value: 'Shoulders', label: 'Shoulders', region: 'Upper Body' },
    { value: 'Chest', label: 'Chest Muscles', region: 'Chest' },

    // Torso - Core
    { value: 'Stomach', label: 'Stomach', region: 'Digestive' },
    { value: 'Liver', label: 'Liver', region: 'Digestive' },
    { value: 'Gallbladder', label: 'Gallbladder', region: 'Digestive' },
    { value: 'Pancreas', label: 'Pancreas', region: 'Digestive' },
    { value: 'SmallIntestine', label: 'Small Intestine', region: 'Digestive' },
    { value: 'LargeIntestine', label: 'Large Intestine', region: 'Digestive' },
    { value: 'Colon', label: 'Colon', region: 'Digestive' },

    // Torso - Lower
    { value: 'Kidneys', label: 'Kidneys', region: 'Urinary' },
    { value: 'Bladder', label: 'Bladder', region: 'Urinary' },
    { value: 'LowerSpine', label: 'Lower Spine', region: 'Back' },
    { value: 'Hips', label: 'Hips', region: 'Lower Body' },
    { value: 'Pelvis', label: 'Pelvis', region: 'Lower Body' },

    // Arms
    { value: 'LeftShoulder', label: 'Left Shoulder', region: 'Arms' },
    { value: 'RightShoulder', label: 'Right Shoulder', region: 'Arms' },
    { value: 'LeftUpperArm', label: 'Left Upper Arm', region: 'Arms' },
    { value: 'RightUpperArm', label: 'Right Upper Arm', region: 'Arms' },
    { value: 'LeftElbow', label: 'Left Elbow', region: 'Arms' },
    { value: 'RightElbow', label: 'Right Elbow', region: 'Arms' },
    { value: 'LeftForearm', label: 'Left Forearm', region: 'Arms' },
    { value: 'RightForearm', label: 'Right Forearm', region: 'Arms' },
    { value: 'LeftWrist', label: 'Left Wrist', region: 'Arms' },
    { value: 'RightWrist', label: 'Right Wrist', region: 'Arms' },

    // Hands
    { value: 'LeftHand', label: 'Left Hand', region: 'Hands' },
    { value: 'RightHand', label: 'Right Hand', region: 'Hands' },
    { value: 'LeftFingers', label: 'Left Fingers', region: 'Hands' },
    { value: 'RightFingers', label: 'Right Fingers', region: 'Hands' },

    // Legs
    { value: 'LeftThigh', label: 'Left Thigh', region: 'Legs' },
    { value: 'RightThigh', label: 'Right Thigh', region: 'Legs' },
    { value: 'LeftKnee', label: 'Left Knee', region: 'Legs' },
    { value: 'RightKnee', label: 'Right Knee', region: 'Legs' },
    { value: 'LeftCalf', label: 'Left Calf', region: 'Legs' },
    { value: 'RightCalf', label: 'Right Calf', region: 'Legs' },
    { value: 'LeftAnkle', label: 'Left Ankle', region: 'Legs' },
    { value: 'RightAnkle', label: 'Right Ankle', region: 'Legs' },

    // Feet
    { value: 'LeftFoot', label: 'Left Foot', region: 'Feet' },
    { value: 'RightFoot', label: 'Right Foot', region: 'Feet' },
    { value: 'LeftToes', label: 'Left Toes', region: 'Feet' },
    { value: 'RightToes', label: 'Right Toes', region: 'Feet' },

    // Systems
    { value: 'ImmuneSystem', label: 'Immune System', region: 'Systems' },
    { value: 'NervousSystem', label: 'Nervous System', region: 'Systems' },
    { value: 'CirculatorySystem', label: 'Circulatory System', region: 'Systems' },
    { value: 'LymphaticSystem', label: 'Lymphatic System', region: 'Systems' },
    { value: 'EndocrineSystem', label: 'Endocrine System', region: 'Systems' },

    // Joints
    { value: 'Joints', label: 'All Joints', region: 'Joints' },
    { value: 'CartilageAll', label: 'Cartilage', region: 'Joints' },
    { value: 'Ligaments', label: 'Ligaments', region: 'Joints' },
    { value: 'Tendons', label: 'Tendons', region: 'Joints' },

    // Muscles
    { value: 'MusclesAll', label: 'All Muscles', region: 'Muscles' },
    { value: 'CoreMuscles', label: 'Core Muscles', region: 'Muscles' },
    { value: 'BackMuscles', label: 'Back Muscles', region: 'Muscles' },

    // Special Senses
    { value: 'Vision', label: 'Vision', region: 'Senses' },
    { value: 'Hearing', label: 'Hearing', region: 'Senses' },
    { value: 'Balance', label: 'Balance', region: 'Senses' },
    { value: 'Taste', label: 'Taste', region: 'Senses' },
    { value: 'Smell', label: 'Smell', region: 'Senses' },

    // Mental & Cognitive
    { value: 'Memory', label: 'Memory', region: 'Cognitive' },
    { value: 'Focus', label: 'Focus', region: 'Cognitive' },
    { value: 'Mood', label: 'Mood', region: 'Cognitive' },
    { value: 'Sleep', label: 'Sleep', region: 'Cognitive' },
  ];

  const selectedRegion = selectedBone ? getBoneRegion(selectedBone) : undefined;
  const exactLocation = selectedBone ? getReadableBoneName(selectedBone) : '';

  useEffect(() => {
    if (selectedBone && mode === 'add') {
      setFormData(prev => ({
        ...prev,
        targetArea: selectedBone
      }));
    }
  }, [selectedBone, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  const handleSelectBodyPart = (bodyPart: string) => {
    setSelectedBodyParts(prev => {
      const newSelection = prev.includes(bodyPart)
        ? prev.filter(p => p !== bodyPart)
        : [...prev, bodyPart];
      
      setFormData(prev => ({
        ...prev,
        bodyParts: newSelection
      }));

      return newSelection;
    });
  };

  return (
    <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'add' ? 'Add Supplement' : 'Supplement Details'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {selectedBone && mode === 'add' && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-blue-800">{selectedRegion?.name || 'Custom'} Area</h3>
              {/* Show icon based on region */}
              {supplementIcons[selectedRegion?.name || 'default']}
            </div>
            <p className="text-sm text-blue-600 mb-2">{selectedRegion?.description}</p>
            <div className="mt-2 px-3 py-1 bg-blue-100 rounded text-sm text-blue-700">
              Specific Location: {exactLocation}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={mode === 'view'}
              placeholder="Enter supplement name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              disabled={mode === 'view'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Dosage</label>
            <input
              type="text"
              value={formData.dosage}
              onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={mode === 'view'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Frequency</label>
            <input
              type="text"
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={mode === 'view'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Target Area</label>
            <input
              type="text"
              value={formData.targetArea}
              onChange={(e) => setFormData({ ...formData, targetArea: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={mode === 'view'}
              placeholder={selectedBone || "Select an area on the model"}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Body Parts</label>
            <div className="flex flex-wrap gap-1 mb-2 max-h-20 overflow-y-auto">
              {selectedBodyParts.map(part => (
                <Badge key={part} variant="secondary" className="flex items-center gap-1">
                  {bodyParts.find(bp => bp.value === part)?.label || part}
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => handleSelectBodyPart(part)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Command className="border rounded-md">
              <CommandInput placeholder="Search body parts..." />
              <div className="max-h-32 overflow-y-auto">
                <CommandEmpty>No body part found.</CommandEmpty>
                <CommandGroup>
                  {bodyParts.map(part => (
                    <CommandItem
                      key={part.value}
                      value={part.value}
                      onSelect={() => handleSelectBodyPart(part.value)}
                    >
                      <span>{part.label}</span>
                      {part.region && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({part.region})
                        </span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </div>
            </Command>
          </div>

          {mode === 'add' && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Suggested for this area:</h3>
              <div className="space-y-2">
                {selectedRegion?.bones.map(bone => (
                  <div key={bone} className="text-sm text-gray-600">
                    • {getReadableBoneName(bone)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {mode === 'add' && (
            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Supplement
            </button>
          )}
        </form>
      </div>
    </div>
  );
}; 