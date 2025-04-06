import { useState } from 'react';
import { Html } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { Supplement } from '../types/Supplement';
import { 
  Brain, 
  Heart, 
  Bone, 
  Pill, 
  Activity,
  Dumbbell
} from 'lucide-react';

interface SupplementMarkerProps {
  supplement: Supplement;
  onClick: (supplement: Supplement) => void;
}

export const SupplementMarker = ({ supplement, onClick }: SupplementMarkerProps) => {
  const [hovered, setHovered] = useState(false);

  const getIcon = () => {
    // Determine icon based on target area or supplement type
    const area = supplement.targetArea.toLowerCase();
    if (area.includes('head') || area.includes('brain')) return Brain;
    if (area.includes('heart') || area.includes('chest')) return Heart;
    if (area.includes('joint') || area.includes('bone')) return Bone;
    if (area.includes('muscle')) return Dumbbell;
    if (area.includes('energy')) return Activity;
    return Pill;
  };

  const IconComponent = getIcon();

  return (
    <group
      position={supplement.position}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onClick(supplement);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 3D Sphere */}
      <mesh>
        <sphereGeometry args={[0.03]} />
        <meshStandardMaterial 
          color={hovered ? '#ff6b6b' : '#ff0000'} 
          emissive={hovered ? '#ff6b6b' : '#000000'}
          emissiveIntensity={hovered ? 0.5 : 0}
          transparent={true}
          opacity={0.5}
        />
      </mesh>

      {/* Tooltip - reduced distance by changing y position from 0.3 to 0.15 */}
      {hovered && (
        <Html position={[0, 0.15, 0]}>
          <div className="bg-white px-2 py-1 rounded shadow text-sm whitespace-nowrap">
            {supplement.name}
            <div className="text-xs text-gray-500">
              {supplement.targetArea}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}; 